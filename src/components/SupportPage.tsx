import React from "react";
import { Mail, RefreshCw, Shield, Clock, ChevronLeft } from "lucide-react";

interface SupportPageProps {
  onBack: () => void;
}

export default function SupportPage({ onBack }: SupportPageProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Support & Policies</h1>
      <p className="text-slate-500 text-sm mb-8">Get Board Ready — IICA Independent Director Exam Prep</p>

      {/* Refund Policy */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg"><RefreshCw className="h-5 w-5 text-green-600" /></div>
          <h2 className="text-base font-bold text-slate-800">Refund Policy</h2>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p><strong>7-day money-back guarantee.</strong> If you're not satisfied within 7 days of purchase, email us for a full refund — no questions asked.</p>
          <p>After 7 days, refunds are evaluated on a case-by-case basis. We stand behind our product and want every user to succeed.</p>
          <p className="text-xs text-slate-400">Refunds are processed within 5-7 business days via the original payment method.</p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg"><Mail className="h-5 w-5 text-indigo-600" /></div>
          <h2 className="text-base font-bold text-slate-800">Contact Support</h2>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p>Email us at: <a href="mailto:support@getboardready.online" className="text-indigo-600 font-semibold">support@getboardready.online</a></p>
          <p>We respond within 24 hours on business days.</p>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Support hours: Mon–Fri, 9 AM – 6 PM IST</span>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg"><Shield className="h-5 w-5 text-blue-600" /></div>
          <h2 className="text-base font-bold text-slate-800">Privacy & Data</h2>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p>Your data is stored securely in Google Firebase (India region). We collect only what's needed: your name, email, profession, and study progress.</p>
          <p>We never sell your data. Your payment is processed by Razorpay — we don't store card or UPI details.</p>
          <p>To delete your account and all data, email us at the address above.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-4">Common Questions</h2>
        <div className="space-y-4 text-sm">
          {[
            ["Can I access on multiple devices?", "Yes. Log in with your registered email on any device to restore your account and Pro access instantly."],
            ["Is this an official IICA product?", "No. Get Board Ready is an independent exam prep tool. It is not affiliated with IICA or MCA. The certificate you earn here is a completion certificate from our platform, not an IICA certification."],
            ["How long do I have access?", "Lifetime. One payment, permanent access — even after you pass the exam."],
            ["What if the AI gives wrong information?", "Our AI is powered by Gemini 2.5 Flash and trained on Companies Act 2013, SEBI LODR, and IICA guidelines. Always cross-verify critical legal points with official sources."],
            ["Can I share my account?", "No. Each account is for one user only. Sharing accounts may result in suspension without refund."],
          ].map(([q, a]) => (
            <div key={q} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <p className="font-semibold text-slate-700 mb-1">{q}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
