export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profession?: string;
  enrolledAt: string;
  currentDay: number;
  completedDays: number[];
  progress: { [day: number]: DayProgress };
  isPremium?: boolean;
  tutorMessagesCount?: number;
}

export interface DayProgress {
  isCompleted: boolean;
  score?: number;
  completedAt?: string;
  notes?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StudyModule {
  day: number;
  title: string;
  category: "Companies Act" | "Corporate Governance" | "SEBI LODR" | "Financials" | "Ethics & CSR" | "Boardroom";
  description: string;
  keySections: string[];
  outline: string[];
}

export interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  section?: string;
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface MockAttempt {
  id: string;
  userId: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeTaken: number; // in seconds
  categoryScores: { [category: string]: { correct: number; total: number } };
}
