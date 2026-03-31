/**
 * India Insurance Market Insights — data computation module.
 * All functions derive statistics from existing product/insurer JSON data at build time.
 */

import {
  getAllProducts,
  getAllInsurers,
  getProductsByCategory,
  getProductsByInsurer,
  getCategoryLastUpdated,
} from "./data";
import type { InsuranceProduct, Insurer, Category } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MarketOverview {
  totalProducts: number;
  totalInsurers: number;
  totalCategories: number;
  totalCities: number;
  totalStates: number;
}

export interface MarketStat {
  label: string;
  value: string;
  note: string;
  icon: string;
}

export interface CSRBucket {
  range: string;
  count: number;
  color: string;
}

export interface InsurerCSR {
  slug: string;
  shortName: string;
  csr: number;
  year: string;
  type: string;
  productCount: number;
}

export interface CategoryInsight {
  slug: Category;
  name: string;
  productCount: number;
  insurerCount: number;
  premiumMin: number;
  premiumMax: number;
  sumInsuredMin: number | null;
  sumInsuredMax: number | null;
  avgCSR: number | null;
  subCategories: string[];
  lastUpdated: string;
}

export interface InsurerRow {
  slug: string;
  shortName: string;
  name: string;
  type: string;
  headquarters: string;
  established: number;
  listed: boolean;
  csr: number;
  csrYear: string;
  productCount: number;
  networkHospitals: number | null;
  categories: Category[];
}

export interface PremiumRangeData {
  category: Category;
  name: string;
  min: number;
  max: number;
  median: number;
  color: string;
}

export interface CoverageDistribution {
  bucket: string;
  count: number;
  min: number;
  max: number;
}

export interface StateData {
  state: string;
  cityCount: number;
}

export interface TierData {
  tier: number;
  label: string;
  count: number;
}

export interface HQData {
  city: string;
  count: number;
}

export interface FreshnessData {
  category: Category;
  name: string;
  lastUpdated: string;
  color: string;
}

