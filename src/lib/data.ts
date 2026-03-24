/**
 * Data access layer – country-aware.
 *
 * Data files live at:
 *   src/data/<countryCode>/health-insurance.json
 *   src/data/<countryCode>/term-life-insurance.json
 *   src/data/<countryCode>/motor-insurance.json
 *   src/data/<countryCode>/travel-insurance.json
 *   src/data/<countryCode>/insurers.json
 *
 * The root-level files (src/data/health-insurance.json etc.) are kept for
 * backward compatibility during the transition period.
 *
 * When no countryCode is supplied the functions default to "in" (India).
 */

import type {
  InsuranceProduct,
  Insurer,
  Category,
  CategoryInfo,
  ProductDataset,
} from "./types";
import { VALID_COUNTRY_CODES } from "./countries";

// ---------------------------------------------------------------------------
// Internal helpers – dynamic require with graceful fallback
// ---------------------------------------------------------------------------

const CATEGORY_FILES: Record<Category, string> = {
  health: "health-insurance.json",
  "term-life": "term-life-insurance.json",
  motor: "motor-insurance.json",
  travel: "travel-insurance.json",
};

const ALL_CATEGORIES: Category[] = ["health", "term-life", "motor", "travel"];

/**
 * Try to load a JSON data file for a given country and filename.
 * Falls back to root data directory if per-country file is missing,
 * then returns null if nothing is found.
 */
function loadDataFile(
  countryCode: string,
  filename: string
): Record<string, unknown> | null {
  // Normalise
  const cc = countryCode.toLowerCase();

  // Try country-specific path first
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`@/data/${cc}/${filename}`);
  } catch {
    // Ignored – file does not exist for this country
  }

  // Fallback to root data directory (backward compat for "in")
  if (cc === "in") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(`@/data/${filename}`);
    } catch {
      // Ignored
    }
  }

  return null;
}

function loadCategoryData(
  category: Category,
  countryCode: string = "in"
): ProductDataset | null {
  const filename = CATEGORY_FILES[category];
  if (!filename) return null;
  const raw = loadDataFile(countryCode, filename);
  if (!raw) return null;
  return raw as unknown as ProductDataset;
}

function loadInsurersData(
  countryCode: string = "in"
): { insurers: Insurer[] } | null {
  const raw = loadDataFile(countryCode, "insurers.json");
  if (!raw) return null;
  return raw as unknown as { insurers: Insurer[] };
}

// ---------------------------------------------------------------------------
// Tag products & insurers with their countryCode
// ---------------------------------------------------------------------------

function tagProducts(
  products: InsuranceProduct[],
  countryCode: string
): InsuranceProduct[] {
  return products.map((p) => ({
    ...p,
    countryCode: p.countryCode ?? countryCode,
  }));
}

