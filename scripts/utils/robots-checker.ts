/**
 * robots.txt Compliance Checker
 *
 * Fetches and parses robots.txt files, caching them per domain for 24 hours.
 *
 * Availability policy (changed 16 Sep 2026 — this used to fail open, which
 * meant a site answering 403 to our bot was crawled anyway):
 *
 *   200               parse and apply the rules
 *   404, 410          no robots.txt → everything allowed (RFC 9309 §2.3.1.3)
 *   401, 403, 429     the site is actively refusing us → nothing allowed.
 *                     Stricter than the RFC on purpose: a bot-protection 403
 *                     is a technical protection and we do not work around it.
 *   5xx, network err  unreachable → nothing allowed (RFC 9309 §2.3.1.4)
 */

interface RobotsCacheEntry {
  rules: RobotsRule[];
  fetchedAt: number;
}

interface RobotsRule {
  userAgent: string;
  disallowPaths: string[];
  allowPaths: string[];
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const DISALLOW_ALL: RobotsRule[] = [
  { userAgent: "*", disallowPaths: ["/"], allowPaths: [] },
];

const robotsCache = new Map<string, RobotsCacheEntry>();

/**
 * Parse a robots.txt body into groups (RFC 9309 §2.1).
 *
 * Consecutive user-agent lines form one group and share its rules, so
 * "User-agent: a / User-agent: b / Disallow: /" applies to both a and b.
 * One RobotsRule is emitted per user-agent, each holding the group's rules.
 */
function parseRobotsTxt(body: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let group: RobotsRule[] = [];
  let lastWasAgent = false;

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const directive = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (directive === "user-agent") {
      if (!lastWasAgent) group = []; // a new group starts
      const rule: RobotsRule = { userAgent: value.toLowerCase(), disallowPaths: [], allowPaths: [] };
      group.push(rule);
      rules.push(rule);
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!group.length || !value) continue;
    if (directive === "disallow") for (const r of group) r.disallowPaths.push(value);
    else if (directive === "allow") for (const r of group) r.allowPaths.push(value);
  }
  return rules;
}

/**
 * Check if a URL path matches a robots.txt pattern.
 * Supports * wildcard and $ end-of-string anchor.
 */
function pathMatches(pattern: string, urlPath: string): boolean {
  // Convert robots.txt pattern to regex
  let regexStr = "^";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "*") {
      regexStr += ".*";
    } else if (ch === "$" && i === pattern.length - 1) {
      regexStr += "$";
    } else {
      // Escape regex special chars
      regexStr += ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }

  try {
    return new RegExp(regexStr).test(urlPath);
  } catch {
    // If regex fails, do simple prefix match
    return urlPath.startsWith(pattern);
  }
}

/**
 * Find the rules that apply to a crawler (RFC 9309 §2.2.1).
 *
 * Matching is on the crawler's product token ("wbibot"), case-insensitively —
 * never a substring of the full user-agent string, which previously let a
 * group for a bot named "es" match "research". If several groups name the
 * token (or, failing that, "*"), their rules are combined.
 */
function findMatchingRules(rules: RobotsRule[], userAgent: string): RobotsRule | null {
  const token = userAgent.trim().split(/[\/\s]/)[0].toLowerCase();
  const pick = (pred: (r: RobotsRule) => boolean): RobotsRule | null => {
    const matched = rules.filter(pred);
    if (!matched.length) return null;
    return {
      userAgent: matched[0].userAgent,
      disallowPaths: matched.flatMap((r) => r.disallowPaths),
      allowPaths: matched.flatMap((r) => r.allowPaths),
    };
  };
  return pick((r) => r.userAgent === token) ?? pick((r) => r.userAgent === "*");
}

/**
 * Fetch robots.txt for a domain and cache the result.
 */
async function fetchRobotsTxt(domain: string): Promise<RobotsRule[]> {
  // Check cache
  const cached = robotsCache.get(domain);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.rules;
  }

  try {
    const robotsUrl = `https://${domain}/robots.txt`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(robotsUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "WBIBot/1.0 (Insurance comparison research; contact@worldbestinsurer.com)",
      },
    });

    clearTimeout(timeout);

    if (response.status === 404 || response.status === 410) {
      // No robots.txt at all: everything is allowed.
      robotsCache.set(domain, { rules: [], fetchedAt: Date.now() });
      return [];
    }
    if (!response.ok) {
      // 401/403/429 (refused) or 5xx (unreachable): treat as disallow-all.
      robotsCache.set(domain, { rules: DISALLOW_ALL, fetchedAt: Date.now() });
      return DISALLOW_ALL;
    }

    const body = await response.text();
    const rules = parseRobotsTxt(body);

    robotsCache.set(domain, { rules, fetchedAt: Date.now() });
    return rules;
  } catch {
    // Unreachable: treat as disallow-all rather than crawling blind.
    robotsCache.set(domain, { rules: DISALLOW_ALL, fetchedAt: Date.now() });
    return DISALLOW_ALL;
  }
}

/**
 * Check if a URL is allowed by the target domain's robots.txt.
 *
 * @param url - The full URL to check
 * @param userAgent - The user agent string to check against
 * @returns true if the URL is allowed, false if disallowed
 */
export async function checkRobots(url: string, userAgent: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname;
    const urlPath = parsed.pathname + parsed.search;

    const rules = await fetchRobotsTxt(domain);

    if (rules.length === 0) {
      // No rules means everything is allowed
      return true;
    }

    const matchingRule = findMatchingRules(rules, userAgent);

    if (!matchingRule) {
      // No matching user-agent block means allowed
      return true;
    }

    // Check Allow rules first (more specific takes priority)
    // Then check Disallow rules
    // Longer (more specific) patterns take precedence

    // Gather all matching allow and disallow patterns
    let longestAllow = -1;
    let longestDisallow = -1;

    for (const pattern of matchingRule.allowPaths) {
      if (pathMatches(pattern, urlPath)) {
        longestAllow = Math.max(longestAllow, pattern.length);
      }
    }

    for (const pattern of matchingRule.disallowPaths) {
      if (pathMatches(pattern, urlPath)) {
        longestDisallow = Math.max(longestDisallow, pattern.length);
      }
    }

    // If both match, the longer (more specific) pattern wins
    if (longestAllow >= 0 && longestAllow >= longestDisallow) {
      return true;
    }

    if (longestDisallow >= 0) {
      return false;
    }

    // No matching patterns means allowed
    return true;
  } catch {
    // An unparseable URL is not something we should be fetching.
    return false;
  }
}

/**
 * Clear the robots.txt cache (useful for testing).
 */
export function clearRobotsCache(): void {
  robotsCache.clear();
}
