# Data-quality report

Generated 2026-09-21 09:28 UTC by `npm run registry -- quality-report`. Registry schema v1, jurisdiction `in`.

**VALID** — 0 validation error(s), 25 warning(s), 44 item(s) awaiting review.

## Coverage

| Collection | Records | Notes |
| --- | ---: | --- |
| Sources | 25 | 17 crawlable, 7 manual-only, 1 API |
| Insurers | 16 | 15 with IRDAI registration no., 14 with CIN, 16 linked to an existing page |
| Products | 50 | 35 with UIN (70%), 23 linked to an existing page |
| Documents | 73 | 25 currently unavailable |
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
| IRDAI | manual | disallowed | 2026-09-16 |
| Government of India Open Government Data Platform | api | not-applicable | 2026-09-16 |
| Acko official website | crawl | allowed | 2026-09-16 |
| Bajaj General Insurance Limited official website | crawl | allowed | 2026-09-20 |
| Bajaj Life Insurance Limited official website | crawl | allowed | 2026-09-20 |
| Care Health official website | manual | refused | 2026-09-16 |
| Go Digit official website | crawl | allowed | 2026-09-16 |
| HDFC ERGO official website | crawl | allowed | 2026-09-16 |
| HDFC Life official website | manual | refused | 2026-09-16 |
| ICICI Lombard official website | manual | refused | 2026-09-16 |
| ICICI Prudential Life official website | manual | refused | 2026-09-16 |
| LIC official website | crawl | allowed | 2026-09-16 |
| ManipalCigna official website | crawl | allowed | 2026-09-16 |
| Axis Max Life Insurance official website | crawl | allowed | 2026-09-16 |
| National Insurance Company Limited official website | crawl | allowed | 2026-09-20 |
| New India Assurance official website | crawl | allowed | 2026-09-16 |
| Niva Bupa official website | crawl | allowed | 2026-09-16 |
| The Oriental Insurance Company Ltd. official website | crawl | allowed | 2026-09-20 |
| PNB MetLife official website | crawl | allowed | 2026-09-16 |
| IndusInd General Insurance official website | crawl | allowed | 2026-09-20 |
| SBI General Insurance official website | crawl | allowed | 2026-09-20 |
| SBI Life official website | manual | refused | 2026-09-16 |
| Star Health official website | manual | refused | 2026-09-16 |
| Tata AIA Life Insurance official website | crawl | allowed | 2026-09-20 |
| Tata AIG official website | crawl | allowed | 2026-09-16 |

## Job history

| Job | Last run | OK | Summary |
| --- | --- | --- | --- |
| ingest | 2026-09-21 09:25 | **no** | 0 accepted, 59 unchanged, 0 held, 19 rejected, 3 documents |
| check-documents | 2026-09-21 09:28 | **no** | 48 ok, 0 changed, 25 unavailable |
| check-sources | 2026-09-16 09:13 | yes | 18 sources checked, 0 changed, 0 now blocking a crawl source |

## Validation

