// Central AI proxy — all Gemini calls route through Cloudflare Worker
// Gemini API key NEVER exposed to browser

const WORKER_URL = "https://red-credit-6798.mnijhara.workers.dev";

export interface AIRequest {
  type: "tutor" | "lesson" | "exam";
  userId: string;
  isPremium: boolean;
  payload: object;
}

export interface AIResult {
  error?: string;
  limitReached?: boolean;
  resetIn?: number;
  candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
}

export async function callAI(req: AIRequest): Promise<AIResult> {
  const res = await fetch(`${WORKER_URL}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });
  if (!res.ok && res.status === 429) {
    return res.json();
  }
  if (!res.ok) throw new Error(`AI service error: ${res.status}`);
  return res.json();
}

export function extractText(data: AIResult): string | null {
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}
