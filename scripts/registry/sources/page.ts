/**
 * Load a source page for verification — from the web for crawlable sources,
 * or from the manual inbox for sources that forbid automated access.
 *
 * The access method is enforced here: a `manual` source is never fetched,
 * even if someone points a candidate at its URL.
 */

import fs from "fs";
import path from "path";
import type { Source } from "../../../src/lib/registry/types";
import { politeFetch } from "../lib/http";
import { extractPage, extractPlain, type PageText } from "../lib/text";

export const INBOX_DIR = path.join(process.cwd(), "scripts/registry/inbox");
export const INBOX_FILES_DIR = path.join(INBOX_DIR, "files");

export type Loaded =
  | { ok: true; page: PageText; url: string; retrievedAt: string; manual: boolean }
  | { ok: false; reason: string };

const cache = new Map<string, Loaded>();

export async function loadSourcePage(source: Source, url: string, localFile?: string): Promise<Loaded> {
  const key = `${source.id}|${url}|${localFile ?? ""}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const result = await load(source, url, localFile);
  cache.set(key, result);
  return result;
}

async function load(source: Source, url: string, localFile?: string): Promise<Loaded> {
  if (localFile) {
    const p = path.resolve(INBOX_FILES_DIR, localFile);
    if (!p.startsWith(INBOX_FILES_DIR + path.sep)) return { ok: false, reason: "localFile escapes the inbox" };
    if (!fs.existsSync(p)) return { ok: false, reason: `local file not found: ${localFile}` };
    const raw = fs.readFileSync(p, "utf-8");
    const page = /\.html?$/i.test(p) ? extractPage(raw, url) : extractPlain(raw);
    return { ok: true, page, url, retrievedAt: fs.statSync(p).mtime.toISOString(), manual: true };
  }

  if (source.accessMethod !== "crawl") {
    return {
      ok: false,
      reason: `${source.id} is a ${source.accessMethod} source — supply a localFile downloaded by a person (robots: ${source.robots})`,
    };
  }

  const res = await politeFetch(url);
  if (!res.ok) return { ok: false, reason: `${res.reason}: ${res.detail}` };
  if (!res.contentType.includes("html")) {
    return { ok: false, reason: `expected an HTML page, got ${res.contentType || "unknown"} (export PDFs to text and use localFile)` };
  }
  return {
    ok: true,
    page: extractPage(res.body.toString("utf-8"), res.url),
    url: res.url,
    retrievedAt: res.fetchedAt,
    manual: false,
  };
}
