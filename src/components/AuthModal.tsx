import React, { useState } from "react";
import { X, Loader2, ShieldCheck, Sparkles, LogIn, UserPlus, Mail, User, Briefcase } from "lucide-react";
import { getUserProfileByEmail } from "../firebase";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  onSignupProceed: (name: string, email: string, profession: string, userId: string) => void;
  defaultTab?: "login" | "signup";
}

const PROFESSIONS = [
  "Chartered Accountant (CA) / CS",
  "CEO / Managing Director",
  "CFO / Finance Executive",
  "Legal / Compliance Officer",
  "Independent Director (Existing)",
  "Senior Government Official",
  "Technology Leader / CTO",
  "Investment / PE Professional",
  "Other Senior Executive"
];

export default function AuthModal({ onClose, onLoginSuccess, onSignupProceed, defaultTab = "signup" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Signup state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState(PROFESSIONS[0]);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    setLoginLoading(true);
    setLoginError("");

    try {
      const profile = await getUserProfileByEmail(loginEmail.trim().toLowerCase());
      if (profile) {
        onLoginSuccess(loginEmail.trim().toLowerCase());
      } else {
        setLoginError("No account found with this email. Please sign up.");
        setTab("signup");
        setEmail(loginEmail);
      }
    } catch (e) {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSignupLoading(true);
    const userId = `usr_${Date.now()}`;
    onSignupProceed(name.trim(), email.trim().toLowerCase(), profession, userId);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full font-sans overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="font-bold text-base">Get Board Ready</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setTab("signup"); setSignupError(""); }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${tab === "signup" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <UserPlus className="h-4 w-4" />
            <span>New User</span>
          </button>
          <button
            onClick={() => { setTab("login"); setLoginError(""); }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${tab === "login" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <LogIn className="h-4 w-4" />
            <span>Returning User</span>
          </button>
        </div>

        <div className="p-6">

          {/* LOGIN TAB */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-4">Enter your registered email to restore your account and Pro access on this device.</p>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
              >
                {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogIn className="h-4 w-4" /><span>Restore My Account</span></>}
              </button>

              <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Your progress and Pro access are stored securely in the cloud</span>
              </div>
            </form>
          )}

          {/* SIGNUP TAB */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <p className="text-sm text-slate-500">Create your account and unlock 30-day IICA exam prep for ₹99.</p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Background</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={profession}
                    onChange={e => setProfession(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {signupError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{signupError}</p>
              )}

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                {signupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Continue to Payment →</span></>}
              </button>

              <p className="text-center text-xs text-slate-400">Already have an account? <button type="button" onClick={() => setTab("login")} className="text-indigo-600 font-semibold">Log in</button></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
