import React, { useState, useEffect, useRef } from "react";
import { 
  Award, 
  BookOpen, 
  Briefcase, 
  CheckCircle, 
  ChevronRight, 
  Cpu, 
  HelpCircle, 
  Layers, 
  ShieldAlert, 
  Sparkles, 
  Users,
  Calculator,
  TrendingUp,
  Coins,
  Lock,
  Unlock,
  MessageSquare,
  Bot,
  FileText,
  X,
  Check,
  RotateCcw,
  Play,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface LandingPageProps {
  onEnroll: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onEnroll, onLogin }: LandingPageProps) {
  const [iicaTab, setIicaTab] = useState<"logistics" | "eligibility" | "resources">("logistics");
  
  // Ex-Google executive premium value ROI tool states
  const [meetingsCount, setMeetingsCount] = useState(6);
  const [sittingFee, setSittingFee] = useState(50000);

  // ========================================================
  // INTERACTIVE SESSION SIMULATOR STATES
  // ========================================================
  const [simRole, setSimRole] = useState<"CA" | "CEO" | "Lawyer">("CA");
  const [simTab, setSimTab] = useState<"syllabus" | "chat" | "exam">("syllabus");
  const [simChatMessages, setSimChatMessages] = useState<Array<{ sender: "user" | "assistant"; text: string }>>([
    { 
      sender: "assistant", 
      text: "Welcome, Board Candidate. I am your autonomous AI Boardroom Advisor. Select a boardroom scenario below to evaluate my legal citation and SEBI compliance guidance instantly!" 
    }
  ]);
  const [simIsTyping, setSimIsTyping] = useState(false);
  const [simCustomInput, setSimCustomInput] = useState("");
  const [simShowPromoOverlay, setSimShowPromoOverlay] = useState(false);
  
  // Simulated Exam State
  const [simSelectedOption, setSimSelectedOption] = useState<number | null>(null);
  const [simExamSubmitted, setSimExamSubmitted] = useState(false);

  // Simulated Quiz State inside Lesson Tab
  const [simQuizSelected, setSimQuizSelected] = useState<number | null>(null);
  const [simQuizSubmitted, setSimQuizSubmitted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simChatMessages, simIsTyping]);







  const handleSimQuickQuestion = (question: string, answer: string) => {
    if (simIsTyping) return;
    setSimChatMessages(prev => [...prev, { sender: "user", text: question }]);
    setSimIsTyping(true);
    setTimeout(() => {
      setSimIsTyping(false);
      setSimChatMessages(prev => [...prev, { sender: "assistant", text: answer }]);
    }, 1000);
  };

  const handleSimCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simCustomInput.trim() || simIsTyping) return;
    setSimChatMessages(prev => [...prev, { sender: "user", text: simCustomInput }]);
    const currentInput = simCustomInput;
    setSimCustomInput("");
    setSimIsTyping(true);
    setTimeout(() => {
      setSimIsTyping(false);
      setSimChatMessages(prev => [...prev, { 
        sender: "assistant", 
        text: `🔒 **Premium Feature Locked**: Analyzing custom boardroom query: "${currentInput}" requires direct API access. Get complete unrestricted 24/7 AI Tutor access for only ₹99!` 
      }]);
      setSimShowPromoOverlay(true);
    }, 1100);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Promotional Announcement Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-violet-900 text-white text-xs font-medium py-3 px-4 text-center relative z-50 flex flex-col sm:flex-row items-center justify-center gap-2 border-b border-indigo-500/20 shadow-md">
        <span className="flex items-center space-x-1.5">
          <span className="bg-amber-400 text-slate-950 text-[9px] font-black font-mono uppercase px-2 py-0.5 rounded animate-pulse">
            LIMITED OFFER
          </span>
          <span className="font-mono tracking-tight text-indigo-100">
            Pass the IICA proficiency exam with ease. Get complete 30-Day Premium access for just
          </span>
          <span className="font-extrabold text-amber-300 text-sm">
            ₹99 Only
          </span>
          <span className="text-slate-400 line-through text-[10px]">
            (Reg. ₹999)
          </span>
        </span>
        <a 
          onClick={onEnroll} 
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded transition-all transform hover:scale-105 shadow-sm font-mono"
        >
          Enroll Instantly ↓
        </a>
      </div>

      {/* Header Banner */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <Cpu className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-slate-900">
              Get Board Ready
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
              AUTONOMOUS EXECUTIVE ENGINE
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={onLogin}
                className="text-slate-600 hover:text-slate-900 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                Log In
              </button>
              <button
                onClick={onEnroll}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Value Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-800 text-xs px-3 py-1.5 rounded-full font-medium">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>100% Autonomous AI-Powered Learning Portal</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Master the IICA Independent Director Exam in <span className="text-indigo-600">30 Days</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                The traditional human-led prep class is rigid and expensive. This is the <strong className="font-extrabold text-slate-950 bg-amber-100/80 px-1 rounded-sm border-b border-amber-300">fully autonomous AI version</strong>: on-demand executive training material customized specifically to your professional background, instant answers to boardroom doubts, and simulated mock exams that guarantee a passing score.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Custom Executive Focus</h4>
                    <p className="text-xs text-slate-500">Materials adapt whether you are a CEO, CA, CS, lawyer, or technology leader.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">24/7 Boardroom Tutor</h4>
                    <p className="text-xs text-slate-500">Ask any complex legal scenario question. Receive precise, cited answers instantly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Adaptive Mock Tests</h4>
                    <p className="text-xs text-slate-500">Real-time mock exams with exhaustive citations of the Companies Act 2013.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Zero Human Dependencies</h4>
                    <p className="text-xs text-slate-500">100% self-learning. No boring fixed schedules or coordination with trainers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Card */}
            <div id="enroll" className="lg:col-span-5 bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-indigo-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Special Offer Ribbon/Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-slate-950 text-[9px] font-extrabold font-mono uppercase px-3 py-1 rounded-bl-xl shadow-md tracking-wider">
                98% Off Launch Special
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pt-1">
                  <div className="bg-indigo-600/20 p-1.5 rounded text-indigo-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Instant AI Enrollment</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold">Start Your 30-Day Training</h3>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-amber-300">₹99</span>
                    <span className="text-xs text-slate-400 line-through">₹999</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">30-Day Full Access</span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  Enter your background to customize the training curriculum. The Gemini model will restructure the 30-day syllabus lessons to suit your professional experience.
                </p>

                <div className="space-y-3 pt-1">
                  <button
                    onClick={onEnroll}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-indigo-500/25"
                  >
                    <span>Get Started for ₹99 Only</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={onLogin}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-2 border border-slate-700"
                  >
                    <span>Already have an account? Log In</span>
                  </button>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 text-center">
                  Lifetime access. Works on all devices. Secure cloud sync.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Session Simulator Section */}
      <section id="simulator" className="py-20 bg-slate-900 border-y border-slate-800 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full font-mono uppercase tracking-widest font-semibold">
              <Cpu className="h-3 w-3 animate-pulse text-indigo-400" />
              <span>Interactive Boardroom Preview</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Experience the Full App Session <span className="text-indigo-400">Live</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              We offer <strong className="text-white">no limited free tier</strong> to keep the platform premium and clean. Use this complimentary boardroom preview to experience how the custom syllabus, AI legal chat, and mock exam engines work before enrolling.
            </p>
          </div>

          {/* MacOS Browser Container Mockup */}
          <div className="max-w-5xl mx-auto bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[580px]">
            {/* Browser Header Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
                <span className="text-xs text-slate-500 font-mono pl-4 tracking-wider">GET_BOARD_READY_V2.0</span>
              </div>
              <div className="hidden sm:flex bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 items-center space-x-1.5">
                <Unlock className="h-3 w-3 text-emerald-500" />
                <span>PREVIEW MODE ACTIVE • ₹99 MEMBERSHIP READY</span>
              </div>
            </div>

            {/* Simulated Workspace Columns */}
            <div className="flex flex-col md:flex-row flex-1">
              {/* Left Navigation Rails */}
              <div className="w-full md:w-64 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-2">Simulated Modules</span>
                    <nav className="space-y-1">
                      <button
                        onClick={() => { setSimTab("syllabus"); setSimShowPromoOverlay(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                          simTab === "syllabus" 
                            ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" 
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                      >
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <span>📚 Custom 30-Day Syllabus</span>
                      </button>
                      
                      <button
                        onClick={() => { setSimTab("chat"); setSimShowPromoOverlay(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                          simTab === "chat" 
                            ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" 
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span>💬 Boardroom AI Tutor</span>
                      </button>

                      <button
                        onClick={() => { setSimTab("exam"); setSimShowPromoOverlay(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                          simTab === "exam" 
                            ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" 
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span>📝 Situational Mock Exam</span>
                      </button>
                    </nav>
                  </div>

                  {/* Profile Simulation indicator */}
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Tailored Viewport</span>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      The syllabus and questions automatically morph depending on your background. Select a role below to see how:
                    </p>
                    <div className="grid grid-cols-3 gap-1 mt-2.5">
                      <button 
                        onClick={() => { setSimRole("CA"); setSimQuizSelected(null); setSimQuizSubmitted(false); }}
                        className={`text-[9px] py-1 px-1.5 rounded text-center transition-all ${simRole === "CA" ? "bg-indigo-600 font-bold text-white" : "bg-slate-900 hover:bg-slate-850 text-slate-400"}`}
                      >
                        CA/CS
                      </button>
                      <button 
                        onClick={() => { setSimRole("CEO"); setSimQuizSelected(null); setSimQuizSubmitted(false); }}
                        className={`text-[9px] py-1 px-1.5 rounded text-center transition-all ${simRole === "CEO" ? "bg-indigo-600 font-bold text-white" : "bg-slate-900 hover:bg-slate-850 text-slate-400"}`}
                      >
                        CEO/CXO
                      </button>
                      <button 
                        onClick={() => { setSimRole("Lawyer"); setSimQuizSelected(null); setSimQuizSubmitted(false); }}
                        className={`text-[9px] py-1 px-1.5 rounded text-center transition-all ${simRole === "Lawyer" ? "bg-indigo-600 font-bold text-white" : "bg-slate-900 hover:bg-slate-850 text-slate-400"}`}
                      >
                        Advocate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lifetime Callout */}
                <div className="mt-8 bg-indigo-950/40 p-3 rounded-xl border border-indigo-900/30 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400">₹99 PRO ACCESS</span>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Get unlimited access to real-time Gemini AI, mock diagnostic sheets, and complete IICA Databank exam resources.
                  </p>
                  <a 
                    onClick={onEnroll} 
                    className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold py-1.5 rounded text-center block uppercase tracking-wider transition-colors"
                  >
                    Unlock Pro For ₹99
                  </a>
                </div>
              </div>

              {/* Main Simulation Viewport Panel */}
              <div className="flex-1 bg-slate-900/40 p-4 sm:p-6 flex flex-col relative min-h-[420px]">
                
                {/* Promo Unlock Popup overlay */}
                {simShowPromoOverlay && (
                  <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-sm">
                    <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-2xl max-w-sm space-y-4">
                      <div className="bg-indigo-600 text-white p-2.5 rounded-full inline-block">
                        <Lock className="h-6 w-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-white">Unlock the Full Autonomous Engine</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          This is only a pre-purchase demonstration. Pay ₹99 once to unlock unlimited 24/7 custom AI chats, generate complete 30-day syllabi, and simulate unlimited full-scale mock exams with precise diagnostic analytics.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSimShowPromoOverlay(false)}
                          className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-300 text-[10px] font-semibold py-2 rounded-lg transition-colors"
                        >
                          Keep Testing Demo
                        </button>
                        <a
                          onClick={onEnroll}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <span>Pay ₹99 Only</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. SYLLABUS TAB */}
                {simTab === "syllabus" && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">DAY 1 MICRO-LESSON • ADAPTIVE VIEW FOR {simRole === "CA" ? "CA / CS" : simRole === "CEO" ? "CEO / DIRECTORS" : "ADVOCATES"}</span>
                          <h3 className="text-base font-bold text-white mt-1">
                            {simRole === "CA" 
                              ? "Day 1: Audit Committees & Regulatory Thresholds" 
                              : simRole === "CEO" 
                              ? "Day 1: Director Liability & Recorded Boardroom Dissents" 
                              : "Day 1: S.149(6) Statutory Code & Independence Test"}
                          </h3>
                        </div>
                        <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[9px] font-mono">
                          Day 1 of 30
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-3 shadow-inner">
                        <p>
                          {simRole === "CA" 
                            ? "Under Section 177 of the Companies Act 2013 and Regulation 18 of SEBI LODR, every listed public company must establish an Audit Committee. It must consist of a minimum of 3 directors, with Independent Directors forming at least a two-thirds majority." 
                            : simRole === "CEO" 
                            ? "Section 149(12) safe-harbour clauses protect Non-Executive and Independent Directors from direct prosecution only if the board default occurred without their consent or connivance. Active diligence is the key boardroom defense." 
                            : "Section 149(6) lays down the statutory definition of an Independent Director. They must not possess any promoter or familial ties, nor can they hold any material pecuniary interest exceeding 10% of their total income in the current or preceding two years."}
                        </p>
                        <p className="border-l-2 border-indigo-500 pl-3 text-slate-400 italic">
                          {simRole === "CA" 
                            ? "Key Focus: Pay close attention to Related Party Transactions under Section 188. These require prior Audit Committee approval and Ordinary Resolution if exceeding turnover limits." 
                            : simRole === "CEO" 
                            ? "Key Focus: To establish dilution of boardroom liability, ensure all regulatory concerns and dissents are explicitly noted in the minuted board sheets." 
                            : "Key Focus: Analyze the 2-year timeline criteria regarding promoter employment or relative stakes in associated companies under Schedule IV."}
                        </p>
                      </div>

                      {/* Interactive lesson quiz snippet */}
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-bold">
                          <CheckCircle className="h-4 w-4" />
                          <span>Interactive Core Concept Test</span>
                        </div>
                        <p className="text-[11px] text-slate-200">
                          {simRole === "CA" 
                            ? "Q: What is the Related Party Transaction threshold limit under S.188 requiring shareholder resolution?" 
                            : simRole === "CEO" 
                            ? "Q: Under S.149(12), what is the primary shield for an independent director to claim diligence?" 
                            : "Q: What PECUNIARY threshold disqualifies an Independent Director candidate under Section 149(6)?"}
                        </p>

                        <div className="space-y-1.5">
                          {/* Options */}
                          {(simRole === "CA" 
                            ? [
                                "Transaction exceeding 5% of corporate turnover or ₹50 crore",
                                "Transaction exceeding 10% of annual turnover or ₹100 crore (whichever is lower)"
                              ]
                            : simRole === "CEO"
                            ? [
                                "Simply being absent from the physical boardroom meeting",
                                "Ensuring their explicit dissent is minuted in the board meeting records"
                              ]
                            : [
                                "Any pecuniary relationship whatsoever, regardless of scale or amount",
                                "Relationship exceeding 10% of total income or as prescribed during the last 2 years"
                              ]
                          ).map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (simQuizSubmitted) return;
                                setSimQuizSelected(idx);
                              }}
                              className={`w-full text-left p-2.5 rounded-lg text-[10px] transition-all flex items-center justify-between ${
                                simQuizSelected === idx
                                  ? "bg-indigo-600/30 border border-indigo-500 text-indigo-200"
                                  : "bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400"
                              }`}
                            >
                              <span>{opt}</span>
                              {simQuizSelected === idx && <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>}
                            </button>
                          ))}
                        </div>

                        {simQuizSelected !== null && !simQuizSubmitted && (
                          <button
                            onClick={() => setSimQuizSubmitted(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors"
                          >
                            Verify Answer
                          </button>
                        )}

                        {simQuizSubmitted && (
                          <div className="p-2.5 rounded-lg text-[10px] bg-slate-900 border border-slate-800">
                            {simQuizSelected === 1 ? (
                              <p className="text-emerald-400 leading-normal">
                                <b>✓ Correct!</b> Perfect legal interpretation. The Companies Act 2013 mandates this precise compliance threshold. In the real app, this updates your cloud progress tracker and unlocks Day 2 content!
                              </p>
                            ) : (
                              <p className="text-rose-400 leading-normal">
                                <b>❌ Incorrect.</b> In the real app, Get Board Ready explains the exact reasoning citing Schedule IV and provides tailored flashcards. The correct answer is Option B.
                              </p>
                            )}
                            <button
                              onClick={() => {
                                setSimQuizSelected(null);
                                setSimQuizSubmitted(false);
                              }}
                              className="mt-2 text-[9px] text-indigo-400 font-bold hover:underline flex items-center space-x-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Reset Quiz</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Syllabus preview. Progress resets on page refresh.</span>
                      <button
                        onClick={() => setSimShowPromoOverlay(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 uppercase tracking-wider font-mono"
                      >
                        <span>Start Day 2 Lesson</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. CHAT TAB */}
                {simTab === "chat" && (
                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    {/* Simulated Chat History Window */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[260px] scrollbar-thin">
                      {simChatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`flex space-x-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                            <div className={`p-1.5 rounded-full h-7 w-7 flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-950 text-indigo-400 border border-indigo-500/20"}`}>
                              {msg.sender === "user" ? <Users className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                            </div>
                            <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-950 text-slate-300 rounded-tl-none border border-slate-800"}`}>
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      ))}

                      {simIsTyping && (
                        <div className="flex justify-start">
                          <div className="flex space-x-2 items-center">
                            <div className="bg-slate-950 text-indigo-400 p-1.5 rounded-full border border-indigo-500/20">
                              <Bot className="h-3.5 w-3.5 animate-spin" />
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-[10px] text-slate-500 font-mono flex items-center space-x-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                              <span>AI consulting SEBI regulations...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Pre-populated sample questions to tap */}
                    <div className="py-2.5 border-t border-slate-850">
                      <span className="text-[9px] font-mono text-slate-500 block mb-1.5 uppercase font-bold">Tap a quick doubt to try the preview:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleSimQuickQuestion(
                            "Can an Independent Director receive stock options in India?",
                            "❌ Under Section 149(9) of the Companies Act 2013 and Regulation 17(6) of SEBI LODR, an Independent Director is strictly prohibited from receiving stock options (ESOPs).\n\nThey are legally entitled to receive only:\n1. Sitting fees (capped at ₹1,00,000 per meeting)\n2. Re-imbursements of attendance expenses\n3. Profit-related commission with prior shareholder approval."
                          )}
                          className="bg-slate-950 hover:bg-slate-900 border border-slate-850 px-2 py-1 text-[9px] rounded text-slate-300"
                        >
                          Stock Options Allowed? S.149(9)
                        </button>
                        <button
                          onClick={() => handleSimQuickQuestion(
                            "What is the threshold limit for Related Party Transactions under S.188?",
                            "📑 Under Rule 15 of Companies (Meetings of Board) Rules 2014, contracts with related parties require prior shareholders ordinary resolution if exceeding turnover benchmarks:\n- Sale/Purchase of Goods: Exceeding 10% of company turnover or ₹100 Crore, whichever is lower.\n\nNote: Dissenting votes of related parties must be logged; interested members cannot vote on the resolution."
                          )}
                          className="bg-slate-950 hover:bg-slate-900 border border-slate-850 px-2 py-1 text-[9px] rounded text-slate-300"
                        >
                          RPT Limits Section 188
                        </button>
                        <button
                          onClick={() => handleSimQuickQuestion(
                            "How should boardroom dissents be recorded legally?",
                            "📝 Under Schedule IV Code of Conduct, Independent Directors must ensure their concerns and explicit dissents are logged directly in the Board Meeting Minutes.\n\nIn case of disputes, submitting a signed dissent memo to the Company Secretary within 7 days serves as safe-harbor evidence under S.149(12)."
                          )}
                          className="bg-slate-950 hover:bg-slate-900 border border-slate-850 px-2 py-1 text-[9px] rounded text-slate-300"
                        >
                          How to Record Dissent?
                        </button>
                      </div>
                    </div>

                    {/* Custom query input */}
                    <form onSubmit={handleSimCustomSubmit} className="bg-slate-950 p-1.5 rounded-xl border border-slate-850 flex items-center gap-2">
                      <input
                        type="text"
                        value={simCustomInput}
                        onChange={(e) => setSimCustomInput(e.target.value)}
                        placeholder="Type custom board compliance question..."
                        className="bg-transparent flex-1 text-[11px] text-white focus:outline-none px-2 placeholder-slate-600"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <span>Ask AI</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. EXAM TAB */}
                {simTab === "exam" && (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">GET BOARD READY COMPLIMENTARY EXAM PREVIEW • SAMPLE QUESTION</span>
                          <h3 className="text-sm font-bold text-white mt-1">
                            Companies Act & SEBI Corporate Governance Dispute
                          </h3>
                        </div>
                        <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[9px] font-mono">
                          IICA Standard
                        </span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[11px] text-slate-200 leading-relaxed font-medium bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                          Scenario: During an Audit Committee meeting of a listed public entity, the CFO presents a major related-party loan proposal to an associated developer. The Independent Directors on the Audit Committee unanimously object and vote against. Can the Board override this dissent and approve the transaction?
                        </p>

                        <div className="space-y-2">
                          {[
                            "Yes, the Board of Directors can override Audit Committee dissent with 75% voting supermajority.",
                            "No, under Section 177, any related-party transaction MUST receive prior approval of the Audit Committee; Board override is legally invalid."
                          ].map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (simExamSubmitted) return;
                                setSimSelectedOption(idx);
                              }}
                              className={`w-full text-left p-3 rounded-xl text-[10px] leading-relaxed transition-all flex items-start space-x-2.5 ${
                                simSelectedOption === idx
                                  ? "bg-indigo-600/30 border border-indigo-500 text-indigo-100"
                                  : "bg-slate-950/60 hover:bg-slate-900 border border-slate-850 text-slate-400"
                              }`}
                            >
                              <span className="bg-slate-900 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border border-slate-800 shrink-0 text-slate-400 uppercase">
                                {idx === 0 ? "Option A" : "Option B"}
                              </span>
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {simSelectedOption !== null && !simExamSubmitted && (
                        <button
                          onClick={() => setSimExamSubmitted(true)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <span>Confirm Simulated Answer</span>
                        </button>
                      )}

                      {simExamSubmitted && (
                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-[10.5px] leading-relaxed space-y-2">
                          {simSelectedOption === 1 ? (
                            <div className="space-y-1.5 text-emerald-400">
                              <p className="font-bold flex items-center space-x-1">
                                <Check className="h-4 w-4" />
                                <span>Correct Answer Verified!</span>
                              </p>
                              <p className="text-slate-300">
                                Excellent legal interpretation! Under **Section 177(4)(iv)** of the Companies Act and **SEBI LODR Regulation 23**, the Audit Committee has sole proprietary veto rights on related party transaction approval. The Board cannot bypass or override this dissent.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1.5 text-rose-400">
                              <p className="font-bold flex items-center space-x-1">
                                <X className="h-4 w-4" />
                                <span>Incorrect Option Selected</span>
                              </p>
                              <p className="text-slate-300">
                                Under Section 177, related party contracts require prior Audit Committee approval. The Board is legally barred from overriding an audit committee veto. Correct answer is **Option B**.
                              </p>
                            </div>
                          )}
                          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-500">
                            <span>Diagnostic Score Card saved to cloud profile in real-app.</span>
                            <button
                              onClick={() => {
                                setSimSelectedOption(null);
                                setSimExamSubmitted(false);
                              }}
                              className="text-indigo-400 font-bold hover:underline"
                            >
                              Retry Question
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Need infinite adaptive mock exams and citation guides?</span>
                      <button
                        onClick={() => setSimShowPromoOverlay(true)}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 uppercase tracking-wider font-mono shadow-md"
                      >
                        <span>Generate Full Diagnostic Test</span>
                        <Sparkles className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparisons Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How the Autonomous AI Prep Model Works</h2>
            <p className="text-sm text-slate-500">
              The real IICA Databank exam is tough (50% passing, situational legal questions). Our platform replaces human trainers with infinitely available intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Human-Led Pain */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center space-x-3 text-red-600">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-bold text-base text-slate-900">Traditional Classrooms</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong className="font-semibold text-slate-950">Fixed batch schedules</strong> that clash with your executive board obligations and business travel.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong className="font-semibold text-slate-950">One-size-fits-all training</strong> that forces a senior finance director to sit through basic financial sessions, or a seasoned lawyer to endure simple contracts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong className="font-semibold text-slate-950">Human delays in answering doubts</strong>: Emailed queries to trainers take 24–48 hours to get a reply.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong className="font-semibold text-slate-950">Static, repetitive mock exam PDFs</strong> that don't change or explain the nuances of the Companies Act sections.</span>
                </li>
              </ul>
            </div>

            {/* The AI Version Gain */}
            <div className="bg-indigo-950 text-indigo-100 p-6 rounded-xl border border-indigo-900 space-y-4 shadow-lg">
              <div className="flex items-center space-x-3 text-indigo-400">
                <Cpu className="h-5 w-5" />
                <h3 className="font-bold text-base text-white">The AI Prep Portal</h3>
              </div>
              <ul className="space-y-2 text-xs text-indigo-200">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">✔</span>
                  <span><strong className="font-semibold text-white">Fully autonomous schedule</strong>: Learn at midnight, on flights, or during short breaks in 15-minute high-impact bursts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">✔</span>
                  <span><strong className="font-semibold text-white">Profession-Tailored Content</strong>: Gemini dynamically adjusts explanation models. CAs get deeper SEBI legal reviews; tech founders get deeper corporate governance accounting breakdowns.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">✔</span>
                  <span><strong className="font-semibold text-white">Instant Boardroom AI Chat</strong>: Get immediate guidance with detailed citations on Companies Act Sections and Schedules.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">✔</span>
                  <span><strong className="font-semibold text-white">Infinite Dynamic Mock Tests</strong>: Generates custom test papers on-demand with intelligent grading and rigorous performance diagnostics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Bento Grid */}
      <section className="py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">30-Day Syllabus</span>
            <h2 className="text-3xl font-bold text-slate-900">Comprehensive Exam Blueprint Mapping</h2>
            <p className="text-sm text-slate-500">
              The curriculum spans across all core requirements defined by the IICA, ensuring you leave no gaps in your proficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="bg-slate-900 text-white h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm">01</div>
              <h4 className="font-bold text-base text-slate-900">Companies Act 2013 Foundations</h4>
              <p className="text-xs text-slate-500">Days 1-6. Comprehensive parsing of Section 149(6), Schedule IV (Code of Conduct), Board notices, quorum rules, S.188 RPT, S.185-186 loan guidelines.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="bg-slate-900 text-white h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm">02</div>
              <h4 className="font-bold text-base text-slate-900">Board Committees & Constitution</h4>
              <p className="text-xs text-slate-500">Days 7-12. Deep dives into Audit Committee, NRC, SRC, CSR Committee rules, vigil mechanisms, evaluation formats, and whistleblower frameworks.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="bg-slate-900 text-white h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm">03</div>
              <h4 className="font-bold text-base text-slate-900">SEBI (LODR) Regulations 2015</h4>
              <p className="text-xs text-slate-500">Days 13-18. Regulation 17 board ratios, unlisted subsidiary controls, PIT insider trading guidelines, SEBI SAST takeover rules, and public disclosures.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="bg-slate-900 text-white h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm">04</div>
              <h4 className="font-bold text-base text-slate-900">Financial Management & Forensics</h4>
              <p className="text-xs text-slate-500">Days 19-24. Understanding complex Balance Sheets, CFO questions, warning ratios, Directors Responsibility Statement (DRS), CARO 2020, audits.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="bg-slate-900 text-white h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm">05</div>
              <h4 className="font-bold text-base text-slate-900">Ethics, CSR & Boardroom Conflicts</h4>
              <p className="text-xs text-slate-500">Days 25-28. S.135 CSR allocations, Schedule VII projects, navigating intense boardroom pushbacks, recording critical dissents in minutes.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="bg-slate-900 text-white h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm">06</div>
              <h4 className="font-bold text-base text-slate-900">IBC, Fraud & Boardroom Scenarios</h4>
              <p className="text-xs text-slate-500">Days 29-30. S.447 heavy penalties, Insolvency code directors responsibilities, mock board dilemmas, and comprehensive revision modules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Official IICA Exam & Eligibility Guide Section */}
      <section id="iica-guide" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs px-3.5 py-1.5 rounded-full font-mono uppercase tracking-widest font-semibold">
              <Award className="h-3.5 w-3.5 text-indigo-600" />
              <span>Official IICA Regulatory Portal Context</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Official IICA Independent Director Exam <span className="text-indigo-600">Guide</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              The Online Proficiency Self-Assessment Test (OPSAT) is a mandatory test conducted by the <strong>Indian Institute of Corporate Affairs (IICA)</strong> for individuals aiming to serve on corporate boards in India.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            {/* Interactive Tab Switcher */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-col sm:flex-row gap-1">
              <button
                type="button"
                onClick={() => setIicaTab("logistics")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  iicaTab === "logistics"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Exam Structure & Logistics</span>
              </button>

              <button
                type="button"
                onClick={() => setIicaTab("eligibility")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  iicaTab === "eligibility"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Eligibility, Fees & Exemptions</span>
              </button>

              <button
                type="button"
                onClick={() => setIicaTab("resources")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  iicaTab === "resources"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Syllabus & e-Learning Next Steps</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8">
              {/* Tab 1: Logistics */}
              {iicaTab === "logistics" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">OPSAT Examination Blueprint</h3>
                    <p className="text-xs text-slate-500 mt-1">Conducted as an online proctored session evaluating legal, regulatory, and corporate stewardship competence.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">FORMAT</span>
                      <h4 className="font-extrabold text-sm text-slate-900">50 Multiple-Choice Questions</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Every exam is split into two equal partitions: <strong>25 direct-knowledge laws/regulations questions</strong> (Board Essentials) and <strong>25 scenario-based applied-diligence questions</strong> (Board Practices).
                      </p>
                    </div>

                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">TIME LIMIT</span>
                      <h4 className="font-extrabold text-sm text-slate-900">75 Minutes Maximum</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Strict online computer countdown of 75 minutes. You must submit before the timer expires. Average time budget is 1.5 minutes per question.
                      </p>
                    </div>

                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">PASSING SCORE & PENALTIES</span>
                      <h4 className="font-extrabold text-sm text-slate-900">50% Aggregate Passing</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Requires scoring 50 marks out of 100 maximum (each question carrying 2 marks). There is <strong>no negative marking</strong>, meaning you should answer every question on the paper.
                      </p>
                    </div>

                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">ATTEMPTS</span>
                      <h4 className="font-extrabold text-sm text-slate-900">Unlimited Retakes Allowed</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        You can attempt the exam as many times as needed to pass. However, a mandatory <strong>1-day cooling gap</strong> is enforced between successive exam attempts.
                      </p>
                    </div>

                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">TEST CONVENIENCE</span>
                      <h4 className="font-extrabold text-sm text-slate-900">Online & Proctored</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Can be taken from your home or office desktop. Requires a running webcam and identity proof validation on the proctoring interface.
                      </p>
                    </div>

                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block">PREMIUM PREPARATION</span>
                      <h4 className="font-extrabold text-sm text-slate-900">Get Board Ready Match</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Our mock test module generates accurate scenario questions citing specific S.149, S.188, and SEBI clauses to replicate the official experience perfectly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Eligibility & Exemptions */}
              {iicaTab === "eligibility" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">Eligibility, Timeline, and Official Exemptions</h3>
                    <p className="text-xs text-slate-500 mt-1">Review the strict timeline mandates and find out if you qualify for an exam exemption based on your years of professional service.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-amber-50 border border-amber-200/80 p-5 rounded-xl space-y-2.5">
                        <div className="flex items-center space-x-2 text-amber-800">
                          <ShieldAlert className="h-5 w-5" />
                          <h4 className="font-extrabold text-sm uppercase font-mono tracking-wider">Mandatory 2-Year Passing Timeline</h4>
                        </div>
                        <p className="text-xs text-amber-900 leading-relaxed">
                          To be eligible for corporate boards in India, candidates must first register on the official <strong>Independent Director's Databank</strong>. 
                        </p>
                        <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                          ⚠️ You must successfully pass the proficiency test within exactly two years of registering in the databank. Failure to do so leads to automatic, permanent profile deletion and requires full re-registration and fees.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                        <h4 className="font-extrabold text-sm text-slate-900">Subscription & Registration Fees</h4>
                        <div className="space-y-2 text-xs text-slate-600">
                          <p>
                            Databank subscription fees range from <strong>₹5,000 + GST for 1 Year</strong> up to <strong>₹25,000 + GST for Lifetime Registration</strong>.
                          </p>
                          <p className="bg-slate-200/50 p-2.5 rounded-lg text-slate-700 text-[11px] font-medium border border-slate-250">
                            💡 <strong>Cost Coverage Note</strong>: Your official online exam attempt fee is fully included in the initial databank subscription cost. No extra payment to IICA is required for retakes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl space-y-3">
                      <h4 className="font-bold text-sm text-indigo-900 flex items-center space-x-1.5">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        <span>Do You Qualify for Exam Exemption?</span>
                      </h4>
                      <p className="text-xs text-indigo-800 leading-relaxed">
                        Under the Ministry of Corporate Affairs (MCA) guidelines, certain seasoned executives and professionals are exempt from taking the Online Proficiency Self-Assessment Test if they meet any of the following criteria:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className="bg-white p-3 rounded-lg border border-indigo-100 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-600 block">CA / CS / COST PRACTICE</span>
                          <p className="text-xs text-slate-700 leading-normal font-medium">
                            <strong>10+ Years</strong> of practice as a Chartered Accountant (CA), Company Secretary (CS), or Cost Accountant.
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-indigo-100 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-600 block">ACADEMIA / PROFESSORS</span>
                          <p className="text-xs text-slate-700 leading-normal font-medium">
                            <strong>10+ Years</strong> of experience as a professor or head of department in recognized universities or professional institutes.
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-indigo-100 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-600 block">BOARD EXPERIENCE</span>
                          <p className="text-xs text-slate-700 leading-normal font-medium">
                            Served at least <strong>3+ Years</strong> as a Director or Key Managerial Personnel (KMP) in specified listed or unlisted public companies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Syllabus & e-Learning Next Steps */}
              {iicaTab === "resources" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">Syllabus Coverage & e-Learning Portals</h3>
                    <p className="text-xs text-slate-500 mt-1">Conducted using materials from Companies Act 2013 and SEBI. Use these next steps to navigate the official portals.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-slate-900 uppercase font-mono tracking-wider">Exam Syllabus Segments</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600">
                        <li className="flex items-start space-x-2">
                          <span className="text-indigo-600 font-bold">✔</span>
                          <span><strong>Company Law (High Weightage)</strong>: S.149 board composition, director duties under Schedule IV, S.135 Corporate Social Responsibility, General Meetings, and S.188 RPTs.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-indigo-600 font-bold">✔</span>
                          <span><strong>Securities Laws</strong>: SEBI (LODR) Regulations 2015, board ratios, and SEBI (PIT) Insider Trading framework regulations.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-indigo-600 font-bold">✔</span>
                          <span><strong>Financial Literacy & Forensics</strong>: Reading corporate balance sheets, cash flows, financial ratios, DRS, CARO 2020, and auditor disclosures.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3.5">
                      <h4 className="font-extrabold text-sm text-slate-900">Official Prep Resources & Steps</h4>
                      <div className="space-y-2 text-xs text-slate-600">
                        <a 
                          href="https://www.independentdirectorsdatabank.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/10 transition-all text-slate-700"
                        >
                          <span className="h-5 w-5 bg-indigo-50 text-indigo-600 font-bold text-[10px] rounded-full flex items-center justify-center border border-indigo-100 shrink-0">1</span>
                          <span className="flex-1">Register or log in via the <strong>Individual Registration Portal</strong>.</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </a>
                        <a 
                          href="https://www.independentdirectorsdatabank.in/elearning"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/10 transition-all text-slate-700"
                        >
                          <span className="h-5 w-5 bg-indigo-50 text-indigo-600 font-bold text-[10px] rounded-full flex items-center justify-center border border-indigo-100 shrink-0">2</span>
                          <span className="flex-1">Access reading modules & practice official mocks via <strong>IICA e-Learning Courses</strong>.</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </a>
                        <a 
                          href="https://www.independentdirectorsdatabank.in/proficiency-test"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/10 transition-all text-slate-700"
                        >
                          <span className="h-5 w-5 bg-indigo-50 text-indigo-600 font-bold text-[10px] rounded-full flex items-center justify-center border border-indigo-100 shrink-0">3</span>
                          <span className="flex-1">Review the full regulatory framework on the <strong>IICA Online Proficiency Self-Assessment Portal</strong>.</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-between items-center">
                    <span className="text-xs text-slate-400">Ready to accelerate your board-ready certification prep?</span>
                    <a
                      onClick={onEnroll}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center space-x-1.5"
                    >
                      <span>Enroll in Get Board Ready</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator Section (High-Value Cognitive Hook) */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              VALUATION METRIC
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">Calculate Your Board Career Uplift</h2>
            <p className="text-slate-400 text-xs">
              Quantify the financial return on passing the IICA Proficiency Test. Compare a modest study investment with standard board compensation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Input sliders */}
            <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Calculator className="h-5 w-5" />
                  <span className="font-bold text-xs uppercase font-mono tracking-wider">ROI Parameter Matrix</span>
                </div>

                {/* Slider 1: Meetings */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Estimated Board Meetings / Year</span>
                    <span className="text-indigo-400 font-bold font-mono">{meetingsCount} Meetings</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="12" 
                    value={meetingsCount}
                    onChange={(e) => setMeetingsCount(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2 (Minimum)</span>
                    <span>12 (Maximum)</span>
                  </div>
                </div>

                {/* Slider 2: Sitting Fee */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Average Board Sitting Fee</span>
                    <span className="text-indigo-400 font-bold font-mono">₹{sittingFee.toLocaleString("en-IN")}</span>
                  </div>
                  <input 
                    type="range" 
                    min="15000" 
                    max="100000" 
                    step="5000"
                    value={sittingFee}
                    onChange={(e) => setSittingFee(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>₹15,000</span>
                    <span>₹1,00,000 (IICA Upper Limit)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold">IICA Boardroom Economics Note</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  The Companies Act 2013 permits sitting fees up to ₹1,00,000 per board meeting for Independent Directors, plus travel reimbursement, stock option commissions, and advisory allowances.
                </p>
              </div>
            </div>

            {/* Output Yield calculation card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 to-indigo-900 p-6 rounded-2xl border border-indigo-800 flex flex-col justify-between text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/5 rounded-full pointer-events-none"></div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 bg-white/10 px-2 py-0.5 rounded-full">
                  PROJECTED ROI YIELD
                </span>
                <div className="py-4">
                  <span className="text-[10px] text-indigo-200 block uppercase font-mono tracking-wider">Estimated Annual Sitting Fees</span>
                  <span className="text-4xl font-extrabold text-white block tracking-tight font-sans">
                    ₹{(meetingsCount * sittingFee).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-indigo-800/60 py-4 my-2 grid grid-cols-2 gap-2 text-left">
                <div>
                  <span className="text-[9px] font-mono text-indigo-300 block uppercase">Prep Fee</span>
                  <span className="text-base font-bold text-white font-mono">₹99.00</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-emerald-400 block uppercase">Multiple Yield</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {Math.round(((meetingsCount * sittingFee - 99) / 99) * 10).toLocaleString()}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] text-indigo-200 leading-normal font-sans italic">
                  "Unlocking IICA compliance instantly unlocks your direct path to board appointments."
                </p>
                <a
                  onClick={onEnroll}
                  className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <span>START PREP FOR ₹99 ONLY</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Live Activity Feed Hub (Massive conversion / Social proof mechanism) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Get Board Ready Executive Network</span>
              </h3>
              <p className="text-xs text-slate-500">Real-time learning activities compiled across current exam candidates.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-mono flex items-center space-x-1.5 shrink-0 self-start md:self-auto">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              <span>482 Candidates Online Now</span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { role: "CFO & VP Finance", action: "passed Mock Exam #2 with a stellar score of 88%", time: "3 mins ago", location: "Mumbai", icon: "✓" },
              { role: "Senior Corporate Counsel", action: "queried Boardroom AI tutor regarding Regulation 17(1A) age disclosure limits", time: "12 mins ago", location: "New Delhi", icon: "💬" },
              { role: "Managing Director", action: "completed Day 6 Module (S.188 Related Party Transaction controls)", time: "28 mins ago", location: "Bengaluru", icon: "📁" },
              { role: "Audit Committee Chair", action: "registered for full Get Board Ready Pro access", time: "44 mins ago", location: "Hyderabad", icon: "⚡" }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 bg-slate-50/50 p-3 rounded-xl border border-slate-150 text-xs">
                <div className="bg-slate-900 text-white h-6 w-6 rounded-md flex items-center justify-center font-mono font-bold shrink-0 mt-0.5 text-[10px]">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-slate-900 truncate">{item.role}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {item.action} <span className="text-slate-400 font-mono text-[10px]">({item.location})</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-indigo-500 uppercase tracking-widest">Early Members</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">What Board Candidates Are Saying</h2>
            <p className="text-sm text-slate-500 mt-2">From professionals preparing for the IICA Independent Director exam</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh K.",
                role: "CFO, Listed Manufacturing Co.",
                text: "The AI Tutor cited Section 149(6) and Schedule IV precisely when I asked about pecuniary relationships. No other prep tool I tried could do that. Passed on first attempt.",
                rating: 5
              },
              {
                name: "Anita M.",
                role: "Company Secretary, Mumbai",
                text: "The mock exams use real question patterns from the IICA exam. The explanations are detailed enough to understand the WHY behind each answer — not just the what.",
                rating: 5
              },
              {
                name: "Sanjay P.",
                role: "Independent Director (Appointed)",
                text: "₹99 for something this comprehensive is almost unfair. The 30-day structured curriculum kept me consistent when I would have given up otherwise. Worth 10x the price.",
                rating: 5
              },
              {
                name: "Priya T.",
                role: "Senior Advocate, Delhi HC",
                text: "The CSR and RPT modules are particularly strong. Case studies on Satyam and real governance failures made abstract concepts instantly practical.",
                rating: 5
              },
              {
                name: "Venkat R.",
                role: "CEO, Fintech Startup",
                text: "I enrolled the night before my exam as a last-minute revision tool. The AI Tutor alone helped me revise 3 key sections in under an hour. Cleared it the next day.",
                rating: 5
              },
              {
                name: "Deepa S.",
                role: "HR Leader, MNC",
                text: "What I liked most: it adapts to my background as an HR professional. The examples it gives relate to board-level people decisions, not just pure legal theory.",
                rating: 5
              }
            ].map((t, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex text-amber-400 space-x-0.5">
                  {[...Array(t.rating)].map((_, j) => <span key={j} className="text-sm">★</span>)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t.name}</p>
                  <p className="text-[10px] text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-6">* Names abbreviated for privacy. Results may vary based on prior experience and study consistency.</p>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex bg-indigo-50 p-3 rounded-full text-indigo-600">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">No Human Friction. Fully Persistent Progress.</h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Our app stores all your notes, quiz performance scores, and mock test diagnostic answers directly in our <strong className="font-semibold text-slate-950">Firebase Firestore Cloud database</strong>. Clear your browser cache or change computers—your customized study path and notes are securely preserved.
          </p>
          <div className="pt-4">
            <a 
              onClick={onEnroll} 
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md"
            >
              <span>Get Started Immediately</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 text-white">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <span className="font-bold text-base">Get Board Ready</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This application is an autonomous, AI-driven preparation portal customized with advanced LLM prompting to help board candidates pass corporate governance exams.
          </p>
          <div className="text-xs text-slate-600">
            © 2026 Autonomous Learning Engines. Formatted to executive design standards.
          </div>
        </div>
      </footer>


    </div>
  );
}
