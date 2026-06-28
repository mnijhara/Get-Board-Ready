import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI securely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI endpoints will operate in fallback mode.");
}

app.use(express.json());

// API: Check health / status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiAvailable: !!ai });
});

// API: Generate Customized Lesson on-demand
app.post("/api/generate-lesson", async (req, res) => {
  const { day, title, category, description, keySections, outline, userProfession } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini API is not configured on the server." });
  }

  const prompt = `
You are the Chief AI Corporate Governance Trainer for the IICA Independent Directors Databank exam preparation course.
Generate an elite, executive-level study lesson for:
Day ${day}: ${title}
Category: ${category}
Key Legal Sections: ${keySections ? keySections.join(", ") : "Companies Act 2013 guidelines"}

Target Audience: Senior CXO / Board Candidate with a professional background in: ${userProfession || "General Management / Leadership"}.
Structure the training material specifically to address their perspective, providing rigorous, high-fidelity corporate governance training.

Outline of topics to cover in detail:
${outline ? outline.map((o: string) => `- ${o}`).join("\n") : "General concepts of " + title}

Ensure the generated lesson:
1. Explains key provisions of the Companies Act 2013 and SEBI LODR rules explicitly.
2. Uses standard professional, formal corporate advisory language (no fluff, precise legal citations).
3. Connects the theory with a realistic boardroom Case Study that high-level candidates can relate to.
4. Generates exactly 3 high-quality practice MCQs (Multiple Choice Questions) specifically calibrated to the IICA self-assessment exam standards (passing mark is 50%, questions can be situational/scenario-based).

Format the entire output as a JSON object matching the requested schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            executiveSummary: {
              type: "STRING",
              description: "A high-impact executive summary (2-3 paragraphs) introducing the day's core concept, importance to directors, and governance context."
            },
            regulatoryDeepDive: {
              type: "STRING",
              description: "Rigorous, detailed legal analysis of key sections, compliance thresholds, and statutory definitions, formatted in markdown (bolding, lists, tables)."
            },
            boardroomPracticalInsights: {
              type: "STRING",
              description: "Crucial, practical advice for active boardrooms. How to spot red flags, what questions to ask management, and how to protect oneself from liability."
            },
            caseStudy: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                scenario: { type: "STRING", description: "A realistic boardroom dilemma scenario requiring legal and governance decisions." },
                analysis: { type: "STRING", description: "How the independent director should react, citing relevant sections and best practices." }
              },
              required: ["title", "scenario", "analysis"]
            },
            checkpointQuestions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  question: { type: "STRING" },
                  options: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  correctAnswerIndex: { type: "INTEGER", description: "0-based index of the correct option" },
                  explanation: { type: "STRING", description: "Thorough explanation citing specific sub-sections or guidelines of why this is correct and why other options are incorrect." }
                },
                required: ["question", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["executiveSummary", "regulatoryDeepDive", "boardroomPracticalInsights", "caseStudy", "checkpointQuestions"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini");
    }

    const resultJson = JSON.parse(resultText);
    res.json(resultJson);
  } catch (error: any) {
    console.error("Error generating lesson via Gemini:", error);
    res.status(500).json({ error: "Failed to generate AI study lesson. Please try again.", details: error.message });
  }
});

// API: AI Boardroom Tutor / Chat Advisor
app.post("/api/ai-chat", async (req, res) => {
  const { messages, userProfession } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini API is not configured on the server." });
  }

  const systemInstruction = `
You are the "AI Boardroom Tutor" — a world-class legal expert in the Companies Act 2013 (India), SEBI LODR Regulations, financial forensics, corporate governance, and ethical board practices.
Your task is to help a senior executive (background: ${userProfession || "General Executive"}) prepare for and pass the IICA Online Proficiency Self-Assessment Test.

Provide responses that are:
1. Highly authoritative, citing specific sections (e.g., Section 149(6), Section 188), rules, schedules (e.g., Schedule IV), or SEBI Regulations (e.g., Reg 17, 18, 23).
2. Formatted as an elegant, professional Board Advisory Memo.
3. Structured with clear headers, bullet points, and actionable advice.
4. Extremely clear and helpful, encouraging the candidate to think critically about board oversight.
`;

  try {
    // Map existing history
    const geminiHistory = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Add system instructions via chat config or systemInstruction option
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Acknowledged. I am ready to advise on corporate governance, Companies Act provisions, SEBI regulations, and help you master the IICA Databank exam. How can I assist you today?" }] },
        ...geminiHistory
      ]
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in AI Chat advisor:", error);
    res.status(500).json({ error: "Failed to get AI guidance. Please try again.", details: error.message });
  }
});

// API: Dynamic Mock Exam Question Generator
app.post("/api/generate-exam", async (req, res) => {
  const { categories, questionCount, userProfession } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini API is not configured on the server." });
  }

  const selectedCategories = categories && categories.length > 0 ? categories : ["Companies Act", "Corporate Governance", "SEBI LODR", "Financials"];
  const count = questionCount || 10;

  const prompt = `
You are the IICA Exam Blueprint Generator. Generate exactly ${count} Multiple Choice Questions (MCQs) for the Independent Directors Databank Online Proficiency Self-Assessment Test.
The questions must be distributed across the following categories: ${selectedCategories.join(", ")}.

Ensure that:
1. The questions are challenging and scenario-based (e.g., 'At a board meeting of XYZ Limited...', 'An Audit Committee consists of...').
2. Questions mimic the real IICA Exam style (where passing is 50%, requiring precise understanding of thresholds, percentages, approvals, and legal schedules).
3. Out of ${count} questions, make about 60% situational/case-study type, and 40% threshold/memorization type.
4. Each question MUST contain a highly thorough explanation citing the precise legal section of Companies Act 2013 or SEBI rules.

Format the output strictly as a JSON object matching the requested schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            questions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  question: { type: "STRING", description: "The MCQ question text, including situational context if appropriate." },
                  category: { type: "STRING", enum: ["Companies Act", "Corporate Governance", "SEBI LODR", "Financials", "Ethics & CSR", "Boardroom"] },
                  options: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                    description: "Exactly 4 options"
                  },
                  correctAnswerIndex: { type: "INTEGER", description: "0-based index of the correct option (0, 1, 2, or 3)" },
                  explanation: { type: "STRING", description: "Thorough explanation citing specific sub-sections, Rules, or Regulations of why this is correct." }
                },
                required: ["question", "category", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini");
    }

    const resultJson = JSON.parse(resultText);
    res.json(resultJson);
  } catch (error: any) {
    console.error("Error generating exam questions:", error);
    res.status(500).json({ error: "Failed to generate mock exam. Please try again.", details: error.message });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI IICA Exam Prep server running at http://localhost:${PORT}`);
  });
}

startServer();
