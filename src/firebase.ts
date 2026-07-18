import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { UserProfile, MockAttempt } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyDDaI737TH8UVnBU-Dts0dZHDrT7DVqGMQ",
  authDomain: "gen-lang-client-0259885456.firebaseapp.com",
  projectId: "gen-lang-client-0259885456",
  storageBucket: "gen-lang-client-0259885456.firebasestorage.app",
  messagingSenderId: "977418368895",
  appId: "1:977418368895:web:e1dbc86bc28320fbb28c4a",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app, "ai-studio-bfe44040-18dd-4d0c-a9b8-cb87bd323332");

export async function saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, "users", userId), profile);
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile));
  } catch (error) {
    console.error("saveUserProfile error:", error);
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile));
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      localStorage.setItem(`user_profile_${userId}`, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error("getUserProfile error:", error);
  }
  const cached = localStorage.getItem(`user_profile_${userId}`);
  return cached ? JSON.parse(cached) : null;
}

export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  // First try localStorage scan (fast, no Firestore index needed)
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("user_profile_")) {
        const profile = JSON.parse(localStorage.getItem(key) || "{}") as UserProfile;
        if (profile.email?.toLowerCase() === email.toLowerCase()) {
          // Verify against Firestore
          const fresh = await getUserProfile(profile.id);
          return fresh || profile;
        }
      }
    }
  } catch {}

  // Fallback: Firestore query (requires composite index on email)
  try {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data() as UserProfile;
      localStorage.setItem(`user_profile_${data.id}`, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error("getUserProfileByEmail Firestore error:", error);
  }
  return null;
}

export async function saveMockAttempt(userId: string, attempt: MockAttempt): Promise<void> {
  try {
    await addDoc(collection(db, "mockAttempts"), attempt);
    const cached = getCachedMockAttempts(userId);
    cached.push(attempt);
    localStorage.setItem(`mock_attempts_${userId}`, JSON.stringify(cached));
  } catch (error) {
    console.error("saveMockAttempt error:", error);
    const cached = getCachedMockAttempts(userId);
    cached.push(attempt);
    localStorage.setItem(`mock_attempts_${userId}`, JSON.stringify(cached));
  }
}

export async function getMockAttempts(userId: string): Promise<MockAttempt[]> {
  try {
    const q = query(collection(db, "mockAttempts"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const attempts: MockAttempt[] = [];
    snap.forEach(d => attempts.push(d.data() as MockAttempt));
    attempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    localStorage.setItem(`mock_attempts_${userId}`, JSON.stringify(attempts));
    return attempts;
  } catch (error) {
    console.error("getMockAttempts error:", error);
  }
  return getCachedMockAttempts(userId);
}

function getCachedMockAttempts(userId: string): MockAttempt[] {
  const cached = localStorage.getItem(`mock_attempts_${userId}`);
  return cached ? JSON.parse(cached) : [];
}

export async function savePremiumStatus(userId: string, email: string, paymentId: string): Promise<void> {
  try {
    await setDoc(doc(db, "payments", userId), {
      isPremium: true,
      userEmail: email,
      paymentId,
      activatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("savePremiumStatus error:", error);
  }
}

export async function checkPremiumStatus(userId: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "payments", userId));
    if (snap.exists()) return snap.data()?.isPremium === true;
  } catch (error) {
    console.error("checkPremiumStatus error:", error);
  }
  return false;
}

export async function saveContactRequest(request: any): Promise<void> {
  try {
    await addDoc(collection(db, "contactRequests"), request);
  } catch (error) {
    console.error("saveContactRequest error:", error);
  }
}
