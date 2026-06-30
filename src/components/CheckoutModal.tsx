import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Loader2, 
  Phone, 
  Mail, 
  User, 
  Briefcase, 
  MessageSquare, 
  Send, 
  Check,
  Printer,
  FileText
} from "lucide-react";
import { saveContactRequest } from "../firebase";

interface CheckoutModalProps {
  onClose: () => void;
  onUpgradeSuccessful: () => void;
  userEmail: string;
}

type ModalStep = "form" | "submitting" | "success";

export default function CheckoutModal({ onClose, onUpgradeSuccessful, userEmail }: CheckoutModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("Corporate Executive");
  const [message, setMessage] = useState("I would like to register for the full 30-day corporate governance training curriculum and gain complete access to the mock exam engines.");
  const [error, setError] = useState("");

  // Get user profile name if exists in local storage
  useEffect(() => {
    try {
      const cachedUserId = localStorage.getItem("iica_user_id");
      if (cachedUserId) {
        const cachedProfile = localStorage.getItem(`user_profile_${cachedUserId}`);
        if (cachedProfile) {
          const profile = JSON.parse(cachedProfile);
          if (profile.name) setName(profile.name);
          if (profile.profession) setProfession(profile.profession);
        }
      }
    } catch (err) {
      console.error("Error reading cached profile", err);
    }
  }, []);

  // Generate real-looking corporate registration reference details
  const [refId] = useState(() => `GBR-REG-${Math.floor(100000 + Math.random() * 900000)}`);
  const [dateStr] = useState(() => {
    return new Date().toLocaleDateString("en-IN", { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setStep("submitting");
    setError("");

    try {
      // Save contact request to Firestore
      await saveContactRequest({
        name,
        email,
        phone,
        profession,
        message,
        timestamp: new Date().toISOString()
      });

      // Simulate NPCI / Database hook completion
      setTimeout(() => {
        setStep("success");
        onUpgradeSuccessful(); // Grants direct premium access immediately to current user session
      }, 1500);

    } catch (err) {
      console.error("Registration submission failed", err);
      setError("Something went wrong. Please try again.");
      setStep("form");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col font-sans print:shadow-none print:border-none print:max-w-full print:w-full">
        
        {/* Header bar (hidden on print) */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-base">Get Board Ready Pro Registration</h3>
          </div>
          {step === "form" && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Registration / Contact Us Form */}
        {step === "form" && (
          <div className="p-6 space-y-5 print:hidden max-h-[85vh] overflow-y-auto">
            {/* Price Promo & Value Proposition */}
            <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-300/40 rounded-xl p-4 flex flex-col space-y-3 text-xs text-indigo-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black font-mono uppercase px-2 py-0.5 rounded animate-pulse">
                    LAUNCH PROMO
                  </span>
                  <span className="font-bold text-slate-900 text-xs">Get Board Ready Pro</span>
                </div>
                <div className="flex items-baseline space-x-1 font-mono">
                  <span className="text-slate-400 line-through text-[10px]">₹999</span>
                  <span className="text-indigo-600 font-extrabold text-sm">₹99</span>
                  <span className="text-[10px] text-slate-500 font-bold font-sans">one-time</span>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed font-normal text-[11px] border-t border-slate-200/60 pt-2">
                Submit your registration inquiry below to secure your promo slot for just <strong>₹99 Only</strong>. This form registers you for unrestricted access to the full 30-day course, mock tests, and AI legal advisors. Your current sandbox session will unlock instantly!
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 mb-1 flex items-center gap-1.5 uppercase">
                  <User className="h-3.5 w-3.5 text-indigo-600" /> Full Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Anand Ramakrishnan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white placeholder-slate-400 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 mb-1 flex items-center gap-1.5 uppercase">
                    <Mail className="h-3.5 w-3.5 text-indigo-600" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. anand@outlook.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white placeholder-slate-400 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 mb-1 flex items-center gap-1.5 uppercase">
                    <Phone className="h-3.5 w-3.5 text-indigo-600" /> Contact Number
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white placeholder-slate-400 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 mb-1 flex items-center gap-1.5 uppercase">
                  <Briefcase className="h-3.5 w-3.5 text-indigo-600" /> Professional Background
                </label>
                <select 
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-sans"
                >
                  <option value="Chartered Accountant (CA) / CS">Chartered Accountant (CA) / CS</option>
                  <option value="Senior Advocate / Legal Counsel">Senior Advocate / Legal Counsel</option>
                  <option value="CEO / Managing Director / CXO">CEO / Managing Director / CXO</option>
                  <option value="Technology Executive / GM">Technology Executive / GM</option>
                  <option value="Retired Civil Servant / Defense Officer">Retired Civil Servant / Defense Officer</option>
                  <option value="Financial Officer (CFO) / Auditor">Financial Officer (CFO) / Auditor</option>
                  <option value="Management Consultant / Advisor">Management Consultant / Advisor</option>
                  <option value="Academician / Professor / Researcher">Academician / Professor / Researcher</option>
                  <option value="Existing Independent Director">Existing Independent Director</option>
                  <option value="Other Professional / Aspiring Director">Other Professional / Aspiring Director (Everyone Allowed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 mb-1 flex items-center gap-1.5 uppercase">
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-600" /> Onboarding Notes
                </label>
                <textarea 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white placeholder-slate-400 transition-all font-sans resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-center text-sm transition-all flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01] duration-150 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>SUBMIT REGISTRATION REQUEST</span>
                </button>
              </div>
            </form>

            <p className="text-[10px] text-slate-400 text-center leading-normal">
              By submitting this form, you request direct corporate access. Your current local sandbox browser session will be immediately upgraded to Premium so you can test all features while your official application is processed.
            </p>
          </div>
        )}

        {/* STEP 2: Submitting Screen */}
        {step === "submitting" && (
          <div className="p-8 space-y-6 text-center print:hidden">
            <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
              <Loader2 className="h-6 w-6 text-indigo-600 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Transmitting Registration...</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Securing connection and saving credentials to Firestore directory...
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & DETAILED TAX INVOICE */}
        {step === "success" && (
          <div className="p-6 space-y-5">
            {/* Header / Seal (Hidden on Print - standard visual only) */}
            <div className="text-center space-y-2 print:hidden">
              <div className="mx-auto bg-emerald-50 text-emerald-600 h-12 w-12 rounded-full flex items-center justify-center border border-emerald-200">
                <Check className="h-6 w-6 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold text-slate-950">Registration Request Submitted!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your request has been queued. We have enabled full Get Board Ready Pro access for your testing session, and generated your confirmation slip.
              </p>
            </div>

            {/* PRINT-FRIENDLY REGISTRATION CONFIRMATION SLIP */}
            <div className="bg-white border-2 border-slate-900 p-5 rounded-2xl space-y-4 text-left font-sans text-slate-900 relative shadow-md print:border-none print:p-0 print:shadow-none">
              
              {/* Corporate Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-slate-900" />
                    <span className="font-black text-sm tracking-tight uppercase">Get Board Ready Inc.</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block leading-tight">
                    Autonomous Executive Portal<br />
                    SAC Code: 9992 (E-Learning Platform Services)<br />
                    Email: support@getboardready.com
                  </span>
                </div>
                <div className="text-right">
                  <span className="bg-slate-900 text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold tracking-wider">
                    Registration Receipt
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-900 block mt-1">{refId}</span>
                </div>
              </div>

              {/* Confirmation Details */}
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-b border-slate-200 pb-3">
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold">Registered Candidate:</span>
                  <span className="font-bold text-slate-950 block">{name}</span>
                  <span className="text-slate-500 block break-all">{email}</span>
                  <span className="text-slate-500 block">{phone}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-slate-400 block uppercase font-bold">Application Metadata:</span>
                  <span className="font-bold text-slate-950 block">{dateStr}</span>
                  <span className="font-bold text-slate-950 block">Status: PENDING REVIEW</span>
                  <span className="text-indigo-600 font-bold block">Sandbox Status: ACTIVE PRO</span>
                </div>
              </div>

              {/* Program Details Table */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[10px] text-slate-400 uppercase tracking-wider pb-1">
                  <span>Product / Package Code</span>
                  <span>Fee Status</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-950">Get Board Ready Pro subscription</span>
                    <span className="text-[10px] text-slate-500 block">Complete 30-Day Adaptive Corporate Governance Course with NPCI syllabus, infinite exams, and AI Boardroom Tutor.</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold font-mono text-slate-900 block">₹99.00</span>
                    <span className="text-[8px] font-mono text-emerald-600 block font-bold uppercase">PROMO APPROVED</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="text-[10px] font-sans text-slate-600 leading-normal bg-slate-50 border border-slate-150 p-3 rounded-xl">
                <strong className="text-slate-900 block mb-0.5">Note to Board Candidate:</strong>
                Your application will be reviewed by our board onboarding committee. In the meantime, you have been granted full premium features inside this web application so you can begin training immediately.
              </div>

              {/* Secure Seal */}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span className="text-indigo-700 font-bold uppercase">FIRESTORE BACKEND SYNCED</span>
                </div>
                <span className="text-slate-400 font-bold">REGISTRATION_ACK_SLIP</span>
              </div>
            </div>

            {/* Utility buttons (hidden on Print) */}
            <div className="flex gap-2.5 pt-1 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-200 uppercase tracking-wider font-mono"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md uppercase tracking-wider font-mono"
              >
                <span>Launch Premium</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
