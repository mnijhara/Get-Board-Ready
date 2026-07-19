// ============================================================
// Get Board Ready — Cloudflare Worker
// Handles: Razorpay payments + Gemini AI proxy + Rate limiting
// ============================================================

// ── CORS ────────────────────────────────────────────────────
function getCORS(request) {
  const origin = request?.headers?.get("Origin") || "https://getboardready.online";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

// ── HMAC helper ─────────────────────────────────────────────
async function hmacSHA256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Firestore REST ──────────────────────────────────────────
async function fsGet(collection, docId, env) {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/${env.FIREBASE_DATABASE_ID}/documents/${collection}/${docId}?key=${env.FIREBASE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function fsSet(collection, docId, fields, env) {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/${env.FIREBASE_DATABASE_ID}/documents/${collection}/${docId}?key=${env.FIREBASE_API_KEY}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  return res.ok;
}

// ── Rate Limiter ─────────────────────────────────────────────
// Uses Cloudflare KV via Firestore (simple approach)
async function checkRateLimit(userId, endpoint, limit, windowMinutes, env) {
  if (!userId) return { allowed: true, remaining: limit };
  const key = `rate_${endpoint}_${userId}`;
  const doc = await fsGet("rate_limits", key, env);
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  if (!doc || !doc.fields) {
    await fsSet("rate_limits", key, {
      count: { integerValue: 1 },
      windowStart: { integerValue: now },
      userId: { stringValue: userId }
    }, env);
    return { allowed: true, remaining: limit - 1 };
  }

  const count = parseInt(doc.fields.count?.integerValue || "0");
  const windowStart = parseInt(doc.fields.windowStart?.integerValue || "0");

  if (now - windowStart > windowMs) {
    // Reset window
    await fsSet("rate_limits", key, {
      count: { integerValue: 1 },
      windowStart: { integerValue: now },
      userId: { stringValue: userId }
    }, env);
    return { allowed: true, remaining: limit - 1 };
  }

  if (count >= limit) {
    const resetIn = Math.ceil((windowStart + windowMs - now) / 60000);
    return { allowed: false, remaining: 0, resetIn };
  }

  await fsSet("rate_limits", key, {
    count: { integerValue: count + 1 },
    windowStart: { integerValue: windowStart },
    userId: { stringValue: userId }
  }, env);
  return { allowed: true, remaining: limit - count - 1 };
}

// ── 1. GEMINI AI PROXY ──────────────────────────────────────
async function handleAIProxy(request, env) {
  const { type, userId, isPremium, payload } = await request.json();

  if (!type || !payload) {
    return new Response(JSON.stringify({ error: "Missing type or payload" }), { status: 400, headers: getCORS(request) });
  }

  // Rate limiting: free users = 5 AI tutor queries/day, premium = 100/day
  if (type === "tutor") {
    const limit = isPremium ? 100 : 5;
    const rate = await checkRateLimit(userId, "tutor", limit, 1440, env); // 24hr window
    if (!rate.allowed) {
      return new Response(JSON.stringify({
        error: `Daily limit reached. ${isPremium ? "Contact support." : "Upgrade to Pro for unlimited queries."}`,
        resetIn: rate.resetIn,
        limitReached: true
      }), { status: 429, headers: getCORS(request) });
    }
  }

  // Rate limit lesson generation: 30/day (one per day)
  if (type === "lesson") {
    const rate = await checkRateLimit(userId, "lesson", 30, 1440, env);
    if (!rate.allowed) {
      return new Response(JSON.stringify({ error: "Daily lesson limit reached." }), { status: 429, headers: getCORS(request) });
    }
  }

  // Rate limit mock exams: free=1/day, premium=unlimited
  if (type === "exam") {
    const limit = isPremium ? 50 : 1;
    const rate = await checkRateLimit(userId, "exam", limit, 1440, env);
    if (!rate.allowed) {
      return new Response(JSON.stringify({
        error: isPremium ? "Daily exam limit reached." : "Upgrade to Pro for unlimited mock exams.",
        limitReached: true
      }), { status: 429, headers: getCORS(request) });
    }
  }

  // Call Gemini API server-side (key never exposed to browser)
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.json();
    return new Response(JSON.stringify({ error: "AI engine error", details: err }), { status: 500, headers: getCORS(request) });
  }

  const data = await geminiRes.json();
  return new Response(JSON.stringify(data), { status: 200, headers: getCORS(request) });
}

// ── 2. CREATE RAZORPAY ORDER ────────────────────────────────
async function createOrder(request, env) {
  const { userId, userEmail, userName } = await request.json();
  if (!userId || !userEmail) {
    return new Response(JSON.stringify({ error: "Missing userId or userEmail" }), { status: 400, headers: getCORS(request) });
  }

  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: 9900,
      currency: "INR",
      receipt: `gbr_${userId.slice(-8)}_${Date.now()}`,
      notes: { userId, userEmail, userName: userName || "User", product: "Get Board Ready Pro" }
    })
  });

  if (!res.ok) {
    const err = await res.json();
    return new Response(JSON.stringify({ error: "Order creation failed", details: err }), { status: 500, headers: getCORS(request) });
  }

  const order = await res.json();
  await fsSet("pending_orders", order.id, {
    userId: { stringValue: userId },
    userEmail: { stringValue: userEmail },
    userName: { stringValue: userName || "User" },
    orderId: { stringValue: order.id },
    amount: { integerValue: order.amount },
    createdAt: { stringValue: new Date().toISOString() },
    status: { stringValue: "created" }
  }, env);

  return new Response(JSON.stringify({
    orderId: order.id, amount: order.amount,
    currency: order.currency, keyId: env.RAZORPAY_KEY_ID
  }), { status: 200, headers: getCORS(request) });
}

