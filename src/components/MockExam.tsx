import { questionBank, questionsByCategory } from "../data/questionBank";
import { callAI, extractText } from "../lib/ai";
import React, { useState, useEffect } from "react";
import { MockAttempt, QuizQuestion } from "../types";
import { 
  AlertCircle, 
  Award, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardList, 
  Cpu, 
  Loader2, 
  PlayCircle, 
  RotateCcw, 
  Timer, 
  TrendingUp, 
  XCircle,
  Lock,
  Sparkles,
  ArrowRight,
  Share2
} from "lucide-react";

interface MockExamProps {
  userId: string;
  userProfession: string;
  onSaveAttempt: (attempt: MockAttempt) => void;
  attempts: MockAttempt[];
  isPremium: boolean;
  onTriggerUpgrade: () => void;
}

export default function MockExam({ userId, userProfession, onSaveAttempt, attempts, isPremium, onTriggerUpgrade }: MockExamProps) {
  const [gameState, setGameState] = useState<"setup" | "loading" | "active" | "results">("setup");
  const [error, setError] = useState<string | null>(null);

  // Configuration State
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [selectedCats, setSelectedCats] = useState<string[]>([
    "Companies Act", 
    "Corporate Governance", 
    "SEBI LODR", 
    "Financials"
  ]);

  // Exam Run State
  const [questions, setQuestions] = useState<(QuizQuestion & { category: string })[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: number }>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  // Result diagnostics
  const [completedAttempt, setCompletedAttempt] = useState<MockAttempt | null>(null);

  const isLocked = !isPremium && attempts.length >= 1;

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const toggleCategory = (cat: string) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter(c => c !== cat));
      }
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const startExam = async () => {
    setGameState("loading");
    setError(null);
    setUserAnswers({});
    setCurrentIndex(0);

    try {
      // Step 1: Use real verified questions from question bank (shuffled)
      const realQuestions = [...questionBank]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(Math.floor(questionCount * 0.6), questionBank.length))
        .map(q => ({
          question: q.question,
          category: q.category,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          explanation: q.explanation,
          section: q.section,
          isVerified: true
        }));

      const aiNeeded = questionCount - realQuestions.length;

      if (aiNeeded > 0) {
        // Step 2: Top up with AI-generated questions for variety
        const prompt = `You are the IICA Exam Blueprint Generator. Generate exactly ${aiNeeded} Multiple Choice Questions for the Independent Directors Databank Online Proficiency Self-Assessment Test.
Categories: ${selectedCats.join(", ")}.
Make 60% situational/case-study type and 40% threshold/memorization type.
Each question must cite the precise legal section and have a thorough explanation.
Do NOT repeat these already included question topics: ${realQuestions.slice(0,5).map(q=>q.question.substring(0,50)).join('; ')}.

Return ONLY a valid JSON object:
{ "questions": [{ "question": "...", "category": "Companies Act", "options": ["A","B","C","D"], "correctAnswerIndex": 0, "explanation": "..." }] }
Return only the JSON, no markdown fences.`;

        const result = await callAI({
          type: "exam",
          userId,
          isPremium,
          payload: {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          }
        });

        if (result.limitReached) {
          if (!isPremium) onTriggerUpgrade();
          // Fall back to only real questions if AI limit reached
          setQuestions([...realQuestions].sort(() => Math.random() - 0.5).slice(0, questionCount));
          return;
        }

        if (!result.error) {
          const text = extractText(result);
          if (text) {
            try {
              const data = JSON.parse(text.replace(/```json|```/g, "").trim());
              if (data.questions?.length > 0) {
                const combined = [...realQuestions, ...data.questions]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, questionCount);
                setQuestions(combined);
              } else {
                setQuestions([...realQuestions].sort(() => Math.random() - 0.5));
              }
            } catch {
              setQuestions([...realQuestions].sort(() => Math.random() - 0.5));
            }
          } else {
            setQuestions([...realQuestions].sort(() => Math.random() - 0.5));
          }
        } else {
          setQuestions([...realQuestions].sort(() => Math.random() - 0.5));
        }
      } else {
        setQuestions([...realQuestions].sort(() => Math.random() - 0.5).slice(0, questionCount));
      }
      setStartTime(Date.now());
      if (questionCount === 50) {
        setTimeRemaining(75 * 60); // Official IICA Online Proficiency Self-Assessment Test (OPSAT) 75-minute limit
      } else {
        setTimeRemaining(questionCount * 120); // 2 minutes per question
      }
      setGameState("active");

      // Start Countdown Timer
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Trigger automatic submission
            handleSubmitExamPaper();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during exam compilation.");
      setGameState("setup");
    }
  };

  const handleOptionSelect = (optIdx: number) => {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: optIdx
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitExamPaper = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    // Calculate results
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    let correctSum = 0;

    // Track category splits
    const catScores: { [category: string]: { correct: number; total: number } } = {};

    questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      const isCorrect = ans === q.correctAnswerIndex;

      if (!catScores[q.category]) {
        catScores[q.category] = { correct: 0, total: 0 };
      }
      catScores[q.category].total += 1;

      if (isCorrect) {
        correctSum += 1;
        catScores[q.category].correct += 1;
      }
    });

    const isPassed = (correctSum / questions.length) >= 0.50; // passing score is 50%

    const attempt: MockAttempt = {
      id: `attempt_${Date.now()}`,
      userId,
      timestamp: new Date().toISOString(),
      score: correctSum,
      totalQuestions: questions.length,
      passed: isPassed,
      timeTaken: elapsedSeconds,
      categoryScores: catScores
    };

    setCompletedAttempt(attempt);
    onSaveAttempt(attempt);
    setGameState("results");
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[530px]">
      
      {/* 1. SETUP CONFIG PANEL */}
      {gameState === "setup" && (
        isLocked ? (
          <div className="p-8 text-center max-w-lg mx-auto my-12 space-y-6">
            <div className="mx-auto bg-slate-100 text-slate-800 h-16 w-16 rounded-full flex items-center justify-center border border-slate-200 shadow-inner animate-pulse">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Simulated Exam Center Locked</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-sm mx-auto">
                Generate unlimited full-scale mock exam generations, in-depth legal citations, and sub-category analytics with your <strong className="font-bold text-slate-900">Get Board Ready Pro</strong> Membership.
              </p>
            </div>

            {/* Features check */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 font-sans text-xs text-slate-700 max-w-sm mx-auto">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold">
                <Sparkles className="h-4 w-4 text-indigo-600 animate-bounce" />
                <span>Get Board Ready Pro Perks:</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-[11px] text-slate-600">
                <li>Unlimited mock exam papers conforming to IICA's 50% target</li>
                <li>Comprehensive Companies Act Section & SEBI LODR Clause citations</li>
                <li>Real-time adaptive AI tutor query resolution (No limits)</li>
                <li>Revision Flashcards fully unlocked</li>
              </ul>
            </div>

            <button
              onClick={onTriggerUpgrade}
              className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md font-mono animate-pulse"
            >
              <span>UPGRADE FOR UNLIMITED EXAMS (₹99 ONLY)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <ClipboardList className="h-5 w-5 text-indigo-600" />
                  <span>Simulated Mock Exam Center</span>
                </h2>
                <p className="text-xs text-slate-500">Practice under official IICA online test environments. Passing target is 50%.</p>
              </div>
              <div className="bg-amber-50 text-amber-800 border border-amber-150 rounded-lg p-2 text-xs font-mono shrink-0">
                ⚡ PASSED TARGET: 50% | NO NEGATIVE MARKS
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left side settings */}
              <div className="md:col-span-7 space-y-5">
                <h3 className="font-bold text-xs font-mono uppercase text-slate-400">Configure Practice Paper</h3>
                
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-800">Select Syllabus Segments</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Companies Act", "Corporate Governance", "SEBI LODR", "Financials", "Ethics & CSR", "Boardroom"].map((cat) => {
                      const active = selectedCats.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`p-3 rounded-lg border text-xs text-left font-medium transition-colors ${
                            active 
                              ? "border-indigo-600 bg-indigo-50/50 text-indigo-900" 
                              : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-800">Question Batch Density</label>
                  <div className="flex space-x-3">
                    {[5, 10, 25, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionCount(num)}
                        className={`flex-1 p-2 rounded-lg border text-xs font-mono font-bold transition-colors text-center ${
                          questionCount === num 
                            ? "border-slate-900 bg-slate-900 text-white" 
                            : "border-slate-200 hover:bg-slate-50 text-slate-700 bg-white"
                        }`}
                      >
                        {num} MCQs
                      </button>
                    ))}
                  </div>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {questionCount === 50 
                      ? "⚡ 50 MCQs represents a full-scale official IICA OPSAT (75-minute limit). No negative marking." 
                      : "Simulated at 120 seconds per question draft. No human coordination required."}
                  </span>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-xs text-rose-800 flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={startExam}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Compile AI Mock Paper</span>
                </button>
              </div>

              {/* Right side attempts history logs */}
              <div className="md:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-slate-800" />
                    <h4 className="font-extrabold text-xs uppercase font-mono tracking-wider">Historical Analytics Log</h4>
                  </div>

                  {attempts.length === 0 ? (
                    <div className="text-center p-8 text-slate-400 text-xs leading-relaxed border border-dashed border-slate-200 bg-white rounded-lg">
                      No mock papers registered in Firestore database. Initiate your first attempt to compile dashboard telemetry.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {attempts.map((att, idx) => {
                        const percentage = Math.round((att.score / att.totalQuestions) * 100);
                        return (
                          <div 
                            key={att.id || idx}
                            className="bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-between shadow-sm text-xs"
                          >
                            <div>
                              <span className="font-mono text-[9px] text-slate-400 uppercase block">{new Date(att.timestamp).toLocaleDateString()} at {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="font-bold text-slate-950 block">{att.totalQuestions} Questions Exam</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-950 block">{percentage}%</span>
                              <span className={`text-[9px] uppercase font-mono font-bold ${att.passed ? "text-emerald-600" : "text-rose-600"}`}>
                                {att.passed ? "PASSED" : "FAILED"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 font-mono leading-normal">
                  ✓ ALL RESULTS SAVED IN PERSISTENT STORAGE
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* 2. LOADING SCREEN */}
      {gameState === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-950 text-base">Synthesizing Exam Blueprint...</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Gemini is auditing thousands of historical corporate governance parameters to generate distinct, situational questions matching IICA standards.
            </p>
          </div>
        </div>
      )}

      {/* 3. ACTIVE TEST DESK */}
      {gameState === "active" && questions.length > 0 && (
        <div className="flex-1 flex flex-col">
          {/* Active Header Timer */}
          <div className="bg-slate-900 text-white px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300">EXAM MODE ACTIVE</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold bg-slate-800 px-3 py-1 rounded border border-slate-700 text-amber-400">
                <Timer className="h-3.5 w-3.5" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={handleSubmitExamPaper}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Core Layout with Question Panel & Navigation Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12">
            
            {/* Main Question Panel */}
            <div className="md:col-span-8 p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-mono font-semibold">
                    {questions[currentIndex].category}
                  </span>
                  <span className="font-mono text-slate-400">Question {currentIndex + 1} of {questions.length}</span>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm text-slate-900 leading-relaxed">
                  {questions[currentIndex].question}
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  {questions[currentIndex].options.map((opt, oIdx) => {
                    const active = userAnswers[currentIndex] === oIdx;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-center space-x-3 ${
                          active 
                            ? "border-indigo-600 bg-indigo-50/40 text-indigo-900 font-medium" 
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className={`h-5 w-5 rounded-full border flex items-center justify-center font-mono text-[9px] font-bold ${
                          active ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-600"
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 border border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-mono text-slate-400">
                  {Object.keys(userAnswers).length} of {questions.length} Answered
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex + 1 === questions.length}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 border border-slate-200"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right side question map */}
            <div className="md:col-span-4 bg-slate-50 border-l border-slate-200 p-5 space-y-4">
              <h4 className="font-extrabold text-[10px] uppercase font-mono text-slate-400 tracking-wider">Exam Board Map</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Navigate directly to any question by clicking its index.</p>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2">
                {questions.map((_, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isCurrent = idx === currentIndex;

                  let boxStyle = "border-slate-200 text-slate-600 bg-white hover:border-slate-300";
                  if (isCurrent) {
                    boxStyle = "border-indigo-600 ring-1 ring-indigo-50 bg-indigo-50/50 text-indigo-900 font-bold";
                  } else if (isAnswered) {
                    boxStyle = "border-slate-800 bg-slate-800 text-white font-medium";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg border text-xs font-mono transition-colors ${boxStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. RESULTS PERFORMANCE SHEET */}
      {gameState === "results" && completedAttempt && (
        <div className="p-6 space-y-6">
          <div className="text-center space-y-3 max-w-md mx-auto py-4">
            <div className={`inline-flex p-3.5 rounded-full ${
              completedAttempt.passed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            }`}>
              {completedAttempt.passed ? <Award className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Exam Grading Completed</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                You correctly answered <strong>{completedAttempt.score} out of {completedAttempt.totalQuestions}</strong> questions in {formatTime(completedAttempt.timeTaken)}.
              </p>
            </div>

            <div className="pt-2">
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase border ${
                completedAttempt.passed 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                {completedAttempt.passed ? "GRADE: PASSED (>=50%)" : "GRADE: FAILED (<50%)"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-150 pt-6">
            <h3 className="font-extrabold text-xs font-mono uppercase text-slate-400 mb-4">Topic Performance Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(completedAttempt.categoryScores).map((cat, i) => {
                const item = completedAttempt.categoryScores[cat];
                const catPct = Math.round((item.correct / item.total) * 100);
                return (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{cat}</span>
                      <span className="text-slate-500 text-[10px] block">{item.correct} of {item.total} Correct</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-950 block">{catPct}%</span>
                      <span className={`text-[9px] font-semibold ${catPct >= 50 ? "text-emerald-600" : "text-amber-600"}`}>
                        {catPct >= 50 ? "Satisfactory" : "Review Required"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full review lists with explanations */}
          <div className="border-t border-slate-150 pt-6 space-y-4">
            <h3 className="font-extrabold text-xs font-mono uppercase text-slate-400">Detailed Question Audits</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {questions.map((q, idx) => {
                const ans = userAnswers[idx];
                const isCorrect = ans === q.correctAnswerIndex;
                return (
                  <div 
                    key={idx}
                    className={`p-4 border rounded-xl text-xs space-y-3 leading-relaxed ${
                      isCorrect ? "bg-emerald-50/20 border-emerald-100" : "bg-rose-50/20 border-rose-100"
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center space-x-1">
                        <span>Question {idx + 1} ({q.category})</span>
                        {(q as any).isVerified && <span className="bg-indigo-100 text-indigo-600 text-[9px] px-1.5 py-0.5 rounded font-bold ml-1">✓ VERIFIED</span>}
                      </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-normal">{q.question}</h4>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded shrink-0 ${
                        isCorrect ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-rose-100 text-rose-800 font-bold"
                      }`}>
                        {isCorrect ? "CORRECT" : "INCORRECT"}
                      </span>
                    </div>

                    <div className="space-y-1 bg-white border border-slate-100 p-3 rounded-lg text-slate-700">
                      <p><strong className="text-slate-950">Your Answer:</strong> {ans !== undefined ? q.options[ans] : "Unanswered"}</p>
                      {!isCorrect && (
                        <p><strong className="text-slate-950">Correct Option:</strong> {q.options[q.correctAnswerIndex]}</p>
                      )}
                    </div>

                    <div className="text-slate-500 text-[11px] leading-relaxed bg-slate-50/40 p-3 rounded border border-slate-150">
                      <span className="font-bold text-slate-800 text-[10px] uppercase font-mono block mb-1">Citations & References:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-150">
            <button
              onClick={() => {
                const pct = Math.round((completedAttempt.score / completedAttempt.totalQuestions) * 100);
                const msg = encodeURIComponent(`📝 IICA Mock Exam Result on Get Board Ready:\n\nScore: ${completedAttempt.score}/${completedAttempt.totalQuestions} (${pct}%)\nStatus: ${completedAttempt.passed ? "✅ PASSED" : "❌ Need more prep"}\nTime: ${formatTime(completedAttempt.timeTaken)}\n\nPrepare for your IICA exam → https://getboardready.online`);
                window.open(`https://wa.me/?text=${msg}`, "_blank");
              }}
              className="bg-green-500 hover:bg-green-400 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Result</span>
            </button>
            <button
              onClick={() => setGameState("setup")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Return to Exam Desk</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
