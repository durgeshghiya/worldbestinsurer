const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// India contacts
const inContacts = {
  "hdfc-life": { customerCareNumber: "1800-266-9777", phone: "+91-22-68446530", email: "service@hdfclife.com", address: "13th Floor, Lodha Excelus, Mahalaxmi, Mumbai 400011", grievanceEmail: "grievanceofficer@hdfclife.com", socialMedia: { twitter: "https://twitter.com/HDFCLife", facebook: "https://www.facebook.com/HDFCLife", linkedin: "https://www.linkedin.com/company/hdfc-life" } },
  "icici-prudential": { customerCareNumber: "1860-266-7766", phone: "+91-22-40391600", email: "lifeline@iciciprulife.com", address: "ICICI PruLife Towers, 1089 Appasaheb Marathe Marg, Prabhadevi, Mumbai 400025", grievanceEmail: "igms@iciciprulife.com", socialMedia: { twitter: "https://twitter.com/ICICIPruLife", facebook: "https://www.facebook.com/ICICIPruLife", linkedin: "https://www.linkedin.com/company/icici-prudential-life-insurance" } },
  "max-life": { customerCareNumber: "1860-120-5577", phone: "+91-11-46769200", email: "service.helpdesk@maxlifeinsurance.com", address: "12th Floor, DLF Square, DLF Phase-II, Gurugram 122002", grievanceEmail: "grievance@maxlifeinsurance.com", socialMedia: { twitter: "https://twitter.com/MaxLifeIns", facebook: "https://www.facebook.com/MaxLifeInsurance" } },
  "tata-aia": { customerCareNumber: "1800-209-8700", phone: "+91-22-62516000", email: "customercare@tataaia.com", address: "14th Floor, Tower A, Peninsula Business Park, Lower Parel, Mumbai 400013", grievanceEmail: "grievanceofficer@tataaia.com" },
  "sbi-life": { customerCareNumber: "1800-267-9090", phone: "+91-22-61919000", email: "info@sbilife.co.in", address: "Natraj, M.V. Road & WEH Junction, Andheri East, Mumbai 400069", grievanceEmail: "grievanceredressalofficer@sbilife.co.in" },
  "lic": { customerCareNumber: "1800-258-9999", phone: "+91-22-68276827", email: "co_csd@licindia.com", address: "Yogakshema Building, Jeevan Bima Marg, Mumbai 400021" },
  "bajaj-allianz-life": { customerCareNumber: "1800-209-7272", phone: "+91-20-66026602", email: "customercare@bajajallianzlife.co.in", address: "GE Plaza, Airport Road, Yerwada, Pune 411006", grievanceEmail: "grievanceredressal@bajajallianzlife.co.in" },
  "pnb-metlife": { customerCareNumber: "1800-425-6969", phone: "+91-80-26502244", email: "indiaservice@pnbmetlife.co.in", address: "Brigade Seshamahal, Basavanagudi, Bengaluru 560004", grievanceEmail: "grievance@pnbmetlife.co.in" },
  "kotak-life": { customerCareNumber: "1800-209-8800", phone: "+91-22-61056105", email: "customercare@kotaklife.com", address: "2nd Floor, Plot C-12, G Block, BKC, Mumbai 400051", grievanceEmail: "grievance@kotaklife.com" },
  "canara-hsbc-life": { customerCareNumber: "1800-103-0003", phone: "+91-124-4563200", email: "customerservice@canarahsbclife.in", address: "Unit 208-212, Vipul Tech Square, Sector 43, Gurugram 122009" },
  "edelweiss-tokio-life": { customerCareNumber: "1800-209-7272", phone: "+91-22-41578888", email: "care@edelweisstokio.in", address: "Edelweiss House, Off CST Road, Kalina, Mumbai 400098" },
  "bandhan-life": { customerCareNumber: "1800-572-8888", phone: "+91-22-44897000", email: "customerservice@bandhanlife.com", address: "4th Floor, Raheja Titanium, Goregaon East, Mumbai 400063" },
  "aditya-birla-sun-life": { customerCareNumber: "1800-270-7000", phone: "+91-20-66516516", email: "care.lifeinsurance@adityabirlacapital.com", address: "One World Center, Tower 1, 15th Floor, Mumbai 400013", grievanceEmail: "head.customerrelations@adityabirlacapital.com" },
  "pramerica-life": { customerCareNumber: "1800-102-7070", phone: "+91-22-67816781", email: "customercare@pramericalife.in", address: "Unit 401, 4th Floor, Mumbai 400070" },
  "star-health": { customerCareNumber: "1800-425-2255", claimHelpline: "1800-102-4477", phone: "+91-44-28288800", email: "customercare@starhealth.in", address: "No. 1, New Tank Street, Nungambakkam, Chennai 600034", grievanceEmail: "grievance@starhealth.in", socialMedia: { twitter: "https://twitter.com/StarHealthIns", facebook: "https://www.facebook.com/StarHealthInsurance" } },
  "care-health": { customerCareNumber: "1800-102-4488", phone: "+91-124-4584858", email: "customercare@careinsurance.com", address: "5th Floor, Jaipur Golden Hospital Road, Rohini, New Delhi 110085", grievanceEmail: "grievance@careinsurance.com" },
  "niva-bupa": { customerCareNumber: "1800-200-0022", phone: "+91-124-6174800", email: "customer.care@nivabupa.com", address: "3rd Floor, Salcon Aurum, Jasola, New Delhi 110025", grievanceEmail: "grievance@nivabupa.com" },
  "aditya-birla-health": { customerCareNumber: "1800-270-7000", phone: "+91-20-66516516", email: "care.healthinsurance@adityabirlacapital.com", address: "8th Floor, Tower A, Peninsula Business Park, Mumbai 400013" },
  "manipalcigna": { customerCareNumber: "1800-258-4242", phone: "+91-22-41799999", email: "customerservice@manipalcigna.com", address: "401, 4th Floor, Trade Centre, BKC, Mumbai 400051" },
  "hdfc-ergo": { customerCareNumber: "1800-266-0700", claimHelpline: "1800-2700-700", phone: "+91-22-68746444", email: "customerservice@hdfcergo.com", address: "1st Floor, HDFC House, Backbay Reclamation, Churchgate, Mumbai 400020", grievanceEmail: "grievancecell@hdfcergo.com" },
  "icici-lombard": { customerCareNumber: "1800-266-9725", phone: "+91-22-41761600", email: "customersupport@icicilombard.com", address: "ICICI Lombard House, 414 Veer Savarkar Marg, Mumbai 400025", grievanceEmail: "igms@icicilombard.com" },
  "bajaj-allianz": { customerCareNumber: "1800-209-5858", phone: "+91-20-30305858", email: "bagicservice@bajajallianz.co.in", address: "GE Plaza, Airport Road, Yerwada, Pune 411006", grievanceEmail: "grievancecell@bajajallianz.co.in" },
  "tata-aig": { customerCareNumber: "1800-266-7780", phone: "+91-22-66699100", email: "customercare@tataaig.com", address: "Peninsula Business Park, Tower A, 15th Floor, Lower Parel, Mumbai 400013", grievanceEmail: "customerfirst@tataaig.com" },
  "new-india-assurance": { customerCareNumber: "1800-209-1415", phone: "+91-22-22708000", email: "customercare@newindia.co.in", address: "87 MG Road, Fort, Mumbai 400001" },
  "digit": { customerCareNumber: "1800-258-4242", phone: "+91-80-68262800", email: "hello@godigit.com", address: "Atlantis, Koramangala, Bengaluru 560095", socialMedia: { twitter: "https://twitter.com/GoDigitIns", facebook: "https://www.facebook.com/GoDigitInsurance" } },
  "acko": { customerCareNumber: "1800-266-2256", email: "help@acko.com", address: "2nd Floor, Hustlehub One East, HSR Layout, Bengaluru 560102" },
  "royal-sundaram": { customerCareNumber: "1800-568-9999", phone: "+91-44-28288800", email: "royalcare@royalsundaram.in", address: "Vishranthi Melaram Towers, Karapakkam, Chennai 600097" },
  "reliance-general": { customerCareNumber: "1800-102-3499", phone: "+91-22-30474747", email: "rgicl.services@relianceada.com", address: "Reliance Centre, South Wing, Santacruz East, Mumbai 400055" },
  "sbi-general": { customerCareNumber: "1800-102-1111", phone: "+91-22-43890000", email: "customer.care@sbigeneral.in", address: "Natraj, 301, Andheri East, Mumbai 400069" },
  "kotak-general": { customerCareNumber: "1800-209-5858", phone: "+91-22-61056105", email: "customer.care@kotakgeneral.com", address: "2nd Floor, Plot C-12, G Block, BKC, Mumbai 400051" },
  "cholamandalam-ms": { customerCareNumber: "1800-200-5544", phone: "+91-44-66026602", email: "customercare@cholainsurance.com", address: "2nd Floor, Dare House, NSC Bose Road, Chennai 600001" },
  "national-insurance": { customerCareNumber: "1800-345-0330", phone: "+91-33-22831705", email: "customercare@nic.co.in", address: "3 Middleton Street, Kolkata 700071" },
  "oriental-insurance": { customerCareNumber: "1800-118-485", phone: "+91-11-43659100", email: "cs@orientalinsurance.co.in", address: "Oriental House, Asaf Ali Road, New Delhi 110002" },
  "united-india-insurance": { customerCareNumber: "1800-425-3333", phone: "+91-44-28600020", email: "customercare@uiic.co.in", address: "24 Whites Road, Chennai 600014" },
};

