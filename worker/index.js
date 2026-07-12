// Cloudflare Worker - Razorpay Backend
// Handles: create-order, verify-payment

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://getboardready.online",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

async function handleCreateOrder(request, env) {
  const { amount, currency = "INR", receipt } = await request.json();

  if (!amount || amount < 100) {
    return new Response(JSON.stringify({ error: "Amount must be at least 100 paise (₹1)" }), {
      status: 400, headers: CORS_HEADERS
    });
  }

  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount, currency, receipt: receipt || `receipt_${Date.now()}` })
  });

  if (!response.ok) {
    const err = await response.json();
    return new Response(JSON.stringify({ error: "Failed to create order", details: err }), {
      status: 500, headers: CORS_HEADERS
    });
  }

  const order = await response.json();
  return new Response(JSON.stringify({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency
  }), { status: 200, headers: CORS_HEADERS });
}

async function handleVerifyPayment(request, env) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return new Response(JSON.stringify({ error: "Missing required payment fields" }), {
      status: 400, headers: CORS_HEADERS
    });
  }

  // HMAC-SHA256 verification
  const message = `${razorpay_order_id}|${razorpay_payment_id}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(env.RAZORPAY_KEY_SECRET);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  if (generatedSignature !== razorpay_signature) {
    return new Response(JSON.stringify({ error: "Payment signature verification failed" }), {
      status: 400, headers: CORS_HEADERS
    });
  }

  return new Response(JSON.stringify({ success: true, payment_id: razorpay_payment_id }), {
    status: 200, headers: CORS_HEADERS
  });
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/create-order") {
      return handleCreateOrder(request, env);
    }

    if (request.method === "POST" && url.pathname === "/api/verify-payment") {
      return handleVerifyPayment(request, env);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404, headers: CORS_HEADERS
    });
  }
};
