/**
 * Gemini API client for insurance data extraction and analysis.
 */
import * as fs from "fs";
import * as path from "path";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY not set. Get one free at https://aistudio.google.com/apikey\n" +
      "Set it: set GEMINI_API_KEY=your_key_here (Windows)\n" +
      "Or: export GEMINI_API_KEY=your_key_here (Mac/Linux)"
    );
  }
  return key;
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiResponse {
  text: string;
  tokensUsed: number;
  success: boolean;
  error?: string;
}

/**
 * Call Gemini API with a prompt.
 */
export async function callGemini(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemInstruction?: string;
  } = {}
): Promise<GeminiResponse> {
  const apiKey = getApiKey();
  const model = options.model ?? "gemini-2.0-flash";
  const url = `${API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.1,
      maxOutputTokens: options.maxTokens ?? 8192,
      responseMimeType: "application/json",
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return { text: "", tokensUsed: 0, success: false, error: `API error ${res.status}: ${err}` };
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const tokens = data.usageMetadata?.totalTokenCount ?? 0;

    return { text, tokensUsed: tokens, success: true };
  } catch (err) {
    return { text: "", tokensUsed: 0, success: false, error: String(err) };
  }
}

/**
 * Call Gemini with plain text response (no JSON mode).
 */
export async function callGeminiText(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemInstruction?: string;
  } = {}
): Promise<GeminiResponse> {
  const apiKey = getApiKey();
  const model = options.model ?? "gemini-2.0-flash";
  const url = `${API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.3,
      maxOutputTokens: options.maxTokens ?? 4096,
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return { text: "", tokensUsed: 0, success: false, error: `API error ${res.status}: ${err}` };
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const tokens = data.usageMetadata?.totalTokenCount ?? 0;

    return { text, tokensUsed: tokens, success: true };
  } catch (err) {
    return { text: "", tokensUsed: 0, success: false, error: String(err) };
  }
}

/**
 * Rate limiter — 15 requests per minute for free tier.
 */
let lastCallTime = 0;
const MIN_INTERVAL = 4200; // ~14 calls/min to stay safe

export async function rateLimitedCall(
  prompt: string,
  options?: Parameters<typeof callGemini>[1]
): Promise<GeminiResponse> {
  const now = Date.now();
  const wait = MIN_INTERVAL - (now - lastCallTime);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallTime = Date.now();
  return callGemini(prompt, options);
}