| Level | Code | Message |
| --- | --- | --- |
| warning | broken-document | document:06bceaa512f17350: last check returned HTTP 0 |
| warning | broken-document | document:15fc6f5a5070bdbb: last check returned HTTP 0 |
| warning | broken-document | document:16cbd481b7bcbe16: last check returned HTTP 0 |
| warning | broken-document | document:212c3f8fe164c911: last check returned HTTP 0 |
| warning | broken-document | document:29ddadc5cffbb33a: last check returned HTTP 0 |
| warning | broken-document | document:35c22c1d93d5efa3: last check returned HTTP 0 |
| warning | broken-document | document:400c15f0bc063200: last check returned HTTP 0 |
| warning | broken-document | document:41b7c56212efe74b: last check returned HTTP 0 |
| warning | broken-document | document:49371676109afdb4: last check returned HTTP 0 |
| warning | broken-document | document:4bf5e3e2aa0e97c7: last check returned HTTP 0 |
| warning | broken-document | document:54e6fa1f29a3c23f: last check returned HTTP 0 |
| warning | broken-document | document:559032eaa673ce70: last check returned HTTP 0 |
| warning | broken-document | document:5e36af8e2d9d939b: last check returned HTTP 0 |
| warning | broken-document | document:5fc5733cf1e6029b: last check returned HTTP 0 |
| warning | broken-document | document:78057c1bbaacf620: last check returned HTTP 0 |
| warning | broken-document | document:9e17790e5524d341: last check returned HTTP 0 |
| warning | broken-document | document:b9af041fe5513a07: last check returned HTTP 0 |
| warning | broken-document | document:bfb5796a9b6cc3bb: last check returned HTTP 0 |
| warning | broken-document | document:c787e48c64da1331: last check returned HTTP 0 |
| warning | broken-document | document:cf3d06e64c4a1d1d: last check returned HTTP 0 |
| warning | broken-document | document:cf790ae09669d5ed: last check returned HTTP 0 |
| warning | broken-document | document:e94a299d05b7db10: last check returned HTTP 0 |
| warning | broken-document | document:eba4c15773de2c40: last check returned HTTP 0 |
| warning | broken-document | document:f9cdfa4d18c04730: last check returned HTTP 0 |
| warning | broken-document | document:fa3e0d24e5a6db71: last check returned HTTP 0 |

## Review queue

