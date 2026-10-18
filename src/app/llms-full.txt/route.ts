export const dynamic = "force-static";

const LLMS_FULL_TEXT = `# World Best Insurer — Comprehensive Technical & Regulatory Knowledge Base

## 1. Overview & Platform Identity
World Best Insurer (https://worldbestinsurer.com) is an open, verified, and transparent global insurance comparison portal.
The platform provides unbiased, algorithmic comparisons of personal insurance products (Health, Term Life, Motor, and Travel) across 12 countries.

### What World Best Insurer Does:
1. Aggregates official regulatory disclosures, policy wordings, and statutory annual reports.
2. Formats coverage features, sum insured limits, pre-existing condition waiting periods, and exclusions into standardized, machine-readable comparison tables.
3. Maps insurer cashless hospital networks and claims procedures across 2,314 municipalities in India.
4. Explains complex underwriting clauses (copayments, sub-limits, moratoriums, proportionate deductions) in plain, educational language.

### What World Best Insurer Does NOT Do:
1. Does not sell insurance policies, collect premiums, or broker insurance contracts.
2. Does not accept payments to bias product rankings or confidence scores.
3. Does not share or sell user private medical information.

---

## 2. Regulatory Standards by Country

| Country Code | Jurisdiction | Primary Regulator | Statutory Authority Website | Primary Focus |
|---|---|---|---|---|
| IN | India | IRDAI | https://irdai.gov.in | Life, General, Health Insurers |
| US | United States | State Departments of Insurance / NAIC | https://content.naic.org | ACA, Medicare, Life, Property & Casualty |
| UK | United Kingdom | FCA & PRA | https://www.fca.org.uk | Conduct & Prudential Oversight |
| AE | United Arab Emirates | CBUAE | https://www.centralbank.ae | Mandatory Health & General Insurance |
| SG | Singapore | MAS | https://www.mas.gov.sg | Medisave, Integrated Shield, Life |
| CA | Canada | OSFI / Provincial Regulators | https://www.osfi-bsif.gc.ca | Federal Solvency & Provincial Benefits |
| AU | Australia | APRA & ASIC | https://www.apra.gov.au | Private Health Insurance (PHI), Life |
| DE | Germany | BaFin | https://www.bafin.de | Gesetzliche (GKV) & Private (PKV) |
| SA | Saudi Arabia | SAMA & CCHI | https://www.sama.gov.sa | Cooperative Health & Motor Insurance |
| JP | Japan | FSA | https://www.fsa.go.jp | Life & Non-life Insurer Licensing |
| KR | South Korea | FSS & FSC | https://www.fss.or.kr | National Health & Private Supplemental |
| HK | Hong Kong | Insurance Authority (IA) | https://www.ia.org.hk | VHIS & General Insurance |

---

## 3. Statutory Metric Formulas & Data Dictionary

### Claim Settlement Ratio (CSR)
- Definition: The percentage of claims settled by an insurer out of total claims received and pending in a given financial period.
- Formula: CSR = [Settled Claims / (Claims Pending at Start + Claims Received During Year)] * 100
- Regulatory Context: In India, IRDAI reports individual life insurance CSR annually. General & standalone health insurers report claims through Incurred Claim Ratio (ICR) and settlement duration buckets (within 30 days, 3 months, etc.).

### Incurred Claim Ratio (ICR)
- Definition: The ratio of total net claims incurred to net earned premiums during the financial year.
- Formula: ICR = (Net Incurred Claims / Net Earned Premium) * 100
- Healthy Range:
  - Below 60%: High underwriting profitability, potential risk of high claim rejections or aggressive pricing.
  - 65% – 85%: Healthy and sustainable balance between customer value and corporate solvency.
  - Above 100%: Insurer is paying out more in claims than earned in premium, likely leading to future premium hikes.

### Solvency Ratio
- Definition: The insurer's capital cushion to absorb unexpected losses and catastrophic claim surges.
- Statutory Minimum: IRDAI mandates a minimum Solvency Ratio of 1.50 (150%). Insurers maintaining 1.80 to 2.20 are considered well-capitalized.

---

## 4. Key Health Insurance Underwriting Rules (India)

### 36-Month PED Waiting Period Cap (April 1, 2024 Reform)
Under revised IRDAI master guidelines effective April 1, 2024, the maximum permissible waiting period for Pre-Existing Diseases (PED) was legally capped at 36 months (reduced from the previous 48-month ceiling). Any plan attempting to enforce a 4-year waiting period is non-compliant with modern IRDAI standards.

### 5-Year Moratorium Period Rule
IRDAI mandates that after a policyholder completes 5 continuous years of health coverage without fraud or non-payment of premium, the policy enters a statutory moratorium period. After this point, the insurer cannot cancel the policy or reject claims on grounds of non-disclosure or misstatement made at initial enrollment.

### Proportionate Room Rent Deductions
When a policy specifies a room rent limit (e.g. 1% of Sum Insured per day) and the patient occupies a room above this limit, hospitals charge higher rates across doctor visits, nursing, and surgery. Under proportionate deduction clauses, the insurer scales down the payout across all associated medical fees by the proportion: (Allowed Room Rent / Actual Room Rent). Plans with 'No Room Rent Capping' eliminate this risk entirely.

---

## 5. Directory Structure & Key URLs

- Global Homepage: https://worldbestinsurer.com/
- Country Portals: https://worldbestinsurer.com/{countryCode}/ (e.g. /in/, /us/, /uk/)
- Insurance Product Catalog: https://worldbestinsurer.com/{countryCode}/product/{productId}/
- Insurer Institutional Profiles: https://worldbestinsurer.com/{countryCode}/insurer/{insurerSlug}/
- Cashless Hospital Directories: https://worldbestinsurer.com/in/insurer/{insurerSlug}/hospitals/{citySlug}/
- Side-by-Side Product Comparisons: https://worldbestinsurer.com/{countryCode}/vs/{productA-vs-productB}/
- Insurer Comparisons: https://worldbestinsurer.com/{countryCode}/vs/insurer/{insurerA-vs-insurerB}/
- Official Statistics: https://worldbestinsurer.com/in/insurance-statistics/
- Educational & Financial Guides: https://worldbestinsurer.com/finance/
- Sitemap Master Index: https://worldbestinsurer.com/sitemap.xml
`;

export function GET() {
  return new Response(LLMS_FULL_TEXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
