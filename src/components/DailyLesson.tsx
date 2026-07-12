import React, { useState, useEffect } from "react";
import { StudyModule, QuizQuestion, DayProgress } from "../types";
import { 
  ArrowLeft, 
  Award, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  ChevronRight, 
  Cpu, 
  FileText, 
  HelpCircle, 
  Loader2, 
  Save, 
  ShieldCheck, 
  XCircle 
} from "lucide-react";

interface DailyLessonProps {
  module: StudyModule;
  userProfession: string;
  onBack: () => void;
  onCompleteDay: (day: number, score: number, notes: string) => void;
  existingProgress?: DayProgress;
}

interface GeneratedLessonData {
  executiveSummary: string;
  regulatoryDeepDive: string;
  boardroomPracticalInsights: string;
  caseStudy: {
    title: string;
    scenario: string;
    analysis: string;
  };
  checkpointQuestions: QuizQuestion[];
}

export default function DailyLesson({ 
  module, 
  userProfession, 
  onBack, 
  onCompleteDay,
  existingProgress 
}: DailyLessonProps) {
  const [activeTab, setActiveTab] = useState<"briefing" | "boardroom" | "case" | "quiz">("briefing");
  const [lessonData, setLessonData] = useState<GeneratedLessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Notes state
  const [notes, setNotes] = useState(existingProgress?.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    fetchLessonData();
  }, [module.day]);

  const fetchLessonData = async () => {
    setIsLoading(true);
    setError(null);
    setLessonData(null);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = `You are the Chief AI Corporate Governance Trainer for the IICA Independent Directors Databank exam preparation course.
Generate an elite, executive-level study lesson for:
Day ${module.day}: ${module.title}
Category: ${module.category}
Key Legal Sections: ${module.keySections ? module.keySections.join(", ") : "Companies Act 2013 guidelines"}
Target Audience: Senior CXO / Board Candidate with background in: ${userProfession || "General Management"}.
Outline: ${module.outline ? module.outline.map((o: string) => `- ${o}`).join("\n") : "General concepts of " + module.title}

Return ONLY a valid JSON object with these exact keys:
{
  "executiveSummary": "2-3 paragraph executive summary",
  "regulatoryDeepDive": "detailed legal analysis in markdown",
  "boardroomPracticalInsights": "practical advice for boardrooms",
  "caseStudy": { "title": "...", "scenario": "...", "analysis": "..." },
  "checkpointQuestions": [{ "question": "...", "options": ["A","B","C","D"], "correctAnswerIndex": 0, "explanation": "..." }]
}
Generate exactly 3 checkpointQuestions. Return only the JSON, no markdown fences.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to communicate with AI generation engine.");
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response from Gemini");

      const data = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (data.error) throw new Error(data.error);

      setLessonData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while compiling your daily session.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !lessonData) return;
    setIsSubmitted(true);
    
    const correctIdx = lessonData.checkpointQuestions[currentQuestionIndex].correctAnswerIndex;
    if (selectedOption === correctIdx) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!lessonData) return;
    setSelectedOption(null);
    setIsSubmitted(false);

    if (currentQuestionIndex + 1 < lessonData.checkpointQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Determine final score percentage
      const scorePercentage = Math.round((correctCount / lessonData.checkpointQuestions.length) * 100);
      onCompleteDay(module.day, scorePercentage, notes);
    }
  };

  const handleSaveNotesLocal = () => {
    setIsSavingNotes(true);
    setTimeout(() => {
      onCompleteDay(module.day, existingProgress?.score || 0, notes);
      setIsSavingNotes(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[550px]">
      {/* Header Panel */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="hover:bg-slate-800 p-1.5 rounded transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded">
                Day {module.day}
              </span>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                {module.category}
              </span>
            </div>
            <h3 className="font-bold text-sm sm:text-base leading-tight mt-0.5">{module.title}</h3>
          </div>
        </div>

        {existingProgress?.isCompleted && (
          <span className="bg-emerald-900/40 text-emerald-400 border border-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center space-x-1">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>Passed {existingProgress.score}%</span>
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-950 text-base">Structuring Executive Briefing...</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Our autonomous Gemini tutor is custom compiling the legal codes, SEBI circulars, and boardroom case studies tailored to your <strong>{userProfession}</strong> background.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <XCircle className="h-12 w-12 text-rose-500" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-950 text-base">Training Desk Compilation Failed</h4>
            <p className="text-xs text-slate-500 max-w-sm">{error}</p>
          </div>
          <button 
            onClick={fetchLessonData}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Retry AI Synthesis
          </button>
        </div>
      )}

      {/* Active Content Panel */}
      {lessonData && !isLoading && !error && (
        <>
          {/* Sub Navigation Tabs */}
          <div className="border-b border-slate-200 bg-slate-50 flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab("briefing")}
              className={`px-4 py-3 font-medium text-xs border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                activeTab === "briefing" 
                  ? "border-indigo-600 text-indigo-600 bg-white" 
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Briefing Memo</span>
            </button>
            <button 
              onClick={() => setActiveTab("boardroom")}
              className={`px-4 py-3 font-medium text-xs border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                activeTab === "boardroom" 
                  ? "border-indigo-600 text-indigo-600 bg-white" 
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Boardroom Actions</span>
            </button>
            <button 
              onClick={() => setActiveTab("case")}
              className={`px-4 py-3 font-medium text-xs border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                activeTab === "case" 
                  ? "border-indigo-600 text-indigo-600 bg-white" 
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Brain className="h-3.5 w-3.5" />
              <span>Case Dilemma</span>
            </button>
            <button 
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-3 font-medium text-xs border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                activeTab === "quiz" 
                  ? "border-indigo-600 text-indigo-600 bg-white" 
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Knowledge Check</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[500px] space-y-6">
            
            {/* 1. Briefing Tab */}
            {activeTab === "briefing" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="font-bold text-xs font-mono uppercase text-slate-500 mb-1">Executive Summary</h4>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    {lessonData.executiveSummary}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900 border-b pb-1.5 border-slate-100 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    <span>Regulatory Deep-Dive (Companies Act & SEBI)</span>
                  </h4>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {lessonData.regulatoryDeepDive}
                  </div>
                </div>

                {module.keySections && (
                  <div className="pt-2">
                    <h5 className="text-[11px] font-mono text-slate-400 uppercase mb-1.5">References to Master:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {module.keySections.map((sec, i) => (
                        <span key={i} className="bg-slate-100 text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Boardroom Actions Tab */}
            {activeTab === "boardroom" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                  <h4 className="font-bold text-sm text-indigo-900 flex items-center space-x-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span>AI Boardroom Defense Protocols</span>
                  </h4>
                  <div className="text-xs text-indigo-950 leading-relaxed whitespace-pre-wrap">
                    {lessonData.boardroomPracticalInsights}
                  </div>
                </div>

                <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-100 space-y-2">
                  <h5 className="font-bold text-xs text-amber-900 font-mono uppercase">Key Boardroom Questions to Ask</h5>
                  <ul className="text-xs text-slate-700 space-y-2.5">
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>"How has the audit committee verified that the related party transactions strictly comply with Section 188 arm's length standards?"</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>"Are our internal financial controls capable of detecting discrepancy patterns prior to final balance sheet certifications?"</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>"Can we trace the specific minutes recording the dissent of the independent board members regarding this corporate investment?"</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Case Dilemma Tab */}
            {activeTab === "case" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase bg-indigo-600 text-white px-2 py-0.5 rounded">Boardroom Case Study</span>
                    <span className="text-xs font-semibold text-indigo-400">{lessonData.caseStudy.title}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white border-b border-slate-800 pb-2">The Dilemma Scenario</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lessonData.caseStudy.scenario}
                  </p>
                </div>

                <div className="bg-emerald-50/40 rounded-xl p-5 border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-xs text-emerald-900 font-mono uppercase">Recommended Board Member Action</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lessonData.caseStudy.analysis}
                  </p>
                </div>
              </div>
            )}

            {/* 4. Quiz Tab */}
            {activeTab === "quiz" && (
              <div className="space-y-6 animate-fadeIn">
                {quizFinished ? (
                  <div className="text-center p-6 space-y-4">
                    <div className="inline-flex bg-emerald-100 p-3 rounded-full text-emerald-600">
                      <Award className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-base">Knowledge Check Completed</h4>
                      <p className="text-xs text-slate-500">
                        You scored <strong>{correctCount} out of {lessonData.checkpointQuestions.length}</strong> correct.
                      </p>
                    </div>
                    <div className="max-w-xs mx-auto">
                      {correctCount >= 2 ? (
                        <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg border border-emerald-100 font-medium">
                          Pass Confirmed (Passing: 50%). Progress securely logged.
                        </div>
                      ) : (
                        <div className="bg-rose-50 text-rose-800 text-xs px-3 py-2 rounded-lg border border-rose-100 font-medium">
                          Failed (Requires at least 2 correct). Let's review the Briefing Note and try again.
                        </div>
                      )}
                    </div>
                    <div className="pt-2 flex justify-center space-x-3">
                      <button 
                        onClick={onBack}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        Return to Syllabus
                      </button>
                      <button 
                        onClick={fetchLessonData}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 transition-colors"
                      >
                        Retake Day {module.day} Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Header/Question Info */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-500 uppercase">Question {currentQuestionIndex + 1} of {lessonData.checkpointQuestions.length}</span>
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-semibold">IICA Format</span>
                    </div>

                    {/* Question Text */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 font-bold text-xs sm:text-sm text-slate-900">
                      {lessonData.checkpointQuestions[currentQuestionIndex].question}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-2">
                      {lessonData.checkpointQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                        const isCorrect = oIdx === lessonData.checkpointQuestions[currentQuestionIndex].correctAnswerIndex;
                        const isSelected = oIdx === selectedOption;

                        let cardStyle = "border-slate-200 hover:bg-slate-50";
                        if (isSelected && !isSubmitted) {
                          cardStyle = "border-indigo-600 bg-indigo-50/30 text-indigo-900";
                        } else if (isSubmitted) {
                          if (isCorrect) {
                            cardStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900";
                          } else if (isSelected) {
                            cardStyle = "border-rose-500 bg-rose-50/50 text-rose-900";
                          } else {
                            cardStyle = "border-slate-100 opacity-60";
                          }
                        }

                        return (
                          <div 
                            key={oIdx}
                            onClick={() => handleOptionSelect(oIdx)}
                            className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center space-x-3 ${cardStyle}`}
                          >
                            <span className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center font-mono text-[10px] font-bold bg-white text-slate-600 shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action buttons / Explanation */}
                    <div className="space-y-4">
                      {isSubmitted && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed space-y-1">
                          <h5 className="font-bold text-slate-900 uppercase text-[10px] font-mono">Detailed Analysis / Citations:</h5>
                          <p>{lessonData.checkpointQuestions[currentQuestionIndex].explanation}</p>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        {!isSubmitted ? (
                          <button 
                            onClick={handleQuizSubmit}
                            disabled={selectedOption === null}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button 
                            onClick={handleNextQuestion}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors flex items-center space-x-1 shadow-sm"
                          >
                            <span>{currentQuestionIndex + 1 === lessonData.checkpointQuestions.length ? "Complete Day Quiz" : "Next Question"}</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer Notes Panel */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-10 space-y-1.5">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Your Personal Boardroom Study Notes (Securely Saved in Firestore)</label>
              <textarea 
                placeholder="Write summaries, custom mnemonics, or questions you intend to ask during actual board alignments..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-12 resize-none placeholder-slate-400"
              />
            </div>
            <div className="md:col-span-2">
              <button 
                onClick={handleSaveNotesLocal}
                disabled={isSavingNotes}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white text-xs font-semibold py-2 rounded-lg border border-slate-800 transition-colors flex items-center justify-center space-x-1 h-12"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