| Item | Kind | Reason |
| --- | --- | --- |
| `national-insurance-identity` | insurer | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows nationalinsurance.nic.co.in/about-us/overview/about-company \| insurerType: robots: robots.txt disallows nationalinsurance.nic.co.in/about-us/overview/about-company \| website: robots: robots.txt disallows nationalin |
| `new-india-assurance-identity` | insurer | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows www.newindia.co.in/ \| insurerType: robots: robots.txt disallows www.newindia.co.in/ \| website: robots: robots.txt disallows www.newindia.co.in/ \| legalName: robots: robots.txt disallows www.newindia.co.in/ \| irda |
| `niva-bupa-identity` | insurer | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows www.nivabupa.com/ \| insurerType: robots: robots.txt disallows www.nivabupa.com/ \| website: robots: robots.txt disallows www.nivabupa.com/ \| legalName: robots: robots.txt disallows www.nivabupa.com/ \| irdaiRegistr |
| `national-insurance-p1` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/base-products/private-car-package-policy \| sumInsured: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/base-products/private-car-packa |
| `national-insurance-p2` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/travel/national-overseas-travel-policy \| uin: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/travel/national-overseas-travel-policy \ |
| `national-insurance-p3` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/health/national-senior-citizen-mediclaim-policy-nscmp \| uin: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/health/national-senior-ci |
| `national-insurance-p4` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/health/national-parivar-mediclaim-plus-policy-floater-policy \| uin: robots: robots.txt disallows nationalinsurance.nic.co.in/products/all-products/health/national-pa |
| `new-india-assurance-p1` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows www.newindia.co.in/health-insurance/arogya-sanjeevani-policy \| uin: robots: robots.txt disallows www.newindia.co.in/health-insurance/arogya-sanjeevani-policy \| sumInsured: robots: robots.txt disallows www.newindia. |
| `new-india-assurance-p2` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows www.newindia.co.in/health-insurance/janata-mediclaim-policy \| uin: robots: robots.txt disallows www.newindia.co.in/health-insurance/janata-mediclaim-policy |
| `niva-bupa-p1` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows www.nivabupa.com/family-health-insurance-plans/reassurev2-insurance.html |
| `niva-bupa-p2` | product | REJECTED: required fact(s) failed verification — name: robots: robots.txt disallows www.nivabupa.com/health-insurance-plans/senior-first-get-quote.html \| eligibility: robots: robots.txt disallows www.nivabupa.com/health-insurance-plans/senior-first-get-quote.html |
| `lic-fy2025-26-dcsr-no` | statistic | REJECTED: required fact(s) failed verification — value: evidence text was not found on the source page \| period: evidence text was not found on the source page |
| `lic-fy2025-26-dcsr-amt` | statistic | REJECTED: required fact(s) failed verification — period: evidence text was not found on the source page |
| `lic-fy2025-26-mcsr-no` | statistic | REJECTED: required fact(s) failed verification — value: evidence text was not found on the source page \| period: evidence text was not found on the source page |
| `lic-fy2025-26-mcsr-amt` | statistic | REJECTED: required fact(s) failed verification — period: evidence text was not found on the source page |
| `lic-fy2025-26-death-claims-count` | statistic | REJECTED: required fact(s) failed verification — value: evidence text was not found on the source page \| period: evidence text was not found on the source page |
| `lic-fy2025-26-maturity-claims-count` | statistic | REJECTED: required fact(s) failed verification — value: evidence text was not found on the source page \| period: evidence text was not found on the source page |
| `lic-fy2025-26-death-claims-paid` | statistic | REJECTED: required fact(s) failed verification — value: evidence text was not found on the source page \| period: evidence text was not found on the source page |
| `lic-fy2025-26-maturity-claims-paid` | statistic | REJECTED: required fact(s) failed verification — value: evidence text was not found on the source page \| period: evidence text was not found on the source page |
| `document:06bceaa512f17350` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Rate%20Chart.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Rate%20Chart.pdf |
| `document:15fc6f5a5070bdbb` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20CIS.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20CIS.pdf |
| `document:16cbd481b7bcbe16` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Proposal%20Form.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Proposal%20Form.pdf |
| `document:212c3f8fe164c911` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Rate%20Chart.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Rate%20Chart.pdf |
| `document:29ddadc5cffbb33a` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Claim%20Form.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Claim%20Form.pdf |
| `document:35c22c1d93d5efa3` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-06/NSCMP%20-%20Prospectus.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-06/NSCMP%20-%20Prospectus.pdf |
| `document:400c15f0bc063200` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Policy%20Wordings.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Policy%20Wordings.pdf |
| `document:41b7c56212efe74b` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-06/NSCMP%20-%20Policy%20Wordings.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-06/NSCMP%20-%20Policy%20Wordings.pdf |
| `document:49371676109afdb4` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/Private%20Car-package%20policy-Base%20Product-Terms%20and%20Conditions_0.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Private%20Car-package%20policy-Base%20Pro |
| `document:4bf5e3e2aa0e97c7` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/Terms%20and%20Conditions%20for%20Liability%20only%20Policy_1.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Terms%20and%20Conditions%20for%20Liability%20only%20P |
| `document:54e6fa1f29a3c23f` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/Long%20term%20PC%20Bundled%20Policy_0.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Long%20term%20PC%20Bundled%20Policy_0.pdf |
| `document:559032eaa673ce70` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20CIS.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20CIS.pdf |
| `document:5e36af8e2d9d939b` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Prospectus_0.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Prospectus_0.pdf |
| `document:5fc5733cf1e6029b` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Claim%20Form.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Claim%20Form.pdf |
| `document:78057c1bbaacf620` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Prospectus.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Prospectus.pdf |
| `document:9e17790e5524d341` | document | document no longer available (robots: robots.txt disallows licindia.in/documents/20121/1500493/LIC_Jeevan+amar_Sales+Brochure_4+inch+x+9+inch_Eng+%281%29.pdf/b75c96c5-0d69-2b23-6c5a-d0c05f6e7b81) — https://licindia.in/documents/20121/1500493/LIC_Jeevan+amar_Sales+Brochure_4+inch+x+9+inch_Eng+%281%29 |
| `document:b9af041fe5513a07` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/Claim%20Form_16_4.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Claim%20Form_16_4.pdf |
| `document:bfb5796a9b6cc3bb` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP-Proposal.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP-Proposal.pdf |
| `document:c787e48c64da1331` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Proposal%20Form.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Proposal%20Form.pdf |
| `document:cf3d06e64c4a1d1d` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20CIS.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20CIS.pdf |
| `document:cf790ae09669d5ed` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/SAOD%20Private%20Car%20Policy.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/SAOD%20Private%20Car%20Policy.pdf |
| `document:e94a299d05b7db10` | document | document no longer available (robots: robots.txt disallows licindia.in/documents/20121/290753/LIC_New+Tech+Term_Sales+Brochure_4+inch+x+9+inch_Eng+%282%29.pdf/d75b9948-b9e3-2ba1-9886-066a1bee6909) — https://licindia.in/documents/20121/290753/LIC_New+Tech+Term_Sales+Brochure_4+inch+x+9+inch_Eng+%282% |
| `document:eba4c15773de2c40` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Claim%20Form.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Claim%20Form.pdf |
| `document:f9cdfa4d18c04730` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Policy%20Wordings.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Policy%20Wordings.pdf |
| `document:fa3e0d24e5a6db71` | document | document no longer available (robots: robots.txt disallows nationalinsurance.nic.co.in/sites/default/files/2026-04/National%20Overseas%20Travel%20Policy%20Rate%20Chart_0.pdf) — https://nationalinsurance.nic.co.in/sites/default/files/2026-04/National%20Overseas%20Travel%20Policy%20Rate%20Chart_0.pdf |

