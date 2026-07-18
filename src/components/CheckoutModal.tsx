import React, { useState } from "react";
import { ShieldCheck, Sparkles, X, CheckCircle, Loader2 } from "lucide-react";

const WORKER_URL = "https://red-credit-6798.mnijhara.workers.dev";
const AMOUNT = 99;

interface CheckoutModalProps {
  onClose: () => void;
  onUpgradeSuccessful: () => void;
  userEmail: string;
  userId: string;
  userName: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutModal({ onClose, onUpgradeSuccessful, userEmail, userId, userName }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "creating" | "paying" | "verifying" | "success">("idle");

  const handlePayNow = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Load Razorpay script
      setStatus("creating");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Failed to load payment gateway. Please check your connection.");

      // Step 2: Create order via Cloudflare Worker
      const orderRes = await fetch(`${WORKER_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail, userName })
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData?.details?.error?.description || errData?.error || "Could not initiate payment. Please try again.");
      }
      const { orderId, amount, currency, keyId } = await orderRes.json();

      // Step 3: Open Razorpay checkout modal (in-page, no redirect)
      setStatus("paying");
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount,
          currency,
          order_id: orderId,
          name: "Get Board Ready",
          description: "30-Day IICA Independent Director Exam Prep",
          image: "https://getboardready.online/favicon.ico",
          prefill: { name: userName, email: userEmail },
          theme: { color: "#4F46E5" },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
          handler: async (response: any) => {
            try {
              // Step 4: Verify payment signature via Cloudflare Worker
              setStatus("verifying");
              const verifyRes = await fetch(`${WORKER_URL}/api/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId,
                  userEmail
                })
              });

              const result = await verifyRes.json();
              if (!result.success) throw new Error("Payment verification failed. Contact support.");

              setStatus("success");
              setTimeout(() => {
                onUpgradeSuccessful();
                onClose();
              }, 1500);
              resolve();
            } catch (e: any) {
              reject(e);
            }
          }
        });
        rzp.open();
      });

    } catch (err: any) {
      if (err.message && err.message !== "Payment cancelled" && err.message !== "popup_closed_by_user") {
        setError(err.message || "Something went wrong. Please try again.");
      }
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  const statusMessages: Record<string, string> = {
    creating: "Preparing secure checkout...",
    paying: "Complete payment in the Razorpay window...",
    verifying: "Verifying your payment...",
    success: "✅ Payment verified! Activating Pro access..."
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans">

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-base">Upgrade to Get Board Ready Pro</h3>
          </div>
          {status === "idle" && (
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Value Prop */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-2">
            <span className="font-bold text-indigo-950 block text-sm">What you get with Pro:</span>
            <ul className="space-y-1.5">
              {[
                "Full 30-day IICA exam curriculum",
                "Unlimited AI Boardroom Tutor queries",
                "Unlimited mock exams with explanations",
                "Lifetime access — one-time payment",
                "Works on all your devices"
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-2 text-xs text-indigo-800">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">One-Time Payment</span>
              <span className="text-lg font-bold text-slate-900">Get Board Ready Pro</span>
            </div>
            <div className="text-right">
              <span className="line-through text-xs text-slate-400 block">₹999</span>
              <span className="text-2xl font-black text-indigo-600">₹{AMOUNT}</span>
            </div>
          </div>

          {/* Status */}
          {status !== "idle" && (
            <div className={`rounded-xl p-3 text-center text-sm font-medium flex items-center justify-center space-x-2 ${status === "success" ? "bg-green-50 text-green-700" : "bg-indigo-50 text-indigo-700"}`}>
              {status !== "success" && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{statusMessages[status]}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{error}</div>
          )}

          {/* Pay Button */}
          {status === "idle" && (
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-extrabold py-4 px-4 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>PAY ₹{AMOUNT} SECURELY</span>}
            </button>
          )}

          {/* Trust */}
          <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>256-bit SSL • UPI • Cards • Netbanking • Wallets • No redirect</span>
          </div>
        </div>
      </div>
    </div>
  );
}
