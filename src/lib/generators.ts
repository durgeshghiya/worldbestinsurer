/**
 * Static page generation utilities.
 * Generates params for VS comparisons, city pages, insurer pages, and blog.
 *
 * All generator functions are now country-aware. When no countryCode is
 * provided they default to "in" (India) for backward compatibility.
 */

import { getAllProducts, getAllInsurers, getCategories } from "./data";
import { VALID_COUNTRY_CODES } from "./countries";
import type { InsuranceProduct, Category } from "./types";

// ---- VS Comparison Pairs ----
export interface VSPair {
  slug: string;
  productA: InsuranceProduct;
  productB: InsuranceProduct;
  category: Category;
  countryCode: string;
}

/**
 * Generate all pairwise VS comparisons within the same category AND country.
 * When countryCode is provided, only that country's products are paired.
 * When omitted, defaults to "in".
 */
export function generateVSPairs(countryCode: string = "in"): VSPair[] {
  const products = getAllProducts(countryCode);
  const pairs: VSPair[] = [];

  // Group by category (products are already within the same country)
  const byCategory = new Map<Category, InsuranceProduct[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  for (const [category, catProducts] of byCategory) {
    for (let i = 0; i < catProducts.length; i++) {
      for (let j = i + 1; j < catProducts.length; j++) {
        const a = catProducts[i];
        const b = catProducts[j];
        pairs.push({
          slug: `${a.id}-vs-${b.id}`,
          productA: a,
          productB: b,
          category,
          countryCode: a.countryCode ?? countryCode,
        });
      }
    }
  }

  return pairs;
}

export function getVSPairBySlug(
  slug: string,
  countryCode?: string
): VSPair | undefined {
  // If country given, search only that country. Otherwise search all active countries.
  const codes = countryCode ? [countryCode] : VALID_COUNTRY_CODES;
  for (const cc of codes) {
    const pair = generateVSPairs(cc).find((p) => p.slug === slug);
    if (pair) return pair;
  }
  return undefined;
}

// ---- City Pages ----
export interface CityInfo {
  slug: string;
  name: string;
  state: string;
  tier: number;
}

const _citiesCache = new Map<string, CityInfo[]>();

/**
 * Return cities for a given country. Data is loaded from:
 *   src/data/<countryCode>/cities.json
 * Falls back to src/data/indian-cities.json for "in".
 */
export function getCities(countryCode: string = "in"): CityInfo[] {
  const cc = countryCode.toLowerCase();
  if (_citiesCache.has(cc)) return _citiesCache.get(cc)!;

  let cities: CityInfo[] = [];

  // Try country-specific cities file
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require(`@/data/${cc}/cities.json`);
    cities = data.cities as CityInfo[];
  } catch {
    // Fallback for India to the legacy file
    if (cc === "in") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const data = require("@/data/indian-cities.json");
        cities = data.cities as CityInfo[];
      } catch {
        // No city data at all
      }
    }
  }

  _citiesCache.set(cc, cities);
  return cities;
}

export function getCityBySlug(
  slug: string,
  countryCode: string = "in"
): CityInfo | undefined {
  return getCities(countryCode).find((c) => c.slug === slug);
}

/**
 * Generate static params for city pages.
 * Returns objects with { country, category, city }.
 */
export function generateCityParams(
  countryCode?: string
): { country: string; category: string; city: string }[] {
  const codes = countryCode ? [countryCode] : VALID_COUNTRY_CODES;
  const cats = ["health", "term-life", "motor", "travel"];
  const params: { country: string; category: string; city: string }[] = [];

  for (const cc of codes) {
    const cities = getCities(cc);
    if (cities.length === 0) continue;
    for (const cat of cats) {
      for (const city of cities) {
        params.push({ country: cc, category: cat, city: city.slug });
      }
    }
  }

  return params;
}

// ---- Blog Articles (global – shared across countries) ----
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string;
}

