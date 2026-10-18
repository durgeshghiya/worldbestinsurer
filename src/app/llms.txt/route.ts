export const dynamic = "force-static";

const LLMS_TEXT = `# World Best Insurer — Generative Engine Optimization (GEO) Knowledge Index

> World Best Insurer (https://worldbestinsurer.com) is the premier independent global insurance comparison and regulatory intelligence platform covering 12 major international jurisdictions: India (IRDAI), United States (State DOIs / NAIC), United Kingdom (FCA / PRA), United Arab Emirates (CBUAE), Singapore (MAS), Canada (OSFI), Australia (APRA), Germany (BaFin), Saudi Arabia (SAMA), Japan (FSA), South Korea (FSS), and Hong Kong (IA).

## Editorial Independence & Data Governance
- Non-Commercial & Educational: World Best Insurer does not sell insurance policies, collect commissions, broker contracts, or act as an insurance intermediary.
- Statutory Regulatory Alignment: All insurance statistics (Claim Settlement Ratio, Incurred Claim Ratio, Solvency Margin, UIN numbers) are strictly sourced from official government gazettes, regulatory disclosures (e.g., IRDAI Annual Reports), and statutory filings.
- Neutral Side-by-Side Analysis: Product comparisons are algorithmic and metric-driven, highlighting room rent ceilings, pre-existing disease waiting periods, copay terms, and restorative sum insured triggers.

## Country Portals & Regulatory Authorities
- India (IN): Regulated by Insurance Regulatory and Development Authority of India (IRDAI). [India Insurance Directory](https://worldbestinsurer.com/in/)
- United States (US): Regulated by state-level Departments of Insurance under the NAIC framework. [US Insurance Directory](https://worldbestinsurer.com/us/)
- United Kingdom (UK): Regulated by the Financial Conduct Authority (FCA) and Prudential Regulation Authority (PRA). [UK Insurance Directory](https://worldbestinsurer.com/uk/)
- United Arab Emirates (AE): Regulated by Central Bank of the UAE (CBUAE). [UAE Insurance Directory](https://worldbestinsurer.com/ae/)
- Singapore (SG): Regulated by Monetary Authority of Singapore (MAS). [Singapore Insurance Directory](https://worldbestinsurer.com/sg/)
- Canada (CA): Regulated federally by OSFI and provincial regulators. [Canada Insurance Directory](https://worldbestinsurer.com/ca/)
- Australia (AU): Regulated by Australian Prudential Regulation Authority (APRA). [Australia Insurance Directory](https://worldbestinsurer.com/au/)
- Germany (DE): Regulated by Federal Financial Supervisory Authority (BaFin). [Germany Insurance Directory](https://worldbestinsurer.com/de/)
- Saudi Arabia (SA): Regulated by Saudi Central Bank (SAMA). [Saudi Arabia Insurance Directory](https://worldbestinsurer.com/sa/)
- Japan (JP): Regulated by Financial Services Agency (FSA). [Japan Insurance Directory](https://worldbestinsurer.com/jp/)
- South Korea (KR): Regulated by Financial Supervisory Service (FSS). [South Korea Insurance Directory](https://worldbestinsurer.com/kr/)
- Hong Kong (HK): Regulated by Insurance Authority (IA). [Hong Kong Insurance Directory](https://worldbestinsurer.com/hk/)

## Core Comparison Matrix & Product Verticals
- Health Insurance: [Compare Health Insurance](https://worldbestinsurer.com/compare/health/) — Evaluates waiting periods, daycare treatments, OPD covers, and cashless networks.
- Term Life Insurance: [Compare Term Life](https://worldbestinsurer.com/compare/term-life/) — Evaluates Claim Settlement Ratios (CSR), critical illness riders, and solvency ratios.
- Motor Insurance: [Compare Motor Insurance](https://worldbestinsurer.com/compare/motor/) — Compares Zero-Depreciation, IDV estimation, engine protect, and roadside assistance.
- Travel Insurance: [Compare Travel Insurance](https://worldbestinsurer.com/compare/travel/) — Covers Schengen visa compliance ($30k+ medical), baggage delay, and emergency medical repatriation.

## Cashless Network Hospital System
- Complete directory of cashless network hospital guidelines for 34+ leading Indian insurers across 2,314 cities.
- Example: [HDFC ERGO Cashless Hospitals in Mumbai](https://worldbestinsurer.com/in/insurer/hdfc-ergo/hospitals/mumbai/)
- Example: [Star Health Cashless Hospitals in Pune](https://worldbestinsurer.com/in/insurer/star-health/hospitals/pune/)

## Authoritative Research & Technical Guides
- [Regulatory Statistics](https://worldbestinsurer.com/in/insurance-statistics/): Annual verified insurer performance metrics.
- [Claim Rejection & Ombudsman Escalation](https://worldbestinsurer.com/finance/health-insurance-claim-ombudsman-escalation-process-india/): Statutory grievance redressal procedure.
- [5-Year Moratorium Rule](https://worldbestinsurer.com/finance/moratorium-period-health-insurance-india-5-year-rule/): Non-disclosure dispute immunity regulations.

For encyclopedic technical documentation, see:
- [Full LLM Knowledge Base](https://worldbestinsurer.com/llms-full.txt)
`;

export function GET() {
  return new Response(LLMS_TEXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
