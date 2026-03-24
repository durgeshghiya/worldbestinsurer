export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: { code: string; symbol: string; name: string };
  locale: string;
  regulator: string;
  insuranceCategories: string[];
  isActive: boolean;
  description: string;
  insurerCount: number;
  productCount: number;
}

export const countries: Country[] = [
  {
    code: "in",
    name: "India",
    flag: "\u{1F1EE}\u{1F1F3}",
    currency: { code: "INR", symbol: "\u20B9", name: "Indian Rupee" },
    locale: "en-IN",
    regulator: "IRDAI",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "One of the fastest-growing insurance markets in the world, regulated by IRDAI",
    insurerCount: 57,
    productCount: 0,
  },
  {
    code: "us",
    name: "United States",
    flag: "\u{1F1FA}\u{1F1F8}",
    currency: { code: "USD", symbol: "$", name: "US Dollar" },
    locale: "en-US",
    regulator: "State DOI",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "World's largest insurance market, regulated at the state level by Departments of Insurance",
    insurerCount: 5900,
    productCount: 0,
  },
  {
    code: "uk",
    name: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    currency: { code: "GBP", symbol: "\u00A3", name: "British Pound" },
    locale: "en-GB",
    regulator: "FCA",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Europe's largest insurance market, regulated by the Financial Conduct Authority and PRA",
    insurerCount: 770,
    productCount: 0,
  },
  {
    code: "ae",
    name: "United Arab Emirates",
    flag: "\u{1F1E6}\u{1F1EA}",
    currency: { code: "AED", symbol: "AED", name: "UAE Dirham" },
    locale: "en-AE",
    regulator: "CBUAE",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Leading Middle Eastern insurance hub, regulated by the Central Bank of the UAE",
    insurerCount: 62,
    productCount: 0,
  },
  {
    code: "sg",
    name: "Singapore",
    flag: "\u{1F1F8}\u{1F1EC}",
    currency: { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    locale: "en-SG",
    regulator: "MAS",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Asia's leading financial hub, regulated by the Monetary Authority of Singapore",
    insurerCount: 160,
    productCount: 0,
  },
  {
    code: "ca",
    name: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    currency: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    locale: "en-CA",
    regulator: "OSFI",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Mature insurance market regulated federally by OSFI and provincially",
    insurerCount: 200,
    productCount: 0,
  },
  {
    code: "au",
    name: "Australia",
    flag: "\u{1F1E6}\u{1F1FA}",
    currency: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    locale: "en-AU",
    regulator: "APRA",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Well-regulated market overseen by the Australian Prudential Regulation Authority",
    insurerCount: 130,
    productCount: 0,
  },
  {
    code: "de",
    name: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    currency: { code: "EUR", symbol: "\u20AC", name: "Euro" },
    locale: "de-DE",
    regulator: "BaFin",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Europe's largest economy with a dual public-private insurance system, regulated by BaFin",
    insurerCount: 530,
    productCount: 0,
  },
  {
    code: "sa",
    name: "Saudi Arabia",
    flag: "\u{1F1F8}\u{1F1E6}",
    currency: { code: "SAR", symbol: "SAR", name: "Saudi Riyal" },
    locale: "en-SA",
    regulator: "SAMA",
    insuranceCategories: ["health", "motor", "travel"],
    isActive: true,
    description:
      "Rapidly growing market regulated by the Saudi Central Bank (SAMA)",
    insurerCount: 30,
    productCount: 0,
  },
  {
    code: "jp",
    name: "Japan",
    flag: "\u{1F1EF}\u{1F1F5}",
    currency: { code: "JPY", symbol: "\u00A5", name: "Japanese Yen" },
    locale: "ja-JP",
    regulator: "FSA Japan",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "World's third-largest insurance market, regulated by the Financial Services Agency",
    insurerCount: 90,
    productCount: 0,
  },
  {
    code: "kr",
    name: "South Korea",
    flag: "\u{1F1F0}\u{1F1F7}",
    currency: { code: "KRW", symbol: "\u20A9", name: "South Korean Won" },
    locale: "ko-KR",
    regulator: "FSS",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Highly developed insurance market regulated by the Financial Supervisory Service",
    insurerCount: 50,
    productCount: 0,
  },
  {
    code: "hk",
    name: "Hong Kong",
    flag: "\u{1F1ED}\u{1F1F0}",
    currency: { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
    locale: "en-HK",
    regulator: "IA",
    insuranceCategories: ["health", "term-life", "motor", "travel"],
    isActive: true,
    description:
      "Major Asian insurance hub regulated by the Insurance Authority",
    insurerCount: 160,
    productCount: 0,
  },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code.toLowerCase());
}

export function getActiveCountries(): Country[] {
  return countries.filter((c) => c.isActive);
}

export const VALID_COUNTRY_CODES: string[] = countries.map((c) => c.code);
