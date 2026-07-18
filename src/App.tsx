import React, { useState, useEffect } from "react";
import { UserProfile, MockAttempt } from "./types";
import { syllabus } from "./data/syllabus";
import { 
  saveUserProfile, getUserProfile, getUserProfileByEmail,
  saveMockAttempt, getMockAttempts, 
  savePremiumStatus, checkPremiumStatus 
} from "./firebase";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import DailyLesson from "./components/DailyLesson";
import AITutor from "./components/AITutor";
import MockExam from "./components/MockExam";
import Flashcards from "./components/Flashcards";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mockAttempts, setMockAttempts] = useState<MockAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<"syllabus" | "tutor" | "mock" | "flashcards">("syllabus");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");
  
  // Temp signup data held between AuthModal → CheckoutModal
  const [pendingSignup, setPendingSignup] = useState<{
    name: string; email: string; profession: string; userId: string;
  } | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    setIsLoading(true);
    const cachedUserId = localStorage.getItem("iica_user_id");
    if (cachedUserId) {
      const profile = await getUserProfile(cachedUserId);
      if (profile) {
        // Always sync premium from Firebase (webhook may have activated it)
        const firebasePremium = await checkPremiumStatus(cachedUserId);
        if (firebasePremium && !profile.isPremium) {
          profile.isPremium = true;
          await saveUserProfile(cachedUserId, profile);
        }
        setUserProfile(profile);
        const history = await getMockAttempts(cachedUserId);
        setMockAttempts(history);
      } else {
        localStorage.removeItem("iica_user_id");
      }
    }
    setIsLoading(false);
  };

  // Called from LandingPage Enroll button → show AuthModal signup tab
  const handleEnrollClick = () => {
    setAuthModalTab("signup");
    setShowAuthModal(true);
  };

  // Called from LandingPage Login button → show AuthModal login tab
  const handleLoginClick = () => {
    setAuthModalTab("login");
    setShowAuthModal(true);
  };

  // Called from AuthModal login tab — email found in Firebase
  const handleLoginSuccess = async (email: string) => {
    setIsLoading(true);
    setShowAuthModal(false);

    const profile = await getUserProfileByEmail(email);
    if (profile) {
      const firebasePremium = await checkPremiumStatus(profile.id);
      if (firebasePremium) profile.isPremium = true;
      setUserProfile(profile);
      localStorage.setItem("iica_user_id", profile.id);
      const history = await getMockAttempts(profile.id);
      setMockAttempts(history);
    }
    setIsLoading(false);
  };

  // Called from AuthModal signup tab — show CheckoutModal
  const handleSignupProceed = (name: string, email: string, profession: string, userId: string) => {
    setShowAuthModal(false);
    setPendingSignup({ name, email, profession, userId });
    setIsCheckoutOpen(true);
  };

  // Called after Razorpay payment verified
  const handleUpgradeSuccessful = async () => {
    if (pendingSignup) {
      // New user completing signup after payment
      const { name, email, profession, userId } = pendingSignup;
      const newProfile: UserProfile = {
        id: userId, name, email, profession,
        enrolledAt: new Date().toISOString(),
        currentDay: 1, completedDays: [], progress: {},
        isPremium: true
      };
      setUserProfile(newProfile);
      localStorage.setItem("iica_user_id", userId);
      await saveUserProfile(userId, newProfile);
      await savePremiumStatus(userId, email, "payment_verified");
      setPendingSignup(null);
    } else if (userProfile) {
      // Existing user upgrading from dashboard
      const updatedProfile: UserProfile = { ...userProfile, isPremium: true };
      setUserProfile(updatedProfile);
      await saveUserProfile(userProfile.id, updatedProfile);
      await savePremiumStatus(userProfile.id, userProfile.email, "payment_verified");
    }
    setIsCheckoutOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Log out? Your progress is safely stored in the cloud.")) {
      localStorage.removeItem("iica_user_id");
      setUserProfile(null);
      setMockAttempts([]);
      setSelectedDay(null);
      setActiveTab("syllabus");
      setPendingSignup(null);
    }
  };

  const handleSelectDay = (day: number) => { setSelectedDay(day); setActiveTab("syllabus"); };

  const handleCompleteDay = async (day: number, score: number, notes: string) => {
    if (!userProfile) return;
    const isPassing = score >= 50;
    const currentCompleted = [...userProfile.completedDays];
    if (isPassing && !currentCompleted.includes(day)) currentCompleted.push(day);

    const updatedProgress = {
      ...userProfile.progress,
      [day]: {
        isCompleted: isPassing || (userProfile.progress[day]?.isCompleted || false),
        score: Math.max(score, userProfile.progress[day]?.score || 0),
        completedAt: new Date().toISOString(),
        notes
      }
    };

    let nextCurrentDay = userProfile.currentDay;
    if (isPassing && day === userProfile.currentDay) nextCurrentDay = Math.min(30, day + 1);

    const updatedProfile = { ...userProfile, completedDays: currentCompleted, progress: updatedProgress, currentDay: nextCurrentDay };
    setUserProfile(updatedProfile);
    await saveUserProfile(userProfile.id, updatedProfile);
  };

  const handleSaveMockAttempt = async (attempt: MockAttempt) => {
    if (!userProfile) return;
    setMockAttempts(prev => [attempt, ...prev]);
    await saveMockAttempt(userProfile.id, attempt);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans space-y-4">
        <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-slate-400">Syncing with Secure Cloud Portal...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <>
        <LandingPage 
          onEnroll={handleEnrollClick}
          onLogin={handleLoginClick}
        />
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
            onSignupProceed={handleSignupProceed}
            defaultTab={authModalTab}
          />
        )}
        {isCheckoutOpen && pendingSignup && (
          <CheckoutModal
            onClose={() => { setIsCheckoutOpen(false); setPendingSignup(null); }}
            onUpgradeSuccessful={handleUpgradeSuccessful}
            userEmail={pendingSignup.email}
            userId={pendingSignup.userId}
            userName={pendingSignup.name}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Dashboard
        profile={userProfile}
        attempts={mockAttempts}
        onSelectDay={handleSelectDay}
        onNavigate={(tab) => { setSelectedDay(null); setActiveTab(tab as any); }}
        activeTab={activeTab}
        onLogout={handleLogout}
        onTriggerUpgrade={() => setIsCheckoutOpen(true)}
      >
        {selectedDay !== null && (
          <DailyLesson
            module={syllabus.find(m => m.day === selectedDay) || syllabus[0]}
            userProfession={userProfile.profession || "Corporate Executive"}
            onBack={() => setSelectedDay(null)}
            onCompleteDay={handleCompleteDay}
            existingProgress={userProfile.progress[selectedDay]}
          />
        )}
        {selectedDay === null && activeTab === "tutor" && (
          <AITutor
            userProfession={userProfile.profession || "Corporate Executive"}
            isPremium={userProfile.isPremium || false}
            onTriggerUpgrade={() => setIsCheckoutOpen(true)}
          />
        )}
        {selectedDay === null && activeTab === "mock" && (
          <MockExam
            userId={userProfile.id}
            userProfession={userProfile.profession || "Corporate Executive"}
            onSaveAttempt={handleSaveMockAttempt}
            attempts={mockAttempts}
            isPremium={userProfile.isPremium || false}
            onTriggerUpgrade={() => setIsCheckoutOpen(true)}
          />
        )}
        {selectedDay === null && activeTab === "flashcards" && <Flashcards />}
      </Dashboard>

      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onUpgradeSuccessful={handleUpgradeSuccessful}
          userEmail={userProfile.email}
          userId={userProfile.id}
          userName={userProfile.name}
        />
      )}
    </>
  );
}
