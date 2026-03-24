import type {
  Category,
  ConfidenceScore,
  InsuranceProduct,
} from '../../src/lib/types';
import type { ExtractedProduct } from './extractors/base-extractor';

/**
 * Normalize an ExtractedProduct (raw scrape output) into a
 * Partial<InsuranceProduct> that conforms to the Zura schema.
 *
 * Handles:
 * - Currency parsing for sumInsured and premiumRange
 * - Age parsing for eligibility
 * - Slug / ID generation
 * - Default values for missing fields
 * - sourceType, lastVerified, confidenceScore assignment
 */
export function normalizeProduct(
  extracted: ExtractedProduct,
  insurerSlug: string,
  category: Category,
  sourceType: string = 'scrape'
): Partial<InsuranceProduct> {
  const f = extracted.rawFields;

  const productName = String(
    f['productName'] || extracted.rawName || 'Unknown Product'
  ).trim();

  const id = slugify(`${insurerSlug}-${productName}`);

  const insurerName = String(
    f['insurerName'] || insurerSlug.replace(/-/g, ' ')
  );

  // ── Eligibility ──
  const eligibility = parseEligibility(f);

  // ── Sum Insured ──
  const sumInsured = parseSumInsured(f);

  // ── Premium Range ──
  const premiumRange = parsePremiumRange(f);

  // ── Waiting Period ──
  const waitingPeriod = parseWaitingPeriod(f);

  // ── Key Inclusions ──
  const keyInclusions = toStringArray(
    f['keyFeatures'] ?? f['keyInclusions'] ?? f['benefits'] ?? []
  );

  // ── Key Exclusions ──
  const keyExclusions = toStringArray(
    f['keyExclusions'] ?? f['exclusions'] ?? []
  );

  // ── Claim Settlement ──
  const claimSettlement = parseClaimSettlement(f);

  // ── Network Hospitals ──
  const networkHospitals = parseNetworkHospitals(f);

  // ── Riders ──
  const riders = toStringArray(f['riders'] ?? []);

  // ── Policy Tenure ──
  const policyTenure = parsePolicyTenure(f);

  // ── Renewability ──
  const renewability = String(f['renewability'] || 'Not specified');

  // ── Special Features ──
  const specialFeatures = toStringArray(
    f['specialFeatures'] ?? f['highlights'] ?? []
  );

  // ── Confidence ──
  const confidenceScore = estimateConfidence(extracted);

  // ── Notes ──
  const notes = extracted.warnings.length > 0
    ? `Extraction warnings: ${extracted.warnings.join('; ')}`
    : '';

  const product: Partial<InsuranceProduct> = {
    id,
    insurerName,
    insurerSlug,
    productName,
    category,
    subCategory: String(f['subCategory'] || detectSubCategory(category, productName)),
    eligibility,
    sumInsured,
    premiumRange,
    waitingPeriod,
    keyInclusions,
    keyExclusions,
    claimSettlement,
    networkHospitals,
    riders,
    policyTenure,
    renewability,
    specialFeatures,
    sourceUrl: extracted.sourceUrl,
    sourceType,
    lastVerified: new Date().toISOString().split('T')[0],
    confidenceScore,
    notes,
  };

  // Strip undefined values
  return stripUndefined(product);
}

// ──────────────────────────────────────────
// Parsing helpers
// ──────────────────────────────────────────

function parseCurrency(text: string | number | null | undefined): number | null {
  if (text === null || text === undefined) return null;
  if (typeof text === 'number') return text;

  const cleaned = String(text)
    .replace(/[₹,Rs.\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const croreMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr)\b/i);
  if (croreMatch) return parseFloat(croreMatch[1]) * 10_000_000;

  const lakhMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)\b/i);
  if (lakhMatch) return parseFloat(lakhMatch[1]) * 100_000;

  const plainMatch = cleaned.match(/(\d[\d,]*(?:\.\d+)?)/);
  if (plainMatch) {
    const num = parseFloat(plainMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) return num;
  }

  return null;
}

function parseAgeRange(
  text: string | number | null | undefined
): { min: number; max: number | null } | null {
  if (!text) return null;
  const s = String(text);

  const rangeMatch = s.match(/(\d+)\s*(?:-|to|–)\s*(\d+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1], 10),
      max: parseInt(rangeMatch[2], 10),
    };
  }

  const minMatch = s.match(/(?:min(?:imum)?|above|from|at\s*least)\s*(\d+)/i);
  if (minMatch) return { min: parseInt(minMatch[1], 10), max: null };

  const maxMatch = s.match(/(?:up\s*to|max(?:imum)?|below|under)\s*(\d+)/i);
  if (maxMatch) return { min: 0, max: parseInt(maxMatch[1], 10) };

  const singleMatch = s.match(/^(\d+)$/);
  if (singleMatch) return { min: parseInt(singleMatch[1], 10), max: null };

  return null;
}