## Unavailable documents

- HTTP 0 — NSCMP Rate Chart: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Rate%20Chart.pdf
- HTTP 0 — NSCMP CIS: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20CIS.pdf
- HTTP 0 — NSCMP Proposal: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Proposal%20Form.pdf
- HTTP 0 — NPMPP Rate Chart: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Rate%20Chart.pdf
- HTTP 0 — NPMPP Claim Form: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Claim%20Form.pdf
- HTTP 0 — NSCMP - Prospectus: https://nationalinsurance.nic.co.in/sites/default/files/2026-06/NSCMP%20-%20Prospectus.pdf
- HTTP 0 — NOTP Wordings: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Policy%20Wordings.pdf
- HTTP 0 — NSCMP Wordings: https://nationalinsurance.nic.co.in/sites/default/files/2026-06/NSCMP%20-%20Policy%20Wordings.pdf
- HTTP 0 — Terms and Conditions for Private Car Package Policy-Base Product: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Private%20Car-package%20policy-Base%20Product-Terms%20and%20Conditions_0.pdf
- HTTP 0 — Terms and Conditions for Liability only Policy: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Terms%20and%20Conditions%20for%20Liability%20only%20Policy_1.pdf
- HTTP 0 — Long term PC Bundled Policy: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Long%20term%20PC%20Bundled%20Policy_0.pdf
- HTTP 0 — NPMPP CIS: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20CIS.pdf
- HTTP 0 — NPMPP Prospectus: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Prospectus_0.pdf
- HTTP 0 — NSCMP Claim Form: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NSCMP%20-%20Claim%20Form.pdf
- HTTP 0 — NOTP Prospectus: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Prospectus.pdf
- HTTP 0 — Sales Brochure: https://licindia.in/documents/20121/1500493/LIC_Jeevan+amar_Sales+Brochure_4+inch+x+9+inch_Eng+%281%29.pdf/b75c96c5-0d69-2b23-6c5a-d0c05f6e7b81?t=1751275371576
- HTTP 0 — Claim Form: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/Claim%20Form_16_4.pdf
- HTTP 0 — NOTP Proposal: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP-Proposal.pdf
- HTTP 0 — NPMPP Proposal: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Proposal%20Form.pdf
- HTTP 0 — NOTP CIS: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20CIS.pdf
- HTTP 0 — SAOD Private Car Policy: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/SAOD%20Private%20Car%20Policy.pdf
- HTTP 0 — Sales Brochure: https://licindia.in/documents/20121/290753/LIC_New+Tech+Term_Sales+Brochure_4+inch+x+9+inch_Eng+%282%29.pdf/d75b9948-b9e3-2ba1-9886-066a1bee6909?t=1741085687365
- HTTP 0 — NOTP Claim Form: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NOTP%20Claim%20Form.pdf
- HTTP 0 — NPMPP Wordings: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/NPMPP%20Policy%20Wordings.pdf
- HTTP 0 — NOTP Rate Chart: https://nationalinsurance.nic.co.in/sites/default/files/2026-04/National%20Overseas%20Travel%20Policy%20Rate%20Chart_0.pdf
