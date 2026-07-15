// Cloudflare Worker - Get Board Ready Payment Backend
// Proper architecture: create-order + webhook (no localStorage, no redirects)

function getCORS(request) {
  const origin = request?.headers?.get("Origin") || "https://getboardready.online";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

// ── HMAC helper ────────────────────────────────────────────────
async function hmacSHA256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Firebase Firestore REST ────────────────────────────────────
async function setFirestoreDoc(collection, docId, fields, env) {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/${env.FIREBASE_DATABASE_ID}/documents/${collection}/${docId}?key=${env.FIREBASE_API_KEY}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  return res.ok;
}

async function getFirestoreDoc(collection, docId, env) {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/${env.FIREBASE_DATABASE_ID}/documents/${collection}/${docId}?key=${env.FIREBASE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

// ── 1. CREATE ORDER ────────────────────────────────────────────
// Called by frontend when user clicks Pay
// Creates a Razorpay order with userId embedded in notes
async function createOrder(request, env) {
  const { userId, userEmail, userName } = await request.json();

  if (!userId || !userEmail) {
    return new Response(JSON.stringify({ error: "Missing userId or userEmail" }), { status: 400, headers: getCORS(request) });
  }

  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const receipt = `gbr_${userId.slice(-8)}_${Date.now()}`;

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: 9900, // ₹99 in paise
      currency: "INR",
      receipt,
      notes: { userId, userEmail, userName: userName || "User", product: "Get Board Ready Pro" }
    })
  });

  if (!res.ok) {
    const err = await res.json();
    return new Response(JSON.stringify({ error: "Order creation failed", details: err }), { status: 500, headers: getCORS(request) });
  }

  const order = await res.json();

  // Store pending order in Firestore so webhook can match it
  await setFirestoreDoc("pending_orders", order.id, {
    userId: { stringValue: userId },
    userEmail: { stringValue: userEmail },
    userName: { stringValue: userName || "User" },
    orderId: { stringValue: order.id },
    amount: { integerValue: order.amount },
    createdAt: { stringValue: new Date().toISOString() },
    status: { stringValue: "created" }
  }, env);

  return new Response(JSON.stringify({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: env.RAZORPAY_KEY_ID
  }), { status: 200, headers: getCORS(request) });
}

// ── 2. VERIFY PAYMENT ──────────────────────────────────────────
// Called by frontend after Razorpay checkout modal closes successfully
async function verifyPayment(request, env) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, userEmail } = await request.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return new Response(JSON.stringify({ error: "Missing payment fields" }), { status: 400, headers: getCORS(request) });
  }

  // Verify signature
  const message = `${razorpay_order_id}|${razorpay_payment_id}`;
  const generated = await hmacSHA256(message, env.RAZORPAY_KEY_SECRET);

  if (generated !== razorpay_signature) {
    return new Response(JSON.stringify({ error: "Invalid payment signature" }), { status: 400, headers: getCORS(request) });
  }

  // Get userId from pending_orders if not provided
  let resolvedUserId = userId;
  let resolvedEmail = userEmail;

  if (!resolvedUserId) {
    const orderDoc = await getFirestoreDoc("pending_orders", razorpay_order_id, env);
    if (orderDoc?.fields) {
      resolvedUserId = orderDoc.fields.userId?.stringValue;
      resolvedEmail = orderDoc.fields.userEmail?.stringValue;
    }
  }

  if (!resolvedUserId) {
    return new Response(JSON.stringify({ error: "Cannot identify user for this payment" }), { status: 400, headers: getCORS(request) });
  }

  // Activate premium in Firebase
  await setFirestoreDoc("payments", resolvedUserId, {
    isPremium: { booleanValue: true },
    userEmail: { stringValue: resolvedEmail || "" },
    paymentId: { stringValue: razorpay_payment_id },
    orderId: { stringValue: razorpay_order_id },
    activatedAt: { stringValue: new Date().toISOString() },
    source: { stringValue: "checkout_verify" }
  }, env);

  // Update order status
  await setFirestoreDoc("pending_orders", razorpay_order_id, {
    status: { stringValue: "paid" },
    paymentId: { stringValue: razorpay_payment_id },
    paidAt: { stringValue: new Date().toISOString() }
  }, env);

  return new Response(JSON.stringify({ success: true, payment_id: razorpay_payment_id }), { status: 200, headers: getCORS(request) });
}

// ── 3. WEBHOOK ─────────────────────────────────────────────────
// Called by Razorpay server after payment — zero user involvement
// This is the safety net: even if frontend fails, premium gets activated
async function handleWebhook(request, env) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  // Verify webhook signature
  const generated = await hmacSHA256(rawBody, env.RAZORPAY_WEBHOOK_SECRET);
  if (generated !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload?.payment?.entity || event.payload?.order?.entity;
    const orderId = payment?.order_id || event.payload?.order?.entity?.id;
    const paymentId = payment?.id;
    const notes = payment?.notes || {};

    let userId = notes.userId;
    let userEmail = notes.userEmail;

    // Fallback: look up from pending_orders
    if (!userId && orderId) {
      const orderDoc = await getFirestoreDoc("pending_orders", orderId, env);
      if (orderDoc?.fields) {
        userId = orderDoc.fields.userId?.stringValue;
        userEmail = orderDoc.fields.userEmail?.stringValue;
      }
    }

    if (userId) {
      await setFirestoreDoc("payments", userId, {
        isPremium: { booleanValue: true },
        userEmail: { stringValue: userEmail || "" },
        paymentId: { stringValue: paymentId || "" },
        orderId: { stringValue: orderId || "" },
        activatedAt: { stringValue: new Date().toISOString() },
        source: { stringValue: "webhook" }
      }, env);
    }
  }

  return new Response("ok", { status: 200 });
}

// ── 4. CHECK PREMIUM ──────────────────────────────────────────
async function checkPremium(request, env) {
  const { userId } = await request.json();
  if (!userId) return new Response(JSON.stringify({ isPremium: false }), { status: 200, headers: CORS });

  const doc = await getFirestoreDoc("payments", userId, env);
  const isPremium = doc?.fields?.isPremium?.booleanValue === true;
  return new Response(JSON.stringify({ isPremium }), { status: 200, headers: CORS });
}

// ── ROUTER ────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: getCORS(request) });

    const { pathname } = new URL(request.url);

    if (request.method === "POST") {
      if (pathname === "/api/create-order")    return createOrder(request, env);
      if (pathname === "/api/verify-payment")  return verifyPayment(request, env);
      if (pathname === "/api/check-premium")   return checkPremium(request, env);
      if (pathname === "/api/webhook")         return handleWebhook(request, env);
    }

    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: getCORS(request) });
  }
};
