/**
 * Crawler Configuration for Indian Insurance Sources
 *
 * This module defines the sources to monitor for Indian insurance product data.
 * All sources must be:
 * 1. Publicly accessible
 * 2. Official insurer or regulator pages
 * 3. Compliant with robots.txt
 * 4. Accessed with rate limiting
 */

export interface ExtractionSelector {
  /** CSS selector to target the element(s) */
  selector: string;
  /** What this selector extracts */
  field: string;
  /** Whether multiple elements are expected */
  multiple?: boolean;
}

export interface ExtractionConfig {
  /** CSS selectors for extracting structured data from the page */
  selectors: ExtractionSelector[];
  /** Selector for the main content area (used for change detection instead of full page) */
  contentSelector?: string;
  /** Selectors to remove before extraction (nav, footer, ads, etc.) */
  removeSelectors?: string[];
}

export interface SourceConfig {
  id: string;
  insurerSlug: string;
  insurerName: string;
  type: "product-page" | "product-list" | "pdf-library" | "sitemap" | "brochure-page";
  url: string;
  category: "health" | "term-life" | "motor" | "travel" | "all";
  priority: "high" | "medium" | "low";
  checkFrequency: "daily" | "weekly" | "monthly";
  trustLevel: "official" | "brochure" | "secondary";
  notes?: string;
  extractionConfig?: ExtractionConfig;
}

export const CRAWLER_CONFIG = {
  // Rate limiting
  requestDelayMs: 2000, // 2 seconds between requests to same domain
  maxConcurrent: 2, // Max concurrent requests total
  maxRequestsPerDomain: 10, // Max requests per domain per run
  timeoutMs: 30000, // 30 second timeout per request

  // User agent — identify ourselves honestly
  userAgent: "WBIBot/1.0 (Insurance comparison research; educational purposes; contact@worldbestinsurer.com)",

  // Retry
  maxRetries: 2,
  retryDelayMs: 5000,

  // Storage
  snapshotDir: "data/snapshots",
  diffDir: "data/diffs",
  queueDir: "data/review-queue",
  crawlerStateDir: "data/crawler-state",
};