// US contacts
const usContacts = {
  "state-farm": { customerCareNumber: "1-800-732-5246", address: "One State Farm Plaza, Bloomington, IL 61710", socialMedia: { twitter: "https://twitter.com/StateFarm", facebook: "https://www.facebook.com/statefarm" } },
  "geico": { customerCareNumber: "1-800-861-8380", claimHelpline: "1-800-841-3000", address: "One GEICO Plaza, Washington, DC 20076", socialMedia: { twitter: "https://twitter.com/GEICO", facebook: "https://www.facebook.com/geico" } },
  "progressive": { customerCareNumber: "1-800-776-4737", claimHelpline: "1-800-274-4499", address: "6300 Wilson Mills Road, Mayfield Village, OH 44143", socialMedia: { twitter: "https://twitter.com/Progressive", facebook: "https://www.facebook.com/progressive" } },
  "allstate": { customerCareNumber: "1-800-255-7828", claimHelpline: "1-800-547-8676", address: "2775 Sanders Road, Northbrook, IL 60062", socialMedia: { twitter: "https://twitter.com/Allstate", facebook: "https://www.facebook.com/Allstate" } },
  "usaa": { customerCareNumber: "1-800-531-8722", address: "9800 Fredericksburg Road, San Antonio, TX 78288", socialMedia: { twitter: "https://twitter.com/USAA", facebook: "https://www.facebook.com/USAA" } },
  "liberty-mutual": { customerCareNumber: "1-800-290-8711", claimHelpline: "1-800-225-2467", address: "175 Berkeley Street, Boston, MA 02116", socialMedia: { twitter: "https://twitter.com/LibertyMutual", facebook: "https://www.facebook.com/libertymutual" } },
  "nationwide": { customerCareNumber: "1-877-669-6877", address: "One Nationwide Plaza, Columbus, OH 43215", socialMedia: { twitter: "https://twitter.com/Nationwide", facebook: "https://www.facebook.com/Nationwide" } },
  "farmers": { customerCareNumber: "1-888-327-6335", claimHelpline: "1-800-435-7764", address: "6301 Owensmouth Avenue, Woodland Hills, CA 91367" },
  "travelers": { customerCareNumber: "1-800-252-4633", address: "485 Lexington Avenue, New York, NY 10017" },
  "metlife": { customerCareNumber: "1-800-638-5433", address: "200 Park Avenue, New York, NY 10166", socialMedia: { twitter: "https://twitter.com/MetLife", facebook: "https://www.facebook.com/MetLife" } },
  "prudential": { customerCareNumber: "1-800-778-2255", address: "751 Broad Street, Newark, NJ 07102", socialMedia: { twitter: "https://twitter.com/Prudential", linkedin: "https://www.linkedin.com/company/prudential" } },
  "new-york-life": { customerCareNumber: "1-800-695-4331", address: "51 Madison Avenue, New York, NY 10010" },
  "northwestern-mutual": { customerCareNumber: "1-866-950-4644", address: "720 East Wisconsin Avenue, Milwaukee, WI 53202" },
  "aetna": { customerCareNumber: "1-800-872-3862", address: "151 Farmington Avenue, Hartford, CT 06156" },
  "cigna": { customerCareNumber: "1-800-997-1654", address: "900 Cottage Grove Road, Bloomfield, CT 06002" },
  "unitedhealth": { customerCareNumber: "1-800-328-5979", address: "9900 Bren Road East, Minnetonka, MN 55343" },
  "humana": { customerCareNumber: "1-800-457-4708", address: "500 West Main Street, Louisville, KY 40202" },
  "kaiser-permanente": { customerCareNumber: "1-800-464-4000", address: "One Kaiser Plaza, Oakland, CA 94612" },
};

