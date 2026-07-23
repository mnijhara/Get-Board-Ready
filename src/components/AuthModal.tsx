import Logo from "./Logo";
import React, { useState } from "react";
import { X, Loader2, ShieldCheck, Sparkles, LogIn, UserPlus, Mail, User, Briefcase, AlertCircle } from "lucide-react";
import { getUserProfileByEmail } from "../firebase";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  onSignupProceed: (name: string, email: string, profession: string, userId: string) => void;
  defaultTab?: "login" | "signup";
}

const PROFESSIONS = [
  "Chartered Accountant (CA) / CS",
  "CEO / Managing Director / CXO",
  "CFO / Finance Executive",
  "Legal / Compliance Officer",
  "Independent Director (Existing)",
  "Senior Government Official",
  "Technology Leader / CTO",
  "Investment / PE Professional",
  "HR Leader / Talent Executive",
  "Management Consultant / Advisor",
  "Academician / Professor",
  "Entrepreneur / Business Owner",
  "Other Senior Executive"
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthModal({ onClose, onLoginSuccess, onSignupProceed, defaultTab = "signup" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState(PROFESSIONS[0]);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = loginEmail.trim().toLowerCase();
    if (!trimmedEmail) return;
    if (!isValidEmail(trimmedEmail)) { setLoginError("Please enter a valid email address."); return; }

    setLoginLoading(true);
    setLoginError("");
    try {
      const profile = await getUserProfileByEmail(trimmedEmail);
      if (profile) {
        onLoginSuccess(trimmedEmail);
      } else {
        setLoginError("No account found with this email. Please sign up to create a new account.");
        setTimeout(() => { setTab("signup"); setEmail(trimmedEmail); setLoginError(""); }, 1500);
      }
    } catch {
      setLoginError("Connection error. Please check your internet and try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) { setSignupError("Please enter your full name."); return; }
    if (!trimmedEmail) { setSignupError("Please enter your email address."); return; }
    if (!isValidEmail(trimmedEmail)) { setSignupError("Please enter a valid email address."); return; }

    setSignupLoading(true);
    setSignupError("");

    // Check if email already registered
    try {
      const existing = await getUserProfileByEmail(trimmedEmail);
      if (existing) {
        setSignupError("This email is already registered. Please log in instead.");
        setSignupLoading(false);
        setTimeout(() => { setTab("login"); setLoginEmail(trimmedEmail); setSignupError(""); }, 1500);
        return;
      }
    } catch {
      // Continue with signup even if check fails
    }

    const userId = `usr_${Date.now()}`;
    onSignupProceed(trimmedName, trimmedEmail, profession, userId);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full font-sans overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <Logo size="sm" variant="light" showText={true} />
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setTab("signup"); setSignupError(""); }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${tab === "signup" ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:text-slate-700"}`}
          >
            <UserPlus className="h-4 w-4" />
            <span>New User</span>
          </button>
          <button
            onClick={() => { setTab("login"); setLoginError(""); }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${tab === "login" ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:text-slate-700"}`}
          >
            <LogIn className="h-4 w-4" />
            <span>Returning User</span>
          </button>
        </div>

        <div className="p-6">

          {/* LOGIN */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
                Enter the email you used when you first enrolled. Your Pro access and progress will be restored instantly on this device.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }}
                    placeholder="your@email.com"
                    required
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-start space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
              >
                {loginLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Looking up your account...</span></>
                  : <><LogIn className="h-4 w-4" /><span>Restore My Account</span></>
                }
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Your progress is stored securely in the cloud</span>
              </div>

              <p className="text-center text-xs text-slate-500">
                New here?{" "}
                <button type="button" onClick={() => setTab("signup")} className="text-indigo-600 font-semibold hover:underline">
                  Create an account →
                </button>
              </p>
            </form>
          )}

          {/* SIGNUP */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-800">
                <strong>₹99 one-time payment</strong> — Lifetime access to all 30 days, unlimited AI Tutor, and unlimited mock exams.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setSignupError(""); }}
                    placeholder="e.g. Rajesh Sharma"
                    required
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setSignupError(""); }}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Use this email to log in on any device</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Professional Background <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={profession}
                    onChange={e => setProfession(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">AI customizes your lessons to your professional background</p>
              </div>

              {signupError && (
                <div className="flex items-start space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{signupError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                {signupLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Setting up...</span></>
                  : <span>Continue to Payment — ₹99 →</span>
                }
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Secure payment via Razorpay • No recurring charges</span>
              </div>

              <p className="text-center text-xs text-slate-500">
                Already enrolled?{" "}
                <button type="button" onClick={() => setTab("login")} className="text-indigo-600 font-semibold hover:underline">
                  Log in →
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