export const SOURCES: SourceConfig[] = [
  // === HEALTH INSURANCE ===
  {
    id: "star-health-plans",
    insurerSlug: "star-health",
    insurerName: "Star Health",
    type: "product-list",
    url: "https://www.starhealth.in/health-insurance",
    category: "health",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
    extractionConfig: {
      contentSelector: ".product-listing, .plan-cards, main",
      selectors: [
        { selector: ".product-card, .plan-card, .insurance-plan", field: "planCard", multiple: true },
        { selector: ".product-card h2, .plan-card h3, .card-title", field: "planName", multiple: true },
        { selector: ".product-card .price, .premium-amount, .plan-price", field: "premiumIndicator", multiple: true },
        { selector: ".product-card .features, .plan-features, .key-features li", field: "features", multiple: true },
        { selector: ".product-card a[href], .plan-card a[href], .know-more", field: "planLinks", multiple: true },
        { selector: ".sum-insured, .cover-amount", field: "sumInsured", multiple: true },
      ],
      removeSelectors: ["nav", "footer", "header", ".breadcrumb", ".chat-widget", "script", "style", "noscript"],
    },
  },
  {
    id: "care-health-plans",
    insurerSlug: "care-health",
    insurerName: "Care Health",
    type: "product-list",
    url: "https://www.careinsurance.com/health-insurance",
    category: "health",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
    extractionConfig: {
      contentSelector: ".product-section, .plan-listing, main",
      selectors: [
        { selector: ".product-card, .plan-item, .insurance-card", field: "planCard", multiple: true },
        { selector: ".product-card h2, .product-card h3, .plan-name", field: "planName", multiple: true },
        { selector: ".product-card .price, .starting-premium, .plan-premium", field: "premiumIndicator", multiple: true },
        { selector: ".product-card .feature-list li, .plan-highlights li, .key-benefits li", field: "features", multiple: true },
        { selector: ".product-card a[href], .plan-item a[href], .view-plan", field: "planLinks", multiple: true },
        { selector: ".cover-range, .sum-assured-range", field: "sumInsured", multiple: true },
      ],
      removeSelectors: ["nav", "footer", "header", ".breadcrumb", ".sticky-cta", "script", "style", "noscript"],
    },
  },
  {
    id: "niva-bupa-plans",
    insurerSlug: "niva-bupa",
    insurerName: "Niva Bupa",
    type: "product-list",
    url: "https://www.nivabupa.com/health-insurance-plans.html",
    category: "health",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
    extractionConfig: {
      contentSelector: ".product-listing, .plans-container, main",
      selectors: [
        { selector: ".product-card, .plan-card, .plan-box", field: "planCard", multiple: true },
        { selector: ".product-card h2, .plan-card h3, .plan-title", field: "planName", multiple: true },
        { selector: ".product-card .premium, .price-tag, .starting-at", field: "premiumIndicator", multiple: true },
        { selector: ".product-card .benefits li, .plan-features li, .usp-list li", field: "features", multiple: true },
        { selector: ".product-card a[href], .plan-card a[href], .explore-plan", field: "planLinks", multiple: true },
        { selector: ".sum-insured, .coverage-amount", field: "sumInsured", multiple: true },
      ],
      removeSelectors: ["nav", "footer", "header", ".breadcrumb", ".floating-cta", "script", "style", "noscript"],
    },
  },
  {
    id: "hdfc-ergo-health",
    insurerSlug: "hdfc-ergo",
    insurerName: "HDFC ERGO",
    type: "product-list",
    url: "https://www.hdfcergo.com/health-insurance",
    category: "health",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },
  {
    id: "icici-lombard-health",
    insurerSlug: "icici-lombard",
    insurerName: "ICICI Lombard",
    type: "product-list",
    url: "https://www.icicilombard.com/health-insurance",
    category: "health",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },
  {
    id: "bajaj-allianz-health",
    insurerSlug: "bajaj-allianz",
    insurerName: "Bajaj Allianz",
    type: "product-list",
    url: "https://www.bajajallianz.com/health-insurance-plans.html",
    category: "health",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },

  // === TERM LIFE INSURANCE ===
  {
    id: "hdfc-life-term",
    insurerSlug: "hdfc-life",
    insurerName: "HDFC Life",
    type: "product-list",
    url: "https://www.hdfclife.com/term-insurance-plans",
    category: "term-life",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },
  {
    id: "icici-pru-term",
    insurerSlug: "icici-prudential",
    insurerName: "ICICI Prudential",
    type: "product-list",
    url: "https://www.iciciprulife.com/term-insurance.html",
    category: "term-life",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },
  {
    id: "max-life-term",
    insurerSlug: "max-life",
    insurerName: "Max Life",
    type: "product-list",
    url: "https://www.maxlifeinsurance.com/term-insurance-plans",
    category: "term-life",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },
  {
    id: "tata-aia-term",
    insurerSlug: "tata-aia",
    insurerName: "Tata AIA",
    type: "product-list",
    url: "https://www.tataaia.com/life-insurance/term-plans.html",
    category: "term-life",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },
  {
    id: "sbi-life-term",
    insurerSlug: "sbi-life",
    insurerName: "SBI Life",
    type: "product-list",
    url: "https://www.sbilife.co.in/en/individual-life-insurance",
    category: "term-life",
    priority: "high",
    checkFrequency: "daily",
    trustLevel: "official",
  },

  // === MOTOR INSURANCE ===
  {
    id: "hdfc-ergo-motor",
    insurerSlug: "hdfc-ergo",
    insurerName: "HDFC ERGO",
    type: "product-list",
    url: "https://www.hdfcergo.com/motor-insurance",
    category: "motor",
    priority: "medium",
    checkFrequency: "weekly",
    trustLevel: "official",
  },
  {
    id: "icici-lombard-motor",
    insurerSlug: "icici-lombard",
    insurerName: "ICICI Lombard",
    type: "product-list",
    url: "https://www.icicilombard.com/motor-insurance",
    category: "motor",
    priority: "medium",
    checkFrequency: "weekly",
    trustLevel: "official",
  },
  {
    id: "bajaj-allianz-motor",
    insurerSlug: "bajaj-allianz",
    insurerName: "Bajaj Allianz",
    type: "product-list",
    url: "https://www.bajajallianz.com/motor-insurance.html",
    category: "motor",
    priority: "medium",
    checkFrequency: "weekly",
    trustLevel: "official",
  },

  // === TRAVEL INSURANCE ===
  {
    id: "bajaj-allianz-travel",
    insurerSlug: "bajaj-allianz",
    insurerName: "Bajaj Allianz",
    type: "product-list",
    url: "https://www.bajajallianz.com/travel-insurance.html",
    category: "travel",
    priority: "medium",
    checkFrequency: "weekly",
    trustLevel: "official",
  },
  {
    id: "hdfc-ergo-travel",
    insurerSlug: "hdfc-ergo",
    insurerName: "HDFC ERGO",
    type: "product-list",
    url: "https://www.hdfcergo.com/travel-insurance",
    category: "travel",
    priority: "medium",
    checkFrequency: "weekly",
    trustLevel: "official",
  },
  {
    id: "tata-aig-travel",
    insurerSlug: "tata-aig",
    insurerName: "Tata AIG",
    type: "product-list",
    url: "https://www.tataaig.com/travel-insurance",
    category: "travel",
    priority: "medium",
    checkFrequency: "weekly",
    trustLevel: "official",
  },

  // === REGULATORY ===
  {
    id: "irdai-registered-insurers",
    insurerSlug: "irdai",
    insurerName: "IRDAI",
    type: "product-list",
    url: "https://www.irdai.gov.in/registered-insurers",
    category: "all",
    priority: "low",
    checkFrequency: "monthly",
    trustLevel: "official",
    notes: "Master list of registered insurers in India",
  },
];

export function getSourcesByFrequency(freq: "daily" | "weekly" | "monthly"): SourceConfig[] {
  return SOURCES.filter((s) => s.checkFrequency === freq);
}

export function getSourcesByCategory(category: string): SourceConfig[] {
  return SOURCES.filter((s) => s.category === category || s.category === "all");
}

export function getSourcesByInsurer(slug: string): SourceConfig[] {
  return SOURCES.filter((s) => s.insurerSlug === slug);
}

export function getSourceById(id: string): SourceConfig | undefined {
  return SOURCES.find((s) => s.id === id);
}