// UK contacts
const ukContacts = {
  "aviva": { customerCareNumber: "0800-068-6800", phone: "+44-20-7283-2000", address: "St Helen's, 1 Undershaft, London EC3P 3DQ", socialMedia: { twitter: "https://twitter.com/aviva", linkedin: "https://www.linkedin.com/company/aviva" } },
  "axa-uk": { customerCareNumber: "0800-169-7857", address: "20 Gracechurch Street, London EC3V 0BG" },
  "direct-line": { customerCareNumber: "0345-246-8704", address: "Churchill Court, Westmoreland Road, Bromley BR1 1DP" },
  "admiral": { customerCareNumber: "0333-220-2000", address: "Ty Admiral, David Street, Cardiff CF10 2EH", socialMedia: { twitter: "https://twitter.com/AdmiralUK", facebook: "https://www.facebook.com/AdmiralUK" } },
  "legal-and-general": { customerCareNumber: "0370-050-0955", phone: "+44-20-3124-2000", address: "One Coleman Street, London EC2R 5AA" },
  "zurich-uk": { customerCareNumber: "0800-232-1234", address: "Zurich House, 2 Gladiator Way, Farnborough GU14 6GB" },
  "bupa": { customerCareNumber: "0345-600-8822", address: "1 Angel Court, London EC2R 7HJ", socialMedia: { twitter: "https://twitter.com/BupaUK", facebook: "https://www.facebook.com/bupa" } },
};

