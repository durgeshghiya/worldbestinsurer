/**
 * Structured Logging Utility for Zura Agent
 *
 * Provides leveled logging with colored console output and file persistence.
 * Logs are appended to data/reports/agent.log in structured format.
 */

import * as fs from "fs";
import * as path from "path";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m",  // cyan
  info: "\x1b[32m",   // green
  warn: "\x1b[33m",   // yellow
  error: "\x1b[31m",  // red
};

const RESET = "\x1b[0m";

const LOG_PREFIXES: Record<LogLevel, string> = {
  debug: "DBG",
  info: "INF",
  warn: "WRN",
  error: "ERR",
};

/** Minimum level to output. Set via ZURA_LOG_LEVEL env var or defaults to "info". */
function getMinLevel(): LogLevel {
  const env = process.env.ZURA_LOG_LEVEL?.toLowerCase();
  if (env && env in LOG_LEVEL_PRIORITY) {
    return env as LogLevel;
  }
  return "info";
}

/** Resolve the log file path relative to project root. */
function getLogFilePath(): string {
  // Walk up from this file to find the project root (where package.json lives)
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return path.join(dir, "data", "reports", "agent.log");
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: use cwd
  return path.join(process.cwd(), "data", "reports", "agent.log");
}

let logFilePath: string | null = null;

function ensureLogFile(): string {
  if (!logFilePath) {
    logFilePath = getLogFilePath();
    const dir = path.dirname(logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  return logFilePath;
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatData(data: unknown): string {
  if (data === undefined || data === null) return "";
  try {
    if (data instanceof Error) {
      return ` ${JSON.stringify({ message: data.message, stack: data.stack })}`;
    }
    return ` ${JSON.stringify(data)}`;
  } catch {
    return ` [unserializable]`;
  }
}

export class Logger {
  constructor(private context: string) {}

  debug(msg: string, data?: unknown): void {
    this.log("debug", msg, data);
  }

  info(msg: string, data?: unknown): void {
    this.log("info", msg, data);
  }

  warn(msg: string, data?: unknown): void {
    this.log("warn", msg, data);
  }

  error(msg: string, data?: unknown): void {
    this.log("error", msg, data);
  }

  /** Create a child logger with a more specific context. */
  child(subContext: string): Logger {
    return new Logger(`${this.context}:${subContext}`);
  }

  private log(level: LogLevel, msg: string, data?: unknown): void {
    const minLevel = getMinLevel();
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[minLevel]) {
      return;
    }

    const ts = formatTimestamp();
    const prefix = LOG_PREFIXES[level];
    const color = LOG_COLORS[level];
    const dataStr = formatData(data);

    // Console output with color
    const consoleLine = `${color}[${prefix}]${RESET} ${ts} [${this.context}] ${msg}${dataStr}`;
    if (level === "error") {
      console.error(consoleLine);
    } else if (level === "warn") {
      console.warn(consoleLine);
    } else {
      console.log(consoleLine);
    }

    // File output (structured, no color codes)
    try {
      const filePath = ensureLogFile();
      const fileEntry = JSON.stringify({
        level,
        ts,
        context: this.context,
        msg,
        ...(data !== undefined && data !== null ? { data } : {}),
      });
      fs.appendFileSync(filePath, fileEntry + "\n", "utf-8");
    } catch {
      // Silently ignore file write errors to avoid log loops
    }
  }
}

/** Default agent-level logger instance. */
export const logger = new Logger("agent");
