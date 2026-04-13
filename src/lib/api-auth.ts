/**
 * API Key Authentication for the Developer API (/api/v1/)
 * Vercel-compatible — no filesystem writes.
 */

import { NextRequest } from "next/server";

export interface ApiKey {
  key: string;
  name: string;
  tier: "free" | "starter" | "pro" | "enterprise";
  dailyLimit: number;
}

// Hardcoded keys — in production, move to environment variables or database
const API_KEYS: ApiKey[] = [
  {
    key: "wbi_demo_2026_public",
    name: "Demo Key (Public)",
    tier: "free",
    dailyLimit: 100,
  },
];

// In-memory rate limit counter (resets on cold start — good enough for demo)
const usageCounters = new Map<string, { date: string; count: number }>();

export interface AuthResult {
  authenticated: boolean;
  apiKey?: ApiKey;
  error?: string;
  status?: number;
}

export function authenticateRequest(request: NextRequest): AuthResult {
  const key =
    request.headers.get("x-api-key") ||
    request.nextUrl.searchParams.get("apiKey");

  if (!key) {
    return {
      authenticated: false,
      error: "Missing API key. Pass via x-api-key header or apiKey query parameter. Demo key: wbi_demo_2026_public",
      status: 401,
    };
  }

  const apiKey = API_KEYS.find((k) => k.key === key);

  if (!apiKey) {
    return {
      authenticated: false,
      error: "Invalid API key.",
      status: 401,
    };
  }

  // Check rate limit (in-memory, resets on cold start)
  const today = new Date().toISOString().split("T")[0];
  const record = usageCounters.get(key);

  if (record && record.date === today && record.count >= apiKey.dailyLimit) {
    return {
      authenticated: false,
      error: `Daily rate limit exceeded (${apiKey.dailyLimit}/day for ${apiKey.tier} tier).`,
      status: 429,
    };
  }

  // Increment
  if (!record || record.date !== today) {
    usageCounters.set(key, { date: today, count: 1 });
  } else {
    record.count++;
  }

  return { authenticated: true, apiKey };
}