function tagInsurers(insurers: Insurer[], countryCode: string): Insurer[] {
  return insurers.map((i) => ({
    ...i,
    countryCode: i.countryCode ?? countryCode,
  }));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return all products, optionally filtered by country.
 * When countryCode is omitted, returns products from ALL countries with data.
 */
export function getAllProducts(countryCode?: string): InsuranceProduct[] {
  const codes = countryCode ? [countryCode] : VALID_COUNTRY_CODES;
  const results: InsuranceProduct[] = [];

  for (const cc of codes) {
    for (const cat of ALL_CATEGORIES) {
      const data = loadCategoryData(cat, cc);
      if (data?.products) {
        results.push(...tagProducts(data.products as InsuranceProduct[], cc));
      }
    }
  }

  return results;
}

/**
 * Return products for a specific category, optionally filtered by country.
 */
export function getProductsByCategory(
  category: Category,
  countryCode?: string
): InsuranceProduct[] {
  const codes = countryCode ? [countryCode] : VALID_COUNTRY_CODES;
  const results: InsuranceProduct[] = [];

  for (const cc of codes) {
    const data = loadCategoryData(category, cc);
    if (data?.products) {
      results.push(...tagProducts(data.products as InsuranceProduct[], cc));
    }
  }

  return results;
}

/**
 * Find a single product by its unique id (searches all countries).
 */
export function getProductById(id: string, countryCode?: string): InsuranceProduct | undefined {
  return getAllProducts(countryCode).find((p) => p.id === id);
}

/**
 * Return all products from a given insurer, optionally within a country.
 */
export function getProductsByInsurer(
  insurerSlug: string,
  countryCode?: string
): InsuranceProduct[] {
  return getAllProducts(countryCode).filter(
    (p) => p.insurerSlug === insurerSlug
  );
}

/**
 * Return all insurers, optionally filtered by country.
 */
export function getAllInsurers(countryCode?: string): Insurer[] {
  const codes = countryCode ? [countryCode] : VALID_COUNTRY_CODES;
  const results: Insurer[] = [];

  for (const cc of codes) {
    const data = loadInsurersData(cc);
    if (data?.insurers) {
      results.push(...tagInsurers(data.insurers as Insurer[], cc));
    }
  }

  return results;
}

/**
 * Find a single insurer by slug, optionally within a country.
 */
export function getInsurerBySlug(
  slug: string,
  countryCode?: string
): Insurer | undefined {
  return getAllInsurers(countryCode).find((i) => i.slug === slug);
}

/**
 * Return the disclaimer string for a category (in a specific country).
 */
export function getCategoryDisclaimer(
  category: Category,
  countryCode: string = "in"
): string {
  const data = loadCategoryData(category, countryCode);
  return (data?.disclaimer as string) ?? "";
}

/**
 * Return the lastUpdated string for a category (in a specific country).
 */
export function getCategoryLastUpdated(
  category: Category,
  countryCode: string = "in"
): string {
  const data = loadCategoryData(category, countryCode);
  return (data?.lastUpdated as string) ?? "";
}

// ---------------------------------------------------------------------------
// Category metadata – product counts are dynamic per country
// ---------------------------------------------------------------------------

/**
 * Return category info array with product counts for the given country.
 */
export function getCategories(countryCode: string = "in"): CategoryInfo[] {
  return [
    {
      slug: "health",
      name: "Health Insurance",
      shortName: "Health",
      description:
        "Compare health insurance plans across top insurers. Explore features, waiting periods, coverage limits, and more.",
      icon: "Heart",
      color: "#ef4444",
      productCount: getProductsByCategory("health", countryCode).length,
    },
    {
      slug: "term-life",
      name: "Term Life Insurance",
      shortName: "Term Life",
      description:
        "Compare term life insurance plans. Evaluate coverage amounts, claim settlement ratios, rider options, and premiums.",
      icon: "Shield",
      color: "#2563eb",
      productCount: getProductsByCategory("term-life", countryCode).length,
    },
    {
      slug: "motor",
      name: "Motor Insurance",
      shortName: "Motor",
      description:
        "Compare car and two-wheeler insurance plans. Check add-ons, cashless garage networks, and claim processes.",
      icon: "Car",
      color: "#16a34a",
      productCount: getProductsByCategory("motor", countryCode).length,
    },
    {
      slug: "travel",
      name: "Travel Insurance",
      shortName: "Travel",
      description:
        "Compare international and domestic travel insurance plans. Check medical cover, trip cancellation, and baggage protection.",
      icon: "Plane",
      color: "#f59e0b",
      productCount: getProductsByCategory("travel", countryCode).length,
    },
  ];
}

/** Legacy export – default to India for backward compatibility */
export const categories: CategoryInfo[] = getCategories("in");

// ---------------------------------------------------------------------------
// Legacy formatCurrency re-exports (kept in data.ts for existing imports)
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number | null): string {
  if (amount === null) return "N/A";
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return `${amount}`;
}

export function formatCurrencyFull(amount: number | null): string {
  if (amount === null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
