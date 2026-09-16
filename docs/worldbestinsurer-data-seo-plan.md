# WorldBestInsurer — Public Insurance Data & SEO Architecture Plan

*Written 16 September 2026, after a full audit of the repository and live site.*

This plan adds an India-focused, provenance-backed insurance data layer
("the registry") to the existing site. Everything is additive: no existing
URL, page, data file or route is removed or renamed. Read §14 (Risks) before
changing anything here — two findings in it constrain the whole design.

---

## 1. Existing architecture

| Layer | What exists | Notes |
| --- | --- | --- |
| Frontend | Next.js **16.2.1**, App Router, React 19.2, Tailwind 4 | Breaking changes vs. training data — consult `node_modules/next/dist/docs/` |
| Rendering | Static generation via `generateStaticParams`; several routes `dynamicParams = false` | ~3,700 pages built per deploy |
| Backend | Next.js route handlers under `src/app/api/` | No separate server |
| **Database** | **None.** Data is JSON in `src/data/**`, read at build time by `src/lib/data.ts` | `src/lib/storage.ts` writes to `/tmp` on Vercel — ephemeral, lost on cold start |
| Hosting | Vercel (`sin1`), deploys on push to `master` (~3–4 min) | `trailingSlash: true`, images unoptimized |
| DNS / CDN | Cloudflare in front; prepends a managed AI-bot block to robots.txt | |
| Auth / admin | **No auth system.** `/admin` is public (noindex) | §14 |
| API | `/api/v1/{insurers,products,compare}` with API-key auth (`src/lib/api-auth.ts`), in-memory rate limit | One hard-coded public demo key |
| Analytics | GA4 `G-PGW5QZ146V`, Consent Mode v2, Funding Choices CMP | |
| Ads | AdSense `ca-pub-4984848270074853`, not approved; all ad slots env-gated off | |
| Search | Client-side ⌘K search over `src/lib/search-index.ts` | |
| Email | Resend (contact, leads) | |
| Scripts | `scripts/` — ingestion (normalizer/validator/differ/merger), a robots.txt-respecting crawler, a review queue (`scripts/agent/review.ts`), SEO tooling | Some of it is unsafe — §14 |
| CI | `.github/workflows/daily-index.yml` | Submits URLs to Google's Indexing API — §14 |

## 2. Existing SEO architecture

