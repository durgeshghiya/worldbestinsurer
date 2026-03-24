/**
 * File Operation Utilities for Zura Agent
 *
 * Provides safe JSON read/write, atomic writes, JSONL appending,
 * directory creation, backups, and existence checks.
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Resolve a path relative to the project root.
 * If the path is already absolute, return it as-is.
 */
function resolve(filePath: string): string {
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(process.cwd(), filePath);
}

/**
 * Read and parse a JSON file. Throws if the file doesn't exist or is invalid JSON.
 */
export function readJSON<T>(filePath: string): T {
  const full = resolve(filePath);
  const content = fs.readFileSync(full, "utf-8");
  return JSON.parse(content) as T;
}

/**
 * Atomically write data as JSON. Writes to a .tmp file first, then renames.
 * Creates parent directories if they don't exist.
 */
export function writeJSON(filePath: string, data: unknown): void {
  const full = resolve(filePath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tmpPath = full + ".tmp";
  const content = JSON.stringify(data, null, 2) + "\n";

  fs.writeFileSync(tmpPath, content, "utf-8");

  // Atomic rename — on Windows this may not be truly atomic but is the best we can do
  try {
    fs.renameSync(tmpPath, full);
  } catch {
    // If rename fails (e.g., cross-device), fall back to copy+delete
    fs.copyFileSync(tmpPath, full);
    try {
      fs.unlinkSync(tmpPath);
    } catch {
      // Ignore cleanup failure
    }
  }
}

/**
 * Append a single record as a line to a JSONL (JSON Lines) file.
 * Creates the file and parent directories if they don't exist.
 */
export function appendJSONL(filePath: string, record: unknown): void {
  const full = resolve(filePath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const line = JSON.stringify(record) + "\n";
  fs.appendFileSync(full, line, "utf-8");
}

/**
 * Ensure a directory exists, creating it and all parents if needed.
 * Returns the resolved absolute path.
 */
export function ensureDir(dirPath: string): string {
  const full = resolve(dirPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
  return full;
}

/**
 * Create a timestamped backup of a file.
 * Copies srcPath to backupDir with a timestamp suffix.
 * Returns the absolute path of the backup file.
 */
export function backupFile(srcPath: string, backupDir: string): string {
  const fullSrc = resolve(srcPath);
  const fullBackupDir = resolve(backupDir);

  if (!fs.existsSync(fullBackupDir)) {
    fs.mkdirSync(fullBackupDir, { recursive: true });
  }

  const ext = path.extname(fullSrc);
  const base = path.basename(fullSrc, ext);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `${base}_${timestamp}${ext}`;
  const backupPath = path.join(fullBackupDir, backupName);

  fs.copyFileSync(fullSrc, backupPath);
  return backupPath;
}

/**
 * Check whether a file exists at the given path.
 */
export function fileExists(filePath: string): boolean {
  const full = resolve(filePath);
  return fs.existsSync(full);
}
