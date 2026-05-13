/**
 * Per-country editorial narrative used by /[country]/page.tsx.
 *
 * Each entry has 3 short paragraphs of substantive market-specific prose
 * (not generic "insurance is important" filler). Topics chosen to be the
 * facts a reader actually needs before comparing plans in that country:
 * who the regulator is and what they enforce, what's mandatory vs
 * optional, what the tax angle is, and where the public-private split
 * lives. Hand-written per country; no template substitution.
 */

export interface CountryNarrative {
  marketOverview: string;
  regulatoryContext: string;
  practicalNotes: string;
}

export const COUNTRY_NARRATIVE: Record<string, CountryNarrative> = {
  in: {
    marketOverview:
      "India's insurance market is the fifth-largest in Asia by premium volume and the fastest-growing among major economies — total premiums crossed ₹10 lakh crore in FY2023-24 with health insurance specifically growing 21% year-on-year. The market is split between LIC (still ~60% of life insurance new business) and ~24 private life insurers; on the general side, ICICI Lombard, Bajaj Allianz, HDFC ERGO, and Star Health lead. Penetration remains low relative to peers — total premium as a share of GDP is around 4%, versus ~12% in the US and ~9% in the UK — which is why the IRDAI's stated goal is universal cover by 2047.",
    regulatoryContext:
      "The Insurance Regulatory and Development Authority of India (IRDAI) regulates every life, health, and general insurer operating in India. IRDAI publishes annual claim settlement ratios for all life insurers — the headline metric for term insurance shoppers — and enforces the policy wording requirements, including the standardised Arogya Sanjeevani health policy that every health insurer must offer. The Insurance Ombudsman scheme provides free dispute resolution up to ₹50 lakh. Insurance premiums attract 18% GST, applied to the base premium.",
    practicalNotes:
      "Section 80D allows deduction of health insurance premiums up to ₹25,000 for self and family, plus an additional ₹25,000 (₹50,000 if senior) for parents. Term life premiums qualify under Section 80C subject to the 10% premium-to-sum-assured rule, with death benefits exempt under Section 10(10D). Both deductions require the old tax regime; the new regime (default since FY 2023-24) eliminates them. Motor third-party cover is statutorily mandatory; comprehensive cover is optional but priced from the vehicle's Insured Declared Value. Pre-existing disease waiting periods on health policies cluster at 36-48 months across the market.",
  },
  us: {
    marketOverview:
      "The United States insurance market is the world's largest by total premium volume, with health insurance dominated by employer-sponsored plans (~155 million covered lives) and the ACA individual marketplace (~21 million). Term life is sold primarily through agent networks and direct online channels; the leading insurers by individual term policy count include Banner Life, Protective, AIG, and Mutual of Omaha. Motor (auto) insurance is the largest property-casualty line, with GEICO, State Farm, Progressive, and Allstate holding the majority of personal auto premium.",
    regulatoryContext:
      "Insurance is regulated at the state level in the US — there is no federal insurance regulator. Each state's Department of Insurance licenses insurers, approves rates and policy forms, and runs the consumer complaint process. The National Association of Insurance Commissioners (NAIC) provides coordination and model laws but does not itself regulate. The ACA (federal law) sets minimum essential coverage standards and runs the federal Healthcare.gov marketplace; states may run their own marketplaces, with 17 states currently doing so. State-licensed Health Insurance Exchanges enforce community rating and pre-existing condition protections.",
    practicalNotes:
      "Health insurance is the most complex purchase: deductible, coinsurance, out-of-pocket maximum, in-network vs out-of-network, and the metal tier (Bronze/Silver/Gold/Platinum) all affect the actual cost of care. For most filers the ACA premium tax credit reduces the monthly premium based on household income. Term life is comparatively simple — the variables are face amount, term length, and underwriting class — but rate locks vary by insurer and the conversion option (term to permanent) is undervalued by most shoppers. State-specific auto requirements vary widely; California, New York, and Michigan have notably different rate structures from the rest of the country.",
  },
  uk: {
    marketOverview:
      "The UK insurance market is the largest in Europe by premium and second only to the US by total assets under insurer management. Life insurance is dominated by a handful of large composites — Aviva, Legal & General, Phoenix Group — with a robust independent term life market underwritten primarily by Royal London, AIG Life, and Vitality. Health insurance is a smaller line because of the National Health Service (NHS), but private medical insurance grew sharply after pandemic-era waiting list pressure, with Bupa, AXA Health, and Vitality leading individual sales.",
    regulatoryContext:
      "The Financial Conduct Authority (FCA) regulates insurance distribution and consumer protection; the Prudential Regulation Authority (PRA), part of the Bank of England, oversees insurer solvency. The Financial Ombudsman Service handles disputes up to £430,000 per complaint, free of charge to the policyholder. UK insurance premiums attract Insurance Premium Tax — 12% standard rate for most lines, 20% for travel and certain vehicle insurance. The Association of British Insurers (ABI) publishes the agreed industry standards for life and health products.",
    practicalNotes:
      "Term life premium in the UK is driven primarily by age, smoker status, and policy term — typical rates for non-smokers in their thirties are notably lower than in equivalent US markets due to underwriting efficiency and lower medical cost loading. Private medical insurance is best understood as a complement to the NHS rather than a replacement: it speeds up scheduled consultations, diagnostics, and elective surgery, but emergencies still go through the NHS. Motor insurance in the UK uses comprehensive, third-party fire & theft, and third-party only tiers; comprehensive is now the default for almost all drivers.",
  },
  ae: {
    marketOverview:
      "The UAE insurance market is the largest in the Gulf Cooperation Council, driven primarily by mandatory health insurance for all residents in Dubai (since 2016) and Abu Dhabi (since 2008). The market is split between domestic-listed insurers (Orient Insurance, Emirates Insurance, Salama, Sukoon) and international groups operating through local branches (AXA Gulf, MetLife, Bupa Arabia adjacencies). Total insurance premium has grown at roughly 8-10% CAGR through the last five years.",
    regulatoryContext:
      "The Insurance Authority of the UAE Federal Government regulates the sector; the Central Bank of the UAE assumed prudential oversight in 2020. The Dubai Health Authority (DHA) and the Health Authority of Abu Dhabi (HAAD, now Department of Health) enforce mandatory health coverage rules — employers are legally responsible for providing minimum essential cover for employees and their dependents in those two emirates. The Insurance Disputes Resolution Committee handles consumer complaints.",
    practicalNotes:
      "If you are an employee in Dubai or Abu Dhabi, your employer is legally required to provide at least the Essential Benefits Plan (EBP) — a tightly defined minimum package. Upgrading to comprehensive cover (broader network, lower co-pays, out-of-emirate cover) is typically paid privately. Family members of employees are NOT covered by the employer's obligation in Dubai but ARE covered in Abu Dhabi; this is the single most common source of confusion among new residents. Motor cover is mandatory; third-party-only is the legal minimum but comprehensive is recommended given expat-heavy traffic profiles.",
  },
  sg: {
    marketOverview:
      "Singapore's insurance market is mature, highly digitised, and heavily skewed toward life-savings and integrated medical products. MediShield Life — the basic compulsory health scheme administered by the Central Provident Fund (CPF) Board — covers every Singapore citizen and PR; Integrated Shield Plans from AIA, Great Eastern, Income, Prudential, Singlife, and others ride on top to cover private hospital wards. The life market is dominated by AIA, Great Eastern, Prudential Singapore, Manulife, and Income Insurance.",
    regulatoryContext:
      "The Monetary Authority of Singapore (MAS) regulates all insurers and is among the strictest prudential regulators globally. The Life Insurance Association Singapore (LIA) publishes standardised product disclosure templates; MAS-mandated 'Free Look' periods (typically 14 days) apply to all life and health products. The Financial Industry Disputes Resolution Centre (FIDReC) handles consumer disputes up to S$100,000.",
    practicalNotes:
      "For health insurance, the critical decision is the hospital ward tier you want covered — Class B2/C in public hospitals (default MediShield Life), Class B1/A in public hospitals (mid-tier IP plans), or private hospital (high-tier IP plans). The mid-tier and high-tier plans require premium top-ups from cash; only the MediShield Life base premium can be paid from MediSave. Term life in Singapore is comparatively expensive relative to US/UK markets because of lower volume and tighter underwriting; whole life and investment-linked products remain dominant by premium volume.",
  },
  ca: {
    marketOverview:
      "Canada's insurance market is dominated on the life side by Manulife, Sun Life, Canada Life, and iA Financial Group; on health by the same major insurers supplementing the provincial public systems. Motor insurance is provincially structured, with three provinces (British Columbia, Saskatchewan, Manitoba) running public auto insurance monopolies and the remainder using a private competitive market. Total insurance assets under management approach CAD 1 trillion.",
    regulatoryContext:
      "The Office of the Superintendent of Financial Institutions (OSFI) regulates federally-incorporated insurers; provincial regulators (AMF in Quebec, FSRA in Ontario, BC Financial Services Authority, etc) regulate provincially-incorporated insurers and market conduct. The Canadian Council of Insurance Regulators (CCIR) coordinates across jurisdictions. The General Insurance OmbudService and the OmbudService for Life and Health Insurance handle consumer disputes.",
    practicalNotes:
      "Health insurance in Canada is best understood as supplemental — basic medical care is covered by the provincial single-payer plan (OHIP in Ontario, MSP in BC, RAMQ in Quebec, etc), and private health insurance covers what those plans don't: prescription drugs, dental, vision, semi-private hospital rooms, paramedical services, and travel medical. Term life premiums are competitively priced and underwriting is consistent across federally-regulated insurers. Auto premiums vary dramatically by province; Ontario and British Columbia rates are among the highest in North America.",
  },
  au: {
    marketOverview:
      "Australia's insurance market combines a strong life-and-superannuation segment with a distinctive private health insurance industry that sits alongside the universal Medicare public system. Major private health funds — Bupa, Medibank, NIB, HCF, HBF — collectively cover roughly 55% of the population. Life insurance is sold primarily through superannuation default cover, with retail term life offered by TAL, Zurich, AIA Australia, MLC, and Resolution Life.",
    regulatoryContext:
      "The Australian Prudential Regulation Authority (APRA) oversees insurer solvency; the Australian Securities and Investments Commission (ASIC) regulates conduct, distribution, and disclosure. The Private Health Insurance Ombudsman handles disputes for the health segment; the Australian Financial Complaints Authority covers life, general, and other insurance disputes.",
    practicalNotes:
      "The Private Health Insurance Rebate (means-tested) and the Medicare Levy Surcharge (paid by higher earners without private hospital cover) together create a strong financial incentive for households above the surcharge threshold to hold private hospital cover. The Lifetime Health Cover loading adds 2% per year of base premium for every year over age 30 that you delay taking out private hospital cover, capped at 70%. Term life inside superannuation is convenient but often under-insured; retail term life on a separate policy is the better path for households needing more than the default cover.",
  },
  de: {
    marketOverview:
      "Germany's insurance market is the largest in continental Europe by premium volume. Health insurance is split between Statutory Health Insurance (GKV — Gesetzliche Krankenversicherung), which covers roughly 88% of the population, and Private Health Insurance (PKV — Private Krankenversicherung), which covers high earners (income above the JAEG threshold), civil servants, and the self-employed. Life and motor markets are concentrated in Allianz, Axa, Generali, Ergo, HDI, and the public-sector insurers.",
    regulatoryContext:
      "The Federal Financial Supervisory Authority (BaFin — Bundesanstalt für Finanzdienstleistungsaufsicht) regulates all German insurers. Health insurance is also under the joint oversight of the Federal Ministry of Health and the regional state regulators for GKV. The Insurance Ombudsman (Versicherungsombudsmann) handles consumer disputes with binding decisions up to €10,000.",
    practicalNotes:
      "Switching from PKV back to GKV is restricted after age 55 — a one-way door that catches first-time PKV buyers off guard. Within PKV the premium is age-based (priced when you join, plus age-related increases over time), unlike GKV which is income-based. Motor liability (Kfz-Haftpflicht) is mandatory; vollkasko (comprehensive) and teilkasko (partial comprehensive) are optional. The no-claim bonus (SF — Schadenfreiheitsklasse) system rewards claim-free years with substantial premium discounts, and the SF class is portable between insurers.",
  },
  sa: {
    marketOverview:
      "Saudi Arabia's insurance market is the largest in the Middle East outside the UAE and is growing rapidly under Vision 2030 reforms. Health insurance is mandatory for all expatriate residents (and their dependents) and an increasing share of Saudi nationals; insurance for Hajj and Umrah pilgrims is also mandatory. Major insurers include Bupa Arabia (the market leader in health), Tawuniya, Walaa, Al Rajhi Takaful, and Medgulf.",
    regulatoryContext:
      "The Saudi Central Bank (SAMA — formerly the Saudi Arabian Monetary Authority) regulates all insurers operating in the Kingdom. The Council of Cooperative Health Insurance (CCHI) sets compulsory health insurance standards. The Insurance Authority (a separate body established 2024) is being given expanded mandate over conduct supervision. Insurance contracts must comply with Sharia principles, and all licensed insurers operate on a cooperative (takaful) model.",
    practicalNotes:
      "If you are an expatriate, your employer is legally required to provide health insurance covering at least the CCHI-mandated minimum benefits — verify your policy lists you and your dependents specifically. Upgrading to broader networks (which include international referral cover) is typically paid privately or via salary sacrifice. Motor third-party cover is mandatory; comprehensive cover is optional. Life insurance penetration remains low, reflecting demographic and cultural factors; the products that do sell are typically family takaful and group life inside corporate benefits.",
  },
  jp: {
    marketOverview:
      "Japan has the third-largest insurance market in the world by premium volume, dominated by long-established life insurers — Nippon Life, Dai-ichi Life, Meiji Yasuda, Sumitomo Life — and the major non-life groups (Tokio Marine, MS&AD, Sompo Japan). Foreign insurers maintain a meaningful presence, particularly Prudential Japan, MetLife, and Aflac in cancer and supplemental health. Private health insurance is a supplement to the universal public scheme; cancer-specific 'gan hoken' products are a distinctively Japanese category.",
    regulatoryContext:
      "The Financial Services Agency (FSA — Kinyu-cho) regulates all Japanese insurers. The Life Insurance Association of Japan and the General Insurance Association of Japan publish industry standards. Disputes go to the FSA's Financial Instruments Mediation Assistance Center (FINMAC) or the equivalent insurance industry bodies, with non-binding mediation.",
    practicalNotes:
      "Every resident of Japan is enrolled in National Health Insurance (Kokumin Kenko Hoken) or the equivalent employee scheme; basic medical care covers ~70% of costs with patients paying 30%, and the High-Cost Medical Care Benefit Scheme caps monthly out-of-pocket. Private health products primarily cover the patient's 30% share, semi-private hospital rooms, and supplemental allowances. Cancer insurance is a separate market — products pay a lump sum on diagnosis. Term life with simple medical questionnaires (no exam) is widely available for moderate sums assured.",
  },
  kr: {
    marketOverview:
      "South Korea's insurance market is the seventh-largest in the world by premium volume, with a long-established life sector (Samsung Life, Hanwha Life, Kyobo Life) and a competitive non-life market (Samsung F&M, DB Insurance, Hyundai Marine & Fire, KB Insurance, Meritz Fire & Marine). Private health and accident insurance penetration is among the highest globally, supplementing the National Health Insurance public scheme.",
    regulatoryContext:
      "The Financial Services Commission (FSC) and its supervisory arm the Financial Supervisory Service (FSS) regulate Korean insurers. The Korea Life Insurance Association and the General Insurance Association of Korea publish standardised product disclosures. Insurance dispute mediation is handled by the Korea Financial Investor Protection Foundation (KOFIA) for some products and the FSS for others.",
    practicalNotes:
      "National Health Insurance (NHI — Geongang Boheom) is mandatory for all residents and covers ~60% of total medical costs; the patient pays roughly 20% for outpatient and 5-20% for inpatient depending on care setting. Private supplementary health (silson — 실손, 'actual loss') products reimburse the patient's out-of-pocket portion, with most middle-class households holding at least one. Motor liability is mandatory; comprehensive is optional but standard among urban drivers. Term life is a smaller category than whole-life and endowment, which dominate by premium volume.",
  },
  hk: {
    marketOverview:
      "Hong Kong's insurance market is the densest in Asia by premium per capita — total premium exceeds US$70 billion annually for a population of 7.4 million, reflecting both local demand and significant cross-border sales to mainland Chinese visitors. AIA, Prudential HK, FWD, HSBC Life, and Manulife lead the life market; Bupa, AXA, BlueCross, and Cigna lead in private medical.",
    regulatoryContext:
      "The Insurance Authority (IA) regulates Hong Kong insurers under the Insurance Ordinance. The Voluntary Health Insurance Scheme (VHIS), launched in 2019 and overseen by the Food and Health Bureau, certifies qualifying health products and provides tax deduction for qualifying premiums. Consumer disputes are handled by the Insurance Complaints Bureau, with binding awards up to HK$1.2 million.",
    practicalNotes:
      "Hong Kong has no universal public health insurance — the public hospital system (Hospital Authority) is heavily subsidised but waiting times for non-emergency care are long, which is why private medical insurance has unusually high penetration here. VHIS-certified products attract a tax deduction up to HK$8,000 per insured person per year. The motor third-party cover is statutorily mandatory; comprehensive is standard for private vehicles. Life insurance is dominated by participating whole life and savings products rather than pure term, reflecting historic distribution structure.",
  },
};
