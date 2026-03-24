/**
 * Site Rebuild Trigger for Zura Insurance Agent
 *
 * Runs `npx next build` to regenerate the static site after data changes.
 */

import { execSync } from "child_process";
import * as path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "../../");

export interface RebuildResult {
  success: boolean;
  output: string;
  durationMs: number;
}

/**
 * Trigger a Next.js site rebuild.
 *
 * @param options.dryRun  If true, log what would happen without actually building.
 * @returns An object with success status, captured output, and duration.
 */
export async function triggerRebuild(
  options?: { dryRun?: boolean }
): Promise<RebuildResult> {
  const dryRun = options?.dryRun ?? false;

  if (dryRun) {
    console.log("[rebuild] Dry run — skipping actual build");
    return {
      success: true,
      output: "Dry run — build skipped",
      durationMs: 0,
    };
  }

  console.log("[rebuild] Starting Next.js build...");
  const start = Date.now();

  try {
    const output = execSync("npx next build", {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 5 * 60 * 1000, // 5 minute timeout
      env: { ...process.env, NODE_ENV: "production" },
    });

    const durationMs = Date.now() - start;
    console.log(`[rebuild] Build completed in ${(durationMs / 1000).toFixed(1)}s`);

    return {
      success: true,
      output: output.toString(),
      durationMs,
    };
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    let output = "Unknown build error";

    if (err && typeof err === "object" && "stdout" in err) {
      const execErr = err as { stdout?: string; stderr?: string; message?: string };
      output = [execErr.stdout, execErr.stderr, execErr.message]
        .filter(Boolean)
        .join("\n");
    } else if (err instanceof Error) {
      output = err.message;
    }

    console.error(`[rebuild] Build FAILED after ${(durationMs / 1000).toFixed(1)}s`);
    console.error(`[rebuild] ${output.slice(0, 500)}`);

    return {
      success: false,
      output,
      durationMs,
    };
  }
}
