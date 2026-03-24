import { clsx, type ClassValue } from "clsx";
import { getCountryByCode } from "./countries";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ---------- Multi-currency formatting ----------

interface CurrencyConfig {
  symbol: string;
  locale: string;
  code: string;
  /** Use Indian lakh/crore notation */
  indian: boolean;
  /** Compact suffixes – [thousand, million/lakh, billion/crore] */
  compactLabels: [string, string, string];
  compactThresholds: [number, number, number];
}

function getCurrencyConfig(countryCode: string): CurrencyConfig {
  const country = getCountryByCode(countryCode);
  if (!country) {
    // Fallback to India for backward compat
    return {
      symbol: "\u20B9",
      locale: "en-IN",
      code: "INR",
      indian: true,
      compactLabels: ["K", "L", "Cr"],
      compactThresholds: [1000, 100000, 10000000],
    };
  }

  const isIndian = countryCode === "in";
  const usesLakhCrore = isIndian;

  return {
    symbol: country.currency.symbol,
    locale: country.locale,
    code: country.currency.code,
    indian: usesLakhCrore,
    compactLabels: usesLakhCrore ? ["K", "L", "Cr"] : ["K", "M", "B"],
    compactThresholds: usesLakhCrore
      ? [1000, 100000, 10000000]
      : [1000, 1000000, 1000000000],
  };
}

/**
 * Format an amount in the appropriate currency for a given country.
 * Compact form: "in" -> ₹5L, ₹10K, ₹1.5Cr; "us" -> $50K, $100K, $1M; etc.
 * Defaults to "in" for backward compatibility.
 */
export function formatCurrency(
  amount: number | null,
  countryCode: string = "in"
): string {
  if (amount === null) return "N/A";
  const cfg = getCurrencyConfig(countryCode);
  const [kT, mT, bT] = cfg.compactThresholds;
  const [kL, mL, bL] = cfg.compactLabels;

  if (amount >= bT) {
    const v = amount / bT;
    return `${cfg.symbol}${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}${bL}`;
  }
  if (amount >= mT) {
    const v = amount / mT;
    return `${cfg.symbol}${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}${mL}`;
  }
  if (amount >= kT) {
    const v = amount / kT;
    return `${cfg.symbol}${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}${kL}`;
  }
  return `${cfg.symbol}${amount}`;
}

/**
 * Format an amount in compact notation with currency symbol.
 * Same as formatCurrency but accepts undefined and defaults to "in".
 */
export function formatCompact(
  amount: number | null | undefined,
  countryCode: string = "in"
): string {
  if (amount == null) return "N/A";
  return formatCurrency(amount, countryCode);
}

/**
 * Format a full (non-compact) currency string using Intl.NumberFormat.
 * "in" -> ₹12,34,567  "us" -> $1,234,567
 */
export function formatCurrencyFull(
  amount: number | null,
  countryCode: string = "in"
): string {
  if (amount === null) return "N/A";
  const cfg = getCurrencyConfig(countryCode);
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---------- Legacy INR helpers (kept for backward compat) ----------

export function formatINR(amount: number | null | undefined): string {
  if (amount == null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---------- General utilities ----------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function freshnessLabel(dateStr: string): {
  label: string;
  color: "green" | "amber" | "red";
} {
  const days = daysSince(dateStr);
  if (days <= 30) return { label: "Fresh", color: "green" };
  if (days <= 90) return { label: "Recent", color: "amber" };
  return { label: "Needs review", color: "red" };
}
