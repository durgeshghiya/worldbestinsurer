/**
 * Registry types — the provenance-backed insurance data layer.
 *
 * The rule this file encodes: an important fact cannot exist without saying
 * where it came from. Every such field is a `Sourced<T>`, so a record that
 * lacks provenance does not type-check, and the validator rejects it at
 * ingestion. Missing facts are absent (undefined), never guessed.
 *
 * See docs/worldbestinsurer-data-seo-plan.md §8.
 */

export const REGISTRY_SCHEMA_VERSION = 1;

// ─────────────────────────────── provenance ───────────────────────────────

export type SourceKind = "regulator" | "government" | "insurer";

/**
 * How a source may be accessed. `manual` means a human downloads the
 * published file and places it in the inbox — used when robots.txt or a
 * technical protection forbids automated access.
 */
export type AccessMethod = "crawl" | "api" | "manual";

export interface Source {
  id: string; // e.g. "irdai", "data-gov-in", "insurer:lic"
  name: string; // shown on the site: "IRDAI", "LIC official website"
  publisher: string;
  kind: SourceKind;
  homepage: string;
  accessMethod: AccessMethod;
  /** What robots.txt said when last checked. */
  robots: "allowed" | "disallowed" | "refused" | "unreachable" | "not-applicable";
  robotsCheckedAt?: string;
  license?: string;
  notes?: string;
}

export interface Provenance {
  sourceId: string;
  /** The exact page or document the value came from. */
  url: string;
  /** When we fetched it (ISO 8601). */
  retrievedAt: string;
  /** The date the source itself states, if it states one. */
  sourceDate?: string;
  /**
   * True when the source gives no publication date and `sourceDate` is the
   * date we saw the value there. Shown as "Seen on …", never as "published".
   */
  sourceDateIsObserved?: boolean;
  /** e.g. "FY2024-25", "Q1 FY2026-27". */
  reportingPeriod?: string;
  /** Verbatim text from the source that contains the value. */
  evidence?: string;
  license?: string;
  notes?: string;
}

export interface Sourced<T> {
  value: T;
  provenance: Provenance;
}

// ─────────────────────────────── taxonomy ───────────────────────────────

/** IRDAI's registration categories. */
export type InsurerType =
  | "life"
  | "general"
  | "standalone-health"
  | "reinsurer"
  | "specialised";

/** Lines of business, as shown to readers. */
export type InsuranceSegment =
  | "life"
  | "health"
  | "motor"
  | "travel"
  | "home"
  | "commercial"
  | "personal-accident"
  | "crop"
  | "other";

export type ProductType =
  | "term"
  | "endowment"
  | "whole-life"
  | "money-back"
  | "ulip"
  | "pension"
  | "savings"
  | "health-indemnity"
  | "health-fixed-benefit"
  | "critical-illness"
  | "personal-accident"
  | "motor-private-car"
  | "motor-two-wheeler"
  | "motor-commercial"
  | "travel"
  | "home"
  | "commercial"
  | "other";

export type EntityStatus = "active" | "renamed" | "merged" | "inactive";
export type ProductStatus = "active" | "withdrawn" | "unknown";

export type DocumentKind =
  | "policy-wording"
  | "prospectus"
  | "brochure"
  | "customer-information-sheet"
  | "product-information"
  | "proposal-form"
  | "claim-form"
  | "public-disclosure"
  | "annual-report";

// ─────────────────────────────── records ───────────────────────────────

export interface FormerName {
  name: string;
  /** ISO date the name stopped being used, if known. */
  until?: string;
  provenance: Provenance;
}

export interface RegistryInsurer {
  slug: string;
  name: Sourced<string>;
  legalName?: Sourced<string>;
  insurerType: Sourced<InsurerType>;
  segments: InsuranceSegment[];
  irdaiRegistrationNumber?: Sourced<string>;
  cin?: Sourced<string>;
  website: Sourced<string>;
  headquarters?: Sourced<string>;
  status: EntityStatus;
  formerNames?: FormerName[];
  /** Slug of the matching record in src/data/in/insurers.json, if any. */
  siteSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistryProduct {
  slug: string;
  insurerSlug: string;
  name: Sourced<string>;
  /** IRDAI Unique Identification Number. */
  uin?: Sourced<string>;
  productType: ProductType;
  segment: InsuranceSegment;
  status: ProductStatus;
  policyTerm?: Sourced<string>;
  eligibility?: Sourced<string>;
  premiumFrequency?: Sourced<string>;
  sumInsured?: Sourced<string>;
  /** id of the matching product in src/data/in/*-insurance.json, if any. */
  siteProductId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistryDocument {
  id: string;
  insurerSlug: string;
  productSlug?: string;
  kind: DocumentKind;
  title: string;
  /** The official URL. The document itself is never copied. */
  url: string;
  contentType?: string;
  /** sha256 of the bytes when last checked — detects silent changes. */
  contentHash?: string;
  /**
   * The server generates this file per request, so its bytes differ between
   * two back-to-back fetches. Change detection by hash is skipped for it.
   */
  volatile?: boolean;
  lastStatus?: number;
  lastCheckedAt?: string;
  /** The page that links to this document, proving the insurer published it. */
  provenance: Provenance;
  createdAt: string;
  updatedAt: string;
}

export type StatisticScope = "insurer" | "segment" | "market";

export interface RegistryStatistic {
  /** Stable hash of scope + subject + metric + period + source. */
  id: string;
  scope: StatisticScope;
  insurerSlug?: string;
  segment?: InsuranceSegment;
  metric: string; // "gross-direct-premium", "solvency-ratio", ...
  label: string; // "Gross direct premium"
  value: number;
  unit: string; // "INR crore", "%", "count", "x"
  reportingPeriod: string;
  /** sourceDate is required for statistics. */
  provenance: Provenance & { sourceDate: string; reportingPeriod: string };
  /** A restatement points at the record it replaces. History is never overwritten. */
  supersedes?: string;
  recordedAt: string;
}

// ─────────────────────────────── bookkeeping ───────────────────────────────

export interface ReviewItem {
  id: string;
  kind: "insurer" | "product" | "document" | "statistic" | "source";
  reason: string;
  candidate: unknown;
  queuedAt: string;
}

export interface ChangeRecord {
  at: string;
  job: string;
  kind: ReviewItem["kind"];
  key: string;
  field: string;
  from: unknown;
  to: unknown;
  sourceUrl: string;
}

export interface RegistryMeta {
  schemaVersion: number;
  jurisdiction: "in";
  lastRun: Record<string, { at: string; ok: boolean; summary: string }>;
}

export interface Registry {
  meta: RegistryMeta;
  sources: Source[];
  insurers: RegistryInsurer[];
  products: RegistryProduct[];
  documents: RegistryDocument[];
  statistics: RegistryStatistic[];
}
