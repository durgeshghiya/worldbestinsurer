/**
 * Compliant HTTP for the registry pipeline.
 *
 *  - robots.txt is checked on every hop, including redirects to another host
 *    (strict policy: 401/403/429/5xx on robots.txt means "do not fetch")
 *  - an honest user agent, a per-host delay, a timeout and bounded retries
 *  - no cookies, no headless browser, no CAPTCHA handling, no auth
 *
 * Anything this refuses to fetch is reported as blocked — never worked around.
 */

import { createHash } from "crypto";
import { checkRobots } from "../../utils/robots-checker";

export const USER_AGENT =
  "WBIBot/1.0 (Insurance comparison research; +https://worldbestinsurer.com/methodology/; contact@worldbestinsurer.com)";

const PER_HOST_DELAY_MS = 2000;
const TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 5;
const MAX_BYTES = 25 * 1024 * 1024;

const lastHit = new Map<string, number>();

async function politeWait(host: string): Promise<void> {
  const prev = lastHit.get(host) ?? 0;
  const wait = prev + PER_HOST_DELAY_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastHit.set(host, Date.now());
}

export type FetchOutcome =
  | {
      ok: true;
      url: string; // final URL after redirects
      status: number;
      contentType: string;
      body: Buffer;
      sha256: string;
      fetchedAt: string;
    }
  | {
      ok: false;
      url: string;
      reason: "robots" | "http" | "network" | "too-large" | "redirect-loop" | "not-https";
      status?: number;
      detail: string;
    };

export async function politeFetch(
  url: string,
  opts: { method?: "GET" | "HEAD"; accept?: string } = {}
): Promise<FetchOutcome> {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      return { ok: false, url: current, reason: "network", detail: "unparseable URL" };
    }
    if (parsed.protocol !== "https:") {
      return { ok: false, url: current, reason: "not-https", detail: "only https sources are accepted" };
    }
    if (!(await checkRobots(current, USER_AGENT))) {
      return { ok: false, url: current, reason: "robots", detail: `robots.txt disallows ${parsed.host}${parsed.pathname}` };
    }
    await politeWait(parsed.host);

    let res: Response;
    let attempt = 0;
    for (;;) {
      try {
        res = await fetch(current, {
          method: opts.method ?? "GET",
          redirect: "manual",
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: {
            "User-Agent": USER_AGENT,
            Accept: opts.accept ?? "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8",
          },
        });
      } catch (e) {
        if (attempt++ < 2) {
          await new Promise((r) => setTimeout(r, 5000 * attempt));
          continue;
        }
        return { ok: false, url: current, reason: "network", detail: String(e) };
      }
      if (res.status >= 500 && attempt++ < 2) {
        await new Promise((r) => setTimeout(r, 5000 * attempt));
        continue;
      }
      break;
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { ok: false, url: current, reason: "http", status: res.status, detail: "redirect without Location" };
      current = new URL(loc, current).toString();
      continue; // robots is re-checked for the new URL on the next hop
    }
    if (!res.ok) {
      // 401/403/429 are protections. They are recorded, not retried or evaded.
      return { ok: false, url: current, reason: "http", status: res.status, detail: `HTTP ${res.status}` };
    }

    const len = Number(res.headers.get("content-length") ?? 0);
    if (len > MAX_BYTES) return { ok: false, url: current, reason: "too-large", status: res.status, detail: `${len} bytes` };
    const body = opts.method === "HEAD" ? Buffer.alloc(0) : Buffer.from(await res.arrayBuffer());
    if (body.length > MAX_BYTES) return { ok: false, url: current, reason: "too-large", status: res.status, detail: `${body.length} bytes` };

    return {
      ok: true,
      url: current,
      status: res.status,
      contentType: (res.headers.get("content-type") ?? "").toLowerCase(),
      body,
      sha256: createHash("sha256").update(body).digest("hex"),
      fetchedAt: new Date().toISOString(),
    };
  }
  return { ok: false, url, reason: "redirect-loop", detail: `more than ${MAX_REDIRECTS} redirects` };
}
