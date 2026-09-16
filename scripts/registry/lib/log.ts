/**
 * Job log. Every event is written as one JSON line to
 * data/registry-logs/<job>-<timestamp>.jsonl (gitignored) and echoed to the
 * console, so a CI run and a local run leave the same trail.
 */

import fs from "fs";
import path from "path";

export type Level = "info" | "warn" | "error";

export class JobLog {
  readonly file: string;
  private counts: Record<Level, number> = { info: 0, warn: 0, error: 0 };

  constructor(readonly job: string) {
    const dir = path.join(process.cwd(), "data/registry-logs");
    fs.mkdirSync(dir, { recursive: true });
    this.file = path.join(dir, `${job}-${new Date().toISOString().replace(/[:.]/g, "-")}.jsonl`);
  }

  private write(level: Level, event: string, data: Record<string, unknown> = {}): void {
    this.counts[level]++;
    const line = { at: new Date().toISOString(), job: this.job, level, event, ...data };
    fs.appendFileSync(this.file, JSON.stringify(line) + "\n");
    const tag = level === "info" ? "  " : level === "warn" ? "! " : "✗ ";
    const detail = Object.entries(data)
      .map(([k, v]) => `${k}=${typeof v === "string" ? v : JSON.stringify(v)}`)
      .join(" ");
    console[level === "error" ? "error" : "log"](`${tag}${event}${detail ? "  " + detail : ""}`);
  }

  info(event: string, data?: Record<string, unknown>) { this.write("info", event, data); }
  warn(event: string, data?: Record<string, unknown>) { this.write("warn", event, data); }
  error(event: string, data?: Record<string, unknown>) { this.write("error", event, data); }

  get summary(): Record<Level, number> {
    return { ...this.counts };
  }
}