function parseEligibility(
  f: Record<string, string | string[] | number | null>
) {
  const ageText = f['eligibilityAge'] ?? f['age'] ?? f['Entry Age'] ?? f['Age'] ?? null;
  const ageRange = parseAgeRange(ageText as string | null);

  const renewableUpTo = String(
    f['renewableUpTo'] ?? f['Renewable Up To'] ?? f['renewability'] ?? 'Not specified'
  );

  return {
    minAge: ageRange?.min ?? 18,
    maxAge: ageRange?.max ?? null,
    renewableUpTo,
  };
}

function parseSumInsured(
  f: Record<string, string | string[] | number | null>
) {
  const sumText = f['sumInsured'] ?? f['Sum Insured'] ?? f['cover'] ?? f['Coverage'] ?? null;

  let min: number | null = null;
  let max: number | null = null;
  let note: string | undefined;
  const options: number[] = [];

  if (sumText) {
    const s = String(sumText);

    // Range: "5 Lakh to 1 Crore" or "5L - 1Cr"
    const rangeMatch = s.match(
      /([\d,.]+\s*(?:lakh|lac|crore|cr|l)\b)\s*(?:-|to|–)\s*([\d,.]+\s*(?:lakh|lac|crore|cr|l)\b)/i
    );
    if (rangeMatch) {
      min = parseCurrency(rangeMatch[1]);
      max = parseCurrency(rangeMatch[2]);
    } else {
      // Single value — treat as max
      const parsed = parseCurrency(s);
      if (parsed !== null) {
        max = parsed;
      }
    }

    // Look for specific option values like "5L / 10L / 25L / 50L / 1Cr"
    const optionMatches = s.match(
      /(\d+(?:\.\d+)?\s*(?:lakh|lac|crore|cr|l)\b)/gi
    );
    if (optionMatches && optionMatches.length > 2) {
      for (const opt of optionMatches) {
        const val = parseCurrency(opt);
        if (val !== null) options.push(val);
      }
    }

    // Capture any extra note
    if (/no\s*(?:cap|limit|sub[- ]?limit)/i.test(s)) {
      note = 'No capping / sub-limit';
    }
  }

  return {
    min,
    max,
    ...(options.length > 0 ? { options } : {}),
    currency: 'INR',
    ...(note ? { note } : {}),
  };
}

function parsePremiumRange(
  f: Record<string, string | string[] | number | null>
) {
  const premText = f['premium'] ?? f['Premium'] ?? f['price'] ?? null;

  let illustrativeMin = 0;
  let illustrativeMax = 0;
  let assumptions = 'Not specified';
  const isVerified = false;

  if (premText) {
    const s = String(premText);

    // Range: "₹5,000 - ₹25,000"
    const rangeMatch = s.match(
      /(?:₹|rs\.?\s*)?(\d[\d,]*)\s*(?:-|to|–)\s*(?:₹|rs\.?\s*)?(\d[\d,]*)/i
    );
    if (rangeMatch) {
      illustrativeMin = parseInt(rangeMatch[1].replace(/,/g, ''), 10) || 0;
      illustrativeMax = parseInt(rangeMatch[2].replace(/,/g, ''), 10) || 0;
    } else {
      const singleVal = parseCurrency(s);
      if (singleVal !== null) {
        illustrativeMin = singleVal;
        illustrativeMax = singleVal;
      }
    }

    // Look for assumptions
    const assumptionMatch = s.match(
      /(?:for|assuming|based\s*on)[:\s]+(.+)/i
    );
    if (assumptionMatch) {
      assumptions = assumptionMatch[1].trim();
    } else if (illustrativeMin > 0) {
      assumptions = 'Illustrative premium from website; actual may vary';
    }
  }

  return {
    illustrativeMin,
    illustrativeMax,
    assumptions,
    isVerified,
  };
}

