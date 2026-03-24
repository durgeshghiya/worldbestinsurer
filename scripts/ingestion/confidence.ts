import type { ConfidenceScore } from '../../src/lib/types';
import type { ExtractedProduct } from './extractors/base-extractor';
import type { ValidationResult } from './validator';

export interface ConfidenceResult {
  overall: ConfidenceScore;
  score: number;
  breakdown: {
    extractionQuality: number;
    sourceReliability: number;
    fieldCompleteness: number;
    validationPenalty: number;
  };
}

/**
 * Compute a confidence score for an extracted product based on:
 * 1. Extraction confidence from the scraper
 * 2. Source type reliability
 * 3. Field completeness (how many important fields are present)
 * 4. Validation result penalties
 *
 * Returns a score in [0, 1] and a categorical ConfidenceScore.
 */
export function computeConfidence(
  extracted: ExtractedProduct,
  sourceType: string,
  validation: ValidationResult
): ConfidenceResult {
  // ── 1. Extraction quality (0–1), weight: 30% ──
  const extractionQuality = Math.max(0, Math.min(1, extracted.extractionConfidence));

  // ── 2. Source reliability (0–1), weight: 25% ──
  const sourceReliability = getSourceReliability(sourceType);

  // ── 3. Field completeness (0–1), weight: 30% ──
  const fieldCompleteness = computeFieldCompleteness(extracted);

  // ── 4. Validation penalty (0–1, where 1 = no penalty), weight: 15% ──
  const validationPenalty = computeValidationPenalty(validation);

  // ── Weighted combination ──
  const score =
    extractionQuality * 0.3 +
    sourceReliability * 0.25 +
    fieldCompleteness * 0.3 +
    validationPenalty * 0.15;

  // Clamp to [0, 1]
  const clampedScore = Math.max(0, Math.min(1, score));

  // Apply warning-based reduction
  const warningReduction = Math.min(extracted.warnings.length * 0.03, 0.15);
  const finalScore = Math.max(0, clampedScore - warningReduction);

  return {
    overall: scoreToCategory(finalScore),
    score: Math.round(finalScore * 100) / 100,
    breakdown: {
      extractionQuality: Math.round(extractionQuality * 100) / 100,
      sourceReliability: Math.round(sourceReliability * 100) / 100,
      fieldCompleteness: Math.round(fieldCompleteness * 100) / 100,
      validationPenalty: Math.round(validationPenalty * 100) / 100,
    },
  };
}

/**
 * Map source types to reliability scores.
 */
function getSourceReliability(sourceType: string): number {
  const reliabilityMap: Record<string, number> = {
    // Official insurer pages
    'official-website': 1.0,
    'insurer-website': 1.0,
    'official': 1.0,

    // Regulatory / government
    'irdai': 0.95,
    'regulatory': 0.95,

    // Insurer PDFs / brochures
    'pdf-brochure': 0.9,
    'brochure': 0.9,
    'policy-document': 0.9,

    // Aggregator sites
    'aggregator': 0.7,
    'policybazaar': 0.7,
    'coverfox': 0.7,
    'insurancedekho': 0.7,

    // Manual / curated
    'manual': 0.85,
    'curated': 0.85,

    // Generic scrape
    'scrape': 0.5,

    // Blog / article
    'blog': 0.3,
    'article': 0.3,
    'news': 0.35,

    // Unknown
    'unknown': 0.2,
  };

  return reliabilityMap[sourceType.toLowerCase()] ?? 0.3;
}

/**
 * Compute how complete the extracted fields are.
 * Checks for the presence and quality of key insurance product fields.
 */
function computeFieldCompleteness(extracted: ExtractedProduct): number {
  const f = extracted.rawFields;
  let score = 0;
  let maxScore = 0;

  // Critical fields (high weight)
  const criticalFields: [string[], number][] = [
    [['sumInsured', 'Sum Insured', 'cover', 'Coverage'], 15],
    [['premium', 'Premium', 'price'], 12],
    [['eligibilityAge', 'age', 'Age', 'Entry Age', 'eligibility'], 10],
    [['insurerName'], 8],
  ];

  for (const [keys, weight] of criticalFields) {
    maxScore += weight;
    for (const key of keys) {
      if (f[key] !== null && f[key] !== undefined && f[key] !== '') {
        score += weight;
        break;
      }
    }
  }

  // Important fields (medium weight)
  const importantFields: [string[], number][] = [
    [['keyFeatures', 'features', 'benefits', 'keyInclusions'], 8],
    [['waitingPeriod', 'Waiting Period'], 6],
    [['claimSettlementRatio', 'Claim Settlement Ratio'], 5],
    [['networkHospitals', 'Network Hospitals'], 5],
    [['renewability', 'Renewable', 'Renewability'], 4],
    [['policyTenure', 'Policy Term', 'Policy Tenure'], 4],
  ];

  for (const [keys, weight] of importantFields) {
    maxScore += weight;
    for (const key of keys) {
      const val = f[key];
      if (val !== null && val !== undefined && val !== '') {
        // Bonus for arrays with multiple items
        if (Array.isArray(val) && val.length > 2) {
          score += weight;
        } else if (Array.isArray(val) && val.length > 0) {
          score += weight * 0.7;
        } else {
          score += weight;
        }
        break;
      }
    }
  }

  // Nice-to-have fields (low weight)
  const optionalFields: [string[], number][] = [
    [['keyExclusions', 'exclusions'], 4],
    [['riders', 'Riders', 'add-ons'], 3],
    [['specialFeatures', 'highlights'], 3],
    [['subCategory'], 2],
    [['copayment', 'Co-payment'], 2],
    [['roomRent', 'Room Rent'], 2],
  ];

  for (const [keys, weight] of optionalFields) {
    maxScore += weight;
    for (const key of keys) {
      if (f[key] !== null && f[key] !== undefined && f[key] !== '') {
        score += weight;
        break;
      }
    }
  }

  // Product name quality
  maxScore += 5;
  if (extracted.rawName && extracted.rawName.length > 3) {
    score += 5;
    // Bonus if name looks like a real product name (not just "Plan" or "Product")
    if (extracted.rawName.length > 10 && !/^(plan|product|insurance)$/i.test(extracted.rawName)) {
      score += 2;
      maxScore += 2;
    }
  }

  return maxScore > 0 ? score / maxScore : 0;
}

/**
 * Compute a penalty factor based on validation errors and warnings.
 * Returns 1.0 for no issues, decreasing toward 0.0 for many issues.
 */
function computeValidationPenalty(validation: ValidationResult): number {
  if (validation.isValid && validation.warnings.length === 0) return 1.0;

  let penalty = 0;

  // Each error costs 0.15
  penalty += validation.errors.length * 0.15;

  // Each warning costs 0.05
  penalty += validation.warnings.length * 0.05;

  return Math.max(0, 1 - penalty);
}

/**
 * Convert a numeric score to a categorical ConfidenceScore.
 */
function scoreToCategory(score: number): ConfidenceScore {
  if (score >= 0.65) return 'high';
  if (score >= 0.35) return 'medium';
  return 'low';
}
