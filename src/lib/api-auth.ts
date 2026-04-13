/**
 * API Key Authentication for the Developer API (/api/v1/)
 *
 * Keys are stored in data/api-keys.json.
 * In production, replace with a database + proper hashing.
 */

import * as fs from "fs";
import * as path from "path";
import { NextRequest } from "next/server";

export interface ApiKey {
  key: string;
  name: string;
  tier: "free" | "starter" | "pro" | "enterprise";
  dailyLimit: number;
  createdAt: string;
  active: boolean;
}

interface UsageRecord {
  [key: string]: { date: string; count: number };
}

const KEYS_FILE = path.join(process.cwd(), "data", "api-keys.json");
const USAGE_FILE = path.join(process.cwd(), "data", "api-usage.json");

const TIER_LIMITS: Record<string, number> = {
  free: 100,
  starter: 5000,
  pro: 50000,
  enterprise: 999999,
};

function loadKeys(): ApiKey[] {
  if (!fs.existsSync(KEYS_FILE)) {
    // Create default demo key
    const defaults: ApiKey[] = [
      {
        key: "wbi_demo_2026_public",
        name: "Demo Key (Public)",
        tier: "free",
        dailyLimit: 100,
        createdAt: "2026-04-13",
        active: true,
      },
    ];
    fs.mkdirSync(path.dirname(KEYS_FILE), { recursive: true });
    fs.writeFileSync(KEYS_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(fs.readFileSync(KEYS_FILE, "utf-8"));
}

function loadUsage(): UsageRecord {
  if (!fs.existsSync(USAGE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(USAGE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveUsage(usage: UsageRecord) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
}

export interface AuthResult {
  authenticated: boolean;
  apiKey?: ApiKey;
  error?: string;
  status?: number;
}

/**
 * Authenticate an API request.
 * Checks the `x-api-key` header or `apiKey` query parameter.
 */
export function authenticateRequest(request: NextRequest): AuthResult {
  const key =
    request.headers.get("x-api-key") ||
    request.nextUrl.searchParams.get("apiKey");

  if (!key) {
    return {
      authenticated: false,
      error: "Missing API key. Pass it via x-api-key header or apiKey query parameter.",
      status: 401,
    };
  }

  const keys = loadKeys();
  const apiKey = keys.find((k) => k.key === key && k.active);

  if (!apiKey) {
    return {
      authenticated: false,
      error: "Invalid or inactive API key.",
      status: 401,
    };
  }

  // Check rate limit
  const today = new Date().toISOString().split("T")[0];
  const usage = loadUsage();
  const record = usage[key];

  if (record && record.date === today && record.count >= apiKey.dailyLimit) {
    return {
      authenticated: false,
      error: `Daily rate limit exceeded (${apiKey.dailyLimit} requests/day for ${apiKey.tier} tier). Upgrade at worldbestinsurer.com/developers.`,
      status: 429,
    };
  }

  // Increment usage
  if (!record || record.date !== today) {
    usage[key] = { date: today, count: 1 };
  } else {
    record.count++;
  }
  saveUsage(usage);

  return { authenticated: true, apiKey };
}
