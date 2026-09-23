# Data-quality report

Generated 2026-09-23 08:48 UTC by `npm run registry -- quality-report`. Registry schema v1, jurisdiction `in`.

**VALID** — 0 validation error(s), 0 warning(s), 0 item(s) awaiting review.

## Coverage

| Collection | Records | Notes |
| --- | ---: | --- |
| Sources | 25 | 17 crawlable, 7 manual-only, 1 API |
| Insurers | 16 | 15 with IRDAI registration no., 14 with CIN, 16 linked to an existing page |
| Products | 50 | 35 with UIN (70%), 23 linked to an existing page |
| Documents | 73 | 0 currently unavailable |
| Statistics | 12 | across 1 reporting period(s) |

## Provenance

Every stored fact carries a source URL, a retrieval time and, where the source
shows it, the verbatim evidence. The pipeline re-fetched each source and
confirmed the evidence was present before accepting it.

| Measure | Count |
| --- | ---: |
| Facts verified in visible page text | 229 |
| Facts found only in embedded structured data | 0 |
| Records retrieved manually (robots-blocked sources) | 0 |

## Products

| Measure | Count |
| --- | ---: |
| UIN format: life | 14 |
| UIN format: non-life | 20 |
| UIN format: non-life-legacy | 1 |
| Products meeting the product-page indexability bar | 27 |

## Source access

| Source | Method | robots.txt | Checked |
| --- | --- | --- | --- |
| IRDAI | manual | disallowed | 2026-09-23 |
| Government of India Open Government Data Platform | api | not-applicable | 2026-09-16 |
| Acko official website | crawl | allowed | 2026-09-23 |
| Bajaj General Insurance Limited official website | crawl | allowed | 2026-09-23 |
| Bajaj Life Insurance Limited official website | crawl | allowed | 2026-09-23 |
| Care Health official website | manual | refused | 2026-09-23 |
| Go Digit official website | crawl | allowed | 2026-09-23 |
| HDFC ERGO official website | crawl | disallowed | 2026-09-23 |
| HDFC Life official website | manual | refused | 2026-09-23 |
| ICICI Lombard official website | manual | refused | 2026-09-23 |
| ICICI Prudential Life official website | manual | refused | 2026-09-23 |
| LIC official website | crawl | unreachable | 2026-09-23 |
| ManipalCigna official website | crawl | allowed | 2026-09-23 |
| Axis Max Life Insurance official website | crawl | allowed | 2026-09-23 |
| National Insurance Company Limited official website | crawl | unreachable | 2026-09-23 |
| New India Assurance official website | crawl | unreachable | 2026-09-23 |
| Niva Bupa official website | crawl | allowed | 2026-09-23 |
| The Oriental Insurance Company Ltd. official website | crawl | allowed | 2026-09-23 |
| PNB MetLife official website | crawl | allowed | 2026-09-23 |
| IndusInd General Insurance official website | crawl | allowed | 2026-09-23 |
| SBI General Insurance official website | crawl | allowed | 2026-09-23 |
| SBI Life official website | manual | refused | 2026-09-23 |
| Star Health official website | manual | allowed | 2026-09-23 |
| Tata AIA Life Insurance official website | crawl | allowed | 2026-09-23 |
| Tata AIG official website | crawl | allowed | 2026-09-23 |

## Job history

| Job | Last run | OK | Summary |
| --- | --- | --- | --- |
| ingest | 2026-09-19 22:19 | yes | 3 accepted, 2 unchanged, 0 held, 0 rejected, 0 documents |
| check-documents | 2026-09-16 09:13 | yes | 22 ok, 0 changed, 0 unavailable |
| check-sources | 2026-09-23 08:48 | **no** | 25 sources checked, 5 changed, 4 now blocking a crawl source |

## Validation

No issues.

## Review queue

Empty.
