# India Compliance & Risk Note

## Zura Insurance Comparison Platform

**Version:** 2.0 (Enhanced)
**Last Updated:** 2026-03-24
**Status:** Active — Review Quarterly
**Applicable Market:** India (IRDAI-regulated)

---

## Table of Contents

1. [Current Legal Status Analysis](#1-current-legal-status-analysis)
2. [What Can Be Displayed Safely Now](#2-what-can-be-displayed-safely-now)
3. [What Requires Caution](#3-what-requires-caution)
4. [Admin Review Gates Before Publishing](#4-admin-review-gates-before-publishing)
5. [Required Disclaimers](#5-required-disclaimers)
6. [Data Freshness Requirements](#6-data-freshness-requirements)
7. [Path to IRDAI Licensing](#7-path-to-irdai-licensing)
8. [Logo & Trademark Usage Rules](#8-logo--trademark-usage-rules)
9. [Content Compliance](#9-content-compliance)
10. [Lead Capture Compliance](#10-lead-capture-compliance)
11. [Automation Compliance](#11-automation-compliance)
12. [Risk Matrix](#12-risk-matrix)

---

## 1. Current Legal Status Analysis

### Regulatory Framework

Insurance intermediaries in India are regulated by the **Insurance Regulatory and Development Authority of India (IRDAI)** under:

- **Insurance Act, 1938** (as amended)
- **IRDAI (Registration of Insurance Agents) Regulations**
- **IRDAI (Insurance Web Aggregators) Regulations, 2017** (amended 2024)
- **IRDAI (Insurance Brokers) Regulations, 2018**
- **IRDAI (Insurance Advertisements and Disclosure) Regulations, 2021**
- **Information Technology Act, 2000** (data protection aspects)
- **Digital Personal Data Protection Act, 2023** (DPDPA)
- **Consumer Protection Act, 2019** (misleading advertisements)

### Zura's Current Classification

**Zura does NOT currently hold any IRDAI registration or licence.**

This means Zura operates as an **informational/educational website**, similar to a financial journalism or consumer education platform. This is a legally permissible category, provided certain boundaries are not crossed.

### Key Legal Boundaries

| Activity | IRDAI Registration Required? | Zura Status |
|---|---|---|
| Publishing factual insurance product information | No | SAFE — doing this |
| Comparing products side-by-side (factual) | No (if educational) | SAFE — doing this |
| Providing educational content about insurance | No | SAFE — doing this |
| Collecting email addresses for a newsletter/waitlist | No | SAFE — doing this |
| Recommending specific policies to individuals | **Yes** (broker/agent licence) | NOT doing this |
| Facilitating policy purchase | **Yes** (intermediary licence) | NOT doing this |
| Generating leads for insurers (paid) | **Yes** (web aggregator licence) | NOT doing this |
| Showing real-time premium quotes from insurer APIs | **Yes** (web aggregator/broker) | NOT doing this |
| Accepting premium payments | **Yes** (intermediary licence) | NOT doing this |
| Providing insurance advisory services | **Yes** (broker licence) | NOT doing this |
| Ranking or rating insurers without disclosed methodology | Legally risky | NOT doing this |

### Legal Precedents and Analogies

Zura's current model is analogous to:

- **NerdWallet/Bankrate (US)** — Editorial comparison sites that publish factual product data without being licensed brokers.
- **Which? (UK)** — Consumer advocacy organization that compares financial products.
- **Financial news websites** — Mint, Moneycontrol, Economic Times publish insurance product information without IRDAI registration.

The key distinction is: **publishing publicly available factual information is journalism/education, not intermediation.**

### Risk Areas in Current Status

1. **The line between "comparison" and "recommendation"** — If the platform crosses from factual comparison into suggesting which product a user should buy, it enters regulated territory.
2. **Premium data specificity** — Showing exact premiums for specific user profiles (age, sum insured) could be construed as providing a "quote", which is regulated.
3. **Revenue model** — If Zura earns referral fees from insurers, IRDAI may classify it as a web aggregator regardless of how the platform describes itself.
4. **Scale and prominence** — A small educational blog has lower regulatory scrutiny than a large-scale comparison platform. As Zura grows, regulatory attention increases.

---

## 2. What Can Be Displayed Safely Now

### Safe Content (Green Zone)

The following can be displayed without IRDAI registration:

#### Product Information
- Product names (official names as registered with IRDAI)
- Product categories and types
- UIN (Unique Identification Number) from IRDAI
- Key features as stated in the product brochure or policy wording
- Eligibility criteria (age ranges, etc.)
- Sum insured ranges
- Waiting periods
- Standard exclusions
- Available riders
- Claim settlement process (as described by insurer)

#### Insurer Information
- Insurer name and registration number
- Type of insurer (life/general/health)
- Claim settlement ratio (from IRDAI annual reports — public data)
- Incurred claim ratio
- Solvency ratio
- Number of network hospitals
- Headquarters and contact information
- Year of incorporation

#### Educational Content
- Articles explaining insurance concepts
- Glossaries of insurance terms
- Guides on how to evaluate insurance products
- Tax benefit explanations (Section 80D, 80C)
- Claims process education
- General tips for choosing insurance (without recommending specific products)

#### Comparison Tables (Factual)
- Side-by-side feature comparison of products
- Feature presence/absence across products
- Sum insured range comparison
- Waiting period comparison
- Eligibility comparison

#### Methodology & Transparency
- Data sources and their trust levels
- Last-verified dates
- Confidence scores
- How data is collected and verified
- Editorial independence statement

### Requirements for Safe Display

Even for safe content, these requirements apply:

1. **Source attribution** — Every data point must cite its source.
2. **Freshness indicator** — Show when data was last verified.
3. **Disclaimer presence** — Every page with product data must have a disclaimer.
4. **No false accuracy** — Do not present data with false precision (e.g., showing premiums to the rupee when the source shows approximate ranges).
5. **No implied endorsement** — The presentation must not suggest Zura endorses or recommends any product.

---

## 3. What Requires Caution

### Premium Data (Yellow Zone)

**Current approach:** Display premium ranges as illustrative figures with prominent disclaimers.

**Risks:**
- Showing exact premiums for specific profiles (age 30, male, ₹5L cover) resembles a "quote" even if labelled illustrative.
- If premiums are stale, users may rely on incorrect figures for purchasing decisions.
- IRDAI's advertising regulations prohibit misleading pricing information.

**Mitigations:**
- Label all premium data as "illustrative" and "approximate."
- Show ranges (e.g., "₹8,000 - ₹15,000/year") rather than exact figures where possible.
- Include prominent disclaimer: "Actual premiums may vary. Please visit the insurer's website for accurate quotes."
- Show the date when premium data was last checked.
- Do not show premiums for low-confidence data sources.

**Admin gate:** Premium data requires medium or higher confidence and a per-premium disclaimer before display.

### Rankings and Ratings (Red Zone — Currently Avoided)

**Current approach:** No rankings, ratings, or "best of" lists.

**Risks:**
- Rankings could be construed as "insurance advisory" which requires a licence.
- IRDAI's advertising regulations (2021) specifically prohibit misleading comparisons.
- Consumer Protection Act, 2019 treats misleading rankings as unfair trade practice.
- Rankings without transparent methodology can attract legal action from insurers ranked lower.

**If rankings are introduced in the future:**
- Transparent methodology must be published and regularly updated.
- Methodology must be based on objectively verifiable criteria.
- No subjective "star ratings" without disclosed, defensible criteria.
- Consider obtaining legal opinion before launch.

### Personalized Recommendations (Red Zone — Not Implemented)

**Current approach:** Not offered.

**Why it's risky:**
- "Based on your profile, we recommend Product X" is insurance advisory.
- Even "Product X is suitable for people like you" crosses the line.
- Requires IRDAI broker or agent licence.

**What's permissible:**
- "Filter products by your age and sum insured preference" — this is user-driven filtering, not recommendation.
- "Products available for your age group" — factual eligibility filtering.
- "Most popular in this category" — based on disclosed metrics (e.g., search volume), not recommendations.

### Affiliate/Referral Links (Red Zone — Not Implemented)

**Current approach:** No affiliate or referral links.

**Risks:**
- Earning referral revenue from insurers likely triggers web aggregator classification.
- Even "Visit insurer website" links could be problematic if tracked for revenue.
- IRDAI explicitly regulates web aggregators who generate leads for insurers.

**Future path:** Only implement after obtaining IRDAI Web Aggregator registration.

---

## 4. Admin Review Gates Before Publishing

### Gate System

Every piece of content must pass through these gates before appearing on the public site:

#### Gate 1: Data Completeness
```
CHECK: All required fields are populated
REQUIRED FIELDS:
  - Product: name, insurer, category, sourceUrl, at least 3 features
  - Premium: amount, age, sumInsured, sourceType, disclaimer
  - Insurer: name, registrationNumber, type
FAIL ACTION: Block from publication, flag for data entry
```

#### Gate 2: Confidence Threshold
```
CHECK: No critical field has "low" confidence
CRITICAL FIELDS:
  - Product name
  - Sum insured range
  - Eligibility rules
  - Premium figures (if shown)
  - Waiting periods
FAIL ACTION: Block from publication, flag for verification
```

#### Gate 3: Freshness Check
```
CHECK: lastVerified within 180 days (configurable per field type)
PREMIUM DATA: Must be within 90 days
FEATURE DATA: Must be within 180 days
INSURER DATA: Must be within 365 days
FAIL ACTION: Remove from public display, queue for re-verification
```

#### Gate 4: Source Validation
```
CHECK: At least one source URL returns HTTP 200
CHECK: Source URL matches the claimed insurer domain
CHECK: Source document content hash hasn't changed without review
FAIL ACTION: Flag for source health review
```

#### Gate 5: Disclaimer Verification
```
CHECK: Page-level disclaimer is present
CHECK: Comparison-level disclaimer is present (if comparison page)
CHECK: Premium-level disclaimer is present (if premiums shown)
CHECK: Disclaimer text matches approved template
FAIL ACTION: Block from publication until disclaimers added
```

#### Gate 6: Compliance Scan
```
CHECK: No prohibited terms ("best policy", "top insurer", "guaranteed")
CHECK: No recommendation language ("we recommend", "you should buy")
CHECK: No false urgency ("buy now", "limited offer", "hurry")
CHECK: No unsubstantiated claims ("cheapest", "most comprehensive")
FAIL ACTION: Flag content for compliance review and editing
```

#### Gate 7: Admin Approval
```
CHECK: A designated admin has reviewed and approved the content
CHECK: Approval is logged with admin identity and timestamp
CHECK: Approval covers the specific version being published
FAIL ACTION: Content remains in review queue
```

### Admin Review Checklist

Before approving any product for publication, the admin must verify:

- [ ] Product name matches the official name on the insurer's website
- [ ] UIN number is correct (cross-checked with IRDAI database)
- [ ] All features are sourced from official documents
- [ ] No subjective or promotional language in feature descriptions
- [ ] Premium data (if present) is clearly marked as illustrative
- [ ] Disclaimers are present and correctly placed
- [ ] Source URLs are valid and accessible
- [ ] No content could be construed as a recommendation
- [ ] No insurer logos or trademarks used without authorization
- [ ] Content passes the "would IRDAI object to this?" test

---

## 5. Required Disclaimers

### Per-Page Disclaimer (All Product Pages)

Must appear prominently near the top of every page displaying product information:

```
DISCLAIMER: The information on this page is for educational and informational
purposes only. Zura is not an IRDAI-registered insurance intermediary and does
not sell, solicit, or advise on insurance products. The data presented here is
sourced from publicly available information and may not reflect the most current
product terms. Please verify all information directly with the insurer before
making any insurance decisions.
```

### Per-Comparison Disclaimer

Must appear above every comparison table:

```
COMPARISON DISCLAIMER: This comparison is based on publicly available product
information and is provided for educational purposes only. It does not constitute
a recommendation of any product over another. Products may have features,
benefits, or limitations not captured in this comparison. Please read the
complete policy documents before making any decisions.
```

### Per-Premium Disclaimer

Must appear adjacent to any premium figures:

```
PREMIUM DISCLAIMER: Premium figures shown are illustrative only, based on
publicly available information as of [DATE]. Actual premiums may vary based on
your specific profile, health status, location, and other factors. These figures
do not constitute a quote. Please visit the insurer's official website or contact
the insurer directly for accurate premium information.
```

### Footer Disclaimer (All Pages)

Must appear in the site footer on every page:

```
Zura is an informational platform providing educational content about insurance
products available in India. Zura is NOT registered with IRDAI as a web
aggregator, insurance broker, or insurance agent. Zura does not sell insurance,
does not provide insurance advisory, and does not receive commissions from
insurers. All product information is sourced from publicly available documents
and is subject to change. Users are advised to verify all information directly
with the respective insurer. Insurance is subject to solicitation.

Data last updated: [DATE] | See our data methodology: [LINK]
```

### Waitlist/Newsletter Disclaimer

Must appear on the waitlist/signup form:

```
By signing up, you are joining Zura's waitlist for updates and educational
content. Your email will not be shared with any insurer or third party. You
can unsubscribe at any time. This is not an application for insurance.
```

### Disclaimer Placement Rules

| Location | Disclaimer Type | Visibility |
|---|---|---|
| Every product page | Per-page disclaimer | Top of content area, visible without scrolling |
| Comparison tables | Per-comparison disclaimer | Directly above the table |
| Premium figures | Per-premium disclaimer | Adjacent to the figures (below or in tooltip) |
| Footer | Footer disclaimer | Every page, visible in footer |
| Waitlist form | Waitlist disclaimer | Below the form fields, above submit button |
| About page | Extended regulatory disclosure | Dedicated section |
| Methodology page | Data accuracy disclaimer | Top of page |

---

## 6. Data Freshness Requirements

### Freshness Standards

| Data Type | Maximum Age for Display | Verification Frequency | Action on Expiry |
|---|---|---|---|
| Premium illustrations | 90 days | Monthly | Remove from display, queue re-verification |
| Product features | 180 days | Quarterly | Add "may be outdated" warning |
| Eligibility rules | 180 days | Quarterly | Add "may be outdated" warning |
| Sum insured ranges | 180 days | Quarterly | Add warning |
| Waiting periods | 365 days | Semi-annually | Add warning |
| Exclusions | 365 days | Semi-annually | Add warning |
| Insurer information | 365 days | Annually (post-annual report) | Flag for update |
| Claim settlement ratios | 365 days | Annually (post-IRDAI annual report) | Mark as previous year data |

### Freshness Display Rules

```typescript
function getFreshnessDisplay(lastVerified: string, dataType: string): FreshnessDisplay {
  const maxAge = getMaxAge(dataType);
  const daysSince = daysBetween(lastVerified, today());
  const ratio = daysSince / maxAge;

  if (ratio <= 0.33) {
    return { badge: "green", text: `Verified ${formatDate(lastVerified)}`, showWarning: false };
  }
  if (ratio <= 0.66) {
    return { badge: "yellow", text: `Last checked ${formatDate(lastVerified)}`, showWarning: false };
  }
  if (ratio <= 1.0) {
    return { badge: "orange", text: `Data from ${formatDate(lastVerified)} — may be outdated`, showWarning: true };
  }
  // Beyond max age
  return { badge: "red", text: "Data may be outdated", showWarning: true, hideFromPublic: true };
}
```

### Freshness Audit Process

**Monthly:**
- Run automated freshness check across all products.
- Generate report of products approaching staleness thresholds.
- Queue stale premium data for re-verification.
- Admin reviews and either re-verifies or unpublishes.

**Quarterly:**
- Re-verify all product features against source documents.
- Update confidence scores based on source changes.
- Review and update all active source URLs.

**Annually (post-IRDAI annual report):**
- Update all claim settlement ratios.
- Update solvency ratios.
- Update network hospital counts.
- Review insurer status (mergers, acquisitions, de-registrations).

---

## 7. Path to IRDAI Licensing

### Option 1: IRDAI Web Aggregator Registration

**What it allows:**
- Compare insurance products with real-time data
- Generate and forward leads to insurers
- Display accurate premium quotes
- Earn referral/lead-generation commissions

**Requirements:**

| Requirement | Detail |
|---|---|
| Entity type | Company registered under Companies Act, 2013 |
| Net worth | Minimum Rs 50 lakh (paid-up capital) |
| Infrastructure | Secure IT infrastructure, data centre, disaster recovery |
| Compliance officer | Designated compliance officer |
| Grievance officer | Designated grievance redressal officer |
| CKYC | Customer KYC integration |
| Data security | ISO 27001 or equivalent |
| Agreement with insurers | Formal agreements with at least 2 life and 2 general insurers |
| Registration fee | As prescribed by IRDAI |
| Annual compliance | Annual reporting, audits, IRDAI inspections |

**Timeline estimate:** 6-12 months from application

**Key restrictions for web aggregators:**
- Cannot provide insurance advice or recommendations
- Cannot handle premium payments
- Must display products from all partner insurers without bias
- Must comply with IRDAI advertising regulations
- Must maintain a grievance redressal mechanism

### Option 2: IRDAI Insurance Broker Licence

**What it allows (beyond web aggregator):**
- Provide insurance advisory services
- Recommend specific products to clients
- Facilitate policy issuance
- Handle premium collection (under regulation)
- Earn commission from insurers

**Requirements:**

| Requirement | Detail |
|---|---|
| Entity type | Company or LLP |
| Net worth | Rs 5 crore minimum (for direct broker) |
| Principal officer | Qualified principal officer (insurance experience + exams) |
| Staff qualifications | Staff must pass IRDAI broker examinations |
| Infrastructure | Office, IT systems, records management |
| PI insurance | Professional indemnity insurance |
| Security deposit | As prescribed |
| Compliance | Extensive compliance, reporting, auditing |

**Timeline estimate:** 12-18 months from application

### Recommended Path

**Phase 1 (Now - Month 6):** Operate as educational platform. No licence needed. Build brand, content, and user base.

**Phase 2 (Month 6 - 12):** Apply for IRDAI Web Aggregator registration. Begin compliance infrastructure setup. Continue operating as educational platform during application period.

**Phase 3 (Month 12+):** Upon receiving web aggregator registration, enable:
- Real-time premium comparison
- Lead routing to insurer partners
- Revenue through referral commissions

**Phase 4 (Month 18+):** Evaluate whether to upgrade to broker licence based on business model evolution.

### Pre-Application Checklist

- [ ] Incorporate company (if not already done)
- [ ] Ensure paid-up capital meets Rs 50 lakh threshold
- [ ] Appoint compliance officer
- [ ] Appoint grievance officer
- [ ] Implement data security framework (work toward ISO 27001)
- [ ] Draft insurer partnership agreements (minimum 4: 2 life + 2 general)
- [ ] Set up CKYC integration
- [ ] Establish grievance redressal mechanism
- [ ] Prepare compliance manual
- [ ] Engage IRDAI-experienced legal counsel
- [ ] Prepare application dossier

---

## 8. Logo & Trademark Usage Rules

### Current Policy: No Insurer Logos

**Zura does not use insurer logos on the platform.**

**Reasons:**
1. **Trademark law** — Insurer logos are registered trademarks. Using them without authorization could constitute trademark infringement under the Trade Marks Act, 1999.
2. **Implied endorsement** — Displaying insurer logos could imply endorsement or partnership.
3. **Regulatory risk** — IRDAI may view logo usage as the platform holding itself out as an intermediary.

### What Is Used Instead

- Insurer name in plain text (permissible as factual reference).
- Color-coded initials or generic icons as visual identifiers.
- Insurer registration number (factual, public data).

### If Logos Are Desired in the Future

To use insurer logos, Zura must:

1. **Obtain written permission** from each insurer's marketing/legal department.
2. **Use logos only as provided** — No modification, recoloring, or resizing beyond brand guidelines.
3. **Include trademark attribution** — "[Logo] is a registered trademark of [Insurer Name]."
4. **No implied endorsement** — Logo usage must not suggest partnership or endorsement.
5. **Revocable** — Insurer can revoke permission at any time; Zura must remove logos promptly.
6. **Review annually** — Confirm continued permission.

### Related Trademark Considerations

| Element | Safe? | Notes |
|---|---|---|
| Insurer name in text | Yes | Factual reference, nominative fair use |
| Official product name | Yes | Factual reference |
| Insurer logo | No | Requires written permission |
| Product brochure images | No | Copyrighted material |
| Screenshots of insurer websites | Cautious | May be fair use for educational context, but risky |
| IRDAI logo | No | Government body, requires permission |
| UIN number | Yes | Public regulatory data |

---

## 9. Content Compliance

### Prohibited Language

The following language must NEVER appear on the platform:

| Category | Prohibited Terms | Why |
|---|---|---|
| Superlatives without methodology | "Best policy", "Top insurer", "No. 1" | Consumer Protection Act: misleading claims |
| Recommendations | "We recommend", "You should buy", "Our pick" | Requires advisory licence |
| Guarantees | "Guaranteed returns", "Guaranteed approval" | Insurance Act: misleading statements |
| Urgency | "Buy now", "Limited time", "Hurry" | We don't sell insurance |
| Disparagement | "Avoid this insurer", "Worst claim ratio" | Defamation risk, IRDAI advertising regulations |
| Absolute claims | "Cheapest", "Most comprehensive", "Covers everything" | Almost never factually accurate |
| Medical advice | "If you have diabetes, buy X" | Crosses into advisory |

### Permitted Language

| Safe Phrase | Context |
|---|---|
| "Compare features" | Factual comparison |
| "Products available in this category" | Neutral listing |
| "Based on publicly available data" | Source attribution |
| "Visit the insurer's website for details" | Directing to primary source |
| "Features may vary — check policy wording" | Appropriate caveat |
| "This product includes [feature]" | Factual statement |
| "Entry age: 18-65 years" | Factual eligibility |
| "Claim settlement ratio: 97.34% (2024-25)" | Factual with year |

### Content Review Process

1. **Automated scan** — Every page is scanned for prohibited terms before publication.
2. **Human review** — All new content is reviewed by a designated compliance reviewer.
3. **Periodic audit** — Monthly audit of published content for compliance drift.
4. **External review** — Quarterly review by legal counsel (recommended after scale).

### Article/Editorial Content Rules

Educational articles must:
- Be factually accurate and cite sources.
- Not recommend specific products or insurers.
- Use conditional language ("you may want to consider" not "you should buy").
- Include a disclaimer that the content is educational, not advisory.
- Not be sponsored by or paid for by any insurer (until web aggregator registration).
- Clearly distinguish between factual information and opinion.

---

## 10. Lead Capture Compliance

### Current Lead Capture: Waitlist Only

Zura currently collects:
- Email addresses for a waitlist/newsletter.
- No personal details beyond email (no age, phone, income, health data).

This is **permissible without IRDAI registration** as it is general marketing, not insurance solicitation.

### Rules for Current Waitlist

1. **Clear purpose disclosure** — Tell users exactly what the waitlist is for.
2. **No insurer data sharing** — Collected emails are NOT shared with insurers.
3. **Opt-in only** — No pre-checked boxes, no implied consent.
4. **Easy unsubscribe** — Every email must have an unsubscribe link.
5. **DPDPA compliance** — Collect only what's needed, provide data access/deletion rights.
6. **No insurance solicitation** — Waitlist communications must be educational, not sales-oriented.

### Future Lead Capture (Post-Registration)

After IRDAI Web Aggregator registration, lead capture can expand to:

| Data Point | When Allowed | Conditions |
|---|---|---|
| Name | Post-registration | With explicit consent |
| Phone number | Post-registration | With explicit consent + DND compliance |
| Age / DOB | Post-registration | For quote generation |
| Location | Post-registration | For product eligibility |
| Health conditions | Post-registration | Only if essential, encrypted, DPDPA compliant |
| Income | Post-registration | For sum insured recommendations |
| Existing policies | Post-registration | For gap analysis (broker licence) |

### DPDPA Compliance (Digital Personal Data Protection Act, 2023)

Key requirements applicable to Zura:

| Requirement | Implementation |
|---|---|
| Lawful purpose | Data collected only for stated purposes |
| Consent | Clear, informed, specific consent before collection |
| Purpose limitation | Data used only for the purpose consented to |
| Data minimization | Collect only what's necessary |
| Accuracy | Keep data accurate and updated |
| Storage limitation | Delete data when purpose is fulfilled |
| Security | Reasonable security safeguards |
| Data Principal rights | Provide access, correction, deletion on request |
| Breach notification | Notify Data Protection Board and affected individuals |
| Cross-border transfer | Only to notified countries (when rules are published) |
| Consent manager | If processing significant volume, register as consent manager |

---

## 11. Automation Compliance

### Web Crawling Rules

Zura's ingestion pipeline crawls insurer websites to collect product data. This must comply with:

#### Legal Framework

1. **Information Technology Act, 2000** — Section 43 prohibits unauthorized access to computer systems. Crawling publicly accessible web pages is generally permissible, but violating robots.txt or terms of service could be argued as unauthorized access.

2. **Copyright Act, 1957** — Product data (names, features, terms) is factual and generally not copyrightable. However, the specific expression, layout, and creative descriptions may be copyrighted.

3. **Database rights** — India does not have a sui generis database right (unlike the EU). Compilations of facts are generally not protected unless they involve creative selection/arrangement.

4. **Contract law** — If an insurer's Terms of Service prohibit scraping, accessing their site may breach an implied contract. Monitor ToS of all crawled sites.

#### Technical Compliance

| Rule | Implementation |
|---|---|
| robots.txt compliance | Check before every fetch. If disallowed, do not crawl. |
| Rate limiting | Maximum 1 request per 5 seconds per domain |
| User-Agent identification | Identify as "ZuraBot/1.0 (+https://zura.in/about)" |
| No authentication bypass | Never circumvent login, CAPTCHA, or access controls |
| No deep linking to PDFs without context | Link to product page, not directly to PDF |
| Respect HTTP 429 (Too Many Requests) | Implement exponential backoff |
| Cache and minimize requests | Store content locally, only re-fetch on schedule |
| No private or internal pages | Only crawl publicly accessible URLs |

#### Data Usage Rights

| Source Data | Can Zura Use It? | Conditions |
|---|---|---|
| Product names | Yes | Factual data, nominative fair use |
| Product features (factual) | Yes | Facts are not copyrightable |
| Feature descriptions (verbatim) | Cautious | Paraphrase creative descriptions |
| Premium figures from calculators | Cautious | Must disclaim as illustrative |
| PDF brochure content (facts) | Yes | Extract facts, don't reproduce creative expression |
| PDF brochure content (verbatim) | No | Copyrighted expression |
| Annual report data | Yes | Publicly disclosed financial data |
| IRDAI regulatory data | Yes | Public regulatory data |
| Insurer logos/images | No | Trademark/copyright protected |
| Website screenshots | Cautious | May be fair use for educational purposes, but risky |

### Handling Cease-and-Desist

If an insurer sends a cease-and-desist regarding data usage or crawling:

1. **Immediately stop crawling** that insurer's website.
2. **Review the claim** with legal counsel.
3. **Remove or modify** disputed content as appropriate.
4. **Respond professionally** within 7 days.
5. **Document everything** for compliance records.
6. **Consider alternative sources** (IRDAI filings, annual reports) for the insurer's data.

---

## 12. Risk Matrix

### Risk Assessment Framework

**Likelihood:** Low / Medium / High
**Impact:** Low (minor operational) / Medium (legal notice, forced changes) / High (regulatory action, shutdown)
**Risk Level:** Likelihood x Impact

### Full Risk Matrix

#### Data Display Risks

| # | Action | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| 1 | Displaying factual product features | Low | Low | **LOW** | Source attribution, freshness dates, disclaimers |
| 2 | Displaying illustrative premiums | Medium | Medium | **MEDIUM** | Prominent "illustrative" label, source date, link to insurer |
| 3 | Side-by-side product comparison | Low | Medium | **LOW-MEDIUM** | Factual only, no ranking, comparison disclaimer |
| 4 | Showing stale/incorrect data | Medium | High | **HIGH** | Automated freshness gates, admin review, staleness alerts |
| 5 | Publishing unverified data | Medium | High | **HIGH** | Confidence scoring, display eligibility gates, admin approval |

#### Content Risks

| # | Action | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| 6 | Using "best policy" or superlative claims | Low | High | **MEDIUM** | Automated prohibited-term scanning, content review |
| 7 | Content interpreted as recommendation | Medium | High | **HIGH** | Strict language guidelines, compliance review, disclaimers |
| 8 | Disparaging an insurer | Low | High | **MEDIUM** | Content review process, no negative language policy |
| 9 | Inaccurate educational content | Low | Medium | **LOW-MEDIUM** | Expert review, source citations, correction process |

#### Regulatory Risks

| # | Action | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| 10 | IRDAI classifying Zura as unlicensed intermediary | Low | High | **MEDIUM** | No transactional features, clear disclaimers, no revenue from insurers |
| 11 | Revenue from insurers without registration | N/A (not doing) | High | **N/A** | Do not accept insurer payments until registered |
| 12 | Lead sharing with insurers without registration | N/A (not doing) | High | **N/A** | Waitlist data stays with Zura only |
| 13 | IRDAI advertising regulation violation | Low | Medium | **LOW-MEDIUM** | Compliance scan, no promotional language |

#### Trademark & IP Risks

| # | Action | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| 14 | Using insurer logos without permission | N/A (not doing) | Medium | **N/A** | Policy: no logos |
| 15 | Using insurer names in text | Low | Low | **LOW** | Nominative fair use, factual reference |
| 16 | Reproducing copyrighted descriptions verbatim | Low | Medium | **LOW-MEDIUM** | Paraphrase, extract facts only, compliance review |
| 17 | Insurer C&D for data usage | Medium | Medium | **MEDIUM** | Rapid response protocol, alternative sources, legal counsel |

#### Technical/Automation Risks

| # | Action | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| 18 | Crawling blocked by insurer | Medium | Low | **LOW** | Respect robots.txt, identify bot, rate limit |
| 19 | Violating insurer ToS via crawling | Medium | Medium | **MEDIUM** | Review ToS of crawled sites, legal review, C&D protocol |
| 20 | Website structure change breaks parser | High | Low | **LOW-MEDIUM** | Source health monitoring, parser alerts, manual fallback |
| 21 | Automated data extraction error goes undetected | Medium | High | **HIGH** | Verification pipeline, anomaly detection, admin review gates |

#### Data Privacy Risks

| # | Action | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| 22 | DPDPA non-compliance (email collection) | Low | High | **MEDIUM** | Consent mechanism, privacy policy, data access/deletion rights |
| 23 | Data breach (waitlist emails) | Low | High | **MEDIUM** | Encryption, access controls, breach notification plan |
| 24 | Collecting more user data than needed | Low | Medium | **LOW-MEDIUM** | Data minimization policy, collect email only |

#### Business/Operational Risks

| # | Action | Likelihood | Impact | Risk Level | Mitigation |
|---|---|---|---|---|---|
| 25 | Growing too fast without compliance infrastructure | Medium | High | **HIGH** | Build compliance first, scale content second |
| 26 | Single admin bottleneck for data verification | High | Medium | **MEDIUM-HIGH** | Document verification process, plan for team expansion |
| 27 | Source websites go down permanently | Low | Medium | **LOW-MEDIUM** | Multi-source coverage, IRDAI filings as backup source |

### High-Risk Items Requiring Immediate Attention

The following items rated HIGH or MEDIUM-HIGH require active management:

1. **#4 — Stale/incorrect data display:** Implement automated freshness gates (Section 6) and admin staleness alerts before scaling product count.

2. **#5 — Publishing unverified data:** Implement display eligibility gates (Section 4) before adding new products.

3. **#7 — Content interpreted as recommendation:** Conduct a full content audit of all published pages. Implement automated compliance scanning.

4. **#21 — Undetected extraction errors:** Build verification pipeline with anomaly detection before enabling automated ingestion.

5. **#25 — Scaling without compliance:** Establish compliance checklist and review process before expanding beyond current 17 products.

6. **#26 — Single admin bottleneck:** Document all verification procedures. Plan for second admin/reviewer.

### Risk Review Schedule

| Frequency | Activity |
|---|---|
| Monthly | Review data freshness report, check for compliance drift |
| Quarterly | Full content compliance audit, update risk matrix |
| Semi-annually | Legal counsel review of platform against current regulations |
| Annually | Comprehensive regulatory review (post-IRDAI annual report) |
| On event | Review after any regulatory change, insurer C&D, or data incident |

---

## Appendix A: IRDAI Key Contacts and References

| Resource | URL |
|---|---|
| IRDAI Official Website | https://irdai.gov.in |
| IRDAI Registered Entities | https://irdai.gov.in/registered-entities |
| Web Aggregator Regulations | IRDAI website, regulatory section |
| Insurance Broker Regulations | IRDAI website, regulatory section |
| IRDAI Annual Report | Published annually, public document |
| Advertising Regulations | IRDAI (Insurance Advertisements and Disclosure) Regulations, 2021 |

## Appendix B: Disclaimer Templates (Copy-Paste Ready)

### Template 1: Product Page Header

> **Important:** This page provides factual information about insurance products for educational purposes only. Zura is not an IRDAI-registered insurance intermediary. We do not sell, recommend, or advise on insurance products. Please verify all details with the insurer before making any decisions. Data shown was last verified on [DATE].

### Template 2: Comparison Table Header

> **Comparison Notice:** This comparison uses publicly available product data and is for informational purposes only. It does not represent a recommendation. Products may have terms and conditions not shown here. Please read the complete policy documents from the respective insurers.

### Template 3: Premium Figure Inline

> *Illustrative premium for a [AGE]-year-old [GENDER] for ₹[SUM INSURED] sum insured. Based on publicly available data as of [DATE]. Actual premiums will vary. Visit [INSURER] for accurate quotes.*

### Template 4: Footer (All Pages)

> Zura is an educational resource about insurance products in India. We are NOT registered with IRDAI as an insurance intermediary. We do not sell insurance, provide advisory services, or receive payments from insurers. All information is from public sources and may change without notice. Verify details with the insurer.

### Template 5: Waitlist Signup

> You are joining Zura's mailing list for insurance education updates. Your email is not shared with insurers or third parties. Unsubscribe anytime. This is not an insurance application.

---

## Appendix C: Compliance Checklist for New Pages

Before any new page is published, verify:

- [ ] Page-level disclaimer is present and visible
- [ ] No prohibited terms (run automated scan)
- [ ] No recommendation or advisory language
- [ ] All data points have source attribution
- [ ] All data points have freshness indicators
- [ ] Premium data (if any) has per-premium disclaimer
- [ ] No insurer logos or copyrighted images
- [ ] All insurer names are factual references (no creative branding)
- [ ] Footer disclaimer is rendered
- [ ] Meta description does not contain promotional language
- [ ] Page title does not contain superlatives ("best", "top", "cheapest")
- [ ] Content has been reviewed by compliance reviewer
- [ ] Page passes display eligibility gates
