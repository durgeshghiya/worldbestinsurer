/**
 * Scheduler for Zura Insurance Data Agent
 *
 * Uses node-cron to schedule daily and weekly pipeline runs.
 * Schedule times are in IST (Asia/Kolkata).
 *
 * - Daily: 6:00 AM IST every day
 * - Weekly: 2:00 AM IST every Sunday
 */

import cron from "node-cron";
import { runPipeline } from "./orchestrator";

/**
 * Start the cron-based scheduler.
 * This function runs indefinitely, executing scheduled tasks.
 */
export function startScheduler(): void {
  console.log("[scheduler] Starting Zura Insurance Data Agent scheduler");
  console.log("[scheduler] Daily run:  06:00 IST (00:30 UTC)");
  console.log("[scheduler] Weekly run: 02:00 IST Sundays (20:30 UTC Saturday)");
  console.log("[scheduler] Press Ctrl+C to stop\n");

  // Daily at 6:00 AM IST
  // IST = UTC+5:30, so 6:00 AM IST = 00:30 UTC
  cron.schedule(
    "30 0 * * *",
    async () => {
      console.log(`\n[scheduler] Triggering daily run at ${new Date().toISOString()}`);
      try {
        await runPipeline({
          mode: "daily",
          autoApprove: true,
          skipBuild: false,
        });
        console.log("[scheduler] Daily run completed");
      } catch (err) {
        console.error("[scheduler] Daily run failed:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
      // scheduled: true,
    }
  );

  // Weekly on Sundays at 2:00 AM IST
  // IST = UTC+5:30, so 2:00 AM IST Sunday = 20:30 UTC Saturday
  cron.schedule(
    "0 2 * * 0",
    async () => {
      console.log(`\n[scheduler] Triggering weekly run at ${new Date().toISOString()}`);
      try {
        await runPipeline({
          mode: "weekly",
          autoApprove: true,
          skipBuild: false,
        });
        console.log("[scheduler] Weekly run completed");
      } catch (err) {
        console.error("[scheduler] Weekly run failed:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
      // scheduled: true,
    }
  );

  // Keep the process alive
  console.log("[scheduler] Scheduler is running. Waiting for next scheduled run...");
}