export interface InsightsData {
  overview: MarketOverview;
  marketStats: MarketStat[];
  insurerCSRs: InsurerCSR[];
  csrBuckets: CSRBucket[];
  categoryAvgCSRs: { category: string; avgCSR: number; color: string }[];
  categoryInsights: CategoryInsight[];
  insurerRows: InsurerRow[];
  premiumRanges: PremiumRangeData[];
  coverageDistribution: CoverageDistribution[];
  stateData: StateData[];
  tierData: TierData[];
  hqData: HQData[];
  freshness: FreshnessData[];
  overallConfidence: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORY_NAMES: Record<Category, string> = {
  health: "Health Insurance",
  "term-life": "Term Life Insurance",
  motor: "Motor Insurance",
  travel: "Travel Insurance",
};

const CATEGORY_COLORS: Record<Category, string> = {
  health: "#c44058",
  "term-life": "#2d3a8c",
  motor: "#2d8f6f",
  travel: "#c47d2e",
};

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// ---------------------------------------------------------------------------
// Main computation
// ---------------------------------------------------------------------------

export function computeInsights(): InsightsData {
  const products = getAllProducts("in");
  const insurers = getAllInsurers("in");

  // Load cities
  let cities: { slug: string; name: string; state: string; tier: number }[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const citiesData = require("@/data/in/cities.json");
    cities = citiesData.cities ?? citiesData ?? [];
  } catch {
    // no cities data
  }

  // ── Overview ──
  const allStates = unique(cities.map((c) => c.state));
  const overview: MarketOverview = {
    totalProducts: products.length,
    totalInsurers: insurers.length,
    totalCategories: 4,
    totalCities: cities.length,
    totalStates: allStates.length,
  };

  // ── Market stats ──
  const csrValues = insurers.map((i) => i.claimSettlementRatio?.value).filter((v): v is number => v != null && v > 0);
  const avgCSR = csrValues.length > 0 ? avg(csrValues) : 0;

  const networkCounts = products.filter((p) => p.networkHospitals?.count).map((p) => p.networkHospitals!.count);
  const maxNetwork = networkCounts.length > 0 ? Math.max(...networkCounts) : 0;

  const allPremiumMins = products.map((p) => p.premiumRange.illustrativeMin).filter((v) => v > 0);
  const allPremiumMaxs = products.map((p) => p.premiumRange.illustrativeMax).filter((v) => v > 0);
  const globalPremiumMin = allPremiumMins.length > 0 ? Math.min(...allPremiumMins) : 0;
  const globalPremiumMax = allPremiumMaxs.length > 0 ? Math.max(...allPremiumMaxs) : 0;

  const sumInsuredMaxes = products.map((p) => p.sumInsured.max).filter((v): v is number => v != null && v > 0);
  const maxSumInsured = sumInsuredMaxes.length > 0 ? Math.max(...sumInsuredMaxes) : 0;

  const oldestInsurer = insurers.reduce((oldest, i) => (i.established < oldest.established ? i : oldest), insurers[0]);
  const listedCount = insurers.filter((i) => i.listed).length;

  const marketStats: MarketStat[] = [
    { label: "Avg. Claim Settlement Ratio", value: `${avgCSR.toFixed(1)}%`, note: "Across all insurers", icon: "TrendingUp" },
    { label: "Max Network Hospitals", value: maxNetwork.toLocaleString(), note: "Health insurance", icon: "Building2" },
    { label: "Premium Range", value: `₹${globalPremiumMin.toLocaleString()} – ₹${globalPremiumMax.toLocaleString()}`, note: "Illustrative, all categories", icon: "IndianRupee" },
    { label: "Max Sum Insured", value: `₹${(maxSumInsured / 10000000).toFixed(0)} Cr`, note: "Highest coverage available", icon: "Shield" },
    { label: "Oldest Insurer", value: `${oldestInsurer?.shortName ?? "N/A"}`, note: `Est. ${oldestInsurer?.established ?? "N/A"}`, icon: "Landmark" },
    { label: "Listed Insurers", value: `${listedCount} of ${insurers.length}`, note: "BSE / NSE listed", icon: "BarChart3" },
  ];

  // ── CSR Analysis ──
  const insurerCSRs: InsurerCSR[] = insurers
    .filter((i) => i.claimSettlementRatio?.value > 0)
    .map((i) => ({
      slug: i.slug,
      shortName: i.shortName,
      csr: i.claimSettlementRatio.value,
      year: i.claimSettlementRatio.year,
      type: i.type,
      productCount: getProductsByInsurer(i.slug, "in").length,
    }))
    .sort((a, b) => b.csr - a.csr);

  const csrBuckets: CSRBucket[] = [
    { range: "90%+", count: insurerCSRs.filter((i) => i.csr >= 90).length, color: "#2d3a8c" },
    { range: "80–90%", count: insurerCSRs.filter((i) => i.csr >= 80 && i.csr < 90).length, color: "#2d8f6f" },
    { range: "70–80%", count: insurerCSRs.filter((i) => i.csr >= 70 && i.csr < 80).length, color: "#c47d2e" },
    { range: "<70%", count: insurerCSRs.filter((i) => i.csr < 70).length, color: "#c44058" },
  ];

  // Category avg CSR (from product-level data)
  const cats: Category[] = ["health", "term-life", "motor", "travel"];
  const categoryAvgCSRs = cats.map((cat) => {
    const catProducts = getProductsByCategory(cat, "in");
    const ratios = catProducts.map((p) => p.claimSettlement?.ratio).filter((v): v is number => v != null && v > 0);
    return {
      category: CATEGORY_NAMES[cat],
      avgCSR: ratios.length > 0 ? Math.round(avg(ratios) * 10) / 10 : 0,
      color: CATEGORY_COLORS[cat],
    };
  });

  // ── Category Insights ──
  const categoryInsights: CategoryInsight[] = cats.map((cat) => {
    const catProducts = getProductsByCategory(cat, "in");
    const premMins = catProducts.map((p) => p.premiumRange.illustrativeMin).filter((v) => v > 0);
    const premMaxs = catProducts.map((p) => p.premiumRange.illustrativeMax).filter((v) => v > 0);
    const siMins = catProducts.map((p) => p.sumInsured.min).filter((v): v is number => v != null);
    const siMaxs = catProducts.map((p) => p.sumInsured.max).filter((v): v is number => v != null);
    const csrs = catProducts.map((p) => p.claimSettlement?.ratio).filter((v): v is number => v != null && v > 0);
    const subs = unique(catProducts.map((p) => p.subCategory).filter(Boolean));
    const uniqueInsurers = unique(catProducts.map((p) => p.insurerSlug));

    return {
      slug: cat,
      name: CATEGORY_NAMES[cat],
      productCount: catProducts.length,
      insurerCount: uniqueInsurers.length,
      premiumMin: premMins.length > 0 ? Math.min(...premMins) : 0,
      premiumMax: premMaxs.length > 0 ? Math.max(...premMaxs) : 0,
      sumInsuredMin: siMins.length > 0 ? Math.min(...siMins) : null,
      sumInsuredMax: siMaxs.length > 0 ? Math.max(...siMaxs) : null,
      avgCSR: csrs.length > 0 ? Math.round(avg(csrs) * 10) / 10 : null,
      subCategories: subs,
      lastUpdated: getCategoryLastUpdated(cat, "in"),
    };
  });

  // ── Insurer Landscape ──
  const insurerRows: InsurerRow[] = insurers
    .map((i) => ({
      slug: i.slug,
      shortName: i.shortName,
      name: i.name,
      type: i.type,
      headquarters: i.headquarters,
      established: i.established,
      listed: i.listed,
      csr: i.claimSettlementRatio?.value ?? 0,
      csrYear: i.claimSettlementRatio?.year ?? "",
      productCount: getProductsByInsurer(i.slug, "in").length,
      networkHospitals: i.networkHospitals,
      categories: i.categories,
    }))
    .sort((a, b) => b.csr - a.csr);

  // ── Premium Range ──
  const premiumRanges: PremiumRangeData[] = cats.map((cat) => {
    const catProducts = getProductsByCategory(cat, "in");
    const mins = catProducts.map((p) => p.premiumRange.illustrativeMin).filter((v) => v > 0);
    const maxs = catProducts.map((p) => p.premiumRange.illustrativeMax).filter((v) => v > 0);
    const allPrems = [...mins, ...maxs];
    return {
      category: cat,
      name: CATEGORY_NAMES[cat],
      min: mins.length > 0 ? Math.min(...mins) : 0,
      max: maxs.length > 0 ? Math.max(...maxs) : 0,
      median: median(allPrems),
      color: CATEGORY_COLORS[cat],
    };
  });

  // ── Coverage Distribution ──
  const bucketDefs: { bucket: string; min: number; max: number }[] = [
    { bucket: "< ₹5L", min: 0, max: 500000 },
    { bucket: "₹5L – ₹10L", min: 500000, max: 1000000 },
    { bucket: "₹10L – ₹25L", min: 1000000, max: 2500000 },
    { bucket: "₹25L – ₹50L", min: 2500000, max: 5000000 },
    { bucket: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
    { bucket: "₹1Cr+", min: 10000000, max: Infinity },
  ];

  const coverageDistribution: CoverageDistribution[] = bucketDefs.map((b) => ({
    ...b,
    count: products.filter((p) => {
      const si = p.sumInsured.max;
      if (si == null) return false;
      return si >= b.min && (b.max === Infinity ? true : si < b.max);
    }).length,
  }));

  // ── City/State ──
  const stateMap = new Map<string, number>();
  for (const c of cities) {
    stateMap.set(c.state, (stateMap.get(c.state) ?? 0) + 1);
  }
  const stateData: StateData[] = [...stateMap.entries()]
    .map(([state, cityCount]) => ({ state, cityCount }))
    .sort((a, b) => b.cityCount - a.cityCount)
    .slice(0, 15);

  const tierMap = new Map<number, number>();
  for (const c of cities) {
    tierMap.set(c.tier, (tierMap.get(c.tier) ?? 0) + 1);
  }
  const tierLabels: Record<number, string> = { 1: "Tier 1 — Metros", 2: "Tier 2 — Major Cities", 3: "Tier 3 — Towns" };
  const tierData: TierData[] = [1, 2, 3].map((t) => ({
    tier: t,
    label: tierLabels[t] ?? `Tier ${t}`,
    count: tierMap.get(t) ?? 0,
  }));

  const hqMap = new Map<string, number>();
  for (const i of insurers) {
    if (i.headquarters) hqMap.set(i.headquarters, (hqMap.get(i.headquarters) ?? 0) + 1);
  }
  const hqData: HQData[] = [...hqMap.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  // ── Freshness ──
  const freshness: FreshnessData[] = cats.map((cat) => ({
    category: cat,
    name: CATEGORY_NAMES[cat],
    lastUpdated: getCategoryLastUpdated(cat, "in"),
    color: CATEGORY_COLORS[cat],
  }));

  const confidenceScores = products.map((p) => p.confidenceScore);
  const mostCommon = confidenceScores.length > 0 ? "medium" : "unknown";

  return {
    overview,
    marketStats,
    insurerCSRs,
    csrBuckets,
    categoryAvgCSRs,
    categoryInsights,
    insurerRows,
    premiumRanges,
    coverageDistribution,
    stateData,
    tierData,
    hqData,
    freshness,
    overallConfidence: mostCommon,
  };
}
