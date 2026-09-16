/**
 * Daily: re-check every source's robots.txt and record what it says.
 *
 * Fetching robots.txt is always permitted, so this runs even for sources that
 * forbid crawling. If a crawlable source starts refusing us, its status flips
 * and the ingest job's fetcher will stop on its own — nothing is overridden.
 */

import { USER_AGENT } from "../lib/http";
import { checkRobots, clearRobotsCache } from "../../utils/robots-checker";
import { JobLog } from "../lib/log";
import { RegistryStore } from "../lib/store";
import type { Source } from "../../../src/lib/registry/types";

type RobotsStatus = Source["robots"];

/**
 * Classify a source's robots.txt. Availability (refused / unreachable) comes
 * from the HTTP status; the allow/disallow verdict comes from the same
 * RFC 9309 checker the fetcher uses, so the two can never disagree.
 */
async function robotsStatus(homepage: string): Promise<RobotsStatus> {
  const origin = new URL(homepage).origin;
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(20_000),
      redirect: "follow",
    });
    if (res.status === 401 || res.status === 403 || res.status === 429) return "refused";
    if (res.status >= 500) return "unreachable";
  } catch {
    return "unreachable";
  }
  clearRobotsCache();
  return (await checkRobots(homepage, USER_AGENT)) ? "allowed" : "disallowed";
}

export async function runCheckSources(): Promise<void> {
  const log = new JobLog("check-sources");
  const store = new RegistryStore("check-sources");
  const now = new Date().toISOString();
  let changed = 0;
  let problems = 0;

  for (const s of store.sources) {
    if (s.robots === "not-applicable") continue; // API sources
    const status = await robotsStatus(s.homepage);
    if (status !== s.robots) {
      changed++;
      store.record({ kind: "source", key: s.id, field: "robots", from: s.robots, to: status, sourceUrl: s.homepage });
      const level = s.accessMethod === "crawl" && status !== "allowed" ? "error" : "warn";
      log[level]("robots-changed", { source: s.id, from: s.robots, to: status });
      if (level === "error") problems++;
      s.robots = status;
    } else {
      log.info("robots-unchanged", { source: s.id, status });
    }
    s.robotsCheckedAt = now.slice(0, 10);
  }
  store.markSourcesDirty();
  store.setRun(`${store.sources.length} sources checked, ${changed} changed, ${problems} now blocking a crawl source`, problems === 0);
  store.commit();
  log.info("done", { changed, problems });
}
