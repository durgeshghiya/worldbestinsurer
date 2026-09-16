/**
 * Display helpers for registry data. Wording here is deliberate: official
 * data and WorldBestInsurer's own analysis must never be confused, and a
 * missing fact is stated as missing rather than filled in.
 */

import type {
  Category,
} from "../types";
import type {
  InsuranceSegment,
  InsurerType,
  ProductType,
  Provenance,
  RegistryStatistic,
  Source,
} from "./types";

export const NOT_AVAILABLE = "Not available in the current public data.";

export const INSURER_TYPE_LABEL: Record<InsurerType, string> = {
  life: "Life insurer",
  general: "General insurer",
  "standalone-health": "Standalone health insurer",
  reinsurer: "Reinsurer",
  specialised: "Specialised insurer",
};

export const SEGMENT_LABEL: Record<InsuranceSegment, string> = {
  life: "Life",
  health: "Health",
  motor: "Motor",
  travel: "Travel",
  home: "Home",
  commercial: "Commercial",
  "personal-accident": "Personal accident",
  crop: "Crop",
  other: "Other",
};

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  term: "Term life",
  endowment: "Endowment",
  "whole-life": "Whole life",
  "money-back": "Money-back",
  ulip: "Unit-linked (ULIP)",
  pension: "Pension / annuity",
  savings: "Savings",
  "health-indemnity": "Health — indemnity",
  "health-fixed-benefit": "Health — fixed benefit",
  "critical-illness": "Critical illness",
  "personal-accident": "Personal accident",
  "motor-private-car": "Motor — private car",
  "motor-two-wheeler": "Motor — two-wheeler",
  "motor-commercial": "Motor — commercial vehicle",
  travel: "Travel",
  home: "Home",
  commercial: "Commercial",
  other: "Other",
};

/** The site's comparison hub a registry product belongs to, if any. */
export function siteCategoryFor(t: ProductType): Category | null {
  if (t === "term") return "term-life";
  if (t === "health-indemnity" || t === "health-fixed-benefit" || t === "critical-illness") return "health";
  if (t.startsWith("motor-")) return "motor";
  if (t === "travel") return "travel";
  return null;
}

export function siteCategoryForSegment(s: InsuranceSegment): Category | null {
  if (s === "life") return "term-life";
  if (s === "health" || s === "motor" || s === "travel") return s;
  return null;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

/** "2026-09-16" → "16 September 2026". Timezone-safe for date-only strings. */
export function formatDate(iso: string | undefined): string {
  if (!iso) return NOT_AVAILABLE;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** "FY2025-26" → "FY 2025–26". */
export function formatPeriod(p: string): string {
  return p.replace(/^FY\s?(\d{4})-(\d{2,4})$/, (_, a, b) => `FY ${a}–${b.slice(-2)}`);
}

export function formatStatValue(s: Pick<RegistryStatistic, "value" | "unit">): string {
  const n = s.value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  if (s.unit === "%") return `${n}%`;
  if (s.unit === "x") return `${n}×`;
  if (s.unit === "count") return n;
  return `${n} ${s.unit}`;
}

/** Latest of a set of ISO timestamps — used for "Last updated". */
export function latest(dates: (string | undefined)[]): string | undefined {
  return dates.filter(Boolean).sort().at(-1);
}

/** "Source: HDFC ERGO official website" — the public attribution line. */
export function attribution(p: Provenance, sources: Map<string, Source>): { label: string; href: string } {
  const src = sources.get(p.sourceId);
  return { label: src?.name ?? p.sourceId, href: p.url };
}