export function getArticles(): Article[] {
  return articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

const articles: Article[] = [
  { slug: "how-to-compare-health-insurance-india", title: "How to Compare Health Insurance in India", excerpt: "A step-by-step guide to evaluating health insurance plans for Indian consumers.", category: "Health", readTime: "8 min", content: "Choosing health insurance can feel overwhelming with dozens of insurers and hundreds of plans available in India. This guide walks you through the key factors to evaluate when comparing health plans: coverage amount (sum insured), waiting periods for pre-existing diseases, room rent limits, co-payment clauses, sub-limits on specific treatments, network hospital availability, claim settlement ratios, and premium affordability. We also explain concepts like restoration benefit, no-claim bonus, and AYUSH coverage that are unique to Indian health insurance." },
  { slug: "what-to-check-before-buying-term-insurance", title: "What to Check Before Buying Term Insurance", excerpt: "Essential checklist for evaluating term life insurance in India.", category: "Term Life", readTime: "7 min", content: "Term insurance is the purest and most affordable form of life insurance. Before buying, evaluate these factors: claim settlement ratio (CSR) of the insurer, coverage amount needed (typically 10-15x annual income), policy term (should cover until retirement), premium payment options, rider availability (accidental death, critical illness, waiver of premium), payout options (lump sum vs monthly income), and the insurer's financial stability. We explain how CSR is calculated and why it matters." },
  { slug: "broker-vs-agent-vs-insurer-vs-aggregator", title: "Broker vs Agent vs Insurer vs Comparison Platform", excerpt: "Understanding the insurance distribution landscape in India.", category: "General", readTime: "6 min", content: "The Indian insurance market has multiple distribution channels. An insurance agent represents one insurer and earns commission on policies sold. An insurance broker represents the customer and can recommend products across multiple insurers. A web aggregator (like Policybazaar) provides online comparison and facilitates leads to insurers. A direct insurer (like Acko, Digit) sells policies directly without intermediaries. An informational platform provides comparison data for education. Each has different IRDAI licensing requirements." },
  { slug: "common-exclusions-health-insurance", title: "Common Exclusions in Health Insurance", excerpt: "Understanding what your health insurance does NOT cover.", category: "Health", readTime: "5 min", content: "Health insurance policies have standard exclusions that every policyholder should understand. Common exclusions include: pre-existing diseases during the waiting period, cosmetic or plastic surgery, dental treatment (unless caused by accident), spectacles and contact lenses, congenital conditions, self-inflicted injuries, war and nuclear risks, maternity (unless specifically covered), obesity-related treatments, and experimental procedures. Understanding exclusions helps avoid claim rejections." },
  { slug: "how-waiting-periods-work", title: "How Waiting Periods Work in Insurance", excerpt: "Understanding initial, PED, and specific disease waiting periods.", category: "Health", readTime: "5 min", content: "Waiting periods are time-based restrictions in health insurance during which certain claims cannot be made. There are three types: Initial waiting period (30 days for most policies — no claims except accidents), Pre-existing disease waiting (24-48 months — conditions you had before buying the policy), and Specific disease waiting (usually 24 months for conditions like hernia, kidney stones, joint replacements). Some insurers offer shorter PED waiting periods as a competitive advantage." },
  { slug: "how-claim-processes-differ", title: "How Claim Processes Differ Across Policy Types", excerpt: "Step-by-step claim processes for health, motor, term, and travel insurance.", category: "General", readTime: "9 min", content: "Each insurance type has a distinct claim process. Health insurance offers cashless claims at network hospitals or reimbursement claims with post-treatment documentation. Motor insurance requires FIR for theft, surveyor assessment for damage, and offers cashless repairs at partner garages. Term life claims require death certificate, policy documents, and nominee identification. Travel insurance claims need documentation from the travel provider plus medical records if applicable." },
  { slug: "understanding-motor-insurance-india", title: "Understanding Motor Insurance in India", excerpt: "Comprehensive guide to car and bike insurance in India.", category: "Motor", readTime: "7 min", content: "Motor insurance is mandatory in India under the Motor Vehicles Act. There are two types: Third-party liability (mandatory, covers damage to others) and Comprehensive (covers own damage plus third-party). Key concepts include IDV (Insured Declared Value — market value of your vehicle), NCB (No Claim Bonus — discount for claim-free years), and add-ons (zero depreciation, engine protect, roadside assistance, return to invoice). Third-party premiums are regulated by IRDAI while own-damage premiums vary by insurer." },
  { slug: "travel-insurance-guide-indians", title: "Travel Insurance Guide for Indian Travellers", excerpt: "Everything Indians need to know about travel insurance.", category: "Travel", readTime: "6 min", content: "Travel insurance protects against unforeseen events during trips. For international travel, it covers medical emergencies abroad, trip cancellation, baggage loss, passport loss, and flight delays. For Schengen visa applications, travel insurance with minimum EUR 30,000 medical cover is mandatory. Key factors to compare: medical cover amount, pre-existing disease coverage, adventure sports cover, COVID coverage, and claim assistance network." },
  { slug: "health-insurance-tax-benefits-80d", title: "Health Insurance Tax Benefits Under Section 80D", excerpt: "How to save tax through health insurance premiums in India.", category: "Health", readTime: "5 min", content: "Section 80D of the Income Tax Act allows deductions for health insurance premiums. For individuals below 60: up to Rs 25,000 for self/family and additional Rs 25,000 for parents. For senior citizen parents: up to Rs 50,000. Preventive health check-ups up to Rs 5,000 are included in the limit. HUF members can also claim deductions. Payment must be through non-cash modes except for preventive health check-ups." },
  { slug: "super-top-up-health-insurance-explained", title: "Super Top-Up Health Insurance Explained", excerpt: "How super top-up plans work and when you need one.", category: "Health", readTime: "5 min", content: "A super top-up health insurance plan provides additional coverage above a deductible threshold. It activates when medical expenses exceed the deductible in a policy year. For example, with a Rs 5 lakh deductible and Rs 50 lakh super top-up, the plan pays for expenses above Rs 5 lakh up to Rs 50 lakh. This is a cost-effective way to increase your health cover. The deductible can be covered by your base health policy or paid out of pocket." },
  { slug: "claim-settlement-ratio-explained", title: "What is Claim Settlement Ratio and Why It Matters", excerpt: "Understanding CSR for life and health insurance in India.", category: "General", readTime: "4 min", content: "Claim Settlement Ratio (CSR) is the percentage of claims an insurer settles out of total claims received in a financial year. For life insurance, a CSR above 95% is considered good. For health insurance, the metric is called incurred claim ratio (ICR). IRDAI publishes these figures annually. However, CSR alone doesn't tell the whole story — consider claim rejection reasons, turnaround time, and the insurer's overall financial health." },
  { slug: "irdai-role-insurance-regulation-india", title: "Role of IRDAI in Insurance Regulation in India", excerpt: "How India's insurance regulator protects policyholders.", category: "General", readTime: "6 min", content: "The Insurance Regulatory and Development Authority of India (IRDAI) regulates all insurance activities in the country. Established in 1999, IRDAI licenses insurers, brokers, and intermediaries; approves insurance products; sets solvency requirements; mandates claim settlement timelines; handles policyholder grievances; publishes industry data; and ensures fair market practices. All insurers operating in India must be registered with IRDAI." },
  { slug: "family-floater-vs-individual-health-plan", title: "Family Floater vs Individual Health Insurance", excerpt: "Which type of health plan is right for your family?", category: "Health", readTime: "5 min", content: "A family floater covers the entire family under one sum insured, while individual plans give each member their own coverage. Floaters are cheaper per person but have a shared limit. Individual plans ensure one family member's claim doesn't exhaust coverage for others. For young families, floaters are cost-effective. For families with older members or health conditions, individual plans may be better. Some families combine both approaches." },
  { slug: "no-claim-bonus-health-insurance", title: "No Claim Bonus (NCB) in Health Insurance", excerpt: "How NCB works and how to maximize it.", category: "Health", readTime: "4 min", content: "No Claim Bonus (NCB) is a reward for not making claims. In health insurance, NCB typically increases your sum insured by 10-50% for each claim-free year, up to a maximum (often 50-100% of base SI). Some policies offer cumulative bonus instead. NCB is lost or reduced when you make a claim. Some insurers offer NCB protection features. When porting your policy to another insurer, your accumulated NCB is portable under IRDAI guidelines." },
  { slug: "how-to-port-health-insurance", title: "How to Port Health Insurance to Another Insurer", excerpt: "Step-by-step guide to health insurance portability in India.", category: "Health", readTime: "5 min", content: "IRDAI allows policyholders to switch health insurers while retaining benefits like waiting period credits and NCB. To port: apply to the new insurer 45 days before renewal, submit the portability form, provide claim history, and the new insurer decides within 15 days. Your pre-existing disease waiting period credit is carried over. However, the new insurer may offer different terms or coverage. Portability is available for individual and family floater policies." },
  { slug: "riders-add-ons-term-insurance", title: "Essential Riders and Add-ons for Term Insurance", excerpt: "How riders enhance your term life coverage.", category: "Term Life", readTime: "5 min", content: "Term insurance riders add extra protection beyond the base death benefit. Common riders include: Accidental Death Benefit (additional payout for accidental death), Critical Illness (lump sum on diagnosis of specified illnesses), Waiver of Premium (premiums waived if policyholder becomes disabled), Accidental Disability (income or lump sum for permanent disability), and Terminal Illness (early payout if diagnosed with terminal illness). Adding riders costs extra premium but provides comprehensive protection." },
  { slug: "zero-depreciation-motor-insurance", title: "Zero Depreciation Add-on in Motor Insurance", excerpt: "Why zero dep cover is important for new cars.", category: "Motor", readTime: "4 min", content: "Standard motor insurance deducts depreciation on parts during claims — meaning you pay the difference. Zero depreciation (or nil depreciation or bumper-to-bumper) cover eliminates this deduction, so you get full claim value without depreciation on parts like rubber, plastic, glass, and fiber. It's most valuable for new cars (0-5 years old) and luxury vehicles where parts are expensive. The add-on typically costs 15-20% extra on the own-damage premium." },
  { slug: "ncb-no-claim-bonus-motor-insurance", title: "NCB in Motor Insurance: How It Works", excerpt: "Understanding and protecting your motor insurance NCB.", category: "Motor", readTime: "4 min", content: "No Claim Bonus (NCB) in motor insurance is a discount on own-damage premium for claim-free years. The scale is: 20% after 1st year, 25% after 2nd, 35% after 3rd, 45% after 4th, and 50% after 5th year. NCB is linked to the vehicle owner, not the vehicle, and is transferable when you sell/buy a car. Making a claim resets NCB to zero. NCB Protect add-on allows one claim without losing your NCB." },
  { slug: "schengen-travel-insurance-requirements", title: "Schengen Visa Travel Insurance Requirements", excerpt: "Mandatory travel insurance requirements for Schengen visa applications.", category: "Travel", readTime: "4 min", content: "For Schengen visa applications, travel insurance is mandatory with these requirements: minimum medical coverage of EUR 30,000 (approximately Rs 27 lakh), coverage must be valid for all Schengen countries, must cover emergency medical expenses and repatriation, must be valid for the entire stay plus a buffer, and must be from a recognized insurer. Most Indian travel insurance plans offer Schengen-compliant options with appropriate coverage levels." },
  { slug: "maternity-health-insurance-india", title: "Maternity Coverage in Health Insurance in India", excerpt: "Understanding maternity benefits in Indian health plans.", category: "Health", readTime: "5 min", content: "Maternity coverage in health insurance typically covers normal delivery, C-section, pre and post-natal expenses, and newborn baby coverage. Key points: most plans have a 24-36 month waiting period for maternity, there are usually sub-limits on delivery expenses, newborn coverage varies (some cover from day 1, others after 90 days), and maternity is often available as an optional rider rather than base coverage. Plans from Niva Bupa, HDFC ERGO, and Star Health offer competitive maternity options." },
  { slug: "critical-illness-insurance-guide", title: "Critical Illness Insurance: Complete Guide for Indians", excerpt: "Why you need critical illness cover beyond regular health insurance.", category: "Health", readTime: "6 min", content: "Critical illness insurance pays a lump sum on diagnosis of specified serious illnesses like cancer, heart attack, stroke, kidney failure, and major organ transplant. Unlike regular health insurance that covers hospitalization costs, the lump sum can be used for any purpose — treatment, income replacement, lifestyle changes, or recovery expenses. You can buy standalone critical illness policies or add riders to health/term insurance. Coverage typically ranges from Rs 5 lakh to Rs 1 crore." },
  { slug: "comprehensive-vs-third-party-motor", title: "Comprehensive vs Third-Party Motor Insurance", excerpt: "Understanding the two types of motor insurance in India.", category: "Motor", readTime: "5 min", content: "Third-party motor insurance is mandatory in India and covers legal liability for injury/death of third parties and damage to third-party property. Comprehensive motor insurance includes third-party coverage PLUS own-damage cover for your vehicle against theft, fire, natural disasters, and accidents. Third-party premiums are fixed by IRDAI while comprehensive premiums vary. For new and valuable vehicles, comprehensive cover is strongly recommended despite the higher premium." },
  { slug: "health-insurance-for-parents", title: "Best Way to Get Health Insurance for Parents", excerpt: "Guide to buying health insurance for senior citizen parents in India.", category: "Health", readTime: "6 min", content: "Getting health insurance for parents becomes critical as they age. Key considerations: entry age limits (most plans accept up to 65, some up to 75-80), pre-existing disease coverage and waiting periods, co-payment requirements (common for senior plans — 10-20%), room rent limits, network hospital availability in their city, claim settlement experience for senior claims, and premium affordability. Specialized senior citizen plans from Star Health, Care Health, and Niva Bupa are designed for this segment." },
  { slug: "insurance-for-freelancers-gig-workers", title: "Insurance for Freelancers and Gig Workers in India", excerpt: "How independent workers can protect themselves with insurance.", category: "General", readTime: "5 min", content: "Freelancers and gig workers don't have employer-provided insurance, making personal coverage essential. Key insurance needs: health insurance (individual plan with adequate sum insured), term life insurance (especially if you have dependents), personal accident insurance (covers disability-related income loss), and professional indemnity insurance (for consultants, designers, developers). Since income is variable, choose policies with flexible premium payment options." },
  { slug: "how-to-file-health-insurance-claim", title: "How to File a Health Insurance Claim in India", excerpt: "Step-by-step process for cashless and reimbursement claims.", category: "Health", readTime: "6 min", content: "There are two ways to claim health insurance in India. Cashless claims: get admitted to a network hospital, show your health card, the hospital coordinates with the insurer via TPA, and the insurer settles directly with the hospital. Reimbursement claims: pay the hospital bills yourself, then submit claim forms with original bills, discharge summary, diagnostic reports, and prescriptions to the insurer within the specified timeline (usually 15-30 days). Keep all original documents for reimbursement claims." },
  { slug: "group-health-vs-individual-health", title: "Group Health Insurance vs Individual Health Policy", excerpt: "Why you need personal health insurance even with company cover.", category: "Health", readTime: "4 min", content: "Many employees rely solely on employer-provided group health insurance, which is risky. Group policies typically have lower sum insured (Rs 3-5 lakh), end when you leave the company, may not cover family adequately, and have basic coverage without features like restoration or NCB. Having a personal health insurance policy ensures continuous coverage regardless of employment status, higher sum insured, comprehensive features, and accumulated no-claim benefits over time." },
  { slug: "day-care-procedures-health-insurance", title: "Day Care Procedures Covered in Health Insurance", excerpt: "Understanding day care coverage in modern health policies.", category: "Health", readTime: "4 min", content: "Day care procedures are treatments that require less than 24 hours of hospitalization but were traditionally done with longer stays. Modern health insurance covers hundreds of day care procedures including cataract surgery, chemotherapy, dialysis, tonsillectomy, angiography, lithotripsy, and many more. IRDAI mandates that health insurance policies must cover day care procedures. However, the specific list of covered procedures varies by insurer and plan." },
  { slug: "ayush-treatment-health-insurance", title: "AYUSH Treatment Coverage in Health Insurance", excerpt: "How Ayurveda, Yoga, Unani, Siddha and Homeopathy treatments are covered.", category: "Health", readTime: "4 min", content: "IRDAI mandates that health insurance policies should cover AYUSH treatments — Ayurveda, Yoga and Naturopathy, Unani, Siddha, and Homeopathy. Coverage is typically available for in-patient treatments at government or recognized AYUSH hospitals. The sum insured limit is usually the same as allopathic treatment. Some plans have sub-limits for AYUSH. This coverage helps policyholders who prefer alternative medicine systems, which are widely practiced in India." },
  { slug: "idv-insured-declared-value-explained", title: "IDV (Insured Declared Value) in Motor Insurance Explained", excerpt: "How your car's insurance value is calculated.", category: "Motor", readTime: "4 min", content: "Insured Declared Value (IDV) is the maximum amount your motor insurer will pay if your vehicle is stolen or totally damaged. IDV is calculated as the manufacturer's listed selling price minus depreciation based on vehicle age. Higher IDV means higher premium but better claim value. You can choose IDV within a range (typically +/- 10% of the calculated value). For new cars, IDV is close to the ex-showroom price. For accessories and modifications, you may need to declare additional value." },
  { slug: "personal-accident-insurance-india", title: "Personal Accident Insurance in India", excerpt: "Understanding standalone PA cover beyond what your other policies provide.", category: "General", readTime: "5 min", content: "Personal Accident (PA) insurance covers death and disability due to accidents. While motor insurance includes mandatory PA cover for the owner-driver, and some health plans include PA riders, a standalone PA policy provides comprehensive coverage including accidental death benefit, permanent total disability, permanent partial disability, and temporary total disability with weekly benefit. PA insurance is especially important for people with active lifestyles, frequent travellers, and those who are the sole earning member." },
  { slug: "what-is-copay-health-insurance", title: "Co-payment in Health Insurance: What It Means for You", excerpt: "Understanding co-pay clauses and how they affect your claims.", category: "Health", readTime: "4 min", content: "Co-payment (co-pay) is a cost-sharing arrangement where the policyholder pays a fixed percentage of every claim. For example, with a 20% co-pay, if your hospital bill is Rs 1 lakh, you pay Rs 20,000 and the insurer pays Rs 80,000. Co-pay is common in senior citizen policies, plans with lower premiums, and for certain treatments. Voluntary co-pay (choosing a higher co-pay for lower premium) can be a smart strategy for healthy individuals looking to reduce premium costs." },
  { slug: "term-insurance-for-women", title: "Term Insurance for Women in India", excerpt: "Why women should buy term insurance and available options.", category: "Term Life", readTime: "5 min", content: "Many Indian insurers offer lower term insurance premiums for women due to statistically higher life expectancy. Women, especially working women and those contributing to household finances, should consider term insurance for income protection, loan coverage, and family security. Key options include HDFC Life Click 2 Protect, Max Life Smart Secure Plus, and LIC Jeevan Amar — all offering competitive rates for women. Some plans offer special features like critical illness riders focused on women's health conditions." },
  { slug: "how-to-choose-sum-insured-health", title: "How to Choose the Right Sum Insured for Health Insurance", excerpt: "Guide to deciding how much health coverage you actually need.", category: "Health", readTime: "5 min", content: "Choosing the right sum insured is crucial. Factors to consider: city of residence (metros need higher cover due to hospital costs), age and health profile, family medical history, inflation in healthcare costs (10-15% annually in India), current cost of common treatments (heart surgery: Rs 3-8 lakh, cancer treatment: Rs 10-30 lakh), and whether you have employer insurance as a base. A general guideline: minimum Rs 10 lakh for individuals in metros, Rs 15-25 lakh for families. Consider a super top-up to extend coverage affordably." },
  { slug: "digital-vs-traditional-insurers-india", title: "Digital-First vs Traditional Insurers in India", excerpt: "Comparing new-age insurers like Acko and Digit with established players.", category: "General", readTime: "5 min", content: "India's insurance market now has digital-first insurers (Acko, Digit, Navi) competing with traditional players (ICICI Lombard, HDFC ERGO, Bajaj Allianz). Digital insurers typically offer simpler products, faster claims, lower premiums, and app-first experiences. Traditional insurers offer wider product range, larger hospital/garage networks, physical branches for complex claims, and established track records. The best choice depends on your comfort with digital processes, claim complexity expectations, and premium sensitivity." },
  { slug: "arogya-sanjeevani-policy-explained", title: "Arogya Sanjeevani Policy: IRDAI's Standard Health Product", excerpt: "Understanding India's standardized health insurance policy.", category: "Health", readTime: "4 min", content: "Arogya Sanjeevani is a standard health insurance product mandated by IRDAI for all general and health insurers. Key features: sum insured from Rs 1 lakh to Rs 5 lakh, co-pay of 5%, covers AYUSH treatments, modern treatments covered, 30-day initial waiting period, 48-month PED waiting, covers day care procedures, no sub-limits in many variants, and available as individual or family floater. Since the basic features are standardized across insurers, the key differentiators are premium, claim service, and network hospitals." },
  { slug: "insurance-jargon-glossary-india", title: "Insurance Jargon Glossary for Indian Consumers", excerpt: "Plain-English explanations of common insurance terms used in India.", category: "General", readTime: "8 min", content: "Understanding insurance terminology helps you make better decisions. Key terms: Sum Insured (maximum amount the insurer pays), Premium (amount you pay for the policy), Deductible (amount you pay before insurance kicks in), Co-pay (percentage you share per claim), Sub-limit (cap on specific expenses like room rent), Waiting Period (time before certain coverages activate), NCB (reward for claim-free years), IDV (vehicle's insured value), CSR (claim settlement ratio), TPA (third party administrator who processes claims), Cashless (insurer pays hospital directly), and Reimbursement (you pay first, insurer reimburses)." },
  { slug: "top-up-vs-super-top-up-difference", title: "Top-Up vs Super Top-Up: What's the Difference?", excerpt: "Understanding the key difference between top-up and super top-up plans.", category: "Health", readTime: "4 min", content: "Both top-up and super top-up plans provide additional coverage above a deductible, but they work differently. A top-up plan requires each individual claim to exceed the deductible — if your deductible is Rs 5 lakh and you have two hospitalizations of Rs 3 lakh each, neither claim triggers the top-up. A super top-up plan aggregates all claims in a policy year — the same two claims totaling Rs 6 lakh would trigger the super top-up since the aggregate exceeds Rs 5 lakh. Super top-ups are generally more useful and widely recommended." },
  { slug: "why-young-people-need-term-insurance", title: "Why Young Indians Should Buy Term Insurance Early", excerpt: "The financial case for buying term insurance in your 20s or 30s.", category: "Term Life", readTime: "4 min", content: "Buying term insurance young has significant advantages: premiums are dramatically lower (a 25-year-old pays roughly half what a 35-year-old pays for the same cover), you lock in low rates for the entire policy term, medical underwriting is easier when you're healthy, you protect against future insurability risk if health deteriorates, and you secure financial protection for dependents early. A Rs 1 crore cover for a 25-year-old non-smoker costs approximately Rs 5,000-7,000 per year — less than Rs 600 per month." },
  { slug: "home-insurance-india-guide", title: "Home Insurance in India: What You Need to Know", excerpt: "Understanding property insurance for Indian homeowners.", category: "General", readTime: "5 min", content: "Home insurance in India covers your house structure and contents against risks like fire, natural disasters, burglary, and water damage. Two types: Structure insurance (covers building, walls, roof, fixtures) and Contents insurance (covers furniture, appliances, electronics, valuables). Most home loans require structure insurance. Premiums are relatively affordable (Rs 2,000-5,000 per year for a Rs 50 lakh house). Key exclusions: earthquake damage (needs separate add-on), wear and tear, and damage due to poor maintenance." },
  { slug: "cyber-insurance-india-digital-protection", title: "Cyber Insurance: Protecting Your Digital Life in India", excerpt: "Understanding cyber insurance for individuals and families.", category: "General", readTime: "4 min", content: "With increasing digital transactions in India, cyber insurance protects against online financial fraud, identity theft, cyber stalking, phishing attacks, and unauthorized transactions. Insurers like Bajaj Allianz, HDFC ERGO, and ICICI Lombard offer individual cyber insurance policies covering financial loss from cyber attacks, legal expenses, counseling costs, and reputation management. Premiums range from Rs 1,000-5,000 annually for coverage of Rs 1-10 lakh. As UPI and digital payments grow, cyber insurance is becoming increasingly relevant." },
  { slug: "pet-insurance-india-options", title: "Pet Insurance in India: Available Options", excerpt: "Exploring insurance options for pet owners in India.", category: "General", readTime: "4 min", content: "Pet insurance is an emerging category in India covering veterinary treatment costs, third-party liability, and loss/theft of pets. Available from select insurers like Bajaj Allianz, New India Assurance, and digital platforms. Coverage typically includes hospitalization, surgery, OPD consultations, and vaccinations. Some plans cover only dogs, while others include cats and exotic pets. Premiums vary based on breed, age, and coverage. While not yet mainstream in India, growing pet adoption is driving demand for pet insurance products." },
];
