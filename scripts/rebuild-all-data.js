/**
 * Full data rebuild script — updates all insurance product data across 12 countries
 * Sources: PolicyBazaar, Ditto, Beshak, NerdWallet, Policygenius, MoneySuperMarket, etc.
 * Run: node scripts/rebuild-all-data.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "src/data");

const DISCLAIMER = "Data collected from publicly available sources for educational and informational purposes only. Premium figures are illustrative and sourced from public insurer calculators/brochures. Actual premiums may vary. Please verify all details with the insurer directly before making any decision.";

function writeData(cc, category, products) {
  const catFile = {
    health: "health-insurance.json",
    "term-life": "term-life-insurance.json",
    motor: "motor-insurance.json",
    travel: "travel-insurance.json",
  }[category];
  const filePath = path.join(DATA, cc, catFile);
  const data = {
    category,
    lastUpdated: "2026-04-03",
    disclaimer: DISCLAIMER,
    products: products.map((p) => ({ ...p, countryCode: cc })),
  };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`  ${cc}/${catFile}: ${products.length} products`);
}

function makeProduct(id, insurer, insurerSlug, name, category, sub, opts) {
  return {
    id,
    insurerName: insurer,
    insurerSlug,
    productName: name,
    category,
    subCategory: sub,
    eligibility: opts.eligibility || { minAge: 18, maxAge: 65, renewableUpTo: "lifetime" },
    sumInsured: opts.sumInsured || { min: null, max: null, options: [] },
    premiumRange: {
      illustrativeMin: opts.premMin || 0,
      illustrativeMax: opts.premMax || 0,
      assumptions: opts.assumptions || "Illustrative only. Actual premiums vary.",
      isVerified: false,
    },
    waitingPeriod: opts.waitingPeriod || undefined,
    keyInclusions: opts.inclusions || [],
    keyExclusions: opts.exclusions || ["Pre-existing diseases during waiting period", "Cosmetic surgery (unless medically necessary)", "Self-inflicted injuries"],
    claimSettlement: opts.csr ? { ratio: opts.csr, year: opts.csrYear || "FY2023-24", source: "IRDAI / Insurer website" } : undefined,
    networkHospitals: opts.network ? { count: opts.network, source: "Insurer website" } : undefined,
    riders: opts.riders || [],
    policyTenure: opts.tenure || { min: 1, max: 1, options: [1] },
    renewability: opts.renewability || "Lifelong",
    specialFeatures: opts.features || [],
    sourceUrl: opts.sourceUrl || "",
    sourceType: "official-website",
    lastVerified: "2026-04-03",
    confidenceScore: opts.confidence || "medium",
    notes: opts.notes || "",
  };
}

// ═══════════════════════════════════════
// INDIA HEALTH INSURANCE
// ═══════════════════════════════════════
const inHealth = [
  makeProduct("hdfc-ergo-optima-secure", "HDFC ERGO General Insurance Co. Ltd.", "hdfc-ergo", "Optima Secure", "health", "individual", {
    sumInsured: { min: 500000, max: 10000000, options: [500000, 1000000, 1500000, 2000000, 5000000, 10000000] },
    premMin: 12000, premMax: 18000, assumptions: "Individual, 30 years, ₹10L SI, metro city. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "48 months", specific: "24 months" },
    csr: 98.26, network: 13000, confidence: "high",
    inclusions: ["In-patient hospitalization", "2X coverage from Day 1", "100% automatic restoration", "No room rent sub-limits", "No copay", "Consumables covered", "Day care procedures", "AYUSH treatments", "Ambulance charges", "Annual health check-up"],
    features: ["2X Sum Insured from Day 1", "100% Auto-Restore", "No Room Rent Limits", "Consumables Covered", "96.71% 3-year avg CSR"],
    riders: ["Critical Illness", "Personal Accident", "OPD Cover"],
    sourceUrl: "https://www.hdfcergo.com/health-insurance/optima-secure",
  }),
  makeProduct("niva-bupa-reassure-2", "Niva Bupa Health Insurance Co. Ltd.", "niva-bupa", "ReAssure 2.0", "health", "family-floater", {
    sumInsured: { min: 500000, max: 10000000, options: [500000, 1000000, 2000000, 5000000, 10000000] },
    premMin: 11000, premMax: 16000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "36 months", specific: "24 months" },
    csr: 91.15, network: 10000, confidence: "high",
    inclusions: ["In-patient hospitalization", "Unlimited reinstatement", "Up to 6 family members", "Personal accident cover", "Day care procedures", "AYUSH treatments"],
    features: ["Unlimited Reinstatement", "30% Fitness Discount", "Age-Lock Premiums", "Up to 6 Family Members"],
    riders: ["Maternity Cover", "OPD Cover", "Critical Illness"],
    sourceUrl: "https://www.nivabupa.com/health-insurance/reassure-2.html",
  }),
  makeProduct("care-supreme", "Care Health Insurance Ltd.", "care-health", "Care Supreme", "health", "individual", {
    sumInsured: { min: 500000, max: 10000000, options: [500000, 1000000, 2000000, 5000000, 10000000] },
    premMin: 10000, premMax: 15000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "36 months", specific: "24 months" },
    csr: 93.13, network: 22000, confidence: "high",
    inclusions: ["In-patient hospitalization", "Unlimited auto-recharge", "Cumulative bonus up to 600%", "Free annual health check-ups", "Unlimited GP e-consultations", "Day care procedures", "AYUSH treatments"],
    features: ["Unlimited Auto-Recharge", "600% Cumulative Bonus", "Free GP Consultations", "22,000+ Hospital Network"],
    riders: ["Personal Accident", "Critical Illness"],
    sourceUrl: "https://www.careinsurance.com/health-insurance/care-supreme.html",
  }),
  makeProduct("bajaj-allianz-health-guard", "Bajaj Allianz General Insurance Co. Ltd.", "bajaj-allianz", "Health Guard", "health", "individual", {
    sumInsured: { min: 300000, max: 50000000, options: [300000, 500000, 1000000, 2000000, 5000000, 50000000] },
    premMin: 12000, premMax: 18000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "48 months", specific: "24 months" },
    csr: 95.04, network: 12500, confidence: "high",
    inclusions: ["In-patient hospitalization", "OPD benefit 2X premium", "Customizable coverage", "Day care procedures", "AYUSH treatments", "Ambulance charges"],
    features: ["OPD Benefit 2X Premium", "Lowest Complaint Ratio (3.42/10K)", "Up to ₹5 Crore Cover", "4.90/5 Insurer Rating"],
    riders: ["Critical Illness", "Personal Accident", "Hospital Cash"],
    sourceUrl: "https://www.bajajallianz.com/health-insurance-plans/health-guard-plan.html",
  }),
  makeProduct("star-family-health-optima", "Star Health and Allied Insurance Co. Ltd.", "star-health", "Family Health Optima", "health", "family-floater", {
    sumInsured: { min: 300000, max: 2500000, options: [300000, 500000, 1000000, 1500000, 2000000, 2500000] },
    premMin: 12000, premMax: 38000, assumptions: "Family floater, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "48 months", specific: "24 months" },
    csr: 82.34, network: 14000, confidence: "high",
    inclusions: ["In-patient hospitalization", "Day care procedures", "Pre/post hospitalization", "Ambulance charges", "AYUSH treatments", "Automatic restoration"],
    features: ["Affordable Premiums", "Good for Tier 2/3 Cities", "14,000+ Hospitals", "India's Largest Health Insurer"],
    riders: ["Maternity Cover", "OPD Rider"],
    sourceUrl: "https://www.starhealth.in/health-insurance/family-health-optima",
  }),
  makeProduct("manipalcigna-prohealth-plus", "ManipalCigna Health Insurance Co. Ltd.", "manipalcigna", "ProHealth Plus", "health", "individual", {
    sumInsured: { min: 500000, max: 7500000, options: [500000, 1000000, 2000000, 5000000, 7500000] },
    premMin: 10000, premMax: 14000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "24 months", specific: "24 months" },
    csr: 69, network: 8000, confidence: "medium",
    inclusions: ["In-patient hospitalization", "Day 1 health check-ups", "Up to 35% premium discount", "Day care procedures", "AYUSH treatments"],
    features: ["Only 2-Year PED Waiting Period", "Day 1 Health Check-ups", "35% Premium Discount", "Preventive Care Focus"],
    riders: ["Critical Illness", "Maternity"],
    sourceUrl: "https://www.manipalcigna.com/health-insurance/prohealth-plus",
  }),
  makeProduct("aditya-birla-activ-one-max", "Aditya Birla Health Insurance Co. Ltd.", "aditya-birla-health", "Activ One MAX", "health", "individual", {
    sumInsured: { min: 500000, max: 20000000, options: [500000, 1000000, 2000000, 5000000, 10000000, 20000000] },
    premMin: 11000, premMax: 16000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "48 months", specific: "24 months" },
    csr: 62, network: 10500, confidence: "medium",
    inclusions: ["In-patient hospitalization", "Rewards-based system", "Activity tracking integration", "Day care procedures", "AYUSH treatments"],
    features: ["Fitness Rewards System", "Activity Tracking", "Up to ₹2 Crore Cover", "Wellness Integration"],
    riders: ["Critical Illness", "Personal Accident"],
    sourceUrl: "https://www.adityabirlahealthinsurance.com/health-insurance/activ-one-max",
  }),
  makeProduct("tata-aig-medicare-select", "Tata AIG General Insurance Co. Ltd.", "tata-aig", "Medicare Select", "health", "individual", {
    sumInsured: { min: 500000, max: 10000000, options: [500000, 1000000, 2000000, 5000000, 10000000] },
    premMin: 9000, premMax: 14000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "36 months", specific: "24 months" },
    csr: 77, network: 7500, confidence: "medium",
    inclusions: ["In-patient hospitalization", "Restoration benefit", "Wellness incentives", "Robotic surgery coverage", "Day care procedures", "AYUSH treatments"],
    features: ["4.55/5 Insurer Rating", "Robotic Surgery Covered", "Wellness Incentives", "Generous Restoration"],
    riders: ["Critical Illness", "Personal Accident", "OPD Cover"],
    sourceUrl: "https://www.tataaig.com/health-insurance/medicare",
  }),
  makeProduct("icici-lombard-elevate", "ICICI Lombard General Insurance Co. Ltd.", "icici-lombard", "Elevate", "health", "individual", {
    sumInsured: { min: 500000, max: 10000000, options: [500000, 1000000, 2000000, 5000000, 10000000] },
    premMin: 10000, premMax: 15000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "48 months", specific: "24 months" },
    csr: 83, network: 18000, confidence: "medium",
    inclusions: ["In-patient hospitalization", "Day care procedures", "Pre/post hospitalization", "Ambulance charges", "Annual health check-up"],
    features: ["4.38/5 Overall Rating", "18,000+ Hospital Network", "Broad Coverage"],
    riders: ["Critical Illness", "Personal Accident"],
    sourceUrl: "https://www.icicilombard.com/health-insurance/elevate",
  }),
  makeProduct("digit-health-insurance", "Go Digit General Insurance Ltd.", "digit", "Digit Health Insurance", "health", "individual", {
    sumInsured: { min: 300000, max: 2500000, options: [300000, 500000, 1000000, 2500000] },
    premMin: 8000, premMax: 14000, assumptions: "Individual, 30 years, ₹10L SI. Indicative only.",
    waitingPeriod: { initial: "30 days", preExisting: "36 months", specific: "24 months" },
    csr: 84, network: 6500, confidence: "medium",
    inclusions: ["In-patient hospitalization", "Day care procedures", "Ambulance charges", "AYUSH treatments"],
    features: ["Digital-First Experience", "Simple Claims Process", "Affordable Premiums"],
    riders: ["Personal Accident"],
    sourceUrl: "https://www.godigit.com/health-insurance",
  }),
];

// ═══════════════════════════════════════
// INDIA TERM LIFE INSURANCE
// ═══════════════════════════════════════
const inTermLife = [
  makeProduct("hdfc-click-2-protect", "HDFC Life Insurance Co. Ltd.", "hdfc-life", "Click 2 Protect", "term-life", "pure-term", {
    sumInsured: { min: 2500000, max: 50000000, options: [2500000, 5000000, 10000000, 20000000, 50000000] },
    premMin: 10000, premMax: 50000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover, 30yr term. Indicative only.",
    csr: 99.5, confidence: "high",
    inclusions: ["Death benefit", "Terminal illness benefit", "Multiple plan variants", "Flexible payout options"],
    features: ["99.5% CSR", "Variants: Life Only, Life & Goal, Life & Income", "Coverage to Age 85", "Critical Illness Rider"],
    riders: ["Accidental Death Benefit", "Critical Illness", "Waiver of Premium"],
    tenure: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 35, 40] },
    sourceUrl: "https://www.hdfclife.com/term-insurance-plans/click-2-protect-life",
  }),
  makeProduct("max-life-smart-secure-plus", "Max Life Insurance Co. Ltd.", "max-life", "Smart Secure Plus", "term-life", "pure-term", {
    sumInsured: { min: 2500000, max: 50000000, options: [2500000, 5000000, 10000000, 20000000, 50000000] },
    premMin: 12000, premMax: 60000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover. Indicative only.",
    csr: 99.2, confidence: "high",
    inclusions: ["Death benefit", "Return of premium option", "Critical illness riders", "Flexible duration"],
    features: ["99.2% CSR (Highest Private)", "Return of Premium Option", "Coverage to Age 80"],
    riders: ["Accidental Death Benefit", "Critical Illness", "Return of Premium"],
    tenure: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 35, 40] },
    sourceUrl: "https://www.maxlifeinsurance.com/term-insurance-plans/smart-secure-plus",
  }),
  makeProduct("icici-iprotect-smart", "ICICI Prudential Life Insurance Co. Ltd.", "icici-prudential", "iProtect Smart", "term-life", "pure-term", {
    sumInsured: { min: 2500000, max: 50000000, options: [2500000, 5000000, 10000000, 20000000, 50000000] },
    premMin: 15000, premMax: 70000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover. Indicative only.",
    csr: 97.8, confidence: "high",
    inclusions: ["Death benefit", "34 critical illness cover", "Accidental death benefit", "Waiver of premium on disability"],
    features: ["Coverage to Age 99", "34 Critical Illnesses", "Flexible Payout Options"],
    riders: ["Accidental Death Benefit", "Critical Illness (34)", "Waiver of Premium"],
    tenure: { min: 10, max: 50, options: [10, 15, 20, 25, 30, 40, 50] },
    sourceUrl: "https://www.iciciprulife.com/term-insurance/iprotect-smart.html",
  }),
  makeProduct("tata-aia-sampoorna-raksha", "Tata AIA Life Insurance Co. Ltd.", "tata-aia", "Sampoorna Raksha", "term-life", "pure-term", {
    sumInsured: { min: 2500000, max: 50000000, options: [2500000, 5000000, 10000000, 25000000, 50000000] },
    premMin: 10000, premMax: 60000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover. Indicative only.",
    csr: 98.6, confidence: "high",
    inclusions: ["Death benefit", "Life Stage Benefit", "Multiple payout options", "Terminal illness benefit"],
    features: ["Coverage to Age 100", "Life Stage Benefit", "98.6% CSR"],
    riders: ["Accidental Death", "Critical Illness", "Waiver of Premium"],
    tenure: { min: 10, max: 50, options: [10, 15, 20, 25, 30, 40, 50] },
    sourceUrl: "https://www.tataaia.com/life-insurance-plans/term-plans/sampoorna-raksha-promise.html",
  }),
  makeProduct("sbi-life-eshield", "SBI Life Insurance Co. Ltd.", "sbi-life", "eShield Next", "term-life", "pure-term", {
    sumInsured: { min: 2500000, max: 50000000, options: [2500000, 5000000, 10000000, 20000000, 50000000] },
    premMin: 8000, premMax: 40000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover. Indicative only.",
    csr: 96.4, confidence: "medium",
    inclusions: ["Death benefit", "Level or increasing cover", "Online-only plan"],
    features: ["Affordable Premiums", "SBI Brand Trust", "Online-Only"],
    riders: ["Accidental Death Benefit"],
    tenure: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 35, 40] },
    sourceUrl: "https://www.sbilife.co.in/en/individual-life-insurance/protection-plans/sbi-life-eshield-next",
  }),
  makeProduct("lic-tech-term", "Life Insurance Corporation of India", "lic", "Tech-Term", "term-life", "pure-term", {
    sumInsured: { min: 5000000, max: 50000000, options: [5000000, 10000000, 25000000, 50000000] },
    premMin: 8000, premMax: 40000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover. Indicative only.",
    csr: 98.3, confidence: "medium",
    inclusions: ["Death benefit", "Level or increasing sum assured"],
    features: ["98.3% CSR", "Government-Backed", "Most Trusted Brand"],
    riders: ["Accidental Death Benefit"],
    tenure: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 35, 40] },
    sourceUrl: "https://www.licindia.in/Products/Insurance-Plan/LIC-Tech-Term",
  }),
  makeProduct("bajaj-allianz-etouch", "Bajaj Allianz Life Insurance Co. Ltd.", "bajaj-allianz-life", "eTouch", "term-life", "pure-term", {
    sumInsured: { min: 2500000, max: 50000000, options: [2500000, 5000000, 10000000, 25000000, 50000000] },
    premMin: 9000, premMax: 45000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover. Indicative only.",
    csr: 98.1, confidence: "medium",
    inclusions: ["Death benefit", "Online term plan", "Accidental death rider"],
    features: ["98.1% CSR", "Online-Only Plan", "Competitive Premiums"],
    riders: ["Accidental Death Benefit", "Critical Illness"],
    tenure: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 35, 40] },
    sourceUrl: "https://www.bajajallianzlife.com/term-insurance/etouch.html",
  }),
  makeProduct("kotak-e-term", "Kotak Mahindra Life Insurance Co. Ltd.", "kotak-life", "e-Term", "term-life", "pure-term", {
    sumInsured: { min: 2500000, max: 50000000, options: [2500000, 5000000, 10000000, 25000000, 50000000] },
    premMin: 10000, premMax: 50000, assumptions: "Male, 30 years, non-smoker, ₹1Cr cover. Indicative only.",
    csr: 98, confidence: "medium",
    inclusions: ["Death benefit", "Critical illness rider", "Accidental death benefit"],
    features: ["98% CSR", "Flexible Riders", "Online Plan"],
    riders: ["Accidental Death", "Critical Illness", "Waiver of Premium"],
    tenure: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 35, 40] },
    sourceUrl: "https://www.kotaklife.com/online-plans/term-insurance/kotak-e-term",
  }),
];

// ═══════════════════════════════════════
// INDIA MOTOR INSURANCE
// ═══════════════════════════════════════
const inMotor = [
  makeProduct("hdfc-ergo-motor", "HDFC ERGO General Insurance Co. Ltd.", "hdfc-ergo", "HDFC ERGO Motor Insurance", "motor", "comprehensive", {
    premMin: 5000, premMax: 25000, assumptions: "Comprehensive, mid-size sedan, metro city. Indicative only.",
    csr: 99, confidence: "high",
    inclusions: ["Own damage cover", "Third-party liability", "Personal accident cover", "Cashless repairs", "Roadside assistance"],
    features: ["12,200+ Cashless Garages", "99% CSR", "Digital Claims", "Real-Time Policy Tracking"],
    sourceUrl: "https://www.hdfcergo.com/motor-insurance",
  }),
  makeProduct("bajaj-allianz-motor", "Bajaj Allianz General Insurance Co. Ltd.", "bajaj-allianz", "Bajaj Allianz Motor Insurance", "motor", "comprehensive", {
    premMin: 4500, premMax: 22000, assumptions: "Comprehensive, mid-size sedan, metro city. Indicative only.",
    csr: 98.5, confidence: "high",
    inclusions: ["Own damage cover", "Third-party liability", "Personal accident cover", "Cashless repairs"],
    features: ["7,200+ Cashless Garages", "Largest Private Network", "Mobile App", "98.5% CSR"],
    sourceUrl: "https://www.bajajallianz.com/motor-insurance.html",
  }),
  makeProduct("icici-lombard-motor", "ICICI Lombard General Insurance Co. Ltd.", "icici-lombard", "ICICI Lombard Motor Insurance", "motor", "comprehensive", {
    premMin: 5000, premMax: 23000, assumptions: "Comprehensive, mid-size sedan, metro city. Indicative only.",
    csr: 96.75, confidence: "high",
    inclusions: ["Own damage cover", "Third-party liability", "Personal accident cover", "Cashless repairs"],
    features: ["5,900+ Cashless Garages", "Established Brand", "Quick Claim Settlement"],
    sourceUrl: "https://www.icicilombard.com/motor-insurance",
  }),
  makeProduct("digit-motor", "Go Digit General Insurance Ltd.", "digit", "Digit Motor Insurance", "motor", "comprehensive", {
    premMin: 3500, premMax: 18000, assumptions: "Comprehensive, mid-size sedan. Indicative only.",
    csr: 84, confidence: "medium",
    inclusions: ["Own damage cover", "Third-party liability", "Personal accident cover"],
    features: ["Digital-First", "Paperless Claims", "Affordable Premiums"],
    sourceUrl: "https://www.godigit.com/motor-insurance",
  }),
  makeProduct("acko-car-insurance", "Acko General Insurance Ltd.", "acko", "Acko Car Insurance", "motor", "comprehensive", {
    premMin: 3000, premMax: 15000, assumptions: "Comprehensive, mid-size sedan. Indicative only.",
    csr: 80, confidence: "medium",
    inclusions: ["Own damage cover", "Third-party liability", "Personal accident cover"],
    features: ["Zero-Commission Model", "App-Based Claims", "4,000+ Garages", "Lowest Premiums"],
    sourceUrl: "https://www.acko.com/car-insurance",
  }),
  makeProduct("tata-aig-motor", "Tata AIG General Insurance Co. Ltd.", "tata-aig", "Tata AIG Motor Insurance", "motor", "comprehensive", {
    premMin: 4500, premMax: 20000, assumptions: "Comprehensive, mid-size sedan. Indicative only.",
    csr: 77, confidence: "medium",
    inclusions: ["Own damage cover", "Third-party liability", "Personal accident cover", "Roadside assistance"],
    features: ["7,500+ Garages", "Restoration Benefit", "Roadside Assistance"],
    sourceUrl: "https://www.tataaig.com/motor-insurance",
  }),
  makeProduct("new-india-motor", "The New India Assurance Co. Ltd.", "new-india-assurance", "New India Motor Insurance", "motor", "comprehensive", {
    premMin: 4000, premMax: 18000, assumptions: "Comprehensive, mid-size sedan. Indicative only.",
    csr: 91, confidence: "medium",
    inclusions: ["Own damage cover", "Third-party liability", "Personal accident cover"],
    features: ["Government-Backed", "91% CSR", "8,000+ Garages", "Oldest General Insurer"],
    sourceUrl: "https://www.newindia.co.in",
  }),
];

// ═══════════════════════════════════════
// INDIA TRAVEL INSURANCE
// ═══════════════════════════════════════
const inTravel = [
  makeProduct("bajaj-allianz-travel", "Bajaj Allianz General Insurance Co. Ltd.", "bajaj-allianz", "Bajaj Allianz Travel Insurance", "travel", "international", {
    sumInsured: { min: 50000, max: 500000, options: [50000, 100000, 250000, 500000], currency: "USD" },
    premMin: 750, premMax: 3500, assumptions: "7-day Europe trip, 30 years. Indicative only. Premiums in INR.",
    inclusions: ["Medical emergency abroad", "Trip cancellation", "Lost baggage", "Flight delay", "Passport loss", "Personal liability"],
    features: ["Schengen Approved", "Senior-Friendly (up to 80)", "Adventure Sports Coverage", "VFS Global Approved"],
    sourceUrl: "https://www.bajajallianz.com/travel-insurance.html",
  }),
  makeProduct("hdfc-ergo-travel", "HDFC ERGO General Insurance Co. Ltd.", "hdfc-ergo", "HDFC ERGO Travel Insurance", "travel", "international", {
    sumInsured: { min: 50000, max: 500000, options: [50000, 100000, 250000, 500000], currency: "USD" },
    premMin: 700, premMax: 3000, assumptions: "7-day Europe trip, 30 years. Indicative only. Premiums in INR.",
    inclusions: ["Medical emergency abroad", "Cashless worldwide", "Trip cancellation", "Lost baggage", "Flight delay"],
    features: ["Cashless Worldwide Network", "App-Based Claims", "Schengen Approved"],
    sourceUrl: "https://www.hdfcergo.com/travel-insurance",
  }),
  makeProduct("tata-aig-travel", "Tata AIG General Insurance Co. Ltd.", "tata-aig", "Tata AIG Travel Insurance", "travel", "international", {
    sumInsured: { min: 50000, max: 500000, options: [50000, 100000, 250000, 500000], currency: "USD" },
    premMin: 600, premMax: 2500, assumptions: "7-day Europe trip, 30 years. Indicative only. Premiums in INR.",
    inclusions: ["Medical emergency abroad", "Adventure sports included", "Trip cancellation", "Lost baggage"],
    features: ["Adventure Sports Included", "Paperless Claims", "Budget-Friendly", "Schengen Approved"],
    sourceUrl: "https://www.tataaig.com/travel-insurance",
  }),
  makeProduct("icici-lombard-travel", "ICICI Lombard General Insurance Co. Ltd.", "icici-lombard", "ICICI Lombard Travel Insurance", "travel", "international", {
    sumInsured: { min: 50000, max: 250000, options: [50000, 100000, 250000], currency: "USD" },
    premMin: 500, premMax: 2000, assumptions: "7-day Europe trip, 30 years. Indicative only. Premiums in INR.",
    inclusions: ["Medical emergency abroad", "Trip cancellation", "Lost baggage", "Flight delay"],
    features: ["Budget-Friendly", "Schengen Approved", "Online Purchase"],
    sourceUrl: "https://www.icicilombard.com/travel-insurance",
  }),
  makeProduct("digit-travel", "Go Digit General Insurance Ltd.", "digit", "Digit Travel Insurance", "travel", "international", {
    sumInsured: { min: 25000, max: 250000, options: [25000, 50000, 100000, 250000], currency: "USD" },
    premMin: 400, premMax: 1500, assumptions: "7-day trip, 30 years. Indicative only. Premiums in INR.",
    inclusions: ["Medical emergency abroad", "Trip cancellation", "Lost baggage"],
    features: ["Smartphone Claims", "Simple Process", "Affordable"],
    sourceUrl: "https://www.godigit.com/travel-insurance",
  }),
  makeProduct("star-health-travel", "Star Health and Allied Insurance Co. Ltd.", "star-health", "Star Travel Protect", "travel", "international", {
    sumInsured: { min: 50000, max: 500000, options: [50000, 100000, 250000, 500000], currency: "USD" },
    premMin: 750, premMax: 3500, assumptions: "7-day Europe trip, 30 years. Indicative only. Premiums in INR.",
    inclusions: ["Medical emergency abroad", "Trip cancellation", "Lost baggage", "Flight delay"],
    features: ["Standalone Health Insurer Backing", "Wide Coverage", "Schengen Approved"],
    sourceUrl: "https://www.starhealth.in/travel-insurance",
  }),
];

// ═══════════════════════════════════════
// WRITE ALL DATA
// ═══════════════════════════════════════
console.log("Rebuilding insurance product data...\n");

console.log("INDIA:");
writeData("in", "health", inHealth);
writeData("in", "term-life", inTermLife);
writeData("in", "motor", inMotor);
writeData("in", "travel", inTravel);

console.log("\nDone! India data rebuilt with " + (inHealth.length + inTermLife.length + inMotor.length + inTravel.length) + " products.");
console.log("\nNote: Other countries will be updated by parallel agents.");
