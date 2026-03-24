# Zura Insurance Comparison Website -- Compliance Note (India)

**Prepared:** March 2026
**Scope:** Regulatory compliance analysis for an Indian insurance information and comparison website operating without an IRDAI license.
**Disclaimer:** This document is for internal planning purposes only. It is not legal advice. Engage a qualified insurance regulatory lawyer before launching or making compliance-critical decisions.

---

## Table of Contents

1. [IRDAI Regulatory Framework](#1-irdai-regulatory-framework)
2. [What the Site CAN Do Without a License](#2-what-the-site-can-do-without-a-license)
3. [What the Site CANNOT Do Without a License](#3-what-the-site-cannot-do-without-a-license)
4. [Required Disclaimers and Notices](#4-required-disclaimers-and-notices)
5. [Competitor Compliance Patterns](#5-competitor-compliance-patterns)
6. [Path to Licensing](#6-path-to-licensing)
7. [Recommended Compliance Roadmap for Zura](#7-recommended-compliance-roadmap-for-zura)
8. [Key Regulatory References](#8-key-regulatory-references)

---

## 1. IRDAI Regulatory Framework

### 1.1 Overview

The Insurance Regulatory and Development Authority of India (IRDAI) is the sole regulator of the insurance sector in India, established under the IRDAI Act 1999. Any entity that solicits, procures, or facilitates the sale of insurance products in India must hold an appropriate registration from IRDAI.

The principal governing law is the **Insurance Act, 1938** (as amended), supplemented by IRDAI regulations, guidelines, and circulars.

### 1.2 Types of IRDAI Registrations/Licenses

| License Type | What It Allows | Key Regulation |
|---|---|---|
| **Insurance Broker** | Solicit and procure insurance on behalf of clients across multiple insurers. Can advise, compare, recommend, and facilitate purchase. | IRDAI (Insurance Brokers) Regulations, 2018 |
| **Web Aggregator** | Operate a website that provides insurance product information, price comparisons, and leads to insurers or licensed intermediaries. Can display premium quotes. Cannot sell directly. | IRDAI (Insurance Web Aggregator) Regulations, 2017 |
| **Corporate Agent** | Act as agent for up to three life, three general, and three health insurers. Can solicit and sell on their behalf. | IRDAI (Registration of Corporate Agents) Regulations, 2015 |
| **Insurance Marketing Firm (IMF)** | Distribute insurance products of one life, one general, and one health insurer in a defined area. | IRDAI (Registration of Insurance Marketing Firm) Regulations, 2015 |
| **Point of Sales Person (POSP)** | Sell pre-approved simple insurance products (POSP products) under the supervision of a licensed intermediary. Requires basic training (15 hours). | IRDAI Guidelines on POSP, 2015 (amended) |
| **Individual Agent** | Traditional insurance agent tied to one insurer per category. | Insurance Act 1938, Section 42 |
| **Surveyor and Loss Assessor** | Assess and settle insurance claims (not relevant to comparison sites). | IRDAI (Insurance Surveyors and Loss Assessors) Regulations |

### 1.3 Web Aggregator License vs Insurance Broker License

#### Web Aggregator (IRDAI Insurance Web Aggregator Regulations, 2017)

- **Primary function:** Maintain a website that allows visitors to compare insurance products from multiple insurers and obtain premium quotations.
- **Revenue model:** Earns commission/fees from insurers or intermediaries for leads generated.
- **Can do:**
  - Display product information, features, and premium quotes from multiple insurers.
  - Allow visitors to compare products side by side.
  - Generate and forward leads to insurers or licensed intermediaries.
  - Provide premium calculation tools using insurer-approved rate data.
- **Cannot do:**
  - Directly sell insurance policies.
  - Provide personalized insurance advice or recommendations.
  - Handle premium collection (unless through insurer's payment gateway).
  - Act as an intermediary in claim settlement.
- **Requirements:**
  - Minimum net worth of INR 50 lakh (INR 25 lakh for MSME applicants per some relaxations).
  - Must have agreements with insurers whose products are displayed.
  - Principal Officer must pass the IRDAI-prescribed examination.
  - Must maintain a grievance redressal mechanism.
  - Registered under the Companies Act or LLP Act.

#### Insurance Broker (IRDAI Insurance Brokers Regulations, 2018)

- **Primary function:** Act as intermediary representing the interest of the client (policyholder). Can advise, solicit, negotiate, and service insurance on behalf of clients across multiple insurers.
- **Revenue model:** Commission from insurers (capped by regulation) and/or brokerage fees from clients.
- **Can do:**
  - Provide personalized insurance advice and recommendations.
  - Solicit, negotiate, and place insurance with any insurer.
  - Compare products and recommend the best fit for a client.
  - Assist with claims.
  - Collect premiums (within regulatory bounds).
  - Issue cover notes in certain situations.
- **Categories:**
  - Direct Broker (life, general, or both)
  - Reinsurance Broker
  - Composite Broker
- **Requirements:**
  - Minimum capital: INR 50 lakh (Direct), INR 200 lakh (Composite), INR 400 lakh (Reinsurance).
  - Principal Officer must have IRDAI broker qualification.
  - Professional indemnity insurance required.
  - Net worth and solvency requirements.
  - Incorporated as a company under the Companies Act.

#### Key Differences

| Aspect | Web Aggregator | Insurance Broker |
|---|---|---|
| Can sell insurance | No (leads only) | Yes |
| Can advise clients | No | Yes |
| Can handle claims | No | Yes |
| Minimum capital | INR 50 lakh | INR 50 lakh to INR 400 lakh |
| Represents | Platform (neutral) | Client's interest |
| Number of insurers | Multiple | Multiple |
| Online-first | Yes (website mandatory) | Can be online or offline |

### 1.4 What Can an UNLICENSED Website Legally Do?

An unlicensed website in India can operate as a **purely informational/educational platform** as long as it does not cross the line into solicitation, procurement, or facilitation of insurance sales. The key legal boundaries are:

**The Insurance Act 1938, Section 42D** makes it illegal for any person to act as an insurance intermediary without registration. "Intermediary" includes anyone who solicits or procures insurance business.

**However, the following activities are generally considered outside the scope of regulated insurance intermediation:**

- Publishing educational articles about insurance concepts.
- Providing general information about types of insurance products available in the market.
- Comparing publicly available product features (coverage, exclusions, claim settlement ratios) sourced from insurer websites and IRDAI public data.
- Operating as a "media" or "content" platform that writes about insurance.
- Capturing leads (name, email, phone) for the purpose of future contact, provided there are clear disclaimers that the site is not a licensed intermediary.
- Linking to official insurer websites or licensed intermediary platforms.
- Publishing calculators that use publicly available formulas (e.g., term insurance needs calculators, HLV calculators) with clear disclaimers that outputs are illustrative.

**The critical line:** The moment a website facilitates, solicits, or procures the actual purchase of an insurance policy -- or holds itself out as being authorized to do so -- it crosses into regulated territory.

---

## 2. What the Site CAN Do Without a License

### 2.1 Educational Content

- Publish articles explaining insurance concepts (what is term insurance, how health insurance works, what is a claim settlement ratio, etc.).
- Create guides on how to choose insurance products.
- Publish glossaries of insurance terms.
- Share news about the insurance industry.
- Create video content explaining insurance topics.

### 2.2 Product Information and Comparison

- Display publicly available product features obtained from insurer websites, IRDAI public disclosures, and annual reports.
- Compare plan features such as coverage amounts, exclusions, waiting periods, co-pay structures, and policy terms.
- Show publicly available data like claim settlement ratios (published by IRDAI), incurred claim ratios, and company financials.
- Create comparison tables based on publicly available information.

**Important caveats:**
- All data must be sourced from publicly available information.
- The site should cite sources (e.g., "Source: IRDAI Annual Report 2024-25" or "Source: [Insurer] website, accessed [date]").
- The site must not present comparisons as personalized recommendations.

### 2.3 Lead Generation

- Capture user interest through forms (name, email, phone number, insurance type of interest).
- Forward leads to licensed intermediaries or insurers (under a referral/lead generation agreement).
- Operate an email newsletter about insurance topics.
- Offer free consultations (provided the consultation is conducted by or referred to a licensed person).

### 2.4 Calculators and Tools

- **Term insurance needs calculator** (based on Human Life Value or income replacement method) -- with disclaimer that results are illustrative.
- **Health insurance coverage estimator** -- with disclaimer.
- **Premium comparison tools** IF the data is sourced from publicly available premium charts and clearly marked as approximate/illustrative.
- **SIP/investment calculators** (if covering ULIP or investment-linked products) -- with disclaimers.

### 2.5 Linking and Referral

- Link to official insurer product pages.
- Link to licensed broker or aggregator platforms.
- Use affiliate links (if the affiliate partner is a licensed entity) -- but the relationship must be disclosed.

### 2.6 Reviews and Ratings

- Publish editorial reviews of insurance products.
- Aggregate and display user reviews (with moderation).
- Provide editorial ratings based on stated, transparent methodology.
- Important: Ratings must not be presented as IRDAI-endorsed or official.

---

## 3. What the Site CANNOT Do Without a License

### 3.1 Absolutely Prohibited Without License

| Prohibited Activity | Why It Is Prohibited | Risk |
|---|---|---|
| Sell or facilitate sale of insurance policies | Section 42D, Insurance Act 1938 | Criminal penalties, fines up to INR 25 lakh, imprisonment up to 10 years |
| Claim to be an insurance broker, agent, or aggregator | Misrepresentation under Insurance Act | IRDAI enforcement action, criminal liability |
| Collect insurance premiums | Only licensed entities can handle premium flows | Criminal penalties |
| Issue policy documents or certificates | Only insurers and authorized intermediaries | Fraud charges |
| Provide personalized insurance advice or recommendations | Constitutes insurance intermediation | Regulatory action |
| Use IRDAI logo or claim IRDAI registration | Fraud/misrepresentation | Criminal penalties |
| Use insurer logos without written permission | Trademark infringement + potential misrepresentation of affiliation | Civil and regulatory action |
| Generate live premium quotes from insurer systems | Requires insurer agreements typically only available to licensed entities | Regulatory action |
| Guarantee or promise specific insurance outcomes | Misleading the public | Consumer protection action |
| Solicit insurance business | Section 42D | Criminal penalties |

### 3.2 Grey Areas Requiring Caution

| Activity | Risk Level | Guidance |
|---|---|---|
| Displaying approximate premiums from publicly available rate cards | Medium | Acceptable if clearly marked as "illustrative" and "based on publicly available data; actual premiums may vary" |
| "Get Quote" button that redirects to insurer site | Low-Medium | Acceptable if the quote is generated on the insurer's platform, not on Zura's platform |
| Recommending "best" products | High | Avoid unless clearly labeled as editorial opinion, not personalized advice |
| Displaying insurer brand names (text only, no logos) | Low | Generally acceptable for informational purposes; factual references to company names are not trademark infringement |
| Collecting detailed personal health/financial information | High | Avoid collecting information that suggests you are underwriting or advising; limit to basic lead capture |
| Earning commission/referral fees from insurers | Medium | Legal if structured as a lead-generation or marketing services agreement, but the arrangement must not constitute unlicensed intermediation |

### 3.3 Logo Usage

- **Do not display insurer logos** unless you have explicit written permission from each insurer.
- Instead, use text-based company names.
- If you obtain written permission, maintain records of the permission and any conditions attached.
- Even with permission, do not use logos in a way that implies endorsement, partnership, or agency relationship.

---

## 4. Required Disclaimers and Notices

### 4.1 Global Site Disclaimer (Must Appear on Every Page -- Footer)

**Template:**

```
DISCLAIMER

Zura (www.zura.in) is an insurance information and education platform.
Zura is NOT a licensed insurance broker, agent, web aggregator, or
intermediary registered with the Insurance Regulatory and Development
Authority of India (IRDAI).

The information provided on this website is for general informational and
educational purposes only. It does not constitute insurance advice, a
recommendation to purchase any insurance product, or an offer or
solicitation of insurance.

Product information, features, and premium estimates displayed on this
website are based on publicly available data and may not reflect the most
current terms, conditions, or pricing. Actual policy terms, conditions,
coverage, exclusions, and premiums are determined solely by the respective
insurance companies.

Users are advised to read the policy documents carefully and consult a
licensed insurance professional before making any insurance purchase
decisions.

Zura does not sell insurance, collect premiums, issue policies, or settle
claims. Any leads or inquiries submitted through this website may be shared
with licensed insurance intermediaries or insurance companies, subject to
our Privacy Policy.

For complaints or grievances related to insurance policies, please contact
the respective insurance company or IRDAI directly at
igms.irda.gov.in or toll-free number 155255.
```

### 4.2 Comparison Page Disclaimer

**Template (to appear at the top or prominently on comparison pages):**

```
COMPARISON DISCLAIMER

The comparison presented on this page is based on publicly available
information obtained from insurer websites, IRDAI public disclosures, and
other public sources as of [DATE]. This comparison is for informational
purposes only.

- Premium estimates shown are approximate and illustrative only. Actual
  premiums depend on individual factors and insurer underwriting.
- Product features and benefits may have been simplified for comparison
  purposes. Please refer to the official policy wordings for complete
  terms and conditions.
- This comparison does not constitute a recommendation to purchase any
  particular product.
- Zura is not affiliated with, endorsed by, or acting as an agent for
  any of the insurance companies listed.
- Claim settlement ratios and other statistics are sourced from IRDAI
  annual reports and insurer public disclosures.

Data sources: [List sources, e.g., "IRDAI Annual Report 2024-25",
"[Insurer] website accessed on [Date]"]
```

### 4.3 Calculator Disclaimer

**Template:**

```
CALCULATOR DISCLAIMER

This calculator provides illustrative estimates only based on general
assumptions and publicly available data. The results are not a guarantee
of actual premiums, coverage amounts, or insurance outcomes.

Actual premiums and coverage will depend on individual underwriting
factors including but not limited to age, health status, medical history,
lifestyle, occupation, and the specific product chosen.

This tool does not constitute insurance advice. Please consult a licensed
insurance professional for personalized recommendations.
```

### 4.4 Lead Capture Form Disclaimer

**Template (to appear adjacent to any form collecting user information):**

```
By submitting this form, you agree to be contacted by Zura or our
licensed insurance partners regarding your insurance inquiry. Your
information will be handled in accordance with our Privacy Policy
[link]. Zura is not a licensed insurance intermediary. Submitting this
form does not constitute an application for insurance.
```

### 4.5 Affiliate/Referral Disclosure

If the site earns referral fees or uses affiliate links:

```
DISCLOSURE: Some links on this page may be affiliate links. If you
purchase an insurance product through these links, Zura may receive a
referral fee from the licensed intermediary or insurer at no additional
cost to you. This does not influence our editorial content or
comparisons.
```

### 4.6 Privacy Policy Requirements

Under the **Information Technology Act 2000**, the **IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules 2011**, and the **Digital Personal Data Protection (DPDP) Act 2023**, the website must have a comprehensive privacy policy covering:

#### Mandatory Elements:

1. **Identity of the Data Fiduciary:** Full legal name of the entity operating the website, registered address, and contact details of the person responsible for data protection (Data Protection Officer once DPDP rules are notified, or a designated contact).

2. **Types of Personal Data Collected:**
   - Basic: Name, email, phone number, city.
   - Optional/Lead data: Age, gender, insurance type of interest, existing coverage details.
   - Technical: IP address, browser type, cookies, device information.
   - Note: Do NOT collect sensitive personal data (health records, financial account details) unless absolutely necessary and with explicit consent.

3. **Purpose of Data Collection:**
   - To provide requested information about insurance products.
   - To share inquiries with licensed insurance partners.
   - To send newsletters and educational content (with opt-in consent).
   - To improve website functionality and user experience.
   - For analytics and research.

4. **Consent Mechanism:**
   - Under DPDP Act 2023: Consent must be free, specific, informed, unconditional, and unambiguous. Must be obtained through a clear affirmative action.
   - Provide a clear consent notice before collecting data.
   - Separate consent for marketing communications.
   - Easy withdrawal of consent mechanism.

5. **Data Sharing:**
   - Disclose that data may be shared with licensed insurance intermediaries and insurers.
   - List categories of third parties (not necessarily specific names, but categories).
   - State that data will not be sold to unrelated third parties.

6. **Data Retention:**
   - State how long personal data will be retained.
   - Retention period should be reasonable and linked to purpose.

7. **Data Principal Rights (under DPDP Act 2023):**
   - Right to access personal data.
   - Right to correction and erasure.
   - Right to grievance redressal.
   - Right to nominate (in case of death/incapacity).

8. **Security Measures:**
   - Describe reasonable security practices implemented.
   - Reference compliance with IS/ISO/IEC 27001 or equivalent (recommended).

9. **Cookies Policy:**
   - What cookies are used and for what purpose.
   - How to manage cookie preferences.

10. **Grievance Redressal:**
    - Name and contact details of Grievance Officer.
    - Process for filing complaints.
    - Timeline for resolution.

11. **Children's Data:**
    - DPDP Act 2023 requires verifiable parental consent for processing data of persons below 18.
    - State that the website is not intended for users under 18 (or implement age verification if necessary).

### 4.7 Terms of Use

Must include:
- That the site provides information only, not insurance services.
- That users must independently verify all information.
- Limitation of liability for accuracy of displayed data.
- Intellectual property notices.
- Governing law (Indian law) and jurisdiction.
- User conduct restrictions.

---

## 5. Competitor Compliance Patterns

### 5.1 Policybazaar

- **Entity:** PB Fintech Limited (listed on NSE/BSE).
- **Licenses held:**
  - IRDAI-registered **Insurance Broker** (through Policybazaar Insurance Brokers Private Limited).
  - Previously operated as a Web Aggregator before upgrading to a broker license (around 2020-2021).
- **How they position themselves:** "India's largest insurance marketplace." They are licensed to sell insurance, provide advice, and facilitate transactions end-to-end.
- **Disclaimers:**
  - Display IRDAI registration number prominently.
  - Include "IRDAI License No." in footer.
  - Policy-specific disclaimers on product pages.
  - Standard "Insurance is the subject matter of solicitation" tagline.
- **Key takeaway:** Policybazaar started as a comparison site, obtained a web aggregator license, then upgraded to broker. Full transaction capability.

### 5.2 Ditto Insurance (by Finshots/Joice)

- **Entity:** Ditto Insurance (operated by Joice Insurance Broking Private Limited).
- **License held:** IRDAI-registered **Insurance Broker** (Direct Broker - Life and General).
- **How they position themselves:** "We are IRDAI licensed insurance brokers. We don't push products. We help you understand insurance and make informed decisions."
- **Disclaimers:**
  - IRDAI broker license number in footer.
  - Clear statements about being a licensed broker.
  - Transparent about earning commissions from insurers.
- **Content strategy:** Heavy emphasis on educational content (YouTube, blog) which drives traffic. Advisory calls are conducted by licensed professionals.
- **Key takeaway:** Content-first approach combined with a broker license. Their educational content does not require a license; their advisory and sales activities do.

### 5.3 Coverfox

- **Entity:** Coverfox Insurance Broking Private Limited.
- **License held:** IRDAI-registered **Insurance Broker.**
- **How they position themselves:** Online insurance broker offering comparison and purchase.
- **Disclaimers:** Standard IRDAI registration disclosures.
- **Key takeaway:** Another example of a comparison-plus-broker model.

### 5.4 Turtlemint / Mintpro

- **Entity:** Turtlemint Insurance Broking Pvt. Ltd.
- **License held:** IRDAI-registered **Insurance Broker.**
- **How they position themselves:** Insurance distribution platform for agents and direct consumers.
- **Key takeaway:** B2B2C model; still requires broker license for any sales activity.

### 5.5 Bankbazaar

- **Entity:** BankBazaar.com.
- **How they position themselves:** Financial product marketplace (loans, credit cards, insurance).
- **For insurance:** Partners with licensed entities; operates more as a lead-generation and marketplace platform.
- **Key takeaway:** Mixed model with partnerships with licensed intermediaries.

### 5.6 Common Compliance Patterns Across Competitors

1. **All major players hold IRDAI licenses** (broker or web aggregator) before offering transactional features.
2. **IRDAI registration numbers are displayed prominently** in footers and about pages.
3. **Standard disclaimer language** includes "Insurance is the subject matter of solicitation" (a phrase commonly required by IRDAI on all insurance marketing materials).
4. **Content/educational sections** are operated alongside but legally distinct from sales/advisory functions.
5. **Privacy policies and terms of use** are comprehensive and prominently linked.
6. **Grievance redressal mechanisms** are published, including IRDAI IGMS reference.

### 5.7 Lessons for Zura

- **Phase 1 (Pre-license):** Operate purely as an educational/informational content platform, similar to what Ditto does with its blog/YouTube content. Do not facilitate transactions.
- **Phase 2 (Post-license):** Once licensed, enable comparison, advisory, and/or transactional features as the license permits.
- **Throughout:** Maintain clear disclaimers, transparent positioning, and a content-first reputation.

---

## 6. Path to Licensing

### 6.1 Web Aggregator Registration

#### Eligibility
- Must be a company registered under the Companies Act 2013 or an LLP registered under the LLP Act 2008.
- Minimum net worth of **INR 50 lakh** (some relaxations may apply for MSME-category applicants; check current IRDAI circulars).
- Must have a functional website/platform.
- Principal Officer must pass the prescribed IRDAI examination.

#### Steps
1. **Incorporate a company or LLP** if not already done.
2. **Meet capital/net worth requirements** -- ensure paid-up capital and net worth of at least INR 50 lakh.
3. **Develop the platform** with proposed comparison and lead-generation features.
4. **Appoint a Principal Officer** who meets IRDAI criteria (typically a person with insurance or financial services experience; must pass the IRDAI-prescribed examination).
5. **Prepare application documents:**
   - Application in prescribed format.
   - Certificate of incorporation.
   - Memorandum and Articles of Association (must include insurance web aggregation in objects clause).
   - Audited financial statements.
   - Business plan including proposed website functionality.
   - Details of IT infrastructure and data security.
   - KYC documents of directors and Principal Officer.
   - Net worth certificate from a Chartered Accountant.
6. **Submit application to IRDAI** with the prescribed fee.
7. **IRDAI review and inspection** -- IRDAI may inspect premises and IT systems.
8. **Execute agreements with insurers** -- must have agreements with insurers whose products will be displayed.
9. **Receive Certificate of Registration** upon approval.

#### Timeline Estimate
- Preparation phase: 2-4 months.
- IRDAI processing: 3-6 months (can be longer depending on IRDAI workload and completeness of application).
- Total estimated timeline: **6-12 months** from start to registration.

#### Ongoing Compliance
- Annual renewal of registration.
- Maintain minimum net worth at all times.
- Regular IRDAI reporting.
- Grievance redressal mechanism.
- Periodic audits.

### 6.2 Insurance Broker License

#### Eligibility
- Must be a company registered under the Companies Act 2013 (LLP not permitted for brokers).
- Minimum paid-up capital:
  - **Direct Broker (Life or General):** INR 50 lakh.
  - **Direct Broker (Life and General/Composite):** INR 200 lakh.
  - **Reinsurance Broker:** INR 400 lakh.
- At least two directors/partners with relevant experience.
- Principal Officer must pass the IRDAI broker examination and have relevant experience.

#### Steps
1. **Incorporate a Private or Public Limited Company** with appropriate objects clause.
2. **Meet capital requirements** -- deposit required paid-up capital.
3. **Appoint qualified Principal Officer and Key Management Personnel.**
4. **Obtain Professional Indemnity Insurance** covering the proposed brokerage activities.
5. **Prepare comprehensive application:**
   - Prescribed application form.
   - Business plan (3-5 years).
   - Details of promoters, directors, and key personnel.
   - Financial projections.
   - IT infrastructure details.
   - Compliance and risk management framework.
   - Anti-money laundering and KYC procedures.
6. **Submit application to IRDAI** with the prescribed fee.
7. **IRDAI due diligence** -- background checks, premise inspection, interview of Principal Officer.
8. **Training and examination** -- Principal Officer and key staff must pass prescribed examinations.
9. **Receive Certificate of Registration.**

#### Timeline Estimate
- Preparation phase: 3-6 months.
- IRDAI processing: 6-12 months.
- Total estimated timeline: **9-18 months.**

#### Ongoing Compliance
- Maintain minimum capital and net worth.
- Annual license renewal.
- Statutory audit and regulatory returns.
- Professional indemnity insurance renewal.
- Continuing professional development for staff.
- IRDAI inspections.

### 6.3 Comparison: Which License Path for Zura?

| Factor | Web Aggregator | Insurance Broker |
|---|---|---|
| Minimum capital | INR 50 lakh | INR 50 lakh to INR 400 lakh |
| Can sell insurance | No | Yes |
| Can provide advice | No | Yes |
| Time to obtain | 6-12 months | 9-18 months |
| Revenue model | Lead gen fees, comparison fees | Commission + advisory fees |
| Complexity | Lower | Higher |
| Long-term potential | Limited to comparison/leads | Full insurance intermediation |

**Recommendation:** Start with the **Web Aggregator** license as it has lower capital requirements, is faster to obtain, and aligns with a comparison website model. Consider upgrading to a **Broker** license later as the business scales (as Policybazaar did).

### 6.4 Alternative: POSP (Point of Sales Person) Model

If Zura wants to start selling certain insurance products quickly with lower overhead:
- Partner with an existing licensed intermediary (broker or insurer).
- Register individuals as POSPs under that intermediary's license.
- POSPs can sell only pre-approved "POSP products" (simple, standardized insurance products).
- Requires only 15 hours of training and a basic examination.
- **Limitation:** Very restricted product range; operates under another entity's license.

This could work as a **bridge strategy** while the Web Aggregator or Broker license is being pursued.

---

## 7. Recommended Compliance Roadmap for Zura

### Phase 1: Immediate (Pre-License Launch)

**Goal:** Launch as a purely informational and educational insurance platform.

- [ ] Implement all disclaimers from Section 4 across the website.
- [ ] Ensure no language on the site suggests Zura sells, brokers, or facilitates insurance.
- [ ] Remove or refrain from using insurer logos without written permission.
- [ ] Use text-based company names in comparisons.
- [ ] Mark all premium estimates as "illustrative" and "based on publicly available data."
- [ ] Implement a comprehensive Privacy Policy compliant with DPDP Act 2023.
- [ ] Implement Terms of Use.
- [ ] Set up a basic grievance redressal mechanism with a named contact person.
- [ ] Ensure lead capture forms include proper consent language.
- [ ] Cite data sources on all comparison pages.
- [ ] Avoid "Buy Now," "Get Policy," or similar CTAs. Use "Learn More," "Visit Insurer Website," or "Talk to an Advisor."
- [ ] If using affiliate links, disclose the relationship.
- [ ] Conduct a legal review of all website copy by an insurance regulatory lawyer.

### Phase 2: Short-Term (Months 1-6)

**Goal:** Build audience and begin license application process.

- [ ] Publish high-quality educational content to build authority and traffic.
- [ ] Begin corporate setup for license application (ensure company/LLP is properly constituted).
- [ ] Engage a regulatory consultant to prepare the Web Aggregator application.
- [ ] Appoint/identify a Principal Officer candidate.
- [ ] Build relationships with insurance companies for future data-sharing agreements.
- [ ] Explore POSP partnerships as a bridge revenue strategy.
- [ ] Implement analytics and lead tracking (with proper consent).

### Phase 3: Medium-Term (Months 6-18)

**Goal:** Obtain Web Aggregator registration.

- [ ] Submit Web Aggregator application to IRDAI.
- [ ] Execute data-sharing and product-display agreements with insurers.
- [ ] Develop enhanced comparison features (live quotes, etc.) for post-license launch.
- [ ] Build out the technology platform for licensed operations.
- [ ] Train staff on IRDAI compliance requirements.

### Phase 4: Long-Term (18+ Months)

**Goal:** Scale and consider broker upgrade.

- [ ] Operate as licensed Web Aggregator.
- [ ] Evaluate upgrading to Insurance Broker license for advisory and sales capabilities.
- [ ] Expand product range and insurer partnerships.
- [ ] Build out claims assistance and advisory services (if broker-licensed).

---

## 8. Key Regulatory References

### Primary Legislation
1. **Insurance Act, 1938** (as amended by Insurance Laws (Amendment) Act, 2015) -- Sections 42, 42D are particularly relevant to intermediary registration.
2. **IRDAI Act, 1999** -- Establishes IRDAI and its regulatory authority.
3. **Information Technology Act, 2000** -- Governs electronic commerce, data protection (until DPDP Act is fully operational).
4. **Digital Personal Data Protection Act, 2023** -- New data protection law; rules expected to be notified progressively.

### Key IRDAI Regulations
5. **IRDAI (Insurance Web Aggregator) Regulations, 2017** -- Primary regulation for web aggregator registration and operations.
6. **IRDAI (Insurance Brokers) Regulations, 2018** -- Governs insurance broker licensing and operations.
7. **IRDAI (Registration of Corporate Agents) Regulations, 2015** -- If corporate agent route is considered.
8. **IRDAI Guidelines on Insurance e-Commerce, 2017** -- Broader guidelines on online insurance distribution.
9. **IRDAI (Protection of Policyholders' Interests) Regulations, 2017** -- Consumer protection standards applicable to all intermediaries.
10. **IRDAI (Insurance Advertisements and Disclosure) Regulations, 2021** -- Governs how insurance products can be advertised and what disclosures are required.

### Data Protection
11. **IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011** -- Current data protection rules under IT Act.
12. **Digital Personal Data Protection Act, 2023** -- New framework; compliance required once rules are notified and effective.

### IRDAI Contact and Resources
- **IRDAI Website:** https://www.irdai.gov.in
- **IRDAI Integrated Grievance Management System:** https://igms.irda.gov.in
- **IRDAI Toll-free Helpline:** 155255
- **IRDAI Registered Intermediary Search:** Available on IRDAI website to verify registration status of any intermediary.

---

## Appendix A: Quick Compliance Checklist for Website Launch

| Item | Status | Notes |
|---|---|---|
| Footer disclaimer on all pages | [ ] | Use template from Section 4.1 |
| Comparison page disclaimers | [ ] | Use template from Section 4.2 |
| Calculator disclaimers | [ ] | Use template from Section 4.3 |
| Lead form consent language | [ ] | Use template from Section 4.4 |
| Affiliate disclosure (if applicable) | [ ] | Use template from Section 4.5 |
| Privacy Policy page | [ ] | Cover all elements from Section 4.6 |
| Terms of Use page | [ ] | Cover elements from Section 4.7 |
| No insurer logos without permission | [ ] | Use text names only |
| No "Buy" or "Purchase" CTAs | [ ] | Use "Learn More," "Compare," "Visit Insurer" |
| No claims of being licensed | [ ] | Explicitly state NOT licensed |
| Data sources cited on comparisons | [ ] | Cite IRDAI reports, insurer websites |
| Grievance officer contact published | [ ] | Name, email, response timeline |
| Cookie consent mechanism | [ ] | DPDP Act compliance |
| Age restriction notice | [ ] | For minors' data under DPDP Act |
| Legal review completed | [ ] | Engage insurance regulatory lawyer |

---

## Appendix B: Template -- "About Us" Page Compliance Language

```
About Zura

Zura is an independent insurance information and education platform
designed to help Indian consumers understand and compare insurance
products.

IMPORTANT NOTICE: Zura is NOT registered with the Insurance Regulatory
and Development Authority of India (IRDAI) as an insurance broker,
agent, web aggregator, or any other category of insurance intermediary.
We do not sell insurance, provide insurance advice, collect premiums, or
process insurance applications.

What We Do:
- Provide educational content about insurance products and concepts.
- Compare insurance products based on publicly available information.
- Help you understand the features and benefits of different insurance
  options.
- Connect you with licensed insurance professionals and insurers for
  purchase decisions.

What We Do Not Do:
- Sell or facilitate the sale of insurance policies.
- Provide personalized insurance advice or recommendations.
- Collect insurance premiums or payments.
- Process insurance applications or claims.
- Act as an intermediary between you and any insurance company.

All insurance product information on this website is sourced from
publicly available data including insurer websites, IRDAI public
disclosures, and published annual reports. While we strive for accuracy,
we recommend verifying all information directly with the respective
insurance company before making any purchase decisions.

For any insurance purchase, please contact the insurance company directly
or consult a licensed insurance intermediary.
```

---

**END OF COMPLIANCE NOTE**

*This document should be reviewed and updated periodically as IRDAI regulations evolve. Last updated: March 2026.*
*Engage a qualified insurance regulatory lawyer to validate all compliance positions before launch.*