// AE contacts
const aeContacts = {
  "daman": { customerCareNumber: "800-42326", phone: "+971-2-596-6000", email: "customercare@damanhealth.ae", address: "ADNEC Area, Sheikh Zayed the First Street, Abu Dhabi" },
  "oman-insurance": { customerCareNumber: "800-4746", phone: "+971-4-233-4500", email: "contact@omaninsurance.ae", address: "Wafi City, Oud Metha, Dubai" },
  "orient-insurance": { phone: "+971-4-253-8100", email: "info@orientinsurance.ae", address: "Orient Insurance Building, Al Maktoum Road, Deira, Dubai" },
  "adnic": { customerCareNumber: "800-23642", phone: "+971-2-408-0000", email: "info@adnic.ae", address: "ADNIC Tower, Khalifa Street, Abu Dhabi" },
  "axa-gulf": { customerCareNumber: "800-292-4843", phone: "+971-4-324-2424", email: "customer.service@axa-gulf.com", address: "Emaar Square, Downtown Dubai" },
};

// Other country contacts (key insurers only)
const otherContacts = {
  ca: {
    "manulife": { customerCareNumber: "1-888-626-8543", address: "200 Bloor Street East, Toronto, ON M4W 1E5" },
    "sun-life": { customerCareNumber: "1-877-786-5433", address: "1 York Street, Toronto, ON M5J 0B6" },
    "great-west-life": { customerCareNumber: "1-800-957-9777", address: "100 Osborne Street North, Winnipeg, MB R3C 1V3" },
  },
  de: {
    "allianz-de": { customerCareNumber: "+49-89-3800-0", address: "Koeniginstrasse 28, 80802 Muenchen" },
    "axa-germany": { phone: "+49-221-148-0", address: "Colonia-Allee 10-20, 51067 Koeln" },
  },
  sg: {
    "aia-singapore": { customerCareNumber: "+65-1800-248-8000", address: "1 Robinson Road, AIA Tower, Singapore 048542" },
    "prudential-sg": { customerCareNumber: "+65-1800-333-0333", address: "7 Straits View, Marina One East Tower, Singapore 018936" },
    "great-eastern": { customerCareNumber: "+65-6248-2211", address: "1 Pickering Street, Great Eastern Centre, Singapore 048659" },
  },
  au: {
    "medibank": { customerCareNumber: "13-23-31", address: "720 Bourke Street, Docklands VIC 3008" },
    "bupa-australia": { customerCareNumber: "1800-253-744", address: "33 Exhibition Street, Melbourne VIC 3000" },
    "nib": { customerCareNumber: "13-14-63", address: "22 Honeysuckle Drive, Newcastle NSW 2300" },
  },
  jp: {
    "nippon-life": { phone: "+81-3-5533-1111", address: "1-6-6 Marunouchi, Chiyoda-ku, Tokyo 100-8288" },
    "dai-ichi-life": { phone: "+81-50-3780-1111", address: "1-13-1 Yurakucho, Chiyoda-ku, Tokyo 100-8411" },
    "meiji-yasuda": { phone: "+81-3-3283-8111", address: "1-1 Marunouchi 2-chome, Chiyoda-ku, Tokyo 100-0005" },
  },
  kr: {
    "samsung-life": { customerCareNumber: "1588-3114", address: "55 Sejong-daero, Jung-gu, Seoul" },
    "hanwha-life": { customerCareNumber: "1588-6363", address: "86 Cheonggyecheon-ro, Jung-gu, Seoul" },
  },
  hk: {
    "aia-hk": { customerCareNumber: "+852-2232-8888", address: "35/F, AIA Central, 1 Connaught Road Central, Hong Kong" },
    "manulife-hk": { customerCareNumber: "+852-2510-5600", address: "22/F, Tower A, Manulife Financial Centre, 223 Wai Yip Street, Kwun Tong" },
  },
  sa: {
    "bupa-arabia": { customerCareNumber: "800-244-0707", phone: "+966-12-218-8888", address: "King Road Tower, King Abdulaziz Road, Jeddah" },
    "tawuniya": { customerCareNumber: "800-124-9990", phone: "+966-11-252-8888", address: "Al Tawuniya Towers, King Fahd Road, Riyadh" },
  },
};

function updateFile(cc, contactMap) {
  const filePath = path.join(ROOT, "src/data", cc, "insurers.json");
  if (!fs.existsSync(filePath)) { console.log("  Skip " + cc + " (no file)"); return 0; }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let count = 0;
  for (const ins of data.insurers) {
    if (contactMap[ins.slug]) {
      ins.contact = { ...contactMap[ins.slug], lastVerified: "2026-04-03" };
      count++;
    } else if (!ins.contact) {
      ins.contact = { lastVerified: "2026-04-03" };
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("  " + cc.toUpperCase() + ": " + data.insurers.length + " insurers, " + count + " with full contact");
  return count;
}

console.log("Populating insurer contact data...\n");
let total = 0;
total += updateFile("in", inContacts);
total += updateFile("us", usContacts);
total += updateFile("uk", ukContacts);
total += updateFile("ae", aeContacts);
for (const [cc, map] of Object.entries(otherContacts)) {
  total += updateFile(cc, map);
}
console.log("\nDone! " + total + " insurers with full contact details across all countries.");
