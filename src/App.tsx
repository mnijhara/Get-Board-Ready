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

  // Detect Razorpay Payment Page redirect and verify via Cloudflare Worker
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("razorpay_payment_link_status") || params.get("payment");
    
    if (paymentStatus === "paid" || paymentStatus === "success") {
      const paymentId = params.get("razorpay_payment_id") || "";
      const paymentLinkId = params.get("razorpay_payment_link_id") || "";
      const paymentLinkRefId = params.get("razorpay_payment_link_reference_id") || "";
      const signature = params.get("razorpay_signature") || "";
      
      // Clean URL immediately
      window.history.replaceState({}, document.title, "/");

      // Store params for verification after profile loads
      if (paymentId) {
        localStorage.setItem("iica_pending_payment", JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_payment_link_id: paymentLinkId,
          razorpay_payment_link_reference_id: paymentLinkRefId,
          razorpay_payment_link_status: paymentStatus,
          razorpay_signature: signature
        }));
      } else {
        // Fallback: no signature params (manual test)
        localStorage.setItem("iica_payment_success", "true");
      }
    }
  }, []);

  const loadCachedSession = async () => {
    setIsLoading(true);
    const cachedUserId = localStorage.getItem("iica_user_id");

    if (cachedUserId) {
      const profile = await getUserProfile(cachedUserId);
      if (profile) {

        // Check Firebase for premium status (cross-device)
        const firebasePremium = await checkPremiumStatus(cachedUserId);
        if (firebasePremium && !profile.isPremium) {
          profile.isPremium = true;
          await saveUserProfile(cachedUserId, profile);
        }

        // Handle pending Razorpay payment verification
        const pendingPayment = localStorage.getItem("iica_pending_payment");
        const paymentSuccess = localStorage.getItem("iica_payment_success") === "true";

        if (pendingPayment && !profile.isPremium) {
          try {
            const paymentData = JSON.parse(pendingPayment);
            const res = await fetch("https://red-credit-6798.mnijhara.workers.dev/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...paymentData,
                userId: cachedUserId,
                userEmail: profile.email
              })
            });
            const result = await res.json();
            if (result.success) {
              profile.isPremium = true;
              await saveUserProfile(cachedUserId, profile);
            }
          } catch (e) {
            console.error("Payment verification error:", e);
          }
          localStorage.removeItem("iica_pending_payment");
        } else if (paymentSuccess && !profile.isPremium) {
          // Fallback for manual test mode
          profile.isPremium = true;
          await saveUserProfile(cachedUserId, profile);
          await savePremiumStatus(cachedUserId, profile.email, "manual_test");
          localStorage.removeItem("iica_payment_success");
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
      isPremium: true // All registered users are now fully paid/premium
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
        />
      )}
    </>
  );
}
