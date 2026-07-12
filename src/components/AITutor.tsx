import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { 
  Bot, 
  Cpu, 
  HelpCircle, 
  Loader2, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Trash2, 
  UserCheck,
  Lock
} from "lucide-react";

interface AITutorProps {
  userProfession: string;
  isPremium: boolean;
  onTriggerUpgrade: () => void;
}

export default function AITutor({ userProfession, isPremium, onTriggerUpgrade }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text: `### Boardroom Briefing Portal: Online Doubt Resolution
      
Welcome, Director. I am your autonomous AI Boardroom Advisor, specialized in Indian Corporate Law, Companies Act 2013, SEBI LODR rules, and board evaluations.

I am configured with full-fidelity context of your background as a **${userProfession}**. You can ask me any question regarding your independent directorship duties, liabilities, committee constitutions, or audit ratios.

*Examples of executive inquiries you can submit:*
- "Explain the strict limitations on pecuniary relationships under Section 149(6)."
- "How do I protect myself from liability under Section 149(12) if the CFO commits financial statement fraud?"
- "What constitutes a material subsidiary transaction under SEBI LODR Regulation 24?"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userMessagesCount = messages.filter(m => m.sender === "user").length;
  const isLimitReached = !isPremium && userMessagesCount >= 5;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = async (textToSend?: string) => {
    if (isLimitReached) {
      onTriggerUpgrade();
      return;
    }

    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) setInputText("");

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const systemInstruction = `You are the "AI Boardroom Tutor" — a world-class legal expert in the Companies Act 2013 (India), SEBI LODR Regulations, financial forensics, corporate governance, and ethical board practices. Help a senior executive (background: ${userProfession || "General Executive"}) prepare for and pass the IICA Online Proficiency Self-Assessment Test. Provide authoritative responses citing specific sections (e.g., Section 149(6), Section 188), formatted as professional Board Advisory Memos with clear headers and bullet points.`;

      const geminiMessages = [...messages, userMsg]
        .filter(m => m.id !== "init")
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: geminiMessages
          })
        }
      );

      if (!response.ok) {
        throw new Error("Tutor module lost connection. Please retry.");
      }

      const data = await response.json();

      const aiMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: "ai",
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, my analysis engine returned an empty response. Please resubmit.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: "ai",
        text: `⚠️ **Advisory Engine Error**: ${err.message || "Failed to establish real-time legal consensus. Please try again shortly."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (window.confirm("Do you want to reset the current legal briefing session?")) {
      setMessages([messages[0]]);
    }
  };

  const presetDoubts = [
    "What are the cooling-off criteria for IDs after serving 2 terms?",
    "Explain Section 188 arm's length exemptions for unlisted subsidiaries.",
    "What is the list of corporate services prohibited under Section 144?",
    "Under what thresholds is a statutory cost audit triggered?"
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[550px]">
      
      {/* Sidebar - Preset Doubt Guide */}
      <div className="md:col-span-4 border-r border-slate-200 bg-slate-50 p-5 flex flex-col justify-between hidden md:flex">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-800">
            <HelpCircle className="h-4 w-4 text-indigo-600" />
            <h4 className="font-extrabold text-xs uppercase font-mono tracking-wider font-sans">Executive Doubt Vault</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            Click any core scenario below to let the AI draft a formal Legal Memorandum citing the Companies Act 2013.
          </p>

          <div className="space-y-2 pt-2 font-sans">
            {presetDoubts.map((doubt, i) => (
              <button
                key={i}
                onClick={() => handleSend(doubt)}
                disabled={isGenerating || (isLimitReached && !isPremium)}
                className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-500 text-[11px] text-slate-700 hover:text-indigo-900 transition-all font-medium leading-relaxed shadow-sm disabled:opacity-50"
              >
                {doubt}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-slate-400 p-3 rounded-lg text-[10px] border border-slate-800 space-y-1 font-sans">
          <span className="text-white font-mono font-bold block uppercase tracking-wider text-[8px] text-indigo-400">Compliance Warning</span>
          Answers generated by the AI tutor are structured based on IICA Exam syllabi and the Companies Act. They constitute educational exam guidelines and not formal corporate legal counseling.
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="md:col-span-8 flex flex-col h-full bg-slate-100">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between font-sans">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-slate-900 text-indigo-400 p-2 rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">AI Boardroom Advisor</h4>
              <p className="text-[10px] text-emerald-600 font-medium">
                {isPremium ? "Pro Advisor Unlimited" : `Free Plan: ${userMessagesCount}/5 queries used`}
              </p>
            </div>
          </div>

          <button 
            onClick={clearChat}
            className="text-slate-400 hover:text-rose-600 p-2 rounded hover:bg-slate-50 transition-colors"
            title="Clear Dialogue History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-sm">
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div 
                key={msg.id}
                className={`flex space-x-3 max-w-[85%] ${isAI ? "" : "ml-auto flex-row-reverse space-x-reverse"}`}
              >
                {/* Avatar Icon */}
                <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                  isAI ? "bg-slate-950 text-indigo-400" : "bg-indigo-600 text-white"
                }`}>
                  {isAI ? <Bot className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-xl text-xs leading-relaxed border ${
                    isAI 
                      ? "bg-white border-slate-200 text-slate-800" 
                      : "bg-indigo-600 border-indigo-500 text-white"
                  }`}>
                    {/* Render plain text with standard double break for markdown paragraphs */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>
                  </div>
                  <span className={`block text-[9px] font-mono text-slate-400 ${isAI ? "" : "text-right"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex space-x-3 max-w-[80%]">
              <div className="p-2 rounded-full h-8 w-8 bg-slate-950 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center space-x-2 text-xs text-slate-500 font-mono shadow-sm">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                <span>AI is consulting Companies Act and SEBI indexes...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Locked Call-To-Action for Free users */}
        {isLimitReached && (
          <div className="bg-amber-50 border-t border-amber-200 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans shrink-0">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-amber-700 shrink-0" />
              <p className="text-[11px] text-amber-800 leading-normal font-medium">
                You've reached your free limit of 5 legal advisor messages. Upgrade to Pro for just ₹99 to get unlimited boardroom queries.
              </p>
            </div>
            <button
              onClick={onTriggerUpgrade}
              className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 shrink-0 uppercase tracking-wider font-mono shadow-sm"
            >
              <Sparkles className="h-3 w-3" />
              <span>Unlock for ₹99</span>
            </button>
          </div>
        )}

        {/* Input Dock */}
        <div className="bg-white border-t border-slate-200 p-3 flex items-center space-x-2">
          <textarea
            rows={1}
            value={inputText}
            disabled={isLimitReached}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isLimitReached ? "Consultation locked. Upgrade to Pro to resume..." : "Ask AI Advisor regarding Board duties, S.188, CARO 2020 rules..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-11 placeholder-slate-400 leading-normal disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isGenerating || !inputText.trim() || isLimitReached}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white p-3 rounded-lg transition-colors shadow shrink-0 h-11 w-11 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
