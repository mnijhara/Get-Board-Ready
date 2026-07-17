import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { UserProfile, MockAttempt } from "./types";

// Firebase App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDaI737TH8UVnBU-Dts0dZHDrT7DVqGMQ",
  authDomain: "gen-lang-client-0259885456.firebaseapp.com",
  projectId: "gen-lang-client-0259885456",
  storageBucket: "gen-lang-client-0259885456.firebasestorage.app",
  messagingSenderId: "977418368895",
  appId: "1:977418368895:web:e1dbc86bc28320fbb28c4a",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app, "ai-studio-bfe44040-18dd-4d0c-a9b8-cb87bd323332");

/**
 * Save user profile to Firestore (with local fallback)
 */
export async function saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, profile);
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile));
  } catch (error) {
    console.error("Firestore saveUserProfile error, falling back to localStorage:", error);
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile));
  }
}

/**
 * Fetch user profile from Firestore (with local fallback)
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      localStorage.setItem(`user_profile_${userId}`, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error("Firestore getUserProfile error, reading from localStorage:", error);
  }

  const cached = localStorage.getItem(`user_profile_${userId}`);
  return cached ? JSON.parse(cached) : null;
}

/**
 * Save custom mock exam attempt
 */
export async function saveMockAttempt(userId: string, attempt: MockAttempt): Promise<void> {
  try {
    const attemptsCol = collection(db, "mockAttempts");
    await addDoc(attemptsCol, attempt);

    // Also update locally cached array of attempts
    const cachedAttempts = getCachedMockAttempts(userId);
    cachedAttempts.push(attempt);
    localStorage.setItem(`mock_attempts_${userId}`, JSON.stringify(cachedAttempts));
  } catch (error) {
    console.error("Firestore saveMockAttempt error, caching locally:", error);
    const cachedAttempts = getCachedMockAttempts(userId);
    cachedAttempts.push(attempt);
    localStorage.setItem(`mock_attempts_${userId}`, JSON.stringify(cachedAttempts));
  }
}

/**
 * Fetch all mock exam attempts for a user
 */
export async function getMockAttempts(userId: string): Promise<MockAttempt[]> {
  try {
    const attemptsCol = collection(db, "mockAttempts");
    const q = query(attemptsCol, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const attempts: MockAttempt[] = [];
    querySnapshot.forEach((docSnap) => {
      attempts.push(docSnap.data() as MockAttempt);
    });

    // Sort descending by timestamp
    attempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    localStorage.setItem(`mock_attempts_${userId}`, JSON.stringify(attempts));
    return attempts;
  } catch (error) {
    console.error("Firestore getMockAttempts error, using localStorage:", error);
  }

  return getCachedMockAttempts(userId);
}

function getCachedMockAttempts(userId: string): MockAttempt[] {
  const cached = localStorage.getItem(`mock_attempts_${userId}`);
  return cached ? JSON.parse(cached) : [];
}

export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  message: string;
  timestamp: string;
}

/**
 * Save contact or registration request
 */
export async function saveContactRequest(request: ContactRequest): Promise<void> {
  try {
    const contactCol = collection(db, "contactRequests");
    await addDoc(contactCol, request);
  } catch (error) {
    console.error("Firestore saveContactRequest error:", error);
  }
}


/**
 * Store premium status in Firestore (called after verified payment)
 */
export async function savePremiumStatus(userId: string, email: string, paymentId: string): Promise<void> {
  try {
    const paymentRef = doc(db, "payments", userId);
    await setDoc(paymentRef, {
      isPremium: true,
      userEmail: email,
      paymentId,
      activatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Firestore savePremiumStatus error:", error);
  }
}

/**
 * Check premium status from Firestore (cross-device support)
 */
export async function checkPremiumStatus(userId: string): Promise<boolean> {
  try {
    const paymentRef = doc(db, "payments", userId);
    const snap = await getDoc(paymentRef);
    if (snap.exists()) {
      return snap.data()?.isPremium === true;
    }
  } catch (error) {
    console.error("Firestore checkPremiumStatus error:", error);
  }
  return false;
}

/**
 * Look up user profile by email — for returning users logging in on new device
 */
export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("email", "==", email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as UserProfile;
    }
  } catch (error) {
    console.error("getUserProfileByEmail error:", error);
  }
  return null;
}
