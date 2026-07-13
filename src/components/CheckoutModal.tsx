import React, { useState } from "react";
import { ShieldCheck, Sparkles, X, ExternalLink, CheckCircle } from "lucide-react";

// =============================================
// UPDATE THIS when Razorpay Payment Page is live
// =============================================
const RAZORPAY_PAYMENT_PAGE_URL = "https://rzp.io/rzp/HDsd7GF1";
const AMOUNT = "99";
// =============================================

interface CheckoutModalProps {
  onClose: () => void;
  onUpgradeSuccessful: () => void;
  userEmail: string;
}

export default function CheckoutModal({ onClose, onUpgradeSuccessful, userEmail }: CheckoutModalProps) {

  const handlePayNow = () => {
    // Redirect to Razorpay Payment Page
    // After payment, Razorpay redirects back to: getboardready.online?payment=success
    window.location.href = RAZORPAY_PAYMENT_PAGE_URL;
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
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
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
                "Lifetime access — one-time payment"
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

          {/* Pay Button */}
          <button
            onClick={handlePayNow}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold py-4 px-4 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01]"
          >
            <span>PAY ₹{AMOUNT} SECURELY</span>
            <ExternalLink className="h-4 w-4" />
          </button>

          {/* Info */}
          <div className="text-center space-y-1">
            <p className="text-[11px] text-slate-500">
              You'll be redirected to Razorpay's secure payment page. After payment, you'll return here automatically with Pro access activated.
            </p>
            <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>256-bit SSL • UPI • Cards • Netbanking • Wallets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
