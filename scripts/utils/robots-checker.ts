/**
 * robots.txt Compliance Checker
 *
 * Fetches and parses robots.txt files, caching them per domain for 24 hours.
 * Returns true (allowed) if the robots.txt cannot be fetched or parsed.
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

const robotsCache = new Map<string, RobotsCacheEntry>();

/**
 * Parse a robots.txt body into structured rules.
 */
function parseRobotsTxt(body: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let currentRule: RobotsRule | null = null;

  const lines = body.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith("#")) {
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const directive = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (directive === "user-agent") {
      // Start a new rule block
      currentRule = {
        userAgent: value.toLowerCase(),
        disallowPaths: [],
        allowPaths: [],
      };
      rules.push(currentRule);
    } else if (directive === "disallow" && currentRule && value) {
      currentRule.disallowPaths.push(value);
    } else if (directive === "allow" && currentRule && value) {
      currentRule.allowPaths.push(value);
    }
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
 * Find the most specific matching rule for a user agent.
 * Priority: exact match > * (wildcard) > no match.
 */
function findMatchingRules(rules: RobotsRule[], userAgent: string): RobotsRule | null {
  const ua = userAgent.toLowerCase();

  // First look for a specific match (check if any user-agent matches our bot name)
  let specificMatch: RobotsRule | null = null;
  let wildcardMatch: RobotsRule | null = null;

  for (const rule of rules) {
    if (rule.userAgent === "*") {
      wildcardMatch = wildcardMatch || rule;
    } else if (ua.includes(rule.userAgent) || rule.userAgent.includes(ua.split("/")[0].toLowerCase())) {
      specificMatch = rule;
    }
  }

  return specificMatch || wildcardMatch || null;
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
        "User-Agent": "WBIBot/1.0",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // If robots.txt doesn't exist or is inaccessible, allow everything
      robotsCache.set(domain, { rules: [], fetchedAt: Date.now() });
      return [];
    }

    const body = await response.text();
    const rules = parseRobotsTxt(body);

    robotsCache.set(domain, { rules, fetchedAt: Date.now() });
    return rules;
  } catch {
    // On any error, allow everything (be permissive)
    robotsCache.set(domain, { rules: [], fetchedAt: Date.now() });
    return [];
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
    // If we can't parse the URL, allow by default
    return true;
  }
}

/**
 * Clear the robots.txt cache (useful for testing).
 */
export function clearRobotsCache(): void {
  robotsCache.clear();
}
