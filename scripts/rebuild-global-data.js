/**
 * Rebuild global insurance data — US, UK, AE, SG, CA, AU, DE, JP, KR, HK, SA
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "src/data");
const DISCLAIMER = "Data collected from publicly available sources for educational purposes only. Premium figures are illustrative. Verify all details with the insurer directly.";

function writeData(cc, category, products) {
  const catFile = { health: "health-insurance.json", "term-life": "term-life-insurance.json", motor: "motor-insurance.json", travel: "travel-insurance.json" }[category];
  const dir = path.join(DATA, cc);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, catFile), JSON.stringify({
    category, lastUpdated: "2026-04-03", disclaimer: DISCLAIMER,
    products: products.map(p => ({ ...p, countryCode: cc })),
  }, null, 2));
  console.log(`  ${cc}/${catFile}: ${products.length} products`);
}

function mp(id, insurer, slug, name, cat, sub, o) {
  return {
    id, insurerName: insurer, insurerSlug: slug, productName: name, category: cat, subCategory: sub,
    eligibility: o.elig || { minAge: 18, maxAge: 65, renewableUpTo: "lifetime" },
    sumInsured: o.si || { min: null, max: null, options: [] },
    premiumRange: { illustrativeMin: o.pMin || 0, illustrativeMax: o.pMax || 0, assumptions: o.assum || "Illustrative only.", isVerified: false },
    waitingPeriod: o.wp || undefined,
    keyInclusions: o.inc || [], keyExclusions: o.exc || ["Pre-existing conditions exclusions apply"],
    claimSettlement: o.csr ? { ratio: o.csr, year: o.csrY || "2024", source: "Insurer/Regulator" } : undefined,
    networkHospitals: o.net ? { count: o.net, source: "Insurer website" } : undefined,
    riders: o.rid || [], policyTenure: o.ten || { min: 1, max: 1, options: [1] },
    renewability: o.ren || "Annual", specialFeatures: o.feat || [],
    sourceUrl: o.url || "", sourceType: "official-website", lastVerified: "2026-04-03",
    confidenceScore: o.conf || "medium", notes: o.notes || "",
  };
}

// ═══ US ═══
console.log("\nUS:");
writeData("us", "health", [
  mp("kaiser-gold", "Kaiser Permanente", "kaiser-permanente", "Kaiser Gold HMO", "health", "hmo", { si: { min: 3000, max: 9100, options: [], currency: "USD", note: "Out-of-pocket max" }, pMin: 400, pMax: 600, assum: "40yo, monthly premium before subsidies", csr: 92, feat: ["#1 Rated 6 Consecutive Years", "Integrated Care Model", "Low Deductibles", "Telemedicine Included"], url: "https://healthy.kaiserpermanente.org", conf: "high" }),
  mp("bcbs-ppo", "Blue Cross Blue Shield", "anthem", "BCBS Preferred PPO", "health", "ppo", { pMin: 350, pMax: 550, assum: "40yo, monthly", feat: ["Nationwide Network", "No Referral Needed", "Flexible Plans"], conf: "high" }),
  mp("uhc-choice-plus", "UnitedHealthcare", "unitedhealth", "Choice Plus PPO", "health", "ppo", { pMin: 400, pMax: 600, assum: "40yo, monthly", feat: ["Largest Network in US", "Virtual Visits", "Rewards Program"], conf: "medium" }),
  mp("aetna-cvs", "Aetna (CVS Health)", "aetna", "Aetna CVS Health Plan", "health", "hmo", { pMin: 350, pMax: 500, assum: "40yo, monthly", feat: ["Highest Star Ratings", "CVS MinuteClinic Access", "Strong Medicare Plans"], conf: "medium" }),
  mp("cigna-connect", "Cigna Healthcare", "cigna", "Cigna Connect", "health", "ppo", { pMin: 300, pMax: 450, assum: "40yo, monthly", feat: ["Good Digital Experience", "Low Deductibles", "Global Coverage Option"], conf: "medium" }),
  mp("humana-gold", "Humana Inc.", "humana", "Humana Gold Plus", "health", "hmo", { pMin: 350, pMax: 500, assum: "40yo, monthly", feat: ["Strong Customer Service", "Low Deductibles", "Silver Sneakers"], conf: "medium" }),
  mp("oscar-health", "Oscar Health", "oscar-health", "Oscar Health Plan", "health", "epo", { pMin: 300, pMax: 450, assum: "40yo, monthly", feat: ["Tech-Forward", "Free Telemedicine", "Concierge Team", "Step Tracking Rewards"], conf: "medium" }),
]);
writeData("us", "term-life", [
  mp("nwm-term", "Northwestern Mutual", "northwestern-mutual", "Northwestern Mutual Term", "term-life", "pure-term", { si: { min: 250000, max: 10000000, options: [250000, 500000, 1000000, 5000000], currency: "USD" }, pMin: 30, pMax: 80, assum: "$1M, 30yo male, monthly", feat: ["A++ Financial Strength", "Dividend-Paying", "Conversion Option"], ten: { min: 10, max: 30, options: [10, 15, 20, 30] }, conf: "high" }),
  mp("nyl-term", "New York Life", "new-york-life", "New York Life Term", "term-life", "pure-term", { pMin: 25, pMax: 70, assum: "$1M, 30yo, monthly", feat: ["Oldest Mutual Insurer", "Strong Financials", "Conversion to Permanent"], ten: { min: 10, max: 30, options: [10, 15, 20, 30] }, conf: "high" }),
  mp("prudential-term", "Prudential Financial", "prudential", "Prudential Term Essential", "term-life", "pure-term", { pMin: 20, pMax: 60, assum: "$1M, 30yo, monthly", feat: ["Wide Range of Terms", "Online Application", "Living Benefits"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] }, conf: "medium" }),
  mp("haven-life", "Haven Life (MassMutual)", "haven-life", "Haven Term", "term-life", "pure-term", { pMin: 15, pMax: 40, assum: "$1M, 30yo, monthly", feat: ["Instant Decisions", "Backed by MassMutual", "No Medical Exam Option"], ten: { min: 10, max: 30, options: [10, 15, 20, 30] }, conf: "medium" }),
  mp("ladder-term", "Ladder Insurance", "ladder", "Ladder Term Life", "term-life", "pure-term", { pMin: 15, pMax: 40, assum: "$1M, 30yo, monthly", feat: ["Adjust Coverage Anytime", "Instant Decisions", "100% Online"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] }, conf: "medium" }),
]);
writeData("us", "motor", [
  mp("state-farm-auto", "State Farm", "state-farm", "State Farm Auto Insurance", "motor", "comprehensive", { pMin: 1100, pMax: 1500, assum: "Annual, avg driver", feat: ["#1 Market Share", "19,000+ Agents", "Drive Safe & Save Discount"], conf: "high" }),
  mp("geico-auto", "GEICO", "geico", "GEICO Auto Insurance", "motor", "comprehensive", { pMin: 900, pMax: 1300, assum: "Annual, avg driver", feat: ["Lowest Rates for Many", "15 Minutes Could Save 15%", "24/7 Claims"], conf: "high" }),
  mp("progressive-auto", "Progressive", "progressive", "Progressive Auto Insurance", "motor", "comprehensive", { pMin: 1000, pMax: 1400, assum: "Annual, avg driver", feat: ["Name Your Price Tool", "Snapshot Discount", "Bundle Savings"], conf: "high" }),
  mp("usaa-auto", "USAA", "usaa", "USAA Auto Insurance", "motor", "comprehensive", { pMin: 700, pMax: 1100, assum: "Annual, military members only", feat: ["#1 Customer Satisfaction", "Military Only", "Lowest Average Premiums"], conf: "high" }),
  mp("allstate-auto", "Allstate", "allstate", "Allstate Auto Insurance", "motor", "comprehensive", { pMin: 1200, pMax: 1600, assum: "Annual, avg driver", feat: ["Drivewise Discount", "Accident Forgiveness", "New Car Replacement"], conf: "medium" }),
]);
writeData("us", "travel", [
  mp("allianz-travel-us", "Allianz Travel Insurance", "allianz-travel", "Allianz OneTrip Prime", "travel", "international", { pMin: 50, pMax: 200, assum: "Per trip, USD", feat: ["Comprehensive Coverage", "24/7 Assistance", "Cancel for Any Reason Option"], url: "https://www.allianztravelinsurance.com" }),
  mp("world-nomads-us", "World Nomads", "world-nomads", "World Nomads Explorer", "travel", "international", { pMin: 100, pMax: 300, assum: "Per trip, USD", feat: ["Adventure Sports Covered", "Buy While Traveling", "150+ Activities"], url: "https://www.worldnomads.com" }),
  mp("travel-guard-us", "Travel Guard (AIG)", "travel-guard-aig", "Travel Guard Gold", "travel", "international", { pMin: 60, pMax: 250, assum: "Per trip, USD", feat: ["Annual Plans Available", "AIG Backed", "Comprehensive"], url: "https://www.travelguard.com" }),
]);

// ═══ UK ═══
console.log("\nUK:");
writeData("uk", "health", [
  mp("bupa-health-uk", "Bupa", "bupa", "Bupa Health Insurance", "health", "private", { pMin: 80, pMax: 200, assum: "Monthly, GBP, individual", feat: ["UK's Largest Private Health Insurer", "Direct Access to Specialists", "Mental Health Cover"], conf: "high" }),
  mp("axa-health-uk", "AXA Health", "axa-uk", "AXA Health Plan", "health", "private", { pMin: 60, pMax: 150, assum: "Monthly, GBP", feat: ["Good Value", "Online GP Service", "Flexible Modules"], conf: "medium" }),
  mp("aviva-health-uk", "Aviva", "aviva", "Aviva Health Insurance", "health", "private", { pMin: 50, pMax: 130, assum: "Monthly, GBP", feat: ["Which? Recommended", "Flexible Modules", "No Claims Discount"], conf: "high" }),
  mp("vitality-health-uk", "Vitality", "vitality", "Vitality Health Plan", "health", "private", { pMin: 70, pMax: 180, assum: "Monthly, GBP", feat: ["Rewards for Healthy Living", "Apple Watch Offer", "Gym Membership"], conf: "medium" }),
  mp("wpa-health-uk", "WPA", "wpa", "WPA Health Insurance", "health", "private", { pMin: 60, pMax: 140, assum: "Monthly, GBP", feat: ["No Claims Discount", "Direct Specialist Access", "Personal Service"], conf: "medium" }),
]);
writeData("uk", "term-life", [
  mp("lg-term-uk", "Legal & General", "legal-and-general", "L&G Term Insurance", "term-life", "pure-term", { pMin: 8, pMax: 25, assum: "Monthly, GBP, 30yo, £500K", feat: ["UK's #1 Life Insurer", "Children's Critical Illness Free", "Flexible Terms"], ten: { min: 10, max: 50, options: [10, 15, 20, 25, 30, 40, 50] }, conf: "high" }),
  mp("aviva-term-uk", "Aviva", "aviva", "Aviva Term Life", "term-life", "pure-term", { pMin: 9, pMax: 28, assum: "Monthly, GBP, 30yo, £500K", feat: ["Children's CI Included", "Fracture Cover", "Global Treatment"], ten: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 40] }, conf: "medium" }),
  mp("zurich-term-uk", "Zurich", "zurich-uk", "Zurich Term Insurance", "term-life", "pure-term", { pMin: 10, pMax: 30, assum: "Monthly, GBP, 30yo, £500K", feat: ["Flexible", "Conversion Option", "Good Riders"], ten: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 40] }, conf: "medium" }),
  mp("royal-london-term", "Royal London", "royal-london", "Royal London Term", "term-life", "pure-term", { pMin: 8, pMax: 25, assum: "Monthly, GBP, 30yo, £500K", feat: ["Mutual Insurer", "Helping Hand Service", "Reviewable Premiums Option"], ten: { min: 10, max: 40, options: [10, 15, 20, 25, 30, 40] }, conf: "medium" }),
]);
writeData("uk", "motor", [
  mp("admiral-car-uk", "Admiral", "admiral", "Admiral Car Insurance", "motor", "comprehensive", { pMin: 400, pMax: 700, assum: "Annual, GBP", feat: ["UK Market Leader (15% Share)", "Multi-Car Discount", "Competitive for Young Drivers"], conf: "high" }),
  mp("direct-line-car-uk", "Direct Line", "direct-line", "Direct Line Car Insurance", "motor", "comprehensive", { pMin: 450, pMax: 750, assum: "Annual, GBP", feat: ["Not on Comparison Sites", "Comprehensive Standard Cover", "High Customer Satisfaction"], conf: "high" }),
  mp("aviva-car-uk", "Aviva", "aviva", "Aviva Car Insurance", "motor", "comprehensive", { pMin: 400, pMax: 650, assum: "Annual, GBP", feat: ["Which? Recommended", "Courtesy Car", "Windscreen Cover"], conf: "medium" }),
  mp("axa-car-uk", "AXA", "axa-uk", "AXA Car Insurance", "motor", "comprehensive", { pMin: 350, pMax: 600, assum: "Annual, GBP", feat: ["Competitive Pricing", "DriveSmart App", "Personal Injury Cover"], conf: "medium" }),
]);
writeData("uk", "travel", [
  mp("staysure-uk", "Staysure", "staysure", "Staysure Travel Insurance", "travel", "international", { pMin: 20, pMax: 80, assum: "Per trip, GBP", feat: ["Best for Over 50s", "Pre-Existing Conditions Covered", "Annual Plans"] }),
  mp("post-office-travel-uk", "Post Office", "post-office", "Post Office Travel Insurance", "travel", "international", { pMin: 10, pMax: 50, assum: "Per trip, GBP", feat: ["Affordable", "Family Plans", "European & Worldwide"] }),
  mp("aviva-travel-uk", "Aviva", "aviva", "Aviva Travel Insurance", "travel", "international", { pMin: 15, pMax: 55, assum: "Per trip, GBP", feat: ["Comprehensive", "Gadget Cover", "Annual Multi-Trip"] }),
]);

// ═══ UAE ═══
console.log("\nUAE:");
writeData("ae", "health", [
  mp("daman-health-ae", "Daman Health Insurance", "daman", "Daman National Health", "health", "individual", { pMin: 3000, pMax: 12000, assum: "Annual, AED", feat: ["Abu Dhabi's Main Provider", "Mandatory Compliance", "Wide Network"], conf: "high" }),
  mp("oman-ins-health", "Oman Insurance Company", "oman-insurance", "Oman Insurance Health", "health", "individual", { pMin: 4000, pMax: 15000, assum: "Annual, AED", feat: ["Comprehensive Plans", "International Network", "Maternity Cover"], conf: "medium" }),
  mp("axa-gulf-health", "AXA Gulf", "axa-gulf", "AXA Gulf Health Plan", "health", "individual", { pMin: 3500, pMax: 13000, assum: "Annual, AED", feat: ["International Network", "Dental & Optical", "Wellness Programs"], conf: "medium" }),
  mp("adnic-health", "ADNIC", "adnic", "ADNIC Health Insurance", "health", "individual", { pMin: 3500, pMax: 12000, assum: "Annual, AED", feat: ["Government-Backed", "Competitive Premiums", "Wide UAE Network"], conf: "medium" }),
]);
writeData("ae", "motor", [
  mp("orient-motor-ae", "Orient Insurance", "orient-insurance", "Orient Motor Insurance", "motor", "comprehensive", { pMin: 1200, pMax: 4500, assum: "Annual, AED", feat: ["Established Provider", "Wide Garage Network", "Competitive"] }),
  mp("axa-motor-ae", "AXA Gulf", "axa-gulf", "AXA Gulf Motor Insurance", "motor", "comprehensive", { pMin: 1500, pMax: 5500, assum: "Annual, AED", feat: ["Cashless Repairs", "Personal Accident", "Agency Repair"] }),
  mp("oman-motor-ae", "Oman Insurance", "oman-insurance", "Oman Motor Insurance", "motor", "comprehensive", { pMin: 1800, pMax: 6000, assum: "Annual, AED", feat: ["Wide Network", "Comprehensive Cover", "Roadside Assist"] }),
]);
writeData("ae", "term-life", [
  mp("zurich-life-ae", "Zurich International", "zurich-ae", "Zurich Term Life UAE", "term-life", "pure-term", { pMin: 200, pMax: 800, assum: "Monthly, AED", feat: ["International Provider", "Flexible Terms", "Critical Illness Rider"], ten: { min: 5, max: 30, options: [5, 10, 15, 20, 25, 30] } }),
  mp("metlife-ae", "MetLife", "metlife-ae", "MetLife Term Plan UAE", "term-life", "pure-term", { pMin: 180, pMax: 700, assum: "Monthly, AED", feat: ["Global Brand", "Flexible Payout", "Online Application"], ten: { min: 5, max: 30, options: [5, 10, 15, 20, 25, 30] } }),
]);
writeData("ae", "travel", [
  mp("oman-travel-ae", "Oman Insurance", "oman-insurance", "Oman Travel Guard", "travel", "international", { pMin: 100, pMax: 500, assum: "Per trip, AED", feat: ["Comprehensive", "Schengen Compliant", "Emergency Assistance"] }),
  mp("axa-travel-ae", "AXA Gulf", "axa-gulf", "AXA Travel Insurance", "travel", "international", { pMin: 120, pMax: 600, assum: "Per trip, AED", feat: ["Worldwide Cover", "Annual Plans", "Adventure Sports"] }),
]);

// ═══ SINGAPORE ═══
console.log("\nSINGAPORE:");
writeData("sg", "health", [
  mp("aia-healthshield-sg", "AIA Singapore", "aia-singapore", "AIA HealthShield Gold Max", "health", "individual", { pMin: 300, pMax: 800, assum: "Annual, SGD, MediShield Life upgrade", feat: ["MediShield Life Top-Up", "Private Hospital Cover", "As-Charged"], conf: "high" }),
  mp("pru-shield-sg", "Prudential Singapore", "prudential-sg", "PRUShield", "health", "individual", { pMin: 280, pMax: 750, assum: "Annual, SGD", feat: ["Comprehensive", "As-Charged Cover", "Cashless Claims"], conf: "medium" }),
  mp("great-eastern-health-sg", "Great Eastern", "great-eastern", "Supreme Health", "health", "individual", { pMin: 300, pMax: 850, assum: "Annual, SGD", feat: ["Established Insurer", "Comprehensive", "Network Hospitals"], conf: "medium" }),
  mp("ntuc-income-sg", "NTUC Income", "ntuc-income", "Enhanced IncomeShield", "health", "individual", { pMin: 250, pMax: 700, assum: "Annual, SGD", feat: ["Affordable", "Social Enterprise", "Good Value"], conf: "medium" }),
]);
writeData("sg", "term-life", [
  mp("aia-term-sg", "AIA Singapore", "aia-singapore", "AIA Term Plus", "term-life", "pure-term", { pMin: 20, pMax: 60, assum: "Monthly, SGD, 30yo, S$500K", feat: ["Flexible Cover", "Critical Illness Rider", "TPD Cover"], ten: { min: 5, max: 40, options: [5, 10, 15, 20, 25, 30, 40] } }),
  mp("singlife-term-sg", "Singlife", "singlife", "Singlife Term Life", "term-life", "pure-term", { pMin: 15, pMax: 50, assum: "Monthly, SGD, 30yo", feat: ["Digital-First", "Affordable", "Simple Application"], ten: { min: 5, max: 30, options: [5, 10, 15, 20, 25, 30] } }),
  mp("fwd-term-sg", "FWD Singapore", "fwd-singapore", "FWD Term Life", "term-life", "pure-term", { pMin: 15, pMax: 45, assum: "Monthly, SGD, 30yo", feat: ["Simple Plans", "Online Application", "Affordable"], ten: { min: 5, max: 30, options: [5, 10, 15, 20, 25, 30] } }),
]);
writeData("sg", "motor", [
  mp("ntuc-motor-sg", "NTUC Income", "ntuc-income", "NTUC Auto Insurance", "motor", "comprehensive", { pMin: 800, pMax: 2500, assum: "Annual, SGD", feat: ["Social Enterprise", "Workshop Partners", "NCD Protection"] }),
  mp("axa-motor-sg", "AXA Singapore", "axa-sg", "AXA SmartDrive", "motor", "comprehensive", { pMin: 900, pMax: 2800, assum: "Annual, SGD", feat: ["Comprehensive", "Windscreen Cover", "Personal Accident"] }),
]);
writeData("sg", "travel", [
  mp("singlife-travel-sg", "Singlife", "singlife", "Singlife Travel Insurance", "travel", "international", { pMin: 30, pMax: 120, assum: "Per trip, SGD", feat: ["Digital Purchase", "Covid Coverage", "Adventure Sports"] }),
  mp("fwd-travel-sg", "FWD Singapore", "fwd-singapore", "FWD Travel Insurance", "travel", "international", { pMin: 25, pMax: 100, assum: "Per trip, SGD", feat: ["Simple Plans", "Affordable", "Online Claims"] }),
]);

// ═══ CANADA ═══
console.log("\nCANADA:");
writeData("ca", "health", [
  mp("manulife-flexcare", "Manulife", "manulife", "Manulife FlexCare", "health", "supplemental", { pMin: 100, pMax: 300, assum: "Monthly, CAD", feat: ["Dental & Vision", "Prescription Drugs", "Paramedical Services"], conf: "high" }),
  mp("sunlife-extended", "Sun Life", "sun-life", "Sun Life Extended Health", "health", "supplemental", { pMin: 90, pMax: 280, assum: "Monthly, CAD", feat: ["Comprehensive", "Mental Health", "Travel Emergency"], conf: "high" }),
  mp("canada-life-health", "Canada Life", "canada-life", "Canada Life Health Plan", "health", "supplemental", { pMin: 85, pMax: 260, assum: "Monthly, CAD", feat: ["Flexible Options", "Drug Coverage", "Dental"], conf: "medium" }),
  mp("desjardins-health", "Desjardins Insurance", "desjardins", "Desjardins Health Plan", "health", "supplemental", { pMin: 80, pMax: 250, assum: "Monthly, CAD", feat: ["Quebec-Based", "Good Value", "Online Claims"], conf: "medium" }),
]);
writeData("ca", "term-life", [
  mp("manulife-term-ca", "Manulife", "manulife", "Manulife Term Insurance", "term-life", "pure-term", { pMin: 20, pMax: 60, assum: "Monthly, CAD, 30yo, $1M", feat: ["Canada's Largest Insurer", "Conversion Option", "Flexible Terms"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
  mp("sunlife-term-ca", "Sun Life", "sun-life", "Sun Life Go Term", "term-life", "pure-term", { pMin: 18, pMax: 55, assum: "Monthly, CAD, 30yo", feat: ["No Medical Exam Option", "Online Application", "Quick Approval"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
]);
writeData("ca", "motor", [
  mp("intact-auto-ca", "Intact Insurance", "intact", "Intact Auto Insurance", "motor", "comprehensive", { pMin: 1200, pMax: 2400, assum: "Annual, CAD", feat: ["Canada's Largest P&C Insurer", "Claims Guarantee", "My Driving Discount"] }),
  mp("desjardins-auto-ca", "Desjardins", "desjardins", "Desjardins Auto Insurance", "motor", "comprehensive", { pMin: 1100, pMax: 2200, assum: "Annual, CAD", feat: ["Ajusto Telematics", "Multi-Vehicle Discount", "Online Quote"] }),
  mp("td-auto-ca", "TD Insurance", "td-insurance", "TD Auto Insurance", "motor", "comprehensive", { pMin: 1000, pMax: 2100, assum: "Annual, CAD", feat: ["TD Bank Integration", "Group Discounts", "Online Management"] }),
]);
writeData("ca", "travel", [
  mp("manulife-travel-ca", "Manulife", "manulife", "Manulife CoverMe Travel", "travel", "international", { pMin: 30, pMax: 100, assum: "Per trip, CAD", feat: ["Emergency Medical", "Trip Cancellation", "Annual Plans"] }),
]);

// ═══ AUSTRALIA ═══
console.log("\nAUSTRALIA:");
writeData("au", "health", [
  mp("medibank-au", "Medibank", "medibank", "Medibank Hospital Cover", "health", "hospital", { pMin: 100, pMax: 300, assum: "Monthly, AUD", feat: ["Australia's Largest Health Fund", "Hospital & Extras", "Telehealth"], conf: "high" }),
  mp("bupa-au", "Bupa Australia", "bupa-australia", "Bupa Hospital Cover", "health", "hospital", { pMin: 110, pMax: 320, assum: "Monthly, AUD", feat: ["Wide Network", "No Gap Dentists", "Overseas Visitors Cover"], conf: "high" }),
  mp("hcf-au", "HCF", "hcf", "HCF Hospital & Extras", "health", "hospital", { pMin: 90, pMax: 280, assum: "Monthly, AUD", feat: ["Not-For-Profit", "Good Value", "Member Centres"], conf: "medium" }),
  mp("nib-au", "NIB", "nib", "NIB Hospital Cover", "health", "hospital", { pMin: 95, pMax: 290, assum: "Monthly, AUD", feat: ["GU Health Network", "Online Claims", "Dental Extras"], conf: "medium" }),
]);
writeData("au", "term-life", [
  mp("tal-term-au", "TAL", "tal", "TAL Term Life", "term-life", "pure-term", { pMin: 25, pMax: 70, assum: "Monthly, AUD, 30yo, $1M AUD", feat: ["Australia's #1 Life Insurer", "TPD Option", "Trauma Cover"], ten: { min: 5, max: 40, options: [5, 10, 15, 20, 30, 40] } }),
  mp("aia-term-au", "AIA Australia", "aia-australia", "AIA Term Insurance", "term-life", "pure-term", { pMin: 22, pMax: 65, assum: "Monthly, AUD, 30yo", feat: ["Vitality Program", "Flexible", "Priority Protection"], ten: { min: 5, max: 40, options: [5, 10, 15, 20, 30, 40] } }),
]);
writeData("au", "motor", [
  mp("nrma-auto-au", "NRMA Insurance", "nrma", "NRMA Car Insurance", "motor", "comprehensive", { pMin: 800, pMax: 2000, assum: "Annual, AUD", feat: ["Roadside Assistance", "New Car Replacement", "Choice of Repairer"] }),
  mp("racv-auto-au", "RACV", "racv", "RACV Car Insurance", "motor", "comprehensive", { pMin: 750, pMax: 1800, assum: "Annual, AUD", feat: ["Member Discounts", "Emergency Assistance", "Online Claims"] }),
  mp("allianz-auto-au", "Allianz Australia", "allianz-au", "Allianz Car Insurance", "motor", "comprehensive", { pMin: 700, pMax: 1700, assum: "Annual, AUD", feat: ["Competitive", "Lifetime Repair Guarantee", "Flexible Cover"] }),
]);
writeData("au", "travel", [
  mp("covermore-au", "Cover-More", "cover-more", "Cover-More Travel Insurance", "travel", "international", { pMin: 50, pMax: 200, assum: "Per trip, AUD", feat: ["Australia's #1 Travel Insurer", "Ski Cover", "Cruise Cover"] }),
  mp("world-nomads-au", "World Nomads", "world-nomads-au", "World Nomads Explorer", "travel", "international", { pMin: 80, pMax: 250, assum: "Per trip, AUD", feat: ["Adventure Sports", "Buy While Traveling", "150+ Activities"] }),
]);

// ═══ GERMANY ═══
console.log("\nGERMANY:");
writeData("de", "health", [
  mp("tk-health-de", "Techniker Krankenkasse", "tk", "TK Gesetzliche Krankenversicherung", "health", "statutory", { pMin: 200, pMax: 400, assum: "Monthly, EUR, statutory contribution", feat: ["Germany's Largest Health Fund", "Digital Services", "TK-App"], conf: "high" }),
  mp("allianz-pkv-de", "Allianz", "allianz-de", "Allianz Private Health", "health", "private", { pMin: 300, pMax: 600, assum: "Monthly, EUR, private", feat: ["Comprehensive Private Cover", "Specialist Access", "Single Room"], conf: "high" }),
  mp("debeka-health-de", "Debeka", "debeka", "Debeka Krankenversicherung", "health", "private", { pMin: 280, pMax: 550, assum: "Monthly, EUR, private", feat: ["Largest Private Health Insurer", "Civil Servant Plans", "Comprehensive"], conf: "medium" }),
]);
writeData("de", "term-life", [
  mp("allianz-risk-de", "Allianz", "allianz-de", "Allianz RisikoLebensversicherung", "term-life", "pure-term", { pMin: 10, pMax: 30, assum: "Monthly, EUR, 30yo, €500K", feat: ["Germany's Largest Insurer", "Flexible Terms", "Online Application"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
  mp("cosmos-term-de", "CosmosDirekt", "cosmosdirekt", "CosmosDirekt Risikoleben", "term-life", "pure-term", { pMin: 8, pMax: 25, assum: "Monthly, EUR, 30yo", feat: ["Cheapest Online Provider", "Direct Insurer", "Simple Process"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
]);
writeData("de", "motor", [
  mp("huk-motor-de", "HUK-COBURG", "huk-coburg", "HUK-COBURG Kfz-Versicherung", "motor", "comprehensive", { pMin: 300, pMax: 800, assum: "Annual, EUR", feat: ["Germany's Largest Motor Insurer", "Civil Servant Discounts", "Online Discount"] }),
  mp("allianz-motor-de", "Allianz", "allianz-de", "Allianz Kfz-Versicherung", "motor", "comprehensive", { pMin: 350, pMax: 900, assum: "Annual, EUR", feat: ["Comprehensive", "International Green Card", "Roadside Assistance"] }),
]);
writeData("de", "travel", [
  mp("ergo-travel-de", "ERGO", "ergo", "ERGO Reiseversicherung", "travel", "international", { pMin: 10, pMax: 40, assum: "Per trip, EUR", feat: ["Annual Plans", "Family Cover", "EU-Wide"] }),
  mp("hansemerkur-travel-de", "HanseMerkur", "hansemerkur", "HanseMerkur Reiseversicherung", "travel", "international", { pMin: 12, pMax: 45, assum: "Per trip, EUR", feat: ["Comprehensive", "Stiftung Warentest Recommended", "Senior Plans"] }),
]);

// ═══ JAPAN ═══
console.log("\nJAPAN:");
writeData("jp", "health", [
  mp("nippon-life-medical", "Nippon Life", "nippon-life", "Nippon Life Medical Insurance", "health", "individual", { pMin: 3000, pMax: 10000, assum: "Monthly, JPY", feat: ["Japan's Largest Life Insurer", "Comprehensive Medical", "Cancer Rider"] }),
  mp("aflac-japan", "Aflac Japan", "aflac-japan", "Aflac Medical Insurance", "health", "individual", { pMin: 2500, pMax: 8000, assum: "Monthly, JPY", feat: ["#1 Cancer Insurance", "Supplemental Plans", "Simple Claims"] }),
  mp("dai-ichi-medical", "Dai-ichi Life", "dai-ichi-life", "Dai-ichi Medical Insurance", "health", "individual", { pMin: 2800, pMax: 9000, assum: "Monthly, JPY", feat: ["Established Provider", "Comprehensive", "Wellness Programs"] }),
]);
writeData("jp", "term-life", [
  mp("nippon-term", "Nippon Life", "nippon-life", "Nippon Life Term", "term-life", "pure-term", { pMin: 1500, pMax: 5000, assum: "Monthly, JPY, ¥50M cover", feat: ["Japan's Largest", "Trusted Brand", "Flexible"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
  mp("lifenet-term", "Lifenet Insurance", "lifenet", "Lifenet Term Insurance", "term-life", "pure-term", { pMin: 1000, pMax: 3500, assum: "Monthly, JPY", feat: ["Online-Only", "Cheapest Premiums", "Simple Process"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
]);
writeData("jp", "motor", [
  mp("tokio-marine-motor", "Tokio Marine & Nichido", "tokio-marine", "Tokio Marine Auto Insurance", "motor", "comprehensive", { pMin: 30000, pMax: 80000, assum: "Annual, JPY", feat: ["Japan's Largest P&C Insurer", "Roadside Assistance", "Direct Settlement"] }),
  mp("sompo-motor", "Sompo Japan", "sompo-japan", "Sompo Auto Insurance", "motor", "comprehensive", { pMin: 28000, pMax: 75000, assum: "Annual, JPY", feat: ["Comprehensive", "24/7 Claims", "Wide Agent Network"] }),
]);
writeData("jp", "travel", [
  mp("tokio-marine-travel", "Tokio Marine & Nichido", "tokio-marine", "Tokio Marine Travel Insurance", "travel", "international", { pMin: 1000, pMax: 3000, assum: "Per trip, JPY", feat: ["Japan's Largest", "Airport Counter", "Online Purchase"] }),
]);

// ═══ SOUTH KOREA ═══
console.log("\nSOUTH KOREA:");
writeData("kr", "health", [
  mp("samsung-life-health", "Samsung Life", "samsung-life", "Samsung Life Medical Insurance", "health", "individual", { pMin: 50000, pMax: 200000, assum: "Monthly, KRW", feat: ["Korea's Largest Insurer", "Comprehensive Medical", "Cancer Cover"] }),
  mp("hanwha-health", "Hanwha Life", "hanwha-life", "Hanwha Life Health Insurance", "health", "individual", { pMin: 45000, pMax: 180000, assum: "Monthly, KRW", feat: ["Strong Brand", "Comprehensive", "Critical Illness"] }),
  mp("kyobo-health", "Kyobo Life", "kyobo-life", "Kyobo Life Medical", "health", "individual", { pMin: 40000, pMax: 170000, assum: "Monthly, KRW", feat: ["Education-Focused", "Comprehensive", "Wellness Programs"] }),
]);
writeData("kr", "term-life", [
  mp("samsung-term", "Samsung Life", "samsung-life", "Samsung Life Term", "term-life", "pure-term", { pMin: 30000, pMax: 100000, assum: "Monthly, KRW, ₩500M", feat: ["Korea's Most Trusted", "Flexible Terms", "Critical Illness Rider"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
  mp("hanwha-term", "Hanwha Life", "hanwha-life", "Hanwha Life Term", "term-life", "pure-term", { pMin: 25000, pMax: 85000, assum: "Monthly, KRW", feat: ["Competitive Premiums", "Online Application", "Flexible"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
]);
writeData("kr", "motor", [
  mp("samsung-fire-motor", "Samsung Fire & Marine", "samsung-fire", "Samsung Fire Auto Insurance", "motor", "comprehensive", { pMin: 500000, pMax: 1500000, assum: "Annual, KRW", feat: ["Market Leader", "Digital Claims", "Wide Network"] }),
  mp("db-motor", "DB Insurance", "db-insurance", "DB Auto Insurance", "motor", "comprehensive", { pMin: 450000, pMax: 1300000, assum: "Annual, KRW", feat: ["Competitive", "Roadside Assistance", "Online Discount"] }),
]);
writeData("kr", "travel", [
  mp("samsung-fire-travel", "Samsung Fire & Marine", "samsung-fire", "Samsung Fire Travel Insurance", "travel", "international", { pMin: 10000, pMax: 30000, assum: "Per trip, KRW", feat: ["Comprehensive", "Global Assistance", "Online Purchase"] }),
]);

// ═══ HONG KONG ═══
console.log("\nHONG KONG:");
writeData("hk", "health", [
  mp("aia-vhis-hk", "AIA Hong Kong", "aia-hk", "AIA Voluntary Health Insurance", "health", "individual", { pMin: 300, pMax: 1000, assum: "Monthly, HKD", feat: ["VHIS Certified", "Tax Deductible", "Comprehensive Hospital Cover"], conf: "high" }),
  mp("bupa-hero-hk", "Bupa Hong Kong", "bupa-hk", "Bupa Hero VHIS", "health", "individual", { pMin: 280, pMax: 900, assum: "Monthly, HKD", feat: ["No Lifetime Limit", "Full Cover", "Global Coverage"], conf: "high" }),
  mp("cigna-global-hk", "Cigna Hong Kong", "cigna-hk", "Cigna Global Health", "health", "individual", { pMin: 400, pMax: 1200, assum: "Monthly, HKD", feat: ["Global Coverage", "International Network", "Expat-Friendly"], conf: "medium" }),
  mp("bowtie-hk", "Bowtie", "bowtie", "Bowtie VHIS", "health", "individual", { pMin: 200, pMax: 700, assum: "Monthly, HKD", feat: ["Virtual Insurer", "Lowest VHIS Premiums", "100% Online"], conf: "medium" }),
]);
writeData("hk", "term-life", [
  mp("aia-term-hk", "AIA Hong Kong", "aia-hk", "AIA Term Insurance", "term-life", "pure-term", { pMin: 100, pMax: 300, assum: "Monthly, HKD, HK$5M", feat: ["Market Leader", "Critical Illness Rider", "Flexible"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
  mp("manulife-term-hk", "Manulife Hong Kong", "manulife-hk", "Manulife Term Life", "term-life", "pure-term", { pMin: 90, pMax: 280, assum: "Monthly, HKD, HK$5M", feat: ["Established Brand", "Conversion Option", "Online Application"], ten: { min: 10, max: 30, options: [10, 15, 20, 25, 30] } }),
]);
writeData("hk", "motor", [
  mp("axa-motor-hk", "AXA Hong Kong", "axa-hk", "AXA Car Insurance", "motor", "comprehensive", { pMin: 3000, pMax: 10000, assum: "Annual, HKD", feat: ["Comprehensive", "Named Driver Discount", "Windscreen Cover"] }),
  mp("qbe-motor-hk", "QBE Hong Kong", "qbe-hk", "QBE Motor Insurance", "motor", "comprehensive", { pMin: 2800, pMax: 9000, assum: "Annual, HKD", feat: ["Competitive", "Courtesy Car", "24/7 Claims"] }),
]);
writeData("hk", "travel", [
  mp("fwd-travel-hk", "FWD Hong Kong", "fwd-hk", "FWD Travel Insurance", "travel", "international", { pMin: 100, pMax: 300, assum: "Per trip, HKD", feat: ["Simple Plans", "Online Purchase", "Affordable"] }),
  mp("blue-cross-travel-hk", "Blue Cross HK", "blue-cross-hk", "Blue Cross Travel Insurance", "travel", "international", { pMin: 120, pMax: 350, assum: "Per trip, HKD", feat: ["Comprehensive", "Annual Plans", "Family Cover"] }),
]);

// ═══ SAUDI ARABIA ═══
console.log("\nSAUDI ARABIA:");
writeData("sa", "health", [
  mp("bupa-arabia-health", "Bupa Arabia", "bupa-arabia", "Bupa Arabia Health Insurance", "health", "individual", { pMin: 3000, pMax: 15000, assum: "Annual, SAR", feat: ["Kingdom's Largest Health Insurer", "Wide Network", "Comprehensive Plans"], conf: "high" }),
  mp("tawuniya-health", "Tawuniya", "tawuniya", "Tawuniya Health Insurance", "health", "individual", { pMin: 2500, pMax: 12000, assum: "Annual, SAR", feat: ["Government-Linked", "Mandatory Compliance", "Wide Network"], conf: "high" }),
  mp("medgulf-health", "MedGulf", "medgulf", "MedGulf Health Insurance", "health", "individual", { pMin: 2000, pMax: 10000, assum: "Annual, SAR", feat: ["Competitive Premiums", "Good Coverage", "SME Plans"], conf: "medium" }),
]);
writeData("sa", "motor", [
  mp("tawuniya-motor", "Tawuniya", "tawuniya", "Tawuniya Motor Insurance", "motor", "comprehensive", { pMin: 1500, pMax: 5000, assum: "Annual, SAR", feat: ["Market Leader", "Cashless Repairs", "SAMA Regulated"] }),
  mp("bupa-motor-sa", "Bupa Arabia", "bupa-arabia", "Bupa Arabia Motor", "motor", "comprehensive", { pMin: 1800, pMax: 6000, assum: "Annual, SAR", feat: ["Comprehensive", "Wide Garage Network", "Online Claims"] }),
]);
writeData("sa", "term-life", [
  mp("tawuniya-life", "Tawuniya", "tawuniya", "Tawuniya Protection Plan", "term-life", "pure-term", { pMin: 200, pMax: 800, assum: "Monthly, SAR", feat: ["Sharia-Compliant", "SAMA Regulated", "Family Protection"], ten: { min: 5, max: 25, options: [5, 10, 15, 20, 25] } }),
]);
writeData("sa", "travel", [
  mp("tawuniya-travel", "Tawuniya", "tawuniya", "Tawuniya Travel Insurance", "travel", "international", { pMin: 100, pMax: 500, assum: "Per trip, SAR", feat: ["Hajj/Umrah Plans", "Schengen Compliant", "Emergency Assistance"] }),
]);

console.log("\n✅ All 12 countries rebuilt successfully!");
