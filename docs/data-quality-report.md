# Data-quality report

Generated 2026-09-17 08:52 UTC by `npm run registry -- quality-report`. Registry schema v1, jurisdiction `in`.

**VALID** — 0 validation error(s), 0 warning(s), 0 item(s) awaiting review.

## Coverage

| Collection | Records | Notes |
| --- | ---: | --- |
| Sources | 18 | 10 crawlable, 7 manual-only, 1 API |
| Insurers | 10 | 9 with IRDAI registration no., 8 with CIN, 10 linked to an existing page |
| Products | 20 | 15 with UIN (75%), 11 linked to an existing page |
| Documents | 22 | 0 currently unavailable |
| Statistics | 12 | across 1 reporting period(s) |

## Provenance

Every stored fact carries a source URL, a retrieval time and, where the source
shows it, the verbatim evidence. The pipeline re-fetched each source and
confirmed the evidence was present before accepting it.

| Measure | Count |
| --- | ---: |
| Facts verified in visible page text | 104 |
| Facts found only in embedded structured data | 0 |
| Records retrieved manually (robots-blocked sources) | 0 |

## Products

| Measure | Count |
| --- | ---: |
| UIN format: non-life | 9 |
| UIN format: life | 6 |
| Products meeting the product-page indexability bar | 13 |

## Source access

| Source | Method | robots.txt | Checked |
| --- | --- | --- | --- |
| IRDAI | manual | disallowed | 2026-09-17 |
| Government of India Open Government Data Platform | api | not-applicable | 2026-09-16 |
| LIC official website | crawl | allowed | 2026-09-17 |
| Axis Max Life Insurance official website | crawl | allowed | 2026-09-17 |
| PNB MetLife official website | crawl | allowed | 2026-09-17 |
| Niva Bupa official website | crawl | allowed | 2026-09-17 |
| ManipalCigna official website | crawl | allowed | 2026-09-17 |
| HDFC ERGO official website | crawl | allowed | 2026-09-17 |
| Tata AIG official website | crawl | allowed | 2026-09-17 |
| New India Assurance official website | crawl | allowed | 2026-09-17 |
| Go Digit official website | crawl | allowed | 2026-09-17 |
| Acko official website | crawl | allowed | 2026-09-17 |
| HDFC Life official website | manual | refused | 2026-09-17 |
| SBI Life official website | manual | refused | 2026-09-17 |
| ICICI Prudential Life official website | manual | refused | 2026-09-17 |
| ICICI Lombard official website | manual | refused | 2026-09-17 |
| Star Health official website | manual | allowed | 2026-09-17 |
| Care Health official website | manual | refused | 2026-09-17 |

## Job history

| Job | Last run | OK | Summary |
| --- | --- | --- | --- |
| ingest | 2026-09-16 09:12 | yes | 0 accepted, 42 unchanged, 0 held, 0 rejected, 0 documents |
| check-documents | 2026-09-16 09:13 | yes | 22 ok, 0 changed, 0 unavailable |
| check-sources | 2026-09-17 08:52 | yes | 18 sources checked, 1 changed, 0 now blocking a crawl source |

## Validation

No issues.

## Review queue

Empty.
