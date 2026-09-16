/**
 * Shared plumbing for /api/v1/registry/* — auth, pagination, validation,
 * caching headers and request logging. (`_lib` is a private folder: Next.js
 * does not route it.)
 *
 * Caching: the registry changes only on deploy and is held in memory once per
 * server instance. Responses are `private` because they are key-gated — a
 * shared CDN cache would hand a keyed response to an unauthenticated caller.
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";
import { registry, siteFacts, type LoadedRegistry, type SiteFacts } from "@/lib/registry";

export const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 25;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export interface Ctx<P = Record<string, never>> {
  req: NextRequest;
  reg: LoadedRegistry;
  site: SiteFacts;
  q: URLSearchParams;
  params: P;
}

export function page<T>(items: T[], q: URLSearchParams) {
  const pageNum = int(q.get("page"), 1, "page", 1, 10_000);
  const size = int(q.get("pageSize"), DEFAULT_PAGE_SIZE, "pageSize", 1, MAX_PAGE_SIZE);
  const start = (pageNum - 1) * size;
  return {
    total: items.length,
    page: pageNum,
    pageSize: size,
    pages: Math.max(1, Math.ceil(items.length / size)),
    items: items.slice(start, start + size),
  };
}

function int(raw: string | null, fallback: number, name: string, min: number, max: number): number {
  if (raw === null || raw === "") return fallback;
  if (!/^\d+$/.test(raw)) throw new ApiError(400, `${name} must be a positive integer`);
  const n = Number(raw);
  if (n < min || n > max) throw new ApiError(400, `${name} must be between ${min} and ${max}`);
  return n;
}

/** Validate an enum-like filter against the allowed values. */
export function oneOf<T extends string>(q: URLSearchParams, name: string, allowed: readonly T[]): T | undefined {
  const v = q.get(name);
  if (v === null || v === "") return undefined;
  if (!(allowed as readonly string[]).includes(v))
    throw new ApiError(400, `${name} must be one of: ${allowed.join(", ")}`);
  return v as T;
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export function slugParam(v: string): string {
  if (!SLUG.test(v) || v.length > 120) throw new ApiError(400, "invalid slug");
  return v;
}

export const pagePath = {
  insurer: (slug: string) => `https://worldbestinsurer.com/in/insurer/${slug}/`,
  product: (slug: string, siteId?: string) => `https://worldbestinsurer.com/in/product/${siteId ?? slug}/`,
};

/** Wrap a handler with auth, error handling, headers and a log line. */
export function handler<P = Record<string, never>>(fn: (ctx: Ctx<P>) => unknown) {
  return async (req: NextRequest, context?: { params: Promise<P> }): Promise<NextResponse> => {
    const started = Date.now();
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      log(req, auth.status ?? 401, started);
      return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });
    }
    try {
      const params = (context ? await context.params : {}) as P;
      const body = await fn({ req, reg: registry(), site: siteFacts(), q: req.nextUrl.searchParams, params });
      log(req, 200, started, auth.apiKey?.name);
      return NextResponse.json(
        { data: body, meta: { jurisdiction: "in", schemaVersion: registry().meta.schemaVersion, disclaimer: DISCLAIMER } },
        { headers: { "Cache-Control": "private, max-age=300", "X-Robots-Tag": "noindex" } }
      );
    } catch (e) {
      const status = e instanceof ApiError ? e.status : 500;
      log(req, status, started, auth.apiKey?.name, e instanceof Error ? e.message : String(e));
      return NextResponse.json(
        { error: e instanceof ApiError ? e.message : "internal error" },
        { status, headers: { "X-Robots-Tag": "noindex" } }
      );
    }
  };
}

const DISCLAIMER =
  "Compiled by WorldBestInsurer from the public sources cited on each record. " +
  "Not affiliated with IRDAI, the Government of India, or any insurer.";

function log(req: NextRequest, status: number, started: number, key?: string, error?: string) {
  console.log(
    JSON.stringify({
      at: new Date().toISOString(),
      api: "registry",
      path: req.nextUrl.pathname,
      query: req.nextUrl.search.replace(/apiKey=[^&]*/g, "apiKey=***"),
      status,
      ms: Date.now() - started,
      key,
      error,
    })
  );
}