- **Metadata**: per-route `generateMetadata`; every indexable route carries an explicit self-canonical (fixed June 2026 after a layout-level fallback made pages canonicalise to the homepage).
- **Sitemap**: one metadata route, `src/app/sitemap.ts`, **643 URLs**, trailing slashes normalised (fixed Sept 2026 — previously every entry 308'd).
- **robots.txt**: served from `src/app/robots.ts` (disallows `/api/`, `/admin/`, `/debug/`). `public/robots.txt` also exists but is shadowed and never served.
- **Structured data**: `src/components/StructuredData.tsx` — Organization, WebSite, Product (with AggregateOffer), Article, BreadcrumbList, FAQPage, ItemList. The fabricated `AggregateRating` was removed in Sept 2026.
- **Index controls**: `noindex, follow` on VS pages, insurer-VS pages, city × category pages, Learn articles under 500 words, and insurer pages with zero products.
- **Indexing state (Search Console, 4 Sep 2026)**: 2,930 indexed; 12,154 "Crawled — currently not indexed"; 7,569 404s (legacy, decaying).

## 3. Existing URL structure

Country-scoped URLs are canonical. Legacy top-level routes canonicalise to them.

| Pattern | Status | Notes |
| --- | --- | --- |
| `/` | indexable | |
| `/{cc}/` | indexable | 12 country hubs |
| `/{cc}/compare/{category}/` | indexable | the comparison tool; category ∈ health, term-life, motor, travel |
| `/{cc}/insurer/{slug}/` | indexable **if it has products** | canonical insurer page |
| `/{cc}/insurers/` | indexable | per-country insurer directory |
| `/{cc}/product/{id}/` | indexable | canonical product page |
| `/insurer/{slug}/`, `/product/{id}/` | canonical → `/{cc}/…` | legacy tree, kept live |
| `/compare/{category}/` | indexable | global category hubs |
| `/{cc}/vs/…`, `/vs/…` | noindex | permutation pages |
| `/learn/`, `/finance/`, `/reports/`, `/insights/` | indexable | editorial |
| 1,215 removed product IDs | 301 → compare page | `src/lib/removed-products.ts` via `src/proxy.ts` |

**Decision: the registry uses these URLs, not new ones.** The brief suggests
`/insurer/{slug}/` and `/insurance-product/{slug}/`, and says to prefer
existing conventions. `/in/insurer/{slug}/` and `/in/product/{id}/` already
exist and are canonical. A parallel `/insurance-product/` tree would publish
every product at two URLs — the exact duplicate-tree problem removed in June
2026. Registry records render on the existing routes.

## 4. Existing database

There is none. The effective "tables" are:

| File | Records (India) | Fields of note |
| --- | ---: | --- |
| `src/data/in/insurers.json` | 34 | slug, name, type, categories, website, HQ, established; `claimSettlementRatio.value` withheld |
| `src/data/in/{health,term-life,motor,travel}-insurance.json` | 62 | premium, sum insured, eligibility, `sourceUrl`, `lastVerified`, `confidenceScore`; **no UIN on any record** |
| `src/data/reports/*.json`, `src/data/finance/*.json` | 4, 12 | editorial |

### Decision: keep the file-backed model, add a typed access layer

Introducing Postgres or Supabase would replace the architecture, which the brief
says to avoid unless necessary. It is not necessary at this scale: the
registry is read at build time, and every page is statically generated. The
file-backed model also gives three things for free:

- **History** — git records every change; the registry adds an append-only changelog on top.
- **A review queue** — pipeline output lands as a pull request, not a silent write.
- **Zero runtime cost** — no connection pool, no cold-start queries.

Pages never read registry files directly. They go through `src/lib/registry/`,
so moving to Postgres later changes one module, not every page.

"Tables" below are therefore typed JSON collections with a schema version and
migration scripts, validated on every build.

## 5. What can be reused

| Existing piece | Reused for |
| --- | --- |
| `/in/insurer/[slug]/`, `/in/product/[id]/`, `/in/insurers/`, `/in/compare/[category]/` | rendering registry records (enriched, not replaced) |
| Header, footer, tokens, cards, tables | every new UI surface |
| `scripts/utils/robots-checker.ts` | robots.txt compliance in every connector |
| `scripts/crawler/config.ts` rate limits and honest user agent | connector fetch policy |
| `src/lib/api-auth.ts` | auth and rate limiting on the registry API |
| `StructuredData.tsx` (Breadcrumb, FAQ, Organization) | JSON-LD for registry pages |
| `scripts/utils/logger.ts` | ingestion job logs |
| The indexability pattern already used on Learn and insurer pages | generalised into one module |

## 6. What needs to be added

1. `src/lib/registry/` — types, loader, provenance helpers, validators, indexability, internal linking.
2. `src/data/registry/in/` — the sourced collections.
3. `scripts/registry/` — the ingestion pipeline (connectors, normalizers, validators, jobs, review queue, reports).
4. Registry panels on insurer and product pages; registry-only pages on the same routes.
5. `/in/products/` — a product and UIN directory (discovery surface).
6. `/in/insurance-statistics/` — gated statistics pages.
7. `/api/v1/registry/*` — the internal API.
8. A segmented sitemap index.
9. `scripts/registry/seo-audit.ts` and `quality-report.ts`.
10. A scheduled refresh workflow, and registry monitoring on `/admin`.

## 7. Data sources

Checked directly on 16 Sep 2026 with the site's crawler user agent.

| Source | Access | How we use it |
| --- | --- | --- |
| **IRDAI** (`irdai.gov.in`) | robots.txt is `User-agent: * / Disallow: /` — **blocks all automated access**, including Googlebot | **No crawler.** A human downloads the published file (insurer list, product list, handbook) and drops it in the manual inbox; the pipeline records the source URL and retrieval date |
| **data.gov.in** | Website returns 403 to crawlers. The official API (`api.data.gov.in/resource/{id}`) is the sanctioned programmatic route | API connector; needs a free key in `DATA_GOV_IN_API_KEY`. Disabled until one is set |
| **Insurer websites** | Varies per site. 22 checked insurers permit crawling; 8 return 403 (bot protection) | Crawl only where robots.txt allows. 403 sites are human-inbox only |
| **Insurer public disclosures** (IRDAI-mandated) | Hosted on insurer sites | Same rule as above; PDF parsing needs a parser dependency (none installed) |

Insurers whose robots.txt permits access (16 Sep 2026): LIC, Max Life, Tata AIG,
Niva Bupa, HDFC ERGO, New India Assurance, Aditya Birla Capital, Bajaj General,
IndusInd Insurance (formerly Reliance General), PNB MetLife, Go Digit, Acko,
ManipalCigna, Oriental Insurance, SBI General, IFFCO Tokio, Chola MS, Universal
Sompo, Shriram General, Bajaj Allianz Life, IndiaFirst Life, Edelweiss Life,
Pramerica Life.

Blocked by bot protection: HDFC Life, SBI Life, ICICI Prudential, ICICI Lombard,
Star Health, Care Health, Kotak Life, Canara HSBC Life, Royal Sundaram, Liberty,
SUD Life.

**Nothing bypasses a CAPTCHA, login, paywall, robots rule or 403.** A blocked
source is recorded as blocked, and its data arrives only through the manual inbox.

## 8. New "tables" (collections)

All live in `src/data/registry/in/`. Every important field is a
`Sourced<T>` — a value that cannot exist without its provenance.

```ts
interface Provenance {
  sourceId: string;         // key into sources.json
  url: string;              // the exact page or document
  retrievedAt: string;      // when we fetched it (ISO)
  sourceDate?: string;      // the date the source itself states
  reportingPeriod?: string; // "FY2024-25", "Q1 FY2026-27"
  evidence?: string;        // verbatim text that proves the value
  license?: string;
  notes?: string;
}
interface Sourced<T> { value: T; provenance: Provenance }
```

| Collection | Key | Contents |
| --- | --- | --- |
| `sources.json` | `id` | publisher, kind (regulator / government / insurer), access method (crawl / api / manual), robots status, licence |
| `insurers.json` | `slug` | name, legal name, insurer type, segments, IRDAI registration no., CIN, website, HQ, status (active / renamed / merged), former names, link to existing site record |
| `products.json` | `slug` | insurer, name, **UIN**, product type, segment, status (active / withdrawn), policy term, eligibility, premium frequency, sum insured, link to existing site product |
| `documents.json` | `id` | kind (policy wording, prospectus, brochure, CIS, proposal form, claim form, disclosure), title, **official URL only**, content hash, last HTTP status |
| `statistics.json` | `id` | scope, metric, value, unit, reporting period, provenance with `sourceDate` required. **Append-only**; a restatement is a new record with `supersedes` |
| `changelog.jsonl` | — | append-only field-level history of every change |
| `review-queue.json` | `id` | records the validators refused to auto-accept |
| `_meta.json` | — | schema version, last run per job |

Documents store the official URL, never a copy of the document.

## 9. New API endpoints

Added under the existing `/api/v1/` namespace so the documented API is untouched.
All use the existing key auth and rate limiter, paginate (`page`, `pageSize` ≤ 100),
validate input, set CDN cache headers, and log.

```
GET /api/v1/registry/insurers
GET /api/v1/registry/insurers/{slug}
GET /api/v1/registry/insurers/{slug}/products
GET /api/v1/registry/insurers/{slug}/statistics
GET /api/v1/registry/products
GET /api/v1/registry/products/{slug}
GET /api/v1/registry/categories
GET /api/v1/registry/statistics
GET /api/v1/registry/search?q=
```

No write endpoints. Data enters only through the pipeline.

## 10. New and enhanced page types

| URL | Type | Indexable when |
| --- | --- | --- |
| `/in/insurer/{slug}/` | enhanced + registry-only insurers | the indexability rules in §13 pass |
| `/in/product/{id}/` | enhanced + registry-only products | §13 |
| `/in/insurers/` | enhanced directory, grouped by IRDAI segment | always |
| `/in/products/` | **new** product and UIN directory | ≥ 10 sourced products |
| `/in/compare/{category}/` | enhanced with insurers, statistics, FAQs | always (existing) |
| `/in/insurance-statistics/` | **new** | ≥ 5 sourced statistics |
| `/in/insurance-statistics/{period}/` | **new** | ≥ 5 sourced statistics for that period |
| `/in/vs/insurer/{a}-vs-{b}/` | existing, currently all noindex | both insurers share ≥ 3 sourced statistics for the same period |

**Category URLs.** The brief lists `/health-insurance/`, `/car-insurance/` and
others. `/compare/{category}/` and `/in/compare/{category}/` already serve those
topics; a second URL per topic would split ranking signals between two pages.
The existing hubs are enhanced instead. Home and commercial insurance have no
data at all, so a hub for them would be exactly the empty page §13 forbids —
the segment model supports them, and they appear when data does.

## 11. Sitemap architecture

`/sitemap.xml` becomes a **sitemap index** (same URL — Search Console needs no
change) pointing to:

```
/sitemap-core.xml        homepage, hubs, policy pages
/sitemap-insurers.xml    indexable insurer pages
/sitemap-products.xml    indexable product pages
/sitemap-categories.xml  compare hubs and directories
/sitemap-editorial.xml   learn, finance, reports
/sitemap-statistics.xml  statistics pages (empty until gated in)
```

Every child is built from one function, `getIndexableUrls()`, which applies the
indexability rules. A URL cannot be in a sitemap and carry `noindex`, because
both read the same decision. Segmenting lets Search Console report indexing
per page type.

## 12. Internal linking

`src/lib/registry/linking.ts` computes relationships from the data, so no link
is hand-maintained:

```
insurer ⇄ its products ⇄ their category hub
insurer → insurers in the same IRDAI segment
insurer → its statistics → the statistics page for that period
product → other products from the insurer, and in the same category
directories → every indexable insurer and product
```

`seo-audit.ts` fails the build report if any sitemap URL has no inbound
internal link.

## 13. Indexing strategy

One module, `src/lib/registry/indexability.ts`, returns
`{ indexable: boolean, reasons: string[] }` for every page. Pages that fail
render normally with `noindex, follow` and stay out of every sitemap.

**Insurer page** — indexable when all hold: sourced name and website; at least
one provenance record; and at least one of (a listed product, a sourced
statistic, two official documents plus a registration number).

**Registry-only product page** — sourced name; a UIN that passes format
validation; at least one official document; at least two of (policy term,
eligibility, premium frequency, sum insured).

**Existing product pages** keep their current status — they survived two audits.

No artificial indexing. The Google Indexing API is only licensed for job-posting
and livestream pages, so its use here is removed (§14). IndexNow remains, for
URLs whose content actually changed.

## 14. Risks

**Found in the audit — these shape the design:**

1. **`scripts/generate-products.js` is still runnable.** It generates products
   with "culturally plausible product names" for real insurers — it is the
   source of the 667 invented products deleted in September. It is disabled
   so it cannot run again.
2. **`.github/workflows/daily-index.yml` submits 200 URLs a day to the Google
   Indexing API**, which is licensed only for `JobPosting` and `BroadcastEvent`
   pages. The step is removed; IndexNow on genuine changes is kept.
3. **IRDAI blocks all crawlers.** The regulator cannot be a live source. Its
   data enters through the manual inbox only.
4. **`/admin` is public.** It will require HTTP Basic auth when `ADMIN_PASSWORD`
   is set, and keeps `noindex` either way.
5. **No PDF parser is installed**, and most official statistics are PDFs. Phase
   10 is scoped to HTML and API sources until one is added.

**General:**

- **Fabrication.** The site's history is invented data presented as fact. Every
  registry field is `Sourced<T>`, and the validator re-fetches the source and
  confirms the evidence text is present before accepting a record. Missing
  data renders as "Not available in the current public data."
- **Thin pages at scale.** Mitigated by §13; the audit script flags any leak.
- **Name drift.** Insurers rebrand (Reliance General → IndusInd Insurance; Bajaj
  Allianz → Bajaj General). Former names are kept with dates, and the
  validator flags name mismatches instead of silently overwriting.
- **Implied affiliation.** Every registry page states the site is not
  affiliated with IRDAI, the Government of India, or any insurer.
- **Copyright.** Official documents are linked, never copied.
- **Build time.** Registry lookups are indexed maps, loaded once per build.

## 15. Implementation phases

| # | Phase | Deliverable |
| --- | --- | --- |
| 1 | Audit | this section's findings |
| 2 | Document | this file |
| 3 | Data model | `src/lib/registry/types.ts`, collections, schema version |
| 4 | Pipeline | `scripts/registry/` with an insurer-site connector, manual-inbox connector and data.gov.in connector |
| 5 | Test import | 10 insurers, 20 products, documents, statistics — each verified against its source |
| 6 | API | `/api/v1/registry/*` |
| 7 | Insurer pages | registry panel + registry-only insurers |
| 8 | Product pages | registry panel + registry-only products + `/in/products/` |
| 9 | Category pages | registry data on compare hubs; segment grouping on the directory |
| 10 | Statistics | `/in/insurance-statistics/` (gated) |
| 11 | Sitemap | segmented index |
| 12 | Structured data | Dataset, Organization-per-insurer, Product, FAQ, Breadcrumb — visible content only |
| 13 | Internal linking | `linking.ts` wired into all registry pages |
| 14 | Freshness | `.github/workflows/registry-refresh.yml` (daily / weekly / monthly), PR-based |
| 15 | SEO audit | `docs/seo-audit-report.md`, `docs/data-quality-report.md` |
| 16 | Scale | only after 15 passes |

**Adding a record end to end** (the final requirement): add a candidate to the
inbox or a connector → `npm run registry:ingest` → validation → PR → merge →
Vercel builds → the page, metadata, JSON-LD, internal links and sitemap entry
all derive from the record. No HTML is written by hand.
