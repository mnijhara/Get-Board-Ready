import Logo from "./Logo";
import React, { useState, useEffect } from "react";
import Certificate from "./Certificate";
import SupportPage from "./SupportPage";
import { UserProfile, StudyModule, MockAttempt } from "../types";
import { syllabus } from "../data/syllabus";
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  ClipboardList, 
  ExternalLink, 
  HelpCircle, 
  Layers, 
  LogOut, 
  MessageSquare, 
  PlayCircle, 
  TrendingUp, 
  UserCheck,
  Lock,
  Sparkles
} from "lucide-react";

interface DashboardProps {
  profile: UserProfile;
  attempts: MockAttempt[];
  onSelectDay: (day: number) => void;
  onNavigate: (tab: "syllabus" | "tutor" | "mock" | "flashcards") => void;
  activeTab: "syllabus" | "tutor" | "mock" | "flashcards";
  onLogout: () => void;
  onTriggerUpgrade: () => void;
  children?: React.ReactNode;
}

export default function Dashboard({ 
  profile, 
  attempts, 
  onSelectDay, 
  onNavigate, 
  activeTab, 
  onLogout,
  onTriggerUpgrade,
  children 
}: DashboardProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(
    localStorage.getItem("gbr_reminder_enabled") === "true"
  );

  const toggleReminder = async () => {
    if (!reminderEnabled) {
      if ("Notification" in window) {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          new Notification("Get Board Ready 🏛️", {
            body: "Daily study reminders enabled! We'll keep your streak alive 🔥",
            icon: "/favicon.svg"
          });
          localStorage.setItem("gbr_reminder_enabled", "true");
          setReminderEnabled(true);
        }
      }
    } else {
      localStorage.setItem("gbr_reminder_enabled", "false");
      setReminderEnabled(false);
    }
  };
  const completedCount = profile.completedDays.length;
  const progressPercentage = Math.round((completedCount / 30) * 100);

  // Calculate average quiz score from progress
  const quizScores = Object.values(profile.progress)
    .map(p => p.score)
    .filter((s): s is number => s !== undefined);
  
  const avgQuizScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  // Calculate high mock exam score
  const highMockScore = attempts.length > 0
    ? Math.max(...attempts.map(a => Math.round((a.score / a.totalQuestions) * 100)))
    : 0;

  const currentModule = syllabus.find(m => m.day === profile.currentDay) || syllabus[0];

  // Group syllabus by category
  const categories = Array.from(new Set(syllabus.map(m => m.category)));

  return (
    <>
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col text-slate-900">
      {/* Top Banner / Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" variant="light" showText={true} />

          <div className="flex items-center space-x-4">
            {profile.isPremium ? (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded font-mono border border-amber-300 animate-pulse tracking-wider">
                👑 PRO ACCESS
              </span>
            ) : (
              <button 
                onClick={onTriggerUpgrade}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 shadow-md shrink-0 font-mono"
              >
                <Sparkles className="h-3 w-3" />
                <span>UPGRADE TO PRO</span>
              </button>
            )}

            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-semibold">{profile.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{profile.email} • {profile.isPremium ? "Premium Account" : "Free Account"}</span>
            </div>
            
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              title="Exit Portal"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Core Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar / Controls */}
        <aside className="lg:col-span-3 space-y-6">
          {/* User Profile Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-900 leading-tight truncate max-w-[150px]">{profile.name}</h4>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                    profile.isPremium ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {profile.isPremium ? "PRO MEMBER" : "FREE ACCOUNT"}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-500">Syllabus Progress</span>
                  <span className="font-mono font-bold text-slate-900">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Avg Quiz</span>
                  <span className="block text-base font-bold text-slate-900">{avgQuizScore}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">High Mock</span>
                  <span className="block text-base font-bold text-slate-900">{highMockScore > 0 ? `${highMockScore}%` : "—"}</span>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
                  <span className="block text-[10px] font-mono text-orange-500 uppercase">🔥 Streak</span>
                  <span className="block text-base font-bold text-orange-600">{profile.streak || 0}d</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Tabs */}
          <nav className="space-y-1">
            <button 
              onClick={() => onNavigate("syllabus")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                activeTab === "syllabus" 
                  ? "bg-slate-900 text-white shadow" 
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>30-Day Syllabus</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </button>

            <button 
              onClick={() => onNavigate("tutor")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                activeTab === "tutor" 
                  ? "bg-slate-900 text-white shadow" 
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>AI Boardroom Tutor</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </button>

            <button 
              onClick={() => onNavigate("mock")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                activeTab === "mock" 
                  ? "bg-slate-900 text-white shadow" 
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <ClipboardList className="h-4 w-4 shrink-0" />
                <span>Custom Mock Exams</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </button>

            <button 
              onClick={() => onNavigate("flashcards")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                activeTab === "flashcards" 
                  ? "bg-slate-900 text-white shadow" 
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Layers className="h-4 w-4 shrink-0" />
                <span>Revision Flashcards</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </button>
          </nav>

          {/* Premium Callout Widget */}
          {!profile.isPremium && (
            <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white p-5 rounded-xl space-y-3.5 shadow-md border border-indigo-850">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>Earn Your Board Pass</span>
              </div>
              <h4 className="font-bold text-sm leading-tight text-white">Unlock All 30 Days of Get Board Ready Pro</h4>
              <p className="text-xs text-indigo-200 leading-normal">
                Upgrade to study Days 4-30, generate infinite exam papers, and consult our AI legal advisor without limits.
              </p>
              <button 
                onClick={onTriggerUpgrade}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-md hover:scale-[1.01] duration-150"
              >
                <span>Upgrade for ₹99 Only</span>
              </button>
            </div>
          )}

          {/* Next Lesson Callout Widget */}
          {(!profile.progress[profile.currentDay]?.isCompleted) && (
            <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3 shadow-md border border-slate-800">
              <span className="text-[9px] font-mono uppercase bg-slate-800 text-indigo-400 px-2 py-0.5 rounded font-bold">Current Lesson</span>
              <h4 className="font-bold text-sm leading-tight text-white">Day {currentModule.day}: {currentModule.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{currentModule.description}</p>
              
              {(!profile.isPremium && currentModule.day > 3) ? (
                <button 
                  onClick={onTriggerUpgrade}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Unlock Day {currentModule.day}</span>
                </button>
              ) : (
                <button 
                  onClick={() => onSelectDay(currentModule.day)}
                  className="w-full bg-white hover:bg-indigo-50 text-indigo-900 font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Launch AI Classroom</span>
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Right Content Space */}
        <main className="lg:col-span-9 space-y-6">
          {/* If there are sub-components active inside the panel (DailyLesson, Tutor, Exam, etc.), render them! */}
          {children ? (
            children
          ) : (
            <>
              {/* Default Syllabus Tab - Render beautiful categorised curriculum list */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your 30-Day Training Curriculum</h2>
                    <p className="text-xs text-slate-500">Click any day to launch the on-demand AI training classroom.</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-mono text-slate-400">STATUS:</span>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded font-semibold border border-indigo-100">
                      {completedCount} of 30 Complete
                    </span>
                  </div>
                </div>

                {profile.profession && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="h-5.5 w-5.5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm tracking-tight">AI Adaptive Program Tailored</span>
                        <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                          Personalized Plan Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        Our Gemini model has configured the 30-day corporate governance curriculum, simulated boardroom cases, and regulatory practice mock questions around your background as a <strong className="text-indigo-950 font-bold bg-indigo-50 px-1 py-0.5 rounded">{profile.profession}</strong>. This provides custom context and high-impact learning.
                      </p>
                    </div>
                  </div>
                )}

                {/* Categories blocks */}
                <div className="space-y-8">
                  {categories.map((cat, i) => {
                    const modulesInCat = syllabus.filter(m => m.category === cat);
                    return (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            Block {i + 1}
                          </span>
                          <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">{cat}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {modulesInCat.map((mod) => {
                            const isCompleted = profile.completedDays.includes(mod.day);
                            const isCurrent = profile.currentDay === mod.day;
                            const score = profile.progress[mod.day]?.score;
                            const isLocked = !profile.isPremium && mod.day > 3;

                            return (
                              <div 
                                key={mod.day}
                                onClick={() => isLocked ? onTriggerUpgrade() : onSelectDay(mod.day)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between space-x-3 group relative ${
                                  isLocked 
                                    ? "bg-slate-50/70 border-slate-200 hover:border-slate-300 opacity-80"
                                    : isCompleted 
                                      ? "bg-emerald-50/40 border-emerald-100 hover:border-emerald-200" 
                                      : isCurrent 
                                        ? "bg-indigo-50/40 border-indigo-200 hover:border-indigo-300 ring-1 ring-indigo-50" 
                                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[11px] font-mono font-bold text-slate-400">
                                      Day {mod.day}
                                    </span>
                                    {isLocked ? (
                                      <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded font-medium flex items-center space-x-1">
                                        <Lock className="h-2 w-2 text-slate-500" />
                                        <span>Pro locked</span>
                                      </span>
                                    ) : (
                                      <>
                                        {isCompleted && (
                                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-medium flex items-center space-x-0.5">
                                            <CheckCircle className="h-2.5 w-2.5" />
                                            <span>Passed {score}%</span>
                                          </span>
                                        )}
                                        {isCurrent && !isCompleted && (
                                          <span className="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 py-0.5 rounded font-medium">
                                            Up Next
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {mod.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 line-clamp-1">
                                    {mod.description}
                                  </p>
                                </div>

                                {isLocked ? (
                                  <Lock className="h-4 w-4 text-slate-400 mt-1 shrink-0 group-hover:text-slate-600 transition-colors" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform mt-1 shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
    {showCertificate && (
      <Certificate profile={profile} onClose={() => setShowCertificate(false)} />
    )}
    {showSupport && (
      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
        <SupportPage onBack={() => setShowSupport(false)} />
      </div>
    )}
    </>
  );
}
