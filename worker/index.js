// Cloudflare Worker - Razorpay Backend for Get Board Ready
// Endpoints: POST /api/verify-payment, POST /api/check-premium

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://getboardready.online",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

// Verify Razorpay payment signature + store premium in Firebase via REST API
async function handleVerifyPayment(request, env) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, userEmail, userId } = await request.json();

  // For Payment Page (no order_id), verify using payment_link_id
  // Razorpay Payment Page sends: razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_status, razorpay_signature
  let isValid = false;

  if (razorpay_payment_link_id) {
    // Payment Page signature: HMAC(payment_link_id + "|" + payment_link_reference_id + "|" + payment_link_status + "|" + payment_id)
    const message = `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id}|${razorpay_payment_link_status}|${razorpay_payment_id}`;
    isValid = await verifyHMAC(message, razorpay_signature, env.RAZORPAY_KEY_SECRET);
  } else if (razorpay_order_id) {
    // Standard checkout signature
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    isValid = await verifyHMAC(message, razorpay_signature, env.RAZORPAY_KEY_SECRET);
  }

  if (!isValid) {
    return new Response(JSON.stringify({ error: "Payment signature verification failed" }), {
      status: 400, headers: CORS_HEADERS
    });
  }

  // Payment is verified — store premium in Firebase Firestore via REST API
  if (userId && userEmail) {
    await storePremiumInFirebase(userId, userEmail, razorpay_payment_id, env);
  }

  return new Response(JSON.stringify({ 
    success: true, 
    payment_id: razorpay_payment_id,
    message: "Payment verified and premium activated"
  }), { status: 200, headers: CORS_HEADERS });
}

// Check if user is premium (cross-device support)
async function handleCheckPremium(request, env) {
  const { userId } = await request.json();
  if (!userId) {
    return new Response(JSON.stringify({ isPremium: false }), { status: 200, headers: CORS_HEADERS });
  }

  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/${env.FIREBASE_DATABASE_ID}/documents/payments/${userId}?key=${env.FIREBASE_API_KEY}`;
  
  try {
    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      const isPremium = data?.fields?.isPremium?.booleanValue === true;
      return new Response(JSON.stringify({ isPremium }), { status: 200, headers: CORS_HEADERS });
    }
  } catch (e) {}

  return new Response(JSON.stringify({ isPremium: false }), { status: 200, headers: CORS_HEADERS });
}

async function storePremiumInFirebase(userId, userEmail, paymentId, env) {
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/${env.FIREBASE_DATABASE_ID}/documents/payments/${userId}?key=${env.FIREBASE_API_KEY}`;
  
  await fetch(firestoreUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        isPremium: { booleanValue: true },
        userEmail: { stringValue: userEmail },
        paymentId: { stringValue: paymentId },
        activatedAt: { stringValue: new Date().toISOString() }
      }
    })
  });
}

async function verifyHMAC(message, signature, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return generatedSignature === signature;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/verify-payment") {
      return handleVerifyPayment(request, env);
    }

    if (request.method === "POST" && url.pathname === "/api/check-premium") {
      return handleCheckPremium(request, env);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404, headers: CORS_HEADERS
    });
  }
};
