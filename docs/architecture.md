# Zura Platform Architecture

## Master System Design Document

**Version:** 1.0
**Last Updated:** 2026-03-24
**Status:** Production Reference

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Global Benchmarking Insights](#2-global-benchmarking-insights)
3. [Data Architecture](#3-data-architecture)
4. [Ingestion Pipeline Architecture](#4-ingestion-pipeline-architecture)
5. [Admin Workflow](#5-admin-workflow)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Data Quality Framework](#7-data-quality-framework)
8. [Scalability & Multi-Market Readiness](#8-scalability--multi-market-readiness)
9. [Tech Stack](#9-tech-stack)

---

## 1. System Overview

### Mission

Zura is a world-class insurance comparison and education platform. India-first, designed for global expansion. The platform enables consumers to explore, compare, and understand insurance products across categories — health, term life, motor, and travel — with transparent, verified data and no conflicts of interest.

### Core Principles

- **Data Accuracy Above All** — Every displayed field has a confidence score, a source, and a last-verified date. Stale or unverified data is gated from public display.
- **Regulatory Compliance by Design** — The platform architecture assumes no IRDAI licence in its initial phase. Every feature is designed to operate safely as an informational/educational tool, with clear upgrade paths to licensed operation.
- **Trust Through Transparency** — Users see exactly where data comes from, when it was last checked, and what confidence level it carries.
- **Performance as a Feature** — Sub-1.5-second page loads. Static generation where possible, ISR where freshness matters.
- **Multi-Market from Day One** — Every entity carries geography and market fields. The schema, taxonomy, and ingestion pipeline are designed to support additional countries without structural changes.

### Current State (MVP)

| Dimension | Status |
|---|---|
| Categories | Health, Term Life, Motor, Travel |
| Products | 17 across 12 insurers |
| Data Source | Static JSON files in `src/data/` |
| Confidence | Medium (public product pages) |
| Regulatory | No licence — informational/educational only |
| Revenue | None (pre-revenue, waitlist collection) |
| Deployment | Static site generation via Next.js |

### Target State (12-Month)

| Dimension | Target |
|---|---|
| Categories | 8+ (add critical illness, super top-up, group health, ULIP) |
| Products | 200+ across 30+ insurers |
| Data Source | Automated ingestion pipeline + admin verification |
| Confidence | High (majority verified from policy wordings) |
| Regulatory | IRDAI Web Aggregator registration in progress |
| Revenue | Lead routing commissions, premium comparison tools |
| Deployment | Next.js with ISR, PostgreSQL backend |

---

## 2. Global Benchmarking Insights

### Platforms Studied

#### UK Market
- **Compare the Market** — Market leader. Known for trust signals, gamified UX (Meerkat rewards), progressive disclosure in forms, strong brand.
- **GoCompare** — Aggressive on price comparison accuracy, real-time quote fetching, clear savings indicators.
- **MoneySupermarket** — Broad financial product comparison, strong editorial content, SEO-first architecture.

#### India Market
- **Policybazaar** — Dominant aggregator, IRDAI-registered web aggregator. Real-time quotes, heavy lead capture, aggressive conversion funnels.
- **Ditto** — Advisory-first model (IRDAI broker). Minimal UI, trust through human advice, transparent commission disclosure.
- **Coverfox** — Comparison + purchase, IRDAI-registered. Clean comparison tables, mobile-optimized.

#### US Market
- **Lemonade** — Digital-first insurer. Instant quotes, AI-powered claims, transparent pricing, behavioral economics in UX.
- **Root Insurance** — Usage-based motor insurance, mobile-first, telematics-driven.
- **NerdWallet** — Editorial comparison, strong SEO, trust through methodology transparency, affiliate model.
- **Bankrate** — Data-driven comparisons, clear methodology pages, calculator-heavy.

#### Europe
- **Check24 (Germany)** — Multi-vertical comparison (insurance, energy, telecom). Deep filter systems, side-by-side comparison with feature-level detail.
- **Verivox (Germany)** — Similar multi-vertical model, strong regulatory compliance, TUV-certified comparison methodology.

### Key Patterns Extracted

#### Trust Indicators
| Pattern | Source | Zura Implementation |
|---|---|---|
| Source attribution on every data point | NerdWallet, Bankrate | Every field links to its source document |
| Last-verified date visible to users | Check24 | `lastVerified` badge on product cards |
| Methodology page | NerdWallet, MoneySupermarket | `/methodology` page (already built) |
| Confidence scoring visible | Unique to Zura | Color-coded confidence badges (high/medium/low) |
| Commission disclosure | Ditto | Planned for licensed phase |
| Editorial independence statement | NerdWallet | About page + methodology page |
| Regulatory status disclosure | All UK/India platforms | Footer disclaimer + about page |

#### Micro-Interactions
| Pattern | Source | Implementation |
|---|---|---|
| Progressive form disclosure | Compare the Market | Multi-step comparison filters — reveal fields as user progresses |
| Instant comparison preview | Check24 | Selected products appear in sticky comparison bar |
| Savings highlight | GoCompare | Show delta between products ("saves X over Y") |
| Feature match indicator | Verivox | Green check / red cross on feature comparison rows |
| Tooltip explanations | Policybazaar | Every insurance term has a hover tooltip with plain-English explanation |
| Loading skeletons | Lemonade | Shimmer placeholders during data fetch |

#### Progressive Disclosure
| Layer | What's Shown | Interaction |
|---|---|---|
| Category page (list) | Product name, insurer, key metric (e.g., sum insured range), confidence badge | Browse, filter, sort |
| Product card (expanded) | Top features, premium range, eligibility summary | Click to expand or hover |
| Product detail page | Full feature set, riders, exclusions, waiting periods, source links | Direct navigation |
| Comparison view | Side-by-side feature-level comparison | Select 2-4 products |
| Source view | Raw source document, extracted vs. displayed values | Admin or power user |

#### Smart Defaults
| Context | Default | Rationale |
|---|---|---|
| Health insurance age | 30 years | Most common buyer demographic in India |
| Sum insured filter | 5L-10L | Most popular range |
| Sort order | "Most features" not "cheapest" | Avoids race-to-bottom, better for consumers |
| Comparison | Pre-select top 3 by coverage breadth | Gives immediate value without user effort |
| Category landing | Health insurance first | Highest search volume, most consumer need |

#### Comparison UX
| Element | Best Practice | Source |
|---|---|---|
| Sticky product headers | Headers stay visible while scrolling features | Check24, Policybazaar |
| Feature grouping | Group by category (coverage, exclusions, riders, cost) | Verivox |
| Highlight differences | Bold or color cells where products differ | GoCompare |
| Mobile comparison | Swipe between products (not side-by-side table) | Lemonade |
| Add/remove products | Drag-and-drop or checkbox selection | Compare the Market |
| Export comparison | PDF download of comparison table | Check24 |

#### Data Freshness Indicators
| Signal | Display | Threshold |
|---|---|---|
| Fresh | Green badge, "Verified [date]" | Verified within 30 days |
| Aging | Yellow badge, "Last checked [date]" | 31-90 days since verification |
| Stale | Red badge, "Data may be outdated" | 91+ days since verification |
| Unverified | Gray badge, "Unverified — from public sources" | Never manually verified |
| Confidence | Inline icon (high/medium/low) | Based on source quality |

---

## 3. Data Architecture

### Design Principles

1. **Every field is traceable** — Each data point connects to a source document, extraction method, and confidence level.
2. **Immutable history** — Product data is versioned. Updates create new versions; old versions remain accessible.
3. **Multi-market ready** — Geography and regulatory market fields on all entities.
4. **Display eligibility gated** — A record must pass quality thresholds before appearing on the public site.
5. **Relational, normalized** — Even while stored as JSON, the schema follows relational normalization principles for future database migration.

### Entity Relationship Model

```
Geography (1) ─────────────────── (M) RegulatoryMarket
                                        │
                                        │ (1)
                                        ▼
Insurer (1) ───── (M) Product (1) ─── (M) ProductVariant
   │                     │                      │
   │                     ├── (M) Feature        ├── (M) Rider
   │                     ├── (M) Exclusion      ├── (M) PremiumIllustration
   │                     ├── (M) WaitingPeriod  └── (M) SumInsuredBand
   │                     ├── (M) EligibilityRule
   │                     ├── (M) SourceDocument
   │                     └── (M) VerificationRecord
   │
   └── (M) SourceSnapshot

UpdateEvent ──── references ──── Product | ProductVariant | Feature | ...
ReviewDecision ── references ── UpdateEvent
```

### Entity Definitions

#### Geography

```typescript
interface Geography {
  id: string;                    // "IN", "US", "GB", "DE"
  name: string;                  // "India"
  currency: string;              // "INR"
  currencySymbol: string;        // "₹"
  locale: string;                // "en-IN"
  timezone: string;              // "Asia/Kolkata"
  regulatoryBody: string;        // "IRDAI"
  dateFormat: string;            // "DD/MM/YYYY"
}
```

#### RegulatoryMarket

```typescript
interface RegulatoryMarket {
  id: string;                    // "IN-IRDAI"
  geographyId: string;           // FK -> Geography
  name: string;                  // "IRDAI Regulated Market"
  regulatorName: string;         // "Insurance Regulatory and Development Authority of India"
  regulatorUrl: string;          // "https://irdai.gov.in"
  licenseTypes: string[];        // ["web_aggregator", "broker", "corporate_agent"]
  complianceNotes: string;       // Free text
  disclaimerTemplate: string;    // Required disclaimer text for this market
}
```

#### Insurer

```typescript
interface Insurer {
  id: string;                    // "hdfc-ergo"
  slug: string;                  // "hdfc-ergo"
  name: string;                  // "HDFC ERGO General Insurance"
  shortName: string;             // "HDFC ERGO"
  geographyId: string;           // FK -> Geography
  marketId: string;              // FK -> RegulatoryMarket
  type: "life" | "general" | "health" | "reinsurer";
  registrationNumber: string;    // IRDAI registration number
  incorporationYear: number;
  headquarters: string;
  website: string;
  claimSettlementRatio: number;  // As decimal, e.g., 0.9734
  claimSettlementRatioYear: string;
  incurredClaimRatio: number;
  solventcyRatio: number;
  networkHospitals: number;
  branches: number;
  logoUsageAllowed: boolean;     // false until trademark clearance
  status: "active" | "inactive" | "merged";
  sourceUrl: string;
  lastVerified: string;          // ISO date
  confidenceScore: "high" | "medium" | "low";
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Product

```typescript
interface Product {
  id: string;                    // "hdfc-ergo-optima-secure"
  slug: string;
  insurerId: string;             // FK -> Insurer
  geographyId: string;           // FK -> Geography
  marketId: string;              // FK -> RegulatoryMarket
  category: ProductCategory;
  name: string;                  // Official product name
  shortDescription: string;      // 1-2 sentence summary
  productType: string;           // "indemnity", "benefit", "term", "endowment", etc.
  uinNumber: string;             // IRDAI Unique Identification Number
  launchDate: string;
  isActive: boolean;
  version: number;               // Incremented on every data change
  previousVersionId: string | null;
  displayEligible: boolean;      // Passes quality gates for public display
  displayEligibilityReason: string | null; // If false, reason why
  sourceUrl: string;
  policyWordingUrl: string | null;
  brochureUrl: string | null;
  lastVerified: string;
  confidenceScore: "high" | "medium" | "low";
  verifiedBy: string | null;     // Admin user who verified
  notes: string;                 // Internal notes
  createdAt: string;
  updatedAt: string;
}

type ProductCategory =
  | "health"
  | "term_life"
  | "motor"
  | "travel"
  | "critical_illness"
  | "super_topup"
  | "group_health"
  | "ulip"
  | "home"
  | "cyber"
  | "pet";
```

#### ProductVariant

```typescript
interface ProductVariant {
  id: string;
  productId: string;             // FK -> Product
  name: string;                  // "Individual", "Family Floater", "Senior Citizen"
  variantType: string;
  isDefault: boolean;            // Show this variant by default in comparisons
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Feature

```typescript
interface Feature {
  id: string;
  productId: string;             // FK -> Product
  variantId: string | null;      // FK -> ProductVariant (null = applies to all)
  category: FeatureCategory;
  name: string;                  // "Room Rent Limit"
  value: string;                 // "No limit" or "1% of sum insured"
  valueType: "boolean" | "text" | "number" | "percentage" | "currency" | "enum";
  booleanValue: boolean | null;
  numericValue: number | null;
  isHighlight: boolean;          // Show in product card summary
  isComparisonKey: boolean;      // Include in comparison table
  displayOrder: number;
  sourceFieldName: string;       // Field name in source document
  sourceValue: string;           // Raw value from source
  confidenceScore: "high" | "medium" | "low";
  notes: string;
  version: number;
}

type FeatureCategory =
  | "coverage"
  | "benefit"
  | "limit"
  | "copay"
  | "deductible"
  | "network"
  | "claim_process"
  | "renewal"
  | "portability"
  | "tax_benefit"
  | "other";
```

#### Rider

```typescript
interface Rider {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;                  // "Critical Illness Rider"
  description: string;
  additionalPremium: string;     // "Varies" or "₹X per lakh"
  isOptional: boolean;
  sourceUrl: string;
  confidenceScore: "high" | "medium" | "low";
  version: number;
}
```

#### WaitingPeriod

```typescript
interface WaitingPeriod {
  id: string;
  productId: string;
  variantId: string | null;
  type: "initial" | "pre_existing" | "specific_disease" | "maternity";
  durationDays: number;
  durationDisplay: string;       // "30 days", "2 years", "3 years"
  description: string;
  conditions: string;
  confidenceScore: "high" | "medium" | "low";
  version: number;
}
```

#### Exclusion

```typescript
interface Exclusion {
  id: string;
  productId: string;
  variantId: string | null;
  category: "permanent" | "temporary" | "conditional";
  description: string;
  isStandard: boolean;           // Standard industry exclusion
  sourceReference: string;       // Section in policy wording
  confidenceScore: "high" | "medium" | "low";
  version: number;
}
```

#### SumInsuredBand

```typescript
interface SumInsuredBand {
  id: string;
  productId: string;
  variantId: string | null;
  minAmount: number;
  maxAmount: number;
  currency: string;              // "INR"
  displayLabel: string;          // "₹5 Lakh - ₹1 Crore"
  isPopular: boolean;            // Highlight in UI
  version: number;
}
```

#### EligibilityRule

```typescript
interface EligibilityRule {
  id: string;
  productId: string;
  variantId: string | null;
  ruleType: "age" | "income" | "occupation" | "location" | "medical" | "family_size";
  field: string;                 // "entry_age_min", "entry_age_max", etc.
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "between";
  value: string;                 // "18", "[18, 65]", etc.
  displayText: string;           // "Entry age: 18-65 years"
  confidenceScore: "high" | "medium" | "low";
  version: number;
}
```

#### PremiumIllustration

```typescript
interface PremiumIllustration {
  id: string;
  productId: string;
  variantId: string | null;
  sumInsured: number;
  age: number;
  gender: "male" | "female" | "any";
  coverType: string;             // "individual", "family_floater"
  familySize: string | null;     // "1A", "2A", "2A+1C", etc.
  annualPremium: number;
  premiumWithGst: number;
  gstRate: number;               // 0.18
  paymentFrequency: "annual" | "semi_annual" | "quarterly" | "monthly";
  sourceType: "calculator" | "brochure" | "quote" | "estimated";
  isIllustrative: boolean;       // true = must be disclaimed
  disclaimerText: string;
  sourceUrl: string;
  fetchedAt: string;             // When the premium was fetched
  confidenceScore: "high" | "medium" | "low";
  version: number;
}
```

#### SourceDocument

```typescript
interface SourceDocument {
  id: string;
  productId: string;
  type: "policy_wording" | "brochure" | "product_page" | "premium_calculator"
      | "regulatory_filing" | "press_release" | "annual_report";
  url: string;
  title: string;
  fetchedAt: string;
  contentHash: string;           // SHA-256 of fetched content
  pdfStoragePath: string | null; // Path to archived PDF
  isActive: boolean;
  trustLevel: "official" | "brochure" | "secondary" | "tertiary";
  version: number;
}
```

#### SourceSnapshot

```typescript
interface SourceSnapshot {
  id: string;
  sourceDocumentId: string;      // FK -> SourceDocument
  fetchedAt: string;
  contentHash: string;
  changeDetected: boolean;
  diffSummary: string | null;    // Human-readable summary of changes
  rawContentPath: string;        // Path to stored raw content
}
```

#### VerificationRecord

```typescript
interface VerificationRecord {
  id: string;
  entityType: string;            // "product", "feature", "premium", etc.
  entityId: string;              // FK -> the entity being verified
  fieldName: string | null;      // Null = entire entity, or specific field name
  verifiedBy: string;            // Admin user
  verifiedAt: string;
  previousConfidence: "high" | "medium" | "low";
  newConfidence: "high" | "medium" | "low";
  sourceDocumentId: string;      // FK -> SourceDocument used for verification
  notes: string;
}
```

#### UpdateEvent

```typescript
interface UpdateEvent {
  id: string;
  entityType: string;
  entityId: string;
  changeType: "create" | "update" | "verify" | "unpublish" | "republish";
  previousVersion: number;
  newVersion: number;
  changedFields: string[];       // List of field names that changed
  source: "ingestion" | "manual" | "admin_review" | "api";
  triggeredBy: string;           // User or system identifier
  createdAt: string;
  requiresReview: boolean;
  reviewStatus: "pending" | "approved" | "rejected" | null;
}
```

#### ReviewDecision

```typescript
interface ReviewDecision {
  id: string;
  updateEventId: string;         // FK -> UpdateEvent
  reviewedBy: string;            // Admin user
  decision: "approve" | "reject" | "edit_and_approve";
  reason: string;
  editedFields: Record<string, { before: string; after: string }> | null;
  decidedAt: string;
}
```

### Versioning Strategy

Every entity that holds product data supports versioning:

```
Product v1 (created) -> Product v2 (premium updated) -> Product v3 (feature added)
    │                        │                               │
    └─ UpdateEvent           └─ UpdateEvent                  └─ UpdateEvent
         │                        │                               │
         └─ ReviewDecision        └─ ReviewDecision              └─ (pending)
```

Rules:
- Version numbers are monotonically increasing integers per entity.
- A new version is created on any field change (except `lastVerified` timestamp-only updates).
- The `displayEligible` flag is evaluated on the latest version only.
- Previous versions are retained for audit trail and rollback.
- The public site always serves the latest approved version.

### Confidence Scoring

| Level | Criteria | Display | Eligible for Public? |
|---|---|---|---|
| **High** | Verified from official policy wording or regulatory filing by an admin within 90 days | Green badge | Yes |
| **Medium** | Extracted from official product page or brochure, not yet manually verified | Yellow badge | Yes (with disclaimer) |
| **Low** | From secondary source, user report, or outdated primary source | Red badge | No (admin review required) |

Confidence is tracked per-field, not just per-entity. A product can have high confidence on its name but medium confidence on its premium illustration.

### Display Eligibility Controls

A product passes display eligibility when ALL of the following are true:

```typescript
function isDisplayEligible(product: Product): boolean {
  return (
    product.isActive &&
    product.confidenceScore !== "low" &&
    daysSince(product.lastVerified) <= 180 &&
    product.version === latestApprovedVersion(product.id) &&
    hasRequiredFields(product) &&
    !hasPendingCriticalUpdate(product.id) &&
    !isUnderDispute(product.id)
  );
}
```

Required fields for display eligibility:
- Product name, insurer, category
- At least one sum insured band
- At least one eligibility rule (age)
- At least 3 features with `isHighlight: true`
- Source URL that returns HTTP 200
- `lastVerified` within 180 days

### Stale Data Detection

The system runs a daily staleness check:

| Age | Status | Action |
|---|---|---|
| 0-30 days | Fresh | No action |
| 31-90 days | Aging | Yellow indicator on admin dashboard |
| 91-180 days | Stale | Auto-trigger re-fetch; alert admin |
| 181+ days | Critical | Remove from public display; admin alert |

---

## 4. Ingestion Pipeline Architecture

### Pipeline Stages

```
┌──────────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐
│   Source      │    │          │    │          │    │            │
│   Discovery   │───▶│  Fetch   │───▶│  Parse   │───▶│ Normalize  │
│              │    │          │    │          │    │            │
└──────────────┘    └──────────┘    └──────────┘    └────────────┘
                                                          │
                                                          ▼
┌──────────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐
│              │    │          │    │  Review   │    │            │
│   Publish    │◀───│  Queue   │◀───│          │◀───│  Verify    │
│              │    │          │    │          │    │            │
└──────────────┘    └──────────┘    └──────────┘    └────────────┘
```

### Stage 1: Source Discovery

**Purpose:** Maintain a registry of all data sources per insurer and product.

```typescript
interface SourceRegistry {
  insurerId: string;
  sources: {
    type: "product_page" | "brochure_pdf" | "premium_calculator" | "policy_wording" | "annual_report";
    url: string;
    fetchMethod: "http_get" | "headless_browser" | "api_call" | "manual";
    schedule: "daily" | "weekly" | "monthly" | "on_demand";
    priority: number;             // Lower = higher priority
    robotsTxtCompliant: boolean;  // Must be true
    rateLimit: number;            // Minimum seconds between requests
    lastChecked: string;
    healthStatus: "healthy" | "degraded" | "down";
  }[];
}
```

Discovery rules:
- Each insurer has at least one official product page source.
- PDF sources (brochures, policy wordings) are checked monthly.
- Premium calculators are checked weekly (higher change frequency).
- New sources are added manually by admin; the system does not auto-discover.

### Stage 2: Fetch

**Purpose:** Retrieve content from registered sources, respecting rate limits and robots.txt.

Implementation:
- **HTTP fetcher**: Standard GET requests for product pages. User-Agent identifies Zura crawler.
- **Headless browser fetcher**: For JavaScript-rendered pages (Puppeteer/Playwright).
- **PDF fetcher**: Download and store PDFs locally.
- **Rate limiter**: Per-domain rate limiting. Default: 1 request per 5 seconds per domain.
- **robots.txt parser**: Check compliance before every fetch. If disallowed, flag for manual review.
- **Retry logic**: 3 retries with exponential backoff (5s, 15s, 45s).
- **Content hashing**: SHA-256 hash of response body stored with every fetch.

```typescript
interface FetchResult {
  sourceId: string;
  fetchedAt: string;
  httpStatus: number;
  contentHash: string;
  contentType: string;
  rawContentPath: string;       // Stored to disk
  previousHash: string | null;
  changeDetected: boolean;       // Hash differs from previous
  fetchDurationMs: number;
}
```

### Stage 3: Parse

**Purpose:** Extract structured data from raw content.

Parsers by content type:

| Content Type | Parser | Output |
|---|---|---|
| HTML product page | DOM parser (Cheerio) + CSS selectors | Key-value pairs |
| PDF brochure | pdf-parse + layout analysis | Structured text blocks |
| PDF policy wording | pdf-parse + section detection | Clause-level text |
| JSON API response | Direct mapping | Structured data |
| Premium calculator | Headless browser + form submission | Premium data points |

PDF parsing pipeline:
1. Extract raw text with layout preservation.
2. Detect document structure (headings, tables, lists).
3. Identify insurance-specific sections (coverage, exclusions, waiting periods, claims).
4. Extract key-value pairs from tables.
5. Flag ambiguous extractions for human review.

### Stage 4: Normalize

**Purpose:** Map parsed data to the Zura schema.

```typescript
interface NormalizationResult {
  entityType: string;
  entityId: string;
  fields: {
    fieldName: string;
    extractedValue: string;       // Raw extracted value
    normalizedValue: string;      // Mapped to schema format
    confidenceScore: "high" | "medium" | "low";
    extractionMethod: string;     // "css_selector", "pdf_table", "regex", etc.
    requiresReview: boolean;      // True if ambiguous
  }[];
}
```

Normalization rules:
- Currency values: Strip symbols, convert to base unit (paise for INR), store as integers.
- Percentages: Store as decimals (0.18 not 18%).
- Age ranges: Parse "18-65 years" into min/max fields.
- Sum insured: Parse "5 Lakh to 1 Crore" into min/max numeric values.
- Boolean features: Map "Yes/No/Available/Not Available/Included" to true/false.
- Waiting periods: Parse "30 days/2 years/36 months" to days.

### Stage 5: Verify

**Purpose:** Cross-check extracted data against existing records and detect anomalies.

Verification checks:
1. **Schema validation** — All required fields present, correct types.
2. **Range validation** — Values within expected bounds (e.g., premium > 0, age 0-150).
3. **Consistency check** — New values compared against previous version. Flag large changes (e.g., premium changed by >50%).
4. **Cross-source validation** — If multiple sources exist for same field, check agreement.
5. **Contradiction detection** — Flag if extracted data contradicts other fields on same product.

### Stage 6: Queue

**Purpose:** Route verified changes to the appropriate review queue.

Queue routing rules:

| Change Type | Auto-Approve? | Queue |
|---|---|---|
| No change (same hash) | Yes (skip) | — |
| Minor change (typo, formatting) | Yes | — |
| Feature value change | No | Standard review |
| Premium change | No | Standard review |
| New product detected | No | Priority review |
| Product removed/discontinued | No | Priority review |
| Source URL broken | No | Source health queue |
| Large change (>5 fields) | No | Priority review |

### Stage 7: Publish

**Purpose:** Apply approved changes to the production dataset and trigger site rebuild.

Publish flow:
1. Create new version of affected entity.
2. Update `displayEligible` flag.
3. Trigger ISR revalidation for affected pages.
4. Update search index.
5. Log publish event.

### Source Health Monitoring

```typescript
interface SourceHealthReport {
  sourceId: string;
  checkInterval: string;          // "daily", "weekly"
  lastSuccessfulFetch: string;
  consecutiveFailures: number;
  currentStatus: "healthy" | "degraded" | "down";
  issues: {
    type: "http_error" | "robots_blocked" | "content_empty" | "structure_changed" | "timeout";
    firstDetected: string;
    description: string;
  }[];
}
```

Escalation:
- 1 failure: Retry in 1 hour.
- 3 consecutive failures: Mark as degraded, alert admin.
- 7 consecutive failures: Mark as down, flag all products from this source for review.
- Source structure change: Pause automated parsing, alert admin for parser update.

---

## 5. Admin Workflow

### Dashboard Overview

The admin dashboard (`/admin`) provides:

1. **Review Queue** — Pending changes from ingestion pipeline.
2. **Product Manager** — CRUD operations on all entities.
3. **Source Manager** — Source registry, health monitoring.
4. **Stale Data Alerts** — Products exceeding freshness thresholds.
5. **Verification Tracker** — Field-level verification status across all products.
6. **Publish Controls** — Manual publish/unpublish with audit trail.

### Review Queue

```
┌─────────────────────────────────────────────────────────────┐
│ REVIEW QUEUE                                    [3 pending] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ● PRIORITY: HDFC ERGO Optima Secure — Premium Changed      │
│   Changed: annualPremium (₹12,500 → ₹13,200)              │
│   Source: Official premium calculator                       │
│   Detected: 2 hours ago                                     │
│   [View Diff] [Approve] [Reject] [Edit & Approve]          │
│                                                             │
│ ○ STANDARD: ICICI Lombard Complete Health — Feature Update  │
│   Changed: roomRentLimit ("1% of SI" → "No limit")         │
│   Source: Product page                                      │
│   Detected: 1 day ago                                       │
│   [View Diff] [Approve] [Reject] [Edit & Approve]          │
│                                                             │
│ ○ STANDARD: Star Health Comprehensive — New Rider Added     │
│   Added: "Personal Accident Rider"                          │
│   Source: Brochure PDF                                      │
│   Detected: 3 days ago                                      │
│   [View Diff] [Approve] [Reject] [Edit & Approve]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Source vs. Extracted Field Comparison

When reviewing a change, the admin sees a side-by-side view:

```
┌───────────────────────┬───────────────────────┬──────────────┐
│ Field                 │ Source (Raw)           │ Extracted    │
├───────────────────────┼───────────────────────┼──────────────┤
│ Room Rent Limit       │ "No Room Rent Capping" │ "No limit"   │
│ Day Care Procedures   │ "Day care covered"     │ true         │
│ Pre-existing Wait     │ "3 yrs waiting period" │ 1095 days    │
│ Annual Premium (30M)  │ "₹13,200* + GST"      │ ₹13,200      │
└───────────────────────┴───────────────────────┴──────────────┘
                         * Source shows raw text from page
                         * Extracted shows normalized value
```

### Field-Level Verification

Each field on a product can be individually verified:

- Click on any field value in the admin view.
- Select source document (dropdown of registered sources for this product).
- Confirm value matches source.
- Field confidence upgrades to "high".
- Verification record created with admin identity and timestamp.

### Publish/Unpublish Controls

| Action | Effect | Trigger |
|---|---|---|
| Publish | Product appears on public site | Admin approval after review |
| Unpublish | Product removed from public site | Admin action or auto (stale) |
| Force Publish | Override display eligibility gates | Admin only, logged with reason |
| Rescan | Trigger immediate re-fetch of all sources for a product | Admin button |

### Stale Record Alerts

The dashboard shows a staleness overview:

```
┌────────────────────────────────────────────────────────┐
│ DATA FRESHNESS                                         │
├────────────────────────────────────────────────────────┤
│ Fresh (0-30d):    ████████████░░░░░░░░  12 products   │
│ Aging (31-90d):   ██████░░░░░░░░░░░░░░   5 products   │
│ Stale (91-180d):  ░░░░░░░░░░░░░░░░░░░░   0 products   │
│ Critical (180d+): ░░░░░░░░░░░░░░░░░░░░   0 products   │
├────────────────────────────────────────────────────────┤
│ [Rescan All Aging] [View Stale Products]               │
└────────────────────────────────────────────────────────┘
```

---

## 6. Frontend Architecture

### Framework

Next.js 16 with App Router. Key architectural decisions:

| Decision | Choice | Rationale |
|---|---|---|
| Rendering | SSG + ISR | Performance + data freshness |
| Routing | App Router (`/app`) | Layouts, loading states, streaming |
| Styling | Tailwind CSS v4 | Utility-first, design-system-friendly |
| Icons | Lucide React | Consistent, tree-shakeable |
| State | URL params + React state | No global state library needed for comparison |
| Data | JSON files (current), API routes (future) | Simplicity now, database-ready schema |

### Route Structure

```
src/app/
├── page.tsx                          # Homepage
├── layout.tsx                        # Root layout with nav, footer, disclaimers
├── compare/
│   ├── page.tsx                      # Category selector
│   └── [category]/
│       ├── page.tsx                  # Category comparison page (filterable list)
│       └── [productSlug]/
│           └── page.tsx              # Product detail page
├── insurer/
│   └── [slug]/
│       └── page.tsx                  # Insurer profile page
├── insurers/
│   └── page.tsx                      # Insurer directory
├── learn/
│   ├── page.tsx                      # Education hub
│   └── [slug]/
│       └── page.tsx                  # Individual article
├── methodology/
│   └── page.tsx                      # Data methodology
├── about/
│   └── page.tsx                      # About Zura
├── contact/
│   └── page.tsx                      # Contact form
├── waitlist/
│   └── page.tsx                      # Early access signup
├── disclaimer/
│   └── page.tsx                      # Legal notices
└── admin/                            # Admin routes (future)
    ├── page.tsx                      # Dashboard
    ├── review/
    │   └── page.tsx                  # Review queue
    ├── products/
    │   ├── page.tsx                  # Product list
    │   └── [id]/
    │       └── page.tsx              # Product editor
    ├── sources/
    │   └── page.tsx                  # Source manager
    └── settings/
        └── page.tsx                  # System settings
```

### Component Library (Design System)

#### Atoms
- `Badge` — Confidence, freshness, status indicators
- `Button` — Primary, secondary, ghost, danger variants
- `Icon` — Wrapper around Lucide icons
- `Tooltip` — Hover explanations for insurance terms
- `Input` — Text, number, select, checkbox, radio
- `Tag` — Category, feature, filter tags

#### Molecules
- `ProductCard` — Product summary with key metrics, confidence badge, CTA
- `FeatureRow` — Single feature in a comparison table (label + value per product)
- `FilterBar` — Active filters with clear controls
- `SearchInput` — Search with typeahead suggestions
- `FreshnessIndicator` — Last-verified date with color coding
- `SourceAttribution` — "Data from [source]" with link
- `DisclaimerBanner` — Contextual disclaimer (page-level, comparison-level)

#### Organisms
- `ComparisonTable` — Full side-by-side product comparison with sticky headers
- `ProductList` — Filterable, sortable product grid/list
- `FilterPanel` — Faceted navigation (age, sum insured, features, insurer)
- `ProductDetail` — Full product page with tabs (overview, features, exclusions, riders)
- `InsurerProfile` — Insurer page with products, ratings, details
- `CategoryNav` — Category selection with counts
- `HeroBanner` — Homepage/category hero with search
- `ComparisonSelector` — Floating bar showing selected products for comparison

#### Templates
- `CategoryPage` — Layout for comparison category pages
- `ProductPage` — Layout for product detail pages
- `AdminPage` — Layout for admin routes (sidebar nav, content area)
- `ArticlePage` — Layout for educational content

### Comparison Engine

The comparison engine runs client-side for instant interactivity:

```typescript
interface ComparisonState {
  selectedProductIds: string[];     // Max 4
  category: ProductCategory;
  filters: FilterState;
  sortBy: SortOption;
  highlightDifferences: boolean;
  featureGroups: FeatureGroup[];    // Grouped features for display
}

interface FilterState {
  ageRange: [number, number] | null;
  sumInsuredRange: [number, number] | null;
  insurerIds: string[];
  features: Record<string, string[]>;  // Feature name -> required values
  confidenceMin: "high" | "medium" | "low";
  maxStaleDays: number;
}

type SortOption =
  | "coverage_breadth"
  | "premium_low_to_high"
  | "premium_high_to_low"
  | "claim_settlement_ratio"
  | "freshness"
  | "name_asc";
```

Comparison flow:
1. User lands on category page with all products displayed.
2. Applies filters (faceted navigation on left/top).
3. Selects 2-4 products via checkbox on product cards.
4. Clicks "Compare Selected" or products auto-appear in sticky comparison bar.
5. Comparison table renders with all features grouped by category.
6. "Highlight Differences" toggle bolds cells where values differ.
7. Mobile: swipe between products instead of side-by-side table.

### Search with Faceted Navigation

```
┌──────────────────────────────────────────────────┐
│  Search: [health insurance for family________]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  FILTERS                 │  RESULTS (12 found)   │
│  ─────────               │                       │
│  Category:               │  [ProductCard]         │
│  ☑ Health                │  [ProductCard]         │
│  ☐ Term Life             │  [ProductCard]         │
│  ☐ Motor                 │  ...                   │
│  ☐ Travel                │                       │
│                          │  Sort: Coverage ▼      │
│  Sum Insured:            │                       │
│  ₹3L ────●──── ₹1Cr     │                       │
│                          │                       │
│  Age:                    │                       │
│  18 ──●──────── 65       │                       │
│                          │                       │
│  Insurer:                │                       │
│  ☑ All                   │                       │
│  ☐ HDFC ERGO             │                       │
│  ☐ ICICI Lombard         │                       │
│  ☐ Star Health           │                       │
│                          │                       │
│  Features:               │                       │
│  ☐ No room rent limit    │                       │
│  ☐ Day care covered      │                       │
│  ☐ Maternity covered     │                       │
│                          │                       │
└──────────────────────────┘
```

### Mobile-First Responsive Grid

Breakpoints:

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column, stacked cards, swipe comparison |
| Tablet | 640-1024px | Two-column grid, sidebar filters collapse to top bar |
| Desktop | 1024-1440px | Three-column grid, persistent sidebar filters |
| Wide | > 1440px | Four-column grid, max-width container |

### Performance Budget

| Metric | Target | Measurement |
|---|---|---|
| LCP (Largest Contentful Paint) | < 1.5s | Category pages, product pages |
| FID (First Input Delay) | < 50ms | Filter interactions, comparison selection |
| CLS (Cumulative Layout Shift) | < 0.05 | No layout shifts from loading data |
| TTFB (Time to First Byte) | < 200ms | CDN-served static pages |
| Bundle size (JS) | < 150KB gzipped | First load |
| Image optimization | WebP/AVIF, lazy loading | All product/insurer images |

Performance strategies:
- Static generation for all product and category pages.
- ISR with 1-hour revalidation for pages with frequently changing data.
- Code splitting per route.
- Font subsetting (only Latin + Devanagari characters needed).
- Image optimization pipeline (next/image with CDN).
- No client-side data fetching on initial page load (all data embedded in static HTML).

---

## 7. Data Quality Framework

### Source Trust Levels

Sources are ranked by reliability:

| Level | Trust | Examples | Auto-Approve? |
|---|---|---|---|
| **Official** | Highest | Policy wording PDF, IRDAI regulatory filings, insurer annual reports | No (but high confidence) |
| **Primary** | High | Official product page, insurer premium calculator | No |
| **Brochure** | Medium-High | Marketing brochure PDF, product leaflet | No |
| **Secondary** | Medium | Aggregator sites, financial advisor blogs, news articles | No |
| **Tertiary** | Low | User reports, social media, forums | No (flagged for verification) |

Rule: A field's confidence score cannot exceed the trust level of its source. A field extracted from a secondary source cannot be marked "high" confidence.

### Field Validation Rules

```typescript
const validationRules: Record<string, ValidationRule[]> = {
  "product.name": [
    { type: "required" },
    { type: "minLength", value: 3 },
    { type: "maxLength", value: 200 },
  ],
  "premiumIllustration.annualPremium": [
    { type: "required" },
    { type: "min", value: 100 },
    { type: "max", value: 10000000 },
    { type: "integer" },
  ],
  "eligibilityRule.entryAgeMin": [
    { type: "required" },
    { type: "min", value: 0 },
    { type: "max", value: 100 },
    { type: "lessThan", field: "eligibilityRule.entryAgeMax" },
  ],
  "waitingPeriod.durationDays": [
    { type: "required" },
    { type: "min", value: 0 },
    { type: "max", value: 3650 },  // Max 10 years
  ],
  "sumInsuredBand.minAmount": [
    { type: "required" },
    { type: "min", value: 0 },
    { type: "lessThan", field: "sumInsuredBand.maxAmount" },
  ],
};
```

### Freshness Scoring

Each entity has a freshness score calculated as:

```typescript
function freshnessScore(entity: { lastVerified: string }): number {
  const daysSince = daysBetween(entity.lastVerified, today());
  if (daysSince <= 30) return 100;                         // Fresh
  if (daysSince <= 90) return 100 - (daysSince - 30);      // Linear decay
  if (daysSince <= 180) return 30 - ((daysSince - 90) * 0.33); // Steep decay
  return 0;                                                 // Stale
}
```

Display rules:
- Score >= 70: Green badge
- Score 30-69: Yellow badge
- Score 1-29: Red badge
- Score 0: Not displayed publicly

### Human Verification Checkpoints

Automated ingestion can update data, but these actions always require human review:

1. **New product creation** — Must be verified against at least one official source.
2. **Product discontinuation** — Must be confirmed (insurer may have restructured, not discontinued).
3. **Premium changes > 20%** — Likely indicates a data extraction error.
4. **Sum insured range changes** — Critical for comparison accuracy.
5. **Feature removal** — Could be extraction error or genuine product change.
6. **Source URL change** — May indicate product restructuring.

### Contradiction Detection

The system checks for contradictions between:

1. **Same field, different sources** — If product page says "No room rent limit" but brochure says "1% of SI", flag for review.
2. **Related fields** — If max sum insured < min sum insured, flag.
3. **Historical consistency** — If a premium drops by 50% between versions, flag.
4. **Cross-product consistency** — If all competitors have a 30-day initial waiting period but one product shows 0, flag for verification.

### Display Eligibility Gates

Before a product appears on the public site, it must pass through these gates:

```
Gate 1: Schema Complete     → All required fields populated
Gate 2: Confidence Check    → No "low" confidence on critical fields
Gate 3: Freshness Check     → Last verified within 180 days
Gate 4: Source Health        → At least one source URL returns HTTP 200
Gate 5: Admin Approval      → Latest version approved by admin
Gate 6: Disclaimer Present  → Product has associated disclaimer text
Gate 7: No Pending Disputes → No unresolved contradictions
```

A product that fails any gate is removed from public display with a specific reason logged.

---

## 8. Scalability & Multi-Market Readiness

### Geography/Market Fields

Every core entity carries `geographyId` and `marketId` fields:

```typescript
// All queries are scoped to a market
function getProducts(marketId: string, category: ProductCategory): Product[] {
  return products.filter(p => p.marketId === marketId && p.category === category);
}

// Frontend routes are geography-aware
// /in/compare/health          (India)
// /us/compare/health          (US — future)
// /gb/compare/health          (UK — future)
```

### Modular Compliance Rules

```typescript
interface MarketComplianceRules {
  marketId: string;
  disclaimers: {
    perPage: string;
    perComparison: string;
    perPremium: string;
    footer: string;
  };
  displayRules: {
    canShowPremiums: boolean;
    canShowRankings: boolean;
    canShowRecommendations: boolean;
    canShowBuyLinks: boolean;
    requiresLicenseForLeadCapture: boolean;
    maxProductsInComparison: number;
  };
  requiredFields: string[];       // Fields that must be present for display
  prohibitedContent: string[];    // Content types not allowed
  regulatoryLinks: {
    regulatorName: string;
    regulatorUrl: string;
    licenseCheckUrl: string;
  };
}
```

Example for India (current):

```typescript
const indiaRules: MarketComplianceRules = {
  marketId: "IN-IRDAI",
  disclaimers: {
    perPage: "Information on this page is for educational purposes only...",
    perComparison: "This comparison is based on publicly available information...",
    perPremium: "Premium figures are illustrative and may vary...",
    footer: "Zura is not an IRDAI-registered insurance intermediary...",
  },
  displayRules: {
    canShowPremiums: true,          // With illustrative disclaimer
    canShowRankings: false,         // Not without methodology + licence
    canShowRecommendations: false,  // Requires advisory licence
    canShowBuyLinks: false,         // Requires intermediary licence
    requiresLicenseForLeadCapture: false,  // Waitlist is allowed
    maxProductsInComparison: 4,
  },
  requiredFields: ["name", "insurerId", "category", "sourceUrl"],
  prohibitedContent: ["best_policy", "top_policy", "recommended", "number_one"],
  regulatoryLinks: {
    regulatorName: "IRDAI",
    regulatorUrl: "https://irdai.gov.in",
    licenseCheckUrl: "https://irdai.gov.in/registered-entities",
  },
};
```

### Category Taxonomy

The category system is designed to work globally:

```typescript
const globalTaxonomy: CategoryDefinition[] = [
  {
    id: "health",
    label: { en: "Health Insurance", hi: "स्वास्थ्य बीमा" },
    subcategories: ["individual", "family_floater", "senior_citizen", "super_topup", "critical_illness", "group"],
    availableIn: ["IN", "US", "GB", "DE"],
  },
  {
    id: "life",
    label: { en: "Life Insurance", hi: "जीवन बीमा" },
    subcategories: ["term", "endowment", "ulip", "whole_life", "money_back"],
    availableIn: ["IN", "US", "GB", "DE"],
  },
  {
    id: "motor",
    label: { en: "Motor Insurance", hi: "मोटर बीमा" },
    subcategories: ["car_comprehensive", "car_third_party", "two_wheeler", "commercial"],
    availableIn: ["IN", "US", "GB", "DE"],
  },
  {
    id: "travel",
    label: { en: "Travel Insurance", hi: "यात्रा बीमा" },
    subcategories: ["international", "domestic", "student", "business"],
    availableIn: ["IN", "US", "GB"],
  },
  {
    id: "home",
    label: { en: "Home Insurance", hi: "गृह बीमा" },
    subcategories: ["structure", "contents", "comprehensive"],
    availableIn: ["US", "GB", "DE"],
  },
  {
    id: "cyber",
    label: { en: "Cyber Insurance", hi: "साइबर बीमा" },
    subcategories: ["individual", "business"],
    availableIn: ["IN", "US"],
  },
];
```

### Multi-Country Ingestion

The ingestion pipeline supports multi-country sources through:

1. **Source registry per market** — Each market has its own set of registered sources.
2. **Parser configuration per market** — Different page structures per country require different parsing rules.
3. **Normalization rules per market** — Currency, date formats, regulatory numbers differ.
4. **Compliance validation per market** — Each market applies its own display eligibility rules.

### i18n-Ready Frontend

Internationalization is built into the frontend architecture:

```typescript
// Locale detection
// /in/compare/health          → locale: "en-IN"
// /in/hi/compare/health       → locale: "hi-IN" (future)
// /us/compare/health          → locale: "en-US" (future)

// Translation structure
const translations = {
  "en-IN": {
    "compare.title": "Compare Insurance Plans",
    "compare.filter.age": "Your Age",
    "compare.filter.sumInsured": "Sum Insured",
    "product.disclaimer": "This information is for educational purposes only.",
  },
  "hi-IN": {
    "compare.title": "बीमा योजनाओं की तुलना करें",
    "compare.filter.age": "आपकी उम्र",
    "compare.filter.sumInsured": "बीमित राशि",
    "product.disclaimer": "यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है।",
  },
};
```

---

## 9. Tech Stack

### Core Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16 | SSG, ISR, App Router |
| Language | TypeScript | 5.x | Type safety across codebase |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| Icons | Lucide React | Latest | Consistent iconography |
| Data (current) | JSON files | — | Static data in `src/data/` |
| Data (next) | SQLite | — | Local database, migration step |
| Data (target) | PostgreSQL | 16+ | Production database |
| ORM (future) | Drizzle ORM | Latest | Type-safe database queries |

### Ingestion Stack

| Component | Technology | Purpose |
|---|---|---|
| HTTP fetcher | `undici` / `node-fetch` | Fast HTTP requests |
| Headless browser | Playwright | JS-rendered pages |
| PDF parser | `pdf-parse` + `pdf2json` | Extract text from PDFs |
| Rate limiter | Custom (token bucket) | Per-domain rate limiting |
| Scheduler | `node-cron` | Scheduled fetch jobs |
| Queue | In-memory (BullMQ future) | Job queue for ingestion tasks |
| Content hashing | Node.js `crypto` | SHA-256 for change detection |

### Admin Stack

| Component | Technology | Purpose |
|---|---|---|
| Admin routes | Next.js App Router (`/admin`) | Admin pages |
| Auth (future) | NextAuth.js / Clerk | Admin authentication |
| Forms | React Hook Form + Zod | Form handling + validation |
| Tables | TanStack Table | Sortable, filterable admin tables |
| Rich text | TipTap | Article/content editing |

### Infrastructure

| Component | Technology | Purpose |
|---|---|---|
| Hosting | Vercel (primary) / Cloudflare Pages (alternative) | Edge deployment, ISR support |
| CDN | Vercel Edge Network / Cloudflare | Global static asset delivery |
| DNS | Cloudflare | DNS management, DDoS protection |
| Monitoring | Vercel Analytics + Web Vitals | Performance monitoring |
| Error tracking | Sentry | Runtime error capture |
| Email | Resend | Transactional emails, waitlist notifications |

### Development Tools

| Tool | Purpose |
|---|---|
| ESLint + Prettier | Code quality and formatting |
| Vitest | Unit and integration testing |
| Playwright | E2E testing |
| Husky + lint-staged | Pre-commit hooks |
| GitHub Actions | CI/CD pipeline |

### Migration Path

```
Phase 1 (Current):   JSON files  →  Next.js SSG  →  Vercel
Phase 2 (Next):      SQLite      →  Next.js SSG + ISR  →  Vercel
Phase 3 (Target):    PostgreSQL  →  Next.js SSR + ISR  →  Vercel + DB
Phase 4 (Scale):     PostgreSQL  →  Microservices  →  Cloud (AWS/GCP)
```

The JSON schema defined in Section 3 is designed to map directly to relational tables. The migration from JSON to SQLite to PostgreSQL requires no schema changes — only a change in the data access layer.

---

## Appendix A: File Structure

```
zura/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (public)/             # Public-facing routes
│   │   └── admin/                # Admin routes (future)
│   ├── components/
│   │   ├── atoms/                # Badge, Button, Tooltip, etc.
│   │   ├── molecules/            # ProductCard, FeatureRow, etc.
│   │   ├── organisms/            # ComparisonTable, ProductList, etc.
│   │   └── templates/            # Page layouts
│   ├── data/                     # JSON data files (current data store)
│   ├── lib/
│   │   ├── comparison/           # Comparison engine logic
│   │   ├── validation/           # Field validation rules
│   │   ├── freshness/            # Staleness detection
│   │   └── compliance/           # Per-market compliance rules
│   ├── types/                    # TypeScript type definitions
│   └── styles/                   # Global styles, Tailwind config
├── scripts/
│   ├── ingest/                   # Ingestion pipeline scripts
│   │   ├── fetch.ts              # HTTP/browser fetchers
│   │   ├── parse.ts              # Content parsers
│   │   ├── normalize.ts          # Data normalization
│   │   └── verify.ts             # Automated verification checks
│   ├── health/                   # Source health monitoring
│   └── migrate/                  # Data migration scripts
├── data/
│   ├── sources/                  # Source registry JSON
│   ├── snapshots/                # Archived source content
│   └── field-dictionary.json     # Field definitions
├── docs/
│   ├── architecture.md           # This document
│   ├── india-compliance-risk.md  # India compliance and risk note
│   ├── project-plan.md           # Project plan
│   ├── data-update-workflow.md   # Data update procedures
│   └── future-roadmap.md         # Roadmap
└── tests/
    ├── unit/                     # Unit tests
    ├── integration/              # Integration tests
    └── e2e/                      # End-to-end tests
```

## Appendix B: Key Design Decisions Log

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| Data store (MVP) | JSON files | SQLite, Supabase | Simplest deployment, no server needed, easy to edit |
| Framework | Next.js 16 | Astro, Remix | Best SSG + ISR support, largest ecosystem |
| Styling | Tailwind v4 | CSS Modules, Styled Components | Fastest development, consistent design tokens |
| Comparison engine | Client-side | Server-side | Instant filtering, no API latency, small dataset |
| Versioning | Per-entity integer | Git-based, event-sourcing | Simple, auditable, database-friendly |
| Confidence scoring | Per-field | Per-entity only | More granular, better trust signals |
| Display gating | Automated + manual | Fully automated | Prevents bad data from reaching users |
| Multi-market | Schema-level from day one | Add later | Avoids costly schema migration |
