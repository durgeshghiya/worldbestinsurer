/**
 * Serverless-compatible file storage.
 *
 * On Vercel, the filesystem is read-only EXCEPT for /tmp.
 * This module writes to /tmp on serverless and to data/ locally.
 *
 * IMPORTANT: /tmp is ephemeral on Vercel — data is lost between cold starts.
 * All writes also console.log the full data so it's visible in Vercel Logs.
 * For persistent storage, replace this with Supabase/Vercel KV.
 */

import * as fs from "fs";
import * as path from "path";

const IS_VERCEL = !!process.env.VERCEL;

function getStoragePath(filename: string): string {
  if (IS_VERCEL) {
    return path.join("/tmp", filename);
  }
  // Local development: use data/ directory
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, filename);
}

export function readJson<T>(filename: string, fallback: T): T {
  const filePath = getStoragePath(filename);
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

export function writeJson(filename: string, data: unknown): void {
  const filePath = getStoragePath(filename);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function appendToJsonArray<T>(filename: string, item: T): void {
  const existing = readJson<T[]>(filename, []);
  existing.push(item);
  writeJson(filename, existing);
}