function parseWaitingPeriod(
  f: Record<string, string | string[] | number | null>
) {
  const wpText = f['waitingPeriod'] ?? f['Waiting Period'] ?? null;
  const preExistingText = f['preExistingWaitingPeriod'] ?? f['Pre-Existing'] ?? null;

  if (!wpText && !preExistingText) return null;

  return {
    initial: String(wpText || '30 days'),
    preExisting: String(preExistingText || wpText || 'Not specified'),
    specific: String(f['specificWaitingPeriod'] ?? 'Not specified'),
  };
}

function parseClaimSettlement(
  f: Record<string, string | string[] | number | null>
) {
  const csrText = f['claimSettlementRatio'] ?? f['Claim Settlement Ratio'] ?? null;
  if (!csrText) return null;

  const s = String(csrText);
  const ratioMatch = s.match(/([\d.]+)\s*%?/);
  const ratio = ratioMatch ? parseFloat(ratioMatch[1]) : null;

  const yearMatch = s.match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : null;

  return {
    ratio,
    year,
    source: 'Insurer website',
  };
}

function parseNetworkHospitals(
  f: Record<string, string | string[] | number | null>
) {
  const hospText = f['networkHospitals'] ?? f['Network Hospitals'] ?? null;
  if (!hospText) return null;

  const s = String(hospText).replace(/,/g, '');
  const countMatch = s.match(/(\d+)/);
  if (!countMatch) return null;

  return {
    count: parseInt(countMatch[1], 10),
    source: 'Insurer website',
  };
}

function parsePolicyTenure(
  f: Record<string, string | string[] | number | null>
) {
  const tenureText = f['policyTenure'] ?? f['Policy Tenure'] ?? f['Policy Term'] ?? null;

  let min: number | null = null;
  let max: number | null = null;
  const options: (number | string)[] = [];

  if (tenureText) {
    const s = String(tenureText);

    const rangeMatch = s.match(/(\d+)\s*(?:-|to|–)\s*(\d+)/);
    if (rangeMatch) {
      min = parseInt(rangeMatch[1], 10);
      max = parseInt(rangeMatch[2], 10);
    } else {
      const singleMatch = s.match(/(\d+)/);
      if (singleMatch) {
        min = parseInt(singleMatch[1], 10);
        max = min;
      }
    }

    // Parse options like "1 / 2 / 3 years"
    const optMatches = s.match(/\d+/g);
    if (optMatches && optMatches.length > 1) {
      for (const o of optMatches) {
        options.push(parseInt(o, 10));
      }
    }
  }

  return {
    min: min ?? 1,
    max: max ?? null,
    options,
  };
}

// ──────────────────────────────────────────
// Utility helpers
// ──────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function toStringArray(
  value: string | string[] | number | null
): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
}

function detectSubCategory(category: Category, productName: string): string {
  const name = productName.toLowerCase();

  switch (category) {
    case 'health':
      if (/family|floater/i.test(name)) return 'family-floater';
      if (/individual/i.test(name)) return 'individual';
      if (/senior|elder/i.test(name)) return 'senior-citizen';
      if (/critical|illness/i.test(name)) return 'critical-illness';
      if (/super\s*top[- ]?up|top[- ]?up/i.test(name)) return 'top-up';
      if (/maternity|women|pregnancy/i.test(name)) return 'maternity';
      if (/group|corporate|employee/i.test(name)) return 'group';
      return 'individual';

    case 'term-life':
      if (/endow/i.test(name)) return 'endowment';
      if (/ulip|unit\s*link/i.test(name)) return 'ulip';
      if (/whole\s*life/i.test(name)) return 'whole-life';
      if (/child|children/i.test(name)) return 'child-plan';
      return 'pure-term';

    case 'motor':
      if (/two[- ]?wheeler|bike|scooter/i.test(name)) return 'two-wheeler';
      if (/commercial|fleet/i.test(name)) return 'commercial';
      if (/third[- ]?party|tp\b/i.test(name)) return 'third-party';
      if (/comprehensive|comp\b/i.test(name)) return 'comprehensive';
      return 'comprehensive';

    case 'travel':
      if (/student/i.test(name)) return 'student';
      if (/senior|elder/i.test(name)) return 'senior';
      if (/family/i.test(name)) return 'family';
      if (/corporate|business/i.test(name)) return 'corporate';
      return 'individual';

    default:
      return 'general';
  }
}

function estimateConfidence(extracted: ExtractedProduct): ConfidenceScore {
  const conf = extracted.extractionConfidence;
  if (conf >= 0.7) return 'high';
  if (conf >= 0.4) return 'medium';
  return 'low';
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T;
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}
