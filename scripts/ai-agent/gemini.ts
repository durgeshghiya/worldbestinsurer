/**
 * Gemini REST API client for insurance data research.
 * Uses the v1beta generateContent endpoint directly via fetch.
 */
import * as fs from "fs";
import * as path from "path";

// Load .env from project root
const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

const API_KEY = () => process.env.GEMINI_API_KEY ?? "";
const MODEL = "gemini-2.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Call Gemini API with a prompt. Returns text response.
 */
export async function callGemini(
  prompt: string,
  options: {
    model?: string;
    systemInstruction?: string;
    maxTokens?: number;
  } = {}
): Promise<GeminiResponse> {
  const key = API_KEY();
  if (!key) {
    return { text: "", success: false, error: "GEMINI_API_KEY not set" };
  }

  const model = options.model ?? MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const body: Record<string, unknown> = {
    contents: [
      {
        parts: [
          {
            text: options.systemInstruction
              ? `${options.systemInstruction}\n\n${prompt}\n\nRespond with ONLY valid JSON, no markdown code fences.`
              : `${prompt}\n\nRespond with ONLY valid JSON, no markdown code fences.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: options.maxTokens ?? 8192,
    },
  };

  // Retry logic with exponential backoff
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (resp.status === 429) {
        const waitSec = 45 * (attempt + 1);
        console.log(`  ⏳ Rate limited. Waiting ${waitSec}s before retry ${attempt + 1}/3...`);
        await sleep(waitSec * 1000);
        continue;
      }

      if (!resp.ok) {
        const errText = await resp.text();
        return { text: "", success: false, error: `API error ${resp.status}: ${errText}` };
      }

      const data = await resp.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!text) {
        return { text: "", success: false, error: "Empty response from Gemini" };
      }

      // Strip markdown code fences if present
      let cleaned = text.trim();
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();

      return { text: cleaned, success: true };
    } catch (err) {
      if (attempt === 2) {
        return { text: "", success: false, error: `Fetch error: ${err}` };
      }
      await sleep(5000);
    }
  }

  return { text: "", success: false, error: "All retries failed" };
}

/**
 * Parse JSON from Gemini response, handling common formatting issues.
 */
export function parseGeminiJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON array or object
    const arrMatch = text.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try { return JSON.parse(arrMatch[0]) as T; } catch {}
    }
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]) as T; } catch {}
    }
    return null;
  }
}
