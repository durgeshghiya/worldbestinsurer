# Finance section — weekly publishing workflow

The `/finance` section is human-curated, one article a week, researched
against primary sources (IRDAI, the Income Tax Act, insurer filings, RBI
circulars, etc.). This file is the end-to-end instructions for adding a
new article.

## File structure

```
src/
  data/
    finance/
      <slug>.json         ← one file per article
  lib/
    finance.ts            ← auto-discovers every JSON in the directory
  app/
    finance/
      page.tsx            ← /finance (listing)
      [slug]/page.tsx     ← /finance/[slug] (detail)
```

There is no import list to maintain — drop a JSON file, commit, push, and
Vercel rebuilds the sitemap + the listing page + a static page for the
article on the next deploy. `dynamicParams = false` on the article route
so any URL not matching a current JSON slug 404s at the router (no
sitemap/route drift).

## JSON schema

See `src/lib/finance.ts` for the authoritative `FinanceArticle` interface.
Every field is required; `tags` and `sources` can be empty arrays but not
omitted.

| Field          | Required | Notes                                                |
| -------------- | :------: | ---------------------------------------------------- |
| `slug`         |    ✓     | Must equal the filename (no extension).              |
| `title`        |    ✓     | 50–70 chars for best SERP appearance.                |
| `excerpt`      |    ✓     | 140–200 chars. Used for `<meta description>` + OG.   |
| `publishedAt`  |    ✓     | `YYYY-MM-DD`. Never change after first publish.      |
| `lastUpdated`  |    ✓     | `YYYY-MM-DD`. Bump whenever you edit the body.       |
| `author`       |    ✓     | Defaults to `"WBI Editorial Team"`.                  |
| `category`     |    ✓     | Tax Planning, Monetary Policy, Investments, etc.     |
| `tags`         |    ✓     | 3–6 short tags; show as chips on the article page.   |
| `readTime`     |    ✓     | Human-readable — `"7 min"` is the convention.        |
| `sections[]`   |    ✓     | Each = `{ heading, body }`. 6–10 sections ideal.     |
| `sources[]`    |    ✓     | Each = `{ title, url }`. Primary sources only.       |

## Weekly cadence

The commitment is **one article per week**, not one per day. If a week
slips, catch up the next week with the same quality bar — never publish
filler to "keep the streak." Google's Helpful Content system is tuned to
penalize that exact pattern.

### Topic selection

1. Open Google Search Console → Performance → Queries
2. Filter to queries with >10 impressions and 0 clicks (our "nearly ranking
   but missing the specific answer" set)
3. Pick one finance-adjacent query where we can write a better answer than
   what currently ranks
4. Write, cite, publish

Good categories: Section 80C/80D/80G deductions, NPS, health insurance tax
angles, ULIP vs mutual-fund comparisons, annuity basics, RBI rate changes
as they affect credit-linked insurance products.

Avoid: stock tips, IPO analysis, individual scheme recommendations — not
our topical authority, and Google penalizes off-topic expansion.

### Research standard

- Every factual claim must cite a primary source. IRDAI, the Income Tax
  Act, RBI, SEBI, or the insurer's own filing. No blog posts, no AI
  summaries, no Wikipedia as a primary cite.
- Prefer specific numbers (`Rs 25,000`, `10% of sum assured`, `FY2024-25`)
  over vague statements.
- When rules change (they do, annually) come back and bump `lastUpdated`.

## Indexing

The finance section is included in the site's dynamic sitemap. Google
re-reads the sitemap on their own schedule (currently landing within a
week of any change based on late-April 2026 observations). No manual
ping step — those endpoints were retired in 2023.

For faster first-crawl after publishing, paste the new article URL into
Search Console → URL Inspection → Request Indexing. That gets the page
into Google's queue within hours rather than days. Limit is ~10 requests
per day per property, which is more than enough for this cadence.

## What this section is NOT

- **Not** auto-generated. Every word is written or reviewed by a human.
- **Not** daily. One deep piece a week beats seven shallow ones for SEO.
- **Not** news. We do not break news, we explain mechanics.
- **Not** advice. The disclaimer at the bottom of every article is real —
  we cannot and do not give personalized tax or investment advice.
