import React, { useState } from "react";
import { sampleFlashcards } from "../data/syllabus";
import { Flashcard } from "../types";
import { 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Layers, 
  RotateCcw, 
  Sparkles 
} from "lucide-react";

export default function Flashcards() {
  const [deck, setDeck] = useState<Flashcard[]>(sampleFlashcards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "review" | "mastered">("all");

  const currentCard = deck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        setCurrentIndex(deck.length - 1);
      }
    }, 150);
  };

  const toggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid flipping the card
    if (masteredIds.includes(id)) {
      setMasteredIds(masteredIds.filter(mId => mId !== id));
    } else {
      setMasteredIds([...masteredIds, id]);
    }
  };

  const handleFilterChange = (mode: "all" | "review" | "mastered") => {
    setIsFlipped(false);
    setFilterMode(mode);
    setCurrentIndex(0);

    let filtered = sampleFlashcards;
    if (mode === "review") {
      filtered = sampleFlashcards.filter(fc => !masteredIds.includes(fc.id));
    } else if (mode === "mastered") {
      filtered = sampleFlashcards.filter(fc => masteredIds.includes(fc.id));
    }

    setDeck(filtered.length > 0 ? filtered : sampleFlashcards);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 min-h-[500px] flex flex-col justify-between">
      
      {/* Header and filters */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <span>Interactive Boardroom Flashcards</span>
          </h2>
          <p className="text-xs text-slate-500">Test your mental recall of vital Companies Act thresholds and code provisions.</p>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 shrink-0">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
              filterMode === "all" 
                ? "bg-slate-900 border-slate-900 text-white" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All ({sampleFlashcards.length})
          </button>
          <button
            onClick={() => handleFilterChange("review")}
            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
              filterMode === "review" 
                ? "bg-slate-900 border-slate-900 text-white" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Review Needed ({sampleFlashcards.length - masteredIds.length})
          </button>
          <button
            onClick={() => handleFilterChange("mastered")}
            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
              filterMode === "mastered" 
                ? "bg-slate-900 border-slate-900 text-white" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Mastered ({masteredIds.length})
          </button>
        </div>
      </div>

      {/* Main card deck frame */}
      {deck.length > 0 && currentCard ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          
          {/* Flipcard wrapper with custom CSS perspective */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-md h-56 cursor-pointer relative group"
            style={{ perspective: "1000px" }}
          >
            {/* Inner rotatable card structure */}
            <div 
              className={`w-full h-full duration-500 transform transition-transform relative select-none`}
              style={{ 
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
              }}
            >
              
              {/* CARD FRONT FACE */}
              <div 
                className="absolute inset-0 bg-slate-900 text-white p-6 rounded-2xl border border-slate-850 flex flex-col justify-between shadow-lg"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/40">
                      RECALL PROMPT
                    </span>
                    <h5 className="text-[10px] font-mono text-slate-400 block pt-1">Topic: {currentCard.topic}</h5>
                  </div>
                  
                  <button
                    onClick={(e) => toggleMastered(currentCard.id, e)}
                    className={`text-xs p-1 rounded-full border transition-all ${
                      masteredIds.includes(currentCard.id)
                        ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400"
                        : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
                    }`}
                    title={masteredIds.includes(currentCard.id) ? "Mark as Review Needed" : "Mark as Mastered"}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>

                <div className="font-bold text-xs sm:text-sm leading-relaxed text-center py-2 text-slate-100">
                  {currentCard.question}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>No. {currentIndex + 1} of {deck.length}</span>
                  <span className="text-indigo-400 font-bold group-hover:underline">Click card to reveal answer</span>
                </div>
              </div>

              {/* CARD BACK FACE */}
              <div 
                className="absolute inset-0 bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-lg"
                style={{ 
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      LEGAL STANDARD
                    </span>
                    {currentCard.section && (
                      <h5 className="text-[10px] font-mono text-slate-500 block pt-1">Citation: {currentCard.section}</h5>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Answer revealed</span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed text-center py-2 font-medium">
                  {currentCard.answer}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Topic: {currentCard.topic}</span>
                  <span className="text-indigo-600 font-bold">Click card to flip back</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action swiper navigation */}
          <div className="flex items-center space-x-6 pt-6">
            <button
              onClick={handlePrev}
              className="bg-slate-50 hover:bg-slate-100 p-3 rounded-full border border-slate-200 text-slate-700 transition-colors"
              title="Previous Card"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-xs font-mono text-slate-500">
              Card {currentIndex + 1} of {deck.length}
            </span>

            <button
              onClick={handleNext}
              className="bg-slate-50 hover:bg-slate-100 p-3 rounded-full border border-slate-200 text-slate-700 transition-colors"
              title="Next Card"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center p-12 text-slate-400 text-xs leading-relaxed flex flex-col items-center space-y-3">
          <Layers className="h-8 w-8 opacity-40" />
          <p>No card materials filtered for the current criteria.</p>
          <button 
            onClick={() => handleFilterChange("all")}
            className="text-indigo-600 font-bold underline"
          >
            Reset Card Deck
          </button>
        </div>
      )}

      {/* Footer statistics */}
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Mastery: {Math.round((masteredIds.length / sampleFlashcards.length) * 100)}% ({masteredIds.length} of {sampleFlashcards.length})</span>
        </div>
        <button
          onClick={() => {
            setMasteredIds([]);
            handleFilterChange("all");
          }}
          className="hover:text-slate-700 flex items-center space-x-1"
          title="Reset All Mastery Scores"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Deck Status</span>
        </button>
      </div>

    </div>
  );
}
