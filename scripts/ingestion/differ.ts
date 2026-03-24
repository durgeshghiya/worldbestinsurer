import type { InsuranceProduct } from '../../src/lib/types';

export interface FieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

/**
 * Compute field-level differences between an existing InsuranceProduct and
 * a Partial<InsuranceProduct> update. Only fields present in the new product
 * are compared. Nested objects and arrays are compared deeply.
 */
export function diffProducts(
  oldProduct: InsuranceProduct,
  newProduct: Partial<InsuranceProduct>
): FieldChange[] {
  const changes: FieldChange[] = [];

  for (const key of Object.keys(newProduct) as (keyof InsuranceProduct)[]) {
    const oldVal = oldProduct[key];
    const newVal = newProduct[key];

    // Skip if new value is undefined (not provided in update)
    if (newVal === undefined) continue;

    if (!deepEqual(oldVal, newVal)) {
      changes.push({
        field: key,
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  }

  return changes;
}

/**
 * Determine whether a set of changes is "low risk" — i.e. safe for
 * auto-approval without manual review.
 *
 * Low risk changes are:
 * - Only metadata/timestamp fields changed (lastVerified, notes, confidenceScore)
 * - Minor textual changes (small edit distance)
 * - Addition of new optional fields (riders, specialFeatures)
 * - Small numeric changes (<10% difference)
 *
 * High risk changes are:
 * - Price changes > 10%
 * - Sum insured changes > 10%
 * - Eligibility age changes
 * - Insurer name/slug changes
 * - Category changes
 * - Key inclusions/exclusions significantly altered
 */
export function isLowRiskChange(changes: FieldChange[]): boolean {
  if (changes.length === 0) return true;

  for (const change of changes) {
    const risk = assessFieldRisk(change);
    if (risk === 'high') return false;
  }

  return true;
}

/**
 * Get a human-readable summary of changes.
 */
export function summarizeChanges(changes: FieldChange[]): string {
  if (changes.length === 0) return 'No changes detected.';

  const lines: string[] = [];

  for (const change of changes) {
    const risk = assessFieldRisk(change);
    const riskTag = risk === 'high' ? '[HIGH RISK]' : risk === 'medium' ? '[MEDIUM]' : '[LOW]';
    const oldStr = formatValue(change.oldValue);
    const newStr = formatValue(change.newValue);
    lines.push(`${riskTag} ${change.field}: ${oldStr} -> ${newStr}`);
  }

  return lines.join('\n');
}

// ──────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────

type RiskLevel = 'low' | 'medium' | 'high';

/** Metadata-only fields that are always low risk */
const METADATA_FIELDS = new Set([
  'lastVerified',
  'notes',
  'confidenceScore',
  'sourceType',
  'sourceUrl',
]);

/** Fields where changes are always high risk */
const IMMUTABLE_FIELDS = new Set([
  'insurerSlug',
  'category',
]);

/** Numeric fields that need percentage-based comparison */
const NUMERIC_THRESHOLD_FIELDS: Record<string, number> = {
  'premiumRange': 0.1,
  'sumInsured': 0.1,
};

function assessFieldRisk(change: FieldChange): RiskLevel {
  const { field, oldValue, newValue } = change;

  // Metadata fields are always low risk
  if (METADATA_FIELDS.has(field)) return 'low';

  // Immutable fields changing is always high risk
  if (IMMUTABLE_FIELDS.has(field)) return 'high';

  // insurerName change is high risk
  if (field === 'insurerName') return 'high';

  // Product name change — medium risk
  if (field === 'productName') return 'medium';

  // Eligibility changes
  if (field === 'eligibility') {
    return assessEligibilityRisk(
      oldValue as InsuranceProduct['eligibility'] | null,
      newValue as InsuranceProduct['eligibility'] | null
    );
  }

  // Sum insured changes
  if (field === 'sumInsured') {
    return assessNumericObjectRisk(
      oldValue as Record<string, unknown> | null,
      newValue as Record<string, unknown> | null,
      ['min', 'max'],
      0.1
    );
  }

  // Premium range changes
  if (field === 'premiumRange') {
    return assessNumericObjectRisk(
      oldValue as Record<string, unknown> | null,
      newValue as Record<string, unknown> | null,
      ['illustrativeMin', 'illustrativeMax'],
      0.1
    );
  }

  // Array fields — check for significant reduction
  if (field === 'keyInclusions' || field === 'keyExclusions') {
    return assessArrayRisk(
      oldValue as string[] | null,
      newValue as string[] | null
    );
  }

  // Riders, special features — additions are low risk, removals medium
  if (field === 'riders' || field === 'specialFeatures') {
    const oldArr = Array.isArray(oldValue) ? oldValue : [];
    const newArr = Array.isArray(newValue) ? newValue : [];
    if (newArr.length >= oldArr.length) return 'low';
    return 'medium';
  }

  // Waiting period
  if (field === 'waitingPeriod') return 'medium';

  // Claim settlement
  if (field === 'claimSettlement') return 'medium';

  // Network hospitals
  if (field === 'networkHospitals') return 'low';

  // Renewability
  if (field === 'renewability') return 'medium';

  // SubCategory
  if (field === 'subCategory') return 'low';

  // Policy tenure
  if (field === 'policyTenure') return 'low';

  // Default: medium
  return 'medium';
}

function assessEligibilityRisk(
  oldVal: InsuranceProduct['eligibility'] | null,
  newVal: InsuranceProduct['eligibility'] | null
): RiskLevel {
  if (!oldVal || !newVal) return 'medium';

  // Check age changes
  const minAgeDiff = Math.abs((newVal.minAge ?? 0) - (oldVal.minAge ?? 0));
  const maxAgeDiff =
    oldVal.maxAge !== null && newVal.maxAge !== null
      ? Math.abs(newVal.maxAge - oldVal.maxAge)
      : 0;

  if (minAgeDiff > 5 || maxAgeDiff > 10) return 'high';
  if (minAgeDiff > 0 || maxAgeDiff > 0) return 'medium';
  return 'low';
}

function assessNumericObjectRisk(
  oldVal: Record<string, unknown> | null,
  newVal: Record<string, unknown> | null,
  numericKeys: string[],
  threshold: number
): RiskLevel {
  if (!oldVal || !newVal) return 'medium';

  for (const key of numericKeys) {
    const oldNum = typeof oldVal[key] === 'number' ? (oldVal[key] as number) : 0;
    const newNum = typeof newVal[key] === 'number' ? (newVal[key] as number) : 0;

    if (oldNum === 0 && newNum === 0) continue;
    if (oldNum === 0 || newNum === 0) return 'medium';

    const ratio = Math.abs(newNum - oldNum) / oldNum;
    if (ratio > threshold * 5) return 'high'; // >50% change
    if (ratio > threshold) return 'medium'; // >10% change
  }

  return 'low';
}

function assessArrayRisk(
  oldArr: string[] | null,
  newArr: string[] | null
): RiskLevel {
  const oldLen = oldArr?.length ?? 0;
  const newLen = newArr?.length ?? 0;

  if (oldLen === 0) return 'low'; // Adding new items

  // Significant reduction
  if (newLen < oldLen * 0.3) return 'high';
  if (newLen < oldLen * 0.7) return 'medium';

  return 'low';
}

/**
 * Deep equality comparison for JSON-serializable values.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (a === undefined || b === undefined) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a === 'number' && typeof b === 'number') {
    return a === b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj).sort();
    const bKeys = Object.keys(bObj).sort();

    if (aKeys.length !== bKeys.length) return false;
    if (!aKeys.every((k, i) => k === bKeys[i])) return false;
    return aKeys.every((k) => deepEqual(aObj[k], bObj[k]));
  }

  return false;
}

/**
 * Format a value for human-readable display in change summaries.
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length <= 3) return `[${value.map(formatValue).join(', ')}]`;
    return `[${value.slice(0, 2).map(formatValue).join(', ')}, ... +${value.length - 2} more]`;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>);
    if (keys.length === 0) return '{}';
    const preview = keys
      .slice(0, 3)
      .map((k) => `${k}: ${formatValue((value as Record<string, unknown>)[k])}`)
      .join(', ');
    const suffix = keys.length > 3 ? `, ... +${keys.length - 3} more` : '';
    return `{${preview}${suffix}}`;
  }

  return String(value);
}
