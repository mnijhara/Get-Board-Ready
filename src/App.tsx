import React, { useState, useEffect } from "react";
import { UserProfile, MockAttempt } from "./types";
import { syllabus } from "./data/syllabus";
import { saveUserProfile, getUserProfile, saveMockAttempt, getMockAttempts, savePremiumStatus, checkPremiumStatus } from "./firebase";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import DailyLesson from "./components/DailyLesson";
import AITutor from "./components/AITutor";
import MockExam from "./components/MockExam";
import Flashcards from "./components/Flashcards";
import CheckoutModal from "./components/CheckoutModal";

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mockAttempts, setMockAttempts] = useState<MockAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<"syllabus" | "tutor" | "mock" | "flashcards">("syllabus");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    loadCachedSession();
  }, []);

  // Check Firebase premium on load (cross-device support via webhook)
  // No localStorage tricks needed — webhook activates premium server-side

  const loadCachedSession = async () => {
    setIsLoading(true);
    const cachedUserId = localStorage.getItem("iica_user_id");

    if (cachedUserId) {
      const profile = await getUserProfile(cachedUserId);
      if (profile) {
        // Always check Firebase for premium — webhook may have activated it
        // This is the ONLY source of truth — no localStorage flags needed
        const firebasePremium = await checkPremiumStatus(cachedUserId);
        if (firebasePremium && !profile.isPremium) {
          profile.isPremium = true;
          await saveUserProfile(cachedUserId, profile);
        }

        setUserProfile(profile);
        const history = await getMockAttempts(cachedUserId);
        setMockAttempts(history);
      }
    }
    setIsLoading(false);
  };

  const handleEnroll = async (name: string, email: string, profession: string) => {
    const userId = `usr_${Date.now()}`;
    const newProfile: UserProfile = {
      id: userId,
      name,
      email,
      profession,
      enrolledAt: new Date().toISOString(),
      currentDay: 1,
      completedDays: [],
      progress: {},
      isPremium: false
    };

    setUserProfile(newProfile);
    localStorage.setItem("iica_user_id", userId);
    await saveUserProfile(userId, newProfile);
  };

  const handleLogout = () => {
    if (window.confirm("Do you want to log out of the AI Exam Prep Portal? Your cloud sync progress is secure.")) {
      localStorage.removeItem("iica_user_id");
      setUserProfile(null);
      setMockAttempts([]);
      setSelectedDay(null);
      setActiveTab("syllabus");
    }
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setActiveTab("syllabus");
  };

  const handleCompleteDay = async (day: number, score: number, notes: string) => {
    if (!userProfile) return;

    const isPassing = score >= 50; // IICA standard passing score is 50%
    const currentCompleted = [...userProfile.completedDays];
    
    if (isPassing && !currentCompleted.includes(day)) {
      currentCompleted.push(day);
    }

    // Progress map record
    const updatedProgress = {
      ...userProfile.progress,
      [day]: {
        isCompleted: isPassing || (userProfile.progress[day]?.isCompleted || false),
        score: Math.max(score, userProfile.progress[day]?.score || 0),
        completedAt: new Date().toISOString(),
        notes
      }
    };

    // Auto increment day if passing current day
    let nextCurrentDay = userProfile.currentDay;
    if (isPassing && day === userProfile.currentDay) {
      nextCurrentDay = Math.min(30, day + 1);
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      completedDays: currentCompleted,
      progress: updatedProgress,
      currentDay: nextCurrentDay
    };

    setUserProfile(updatedProfile);
    await saveUserProfile(userProfile.id, updatedProfile);
  };

  const handleSaveMockAttempt = async (attempt: MockAttempt) => {
    if (!userProfile) return;
    setMockAttempts(prev => [attempt, ...prev]);
    await saveMockAttempt(userProfile.id, attempt);
  };

  const handleUpgradeSuccessful = async () => {
    if (!userProfile) return;
    const updatedProfile: UserProfile = {
      ...userProfile,
      isPremium: true
    };
    setUserProfile(updatedProfile);
    await saveUserProfile(userProfile.id, updatedProfile);
    await savePremiumStatus(userProfile.id, userProfile.email, "payment_verified");
  };

  if (isLoading) {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans space-y-4">
        <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-slate-400">Syncing with Secure Firestore Portal...</p>
      </div>
    );
  }

  // Not Enrolled: Render Visitor Landing Page
  if (!userProfile) {
    return <LandingPage onEnroll={handleEnroll} />;
  }

  // Enrolled Portal: Render Adaptive Dashboard with active screens
  return (
    <>
      <Dashboard
        profile={userProfile}
        attempts={mockAttempts}
        onSelectDay={handleSelectDay}
        onNavigate={(tab) => {
          setSelectedDay(null);
          setActiveTab(tab);
        }}
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

        {selectedDay === null && activeTab === "flashcards" && (
          <Flashcards />
        )}
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
