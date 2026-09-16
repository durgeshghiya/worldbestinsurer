/**
 * Evidence verification — the anti-fabrication gate.
 *
 * A fact is accepted only if:
 *   1. its evidence text appears on the source page we fetched ourselves, and
 *   2. its value appears inside that evidence, and
 *   3. short identifiers carry a label ("Regn. No.", "UIN") in the evidence,
 *      so "512" cannot be matched against any stray number on a page.
 *
 * Numbers are matched in the notations Indian documents actually use:
 * 1234567.5 → "1234567.5", "12,34,567.5", "1,234,567.5".
 */

import { baseDomain } from "../../../src/lib/registry/validate";
import { norm, type PageText } from "../lib/text";
import type { Fact } from "../sources/candidate";

export const MAX_EVIDENCE_CHARS = 400;

const LABELS: Record<string, RegExp> = {
  irdaiRegistrationNumber: /\b(regn|registration|reg\.?)\b/i,
  uin: /\b(uin|unique identification)\b/i,
  cin: /\b(cin|corporate identity)\b/i,
};

/**
 * Insurer type is a classification, so its value ("standalone-health") is not
 * printed verbatim. The evidence must instead contain the word that the
 * insurer's own name or licence uses for that class.
 */
const TYPE_KEYWORDS: Record<string, RegExp> = {
  life: /\blife\b/i,
  general: /\bgeneral\b/i,
  "standalone-health": /\bhealth\b/i,
  reinsurer: /\bre-?insurance\b/i,
  specialised: /\b(agriculture|export credit|credit guarantee)\b/i,
};

export interface VerifyContext {
  /** Final URL of the page the evidence is checked against. */
  pageUrl: string;
  /** The source's registered homepage (sources.json). */
  sourceHomepage: string;
}

export interface EvidenceResult {
  ok: boolean;
  location?: "visible" | "embedded";
  reason?: string;
}

function indianGrouping(intPart: string): string {
  if (intPart.length <= 3) return intPart;
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
}

export function numberVariants(n: number): string[] {
  const out = new Set<string>();
  for (const digits of [0, 1, 2]) {
    const fixed = n.toFixed(digits);
    if (Number(fixed) !== n) continue; // never round a value into a match
    const [i, f] = fixed.split(".");
    const tail = f ? `.${f}` : "";
    out.add(`${i}${tail}`);
    out.add(`${indianGrouping(i)}${tail}`);
    out.add(`${i.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${tail}`);
  }
  return [...out];
}

export function verifyFact(
  field: string,
  fact: Fact<string | number>,
  page: PageText,
  ctx: VerifyContext
): EvidenceResult {
  // An official website is proven by provenance, not by page text: it must be
  // the domain the source is registered under, and the domain we fetched.
  if (field === "website") {
    try {
      const d = baseDomain(String(fact.value));
      if (d !== baseDomain(ctx.sourceHomepage))
        return { ok: false, reason: `website ${d} is not the registered domain of this source (${baseDomain(ctx.sourceHomepage)})` };
      if (d !== baseDomain(ctx.pageUrl))
        return { ok: false, reason: `website ${d} does not match the page it was read from (${baseDomain(ctx.pageUrl)})` };
      return { ok: true, location: "visible" };
    } catch {
      return { ok: false, reason: "website is not a valid URL" };
    }
  }

  const ev = fact.evidence ?? "";
  if (!ev.trim()) return { ok: false, reason: "empty evidence" };
  if (ev.length > MAX_EVIDENCE_CHARS)
    return { ok: false, reason: `evidence is ${ev.length} chars; quote the relevant passage only (≤ ${MAX_EVIDENCE_CHARS})` };

  const nev = norm(ev);

  if (field === "insurerType") {
    const kw = TYPE_KEYWORDS[String(fact.value)];
    if (!kw) return { ok: false, reason: `unknown insurer type "${fact.value}"` };
    if (!kw.test(ev)) return { ok: false, reason: `evidence does not support insurer type "${fact.value}"` };
    const n = normalised(page);
    if (n.visible.includes(nev)) return { ok: true, location: "visible" };
    if (n.embedded.includes(nev)) return { ok: true, location: "embedded" };
    return { ok: false, reason: "evidence text was not found on the source page" };
  }

  const valueStrings =
    typeof fact.value === "number" ? numberVariants(fact.value) : [String(fact.value)];
  if (!valueStrings.some((v) => nev.includes(norm(v)))) {
    return { ok: false, reason: `value "${fact.value}" does not appear inside its evidence` };
  }

  const label = LABELS[field];
  const shortValue = String(fact.value).length <= 4;
  if (label && (shortValue || field === "uin") && !label.test(ev)) {
    return { ok: false, reason: `evidence for ${field} must include its label (e.g. "Regn. No.", "UIN")` };
  }

  const n = normalised(page);
  if (n.visible.includes(nev)) return { ok: true, location: "visible" };
  if (n.embedded && n.embedded.includes(nev)) return { ok: true, location: "embedded" };
  return { ok: false, reason: "evidence text was not found on the source page" };
}

const normCache = new WeakMap<PageText, { visible: string; embedded: string }>();

function normalised(page: PageText): { visible: string; embedded: string } {
  let n = normCache.get(page);
  if (!n) {
    n = { visible: norm(page.visible), embedded: page.embedded ? norm(page.embedded) : "" };
    normCache.set(page, n);
  }
  return n;
}
