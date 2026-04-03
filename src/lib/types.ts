export interface Eligibility {
  minAge: number;
  maxAge: number | null;
  renewableUpTo: string;
}

export interface SumInsured {
  min: number | null;
  max: number | null;
  options?: number[];
  currency?: string;
  note?: string;
}

export interface PremiumRange {
  illustrativeMin: number;
  illustrativeMax: number;
  assumptions: string;
  isVerified: boolean;
}

export interface WaitingPeriod {
  initial: string;
  preExisting: string;
  specific: string;
}

export interface ClaimSettlement {
  ratio: number | null;
  year: string | null;
  source: string | null;
}

export interface NetworkHospitals {
  count: number;
  source: string;
}

export interface PolicyTenure {
  min: number | null;
  max: number | null;
  options: (number | string)[];
}

export type Category = "health" | "term-life" | "motor" | "travel";
export type ConfidenceScore = "high" | "medium" | "low";

export interface InsuranceProduct {
  id: string;
  insurerName: string;
  insurerSlug: string;
  productName: string;
  category: Category;
  subCategory: string;
  eligibility: Eligibility;
  sumInsured: SumInsured;
  premiumRange: PremiumRange;
  waitingPeriod: WaitingPeriod | null;
  keyInclusions: string[];
  keyExclusions: string[];
  claimSettlement: ClaimSettlement | null;
  networkHospitals: NetworkHospitals | null;
  riders: string[];
  policyTenure: PolicyTenure;
  renewability: string;
  specialFeatures: string[];
  sourceUrl: string;
  sourceType: string;
  lastVerified: string;
  confidenceScore: ConfidenceScore;
  notes: string;
  countryCode: string;
}

export interface ProductDataset {
  category: Category;
  lastUpdated: string;
  disclaimer: string;
  products: InsuranceProduct[];
}

export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  customerCareNumber?: string;
  claimHelpline?: string;
  address?: string;
  socialMedia?: SocialMedia;
  grievanceEmail?: string;
  fax?: string;
  lastVerified?: string;
}

export interface Insurer {
  slug: string;
  name: string;
  shortName: string;
  type: string;
  categories: Category[];
  website: string;
  headquarters: string;
  established: number;
  listed: boolean;
  claimSettlementRatio: { value: number; year: string; verified: boolean };
  networkHospitals: number | null;
  description: string;
  countryCode: string;
  contact?: ContactInfo;
}

export interface CategoryInfo {
  slug: Category;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: Category | "general";
  readTime: string;
  publishedAt: string;
  author: string;
}