// ── 3. VERIFY PAYMENT ───────────────────────────────────────
async function verifyPayment(request, env) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, userEmail } = await request.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return new Response(JSON.stringify({ error: "Missing payment fields" }), { status: 400, headers: getCORS(request) });
  }

  const generated = await hmacSHA256(`${razorpay_order_id}|${razorpay_payment_id}`, env.RAZORPAY_KEY_SECRET);
  if (generated !== razorpay_signature) {
    return new Response(JSON.stringify({ error: "Invalid payment signature" }), { status: 400, headers: getCORS(request) });
  }

  let resolvedUserId = userId;
  let resolvedEmail = userEmail;
  if (!resolvedUserId) {
    const orderDoc = await fsGet("pending_orders", razorpay_order_id, env);
    if (orderDoc?.fields) {
      resolvedUserId = orderDoc.fields.userId?.stringValue;
      resolvedEmail = orderDoc.fields.userEmail?.stringValue;
    }
  }

  if (!resolvedUserId) {
    return new Response(JSON.stringify({ error: "Cannot identify user" }), { status: 400, headers: getCORS(request) });
  }

  await activatePremium(resolvedUserId, resolvedEmail, razorpay_payment_id, razorpay_order_id, "checkout_verify", env);

  return new Response(JSON.stringify({ success: true, payment_id: razorpay_payment_id }), { status: 200, headers: getCORS(request) });
}

// ── 4. WEBHOOK ──────────────────────────────────────────────
async function handleWebhook(request, env) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const generated = await hmacSHA256(rawBody, env.RAZORPAY_WEBHOOK_SECRET);

  if (generated !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);
  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    const paymentId = payment?.id;
    const notes = payment?.notes || {};

    let userId = notes.userId;
    let userEmail = notes.userEmail;

    if (!userId && orderId) {
      const orderDoc = await fsGet("pending_orders", orderId, env);
      if (orderDoc?.fields) {
        userId = orderDoc.fields.userId?.stringValue;
        userEmail = orderDoc.fields.userEmail?.stringValue;
      }
    }

    if (userId) {
      await activatePremium(userId, userEmail, paymentId, orderId, "webhook", env);
    }
  }

  return new Response("ok", { status: 200 });
}

// ── 5. CHECK PREMIUM ────────────────────────────────────────
async function checkPremium(request, env) {
  const { userId } = await request.json();
  if (!userId) return new Response(JSON.stringify({ isPremium: false }), { status: 200, headers: getCORS(request) });
  const doc = await fsGet("payments", userId, env);
  const isPremium = doc?.fields?.isPremium?.booleanValue === true;
  return new Response(JSON.stringify({ isPremium }), { status: 200, headers: getCORS(request) });
}

// ── HELPER: Activate Premium ────────────────────────────────
async function activatePremium(userId, userEmail, paymentId, orderId, source, env) {
  await fsSet("payments", userId, {
    isPremium: { booleanValue: true },
    userEmail: { stringValue: userEmail || "" },
    paymentId: { stringValue: paymentId || "" },
    orderId: { stringValue: orderId || "" },
    activatedAt: { stringValue: new Date().toISOString() },
    source: { stringValue: source }
  }, env);

  // Update order status
  if (orderId) {
    await fsSet("pending_orders", orderId, {
      status: { stringValue: "paid" },
      paymentId: { stringValue: paymentId || "" },
      paidAt: { stringValue: new Date().toISOString() }
    }, env);
  }
}

// ── ROUTER ──────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: getCORS(request) });
    const { pathname } = new URL(request.url);
    if (request.method === "POST") {
      if (pathname === "/api/ai")              return handleAIProxy(request, env);
      if (pathname === "/api/create-order")    return createOrder(request, env);
      if (pathname === "/api/verify-payment")  return verifyPayment(request, env);
      if (pathname === "/api/check-premium")   return checkPremium(request, env);
      if (pathname === "/api/webhook")         return handleWebhook(request, env);
    }
    return new Response(JSON.stringify({ status: "Get Board Ready API v2.0" }), { status: 200, headers: getCORS(request) });
  }
};
