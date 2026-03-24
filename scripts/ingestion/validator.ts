import type { InsuranceProduct, Category } from '../../src/lib/types';

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

const VALID_CATEGORIES: Category[] = ['health', 'term-life', 'motor', 'travel'];

/**
 * Validate a Partial<InsuranceProduct> against the schema.
 * Returns errors (must-fix) and warnings (should-fix).
 */
export function validateProduct(
  product: Partial<InsuranceProduct>
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // ── Required fields ──
  if (!product.id || product.id.trim().length === 0) {
    errors.push({ field: 'id', message: 'Product ID is required' });
  } else if (!/^[a-z0-9-]+$/.test(product.id)) {
    errors.push({
      field: 'id',
      message: 'Product ID must be lowercase alphanumeric with hyphens only',
    });
  }

  if (!product.insurerName || product.insurerName.trim().length === 0) {
    errors.push({ field: 'insurerName', message: 'Insurer name is required' });
  }

  if (!product.insurerSlug || product.insurerSlug.trim().length === 0) {
    errors.push({ field: 'insurerSlug', message: 'Insurer slug is required' });
  } else if (!/^[a-z0-9-]+$/.test(product.insurerSlug)) {
    errors.push({
      field: 'insurerSlug',
      message: 'Insurer slug must be lowercase alphanumeric with hyphens only',
    });
  }

  if (!product.productName || product.productName.trim().length === 0) {
    errors.push({ field: 'productName', message: 'Product name is required' });
  }

  if (!product.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!VALID_CATEGORIES.includes(product.category)) {
    errors.push({
      field: 'category',
      message: `Invalid category "${product.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  if (!product.sourceUrl || product.sourceUrl.trim().length === 0) {
    errors.push({ field: 'sourceUrl', message: 'Source URL is required' });
  } else {
    try {
      new URL(product.sourceUrl);
    } catch {
      errors.push({ field: 'sourceUrl', message: 'Source URL must be a valid URL' });
    }
  }

  // ── Eligibility ──
  if (product.eligibility) {
    const { minAge, maxAge } = product.eligibility;
    if (typeof minAge !== 'number' || minAge < 0 || minAge > 100) {
      errors.push({
        field: 'eligibility.minAge',
        message: 'Minimum age must be a number between 0 and 100',
      });
    }
    if (maxAge !== null && maxAge !== undefined) {
      if (typeof maxAge !== 'number' || maxAge < 0 || maxAge > 150) {
        errors.push({
          field: 'eligibility.maxAge',
          message: 'Maximum age must be a number between 0 and 150, or null',
        });
      }
      if (typeof minAge === 'number' && typeof maxAge === 'number' && minAge > maxAge) {
        errors.push({
          field: 'eligibility',
          message: 'Minimum age cannot exceed maximum age',
        });
      }
    }
  } else {
    warnings.push({
      field: 'eligibility',
      message: 'Eligibility information is missing',
    });
  }

  // ── Sum Insured ──
  if (product.sumInsured) {
    const { min, max } = product.sumInsured;
    if (min !== null && min !== undefined && (typeof min !== 'number' || min < 0)) {
      errors.push({
        field: 'sumInsured.min',
        message: 'Sum insured minimum must be a non-negative number or null',
      });
    }
    if (max !== null && max !== undefined && (typeof max !== 'number' || max < 0)) {
      errors.push({
        field: 'sumInsured.max',
        message: 'Sum insured maximum must be a non-negative number or null',
      });
    }
    if (
      typeof min === 'number' &&
      typeof max === 'number' &&
      min > max
    ) {
      errors.push({
        field: 'sumInsured',
        message: 'Sum insured min cannot exceed max',
      });
    }
    if (product.sumInsured.options) {
      for (let i = 0; i < product.sumInsured.options.length; i++) {
        const opt = product.sumInsured.options[i];
        if (typeof opt !== 'number' || opt <= 0) {
          warnings.push({
            field: `sumInsured.options[${i}]`,
            message: `Option value should be a positive number, got ${opt}`,
          });
        }
      }
    }
    if (min === null && max === null && (!product.sumInsured.options || product.sumInsured.options.length === 0)) {
      warnings.push({
        field: 'sumInsured',
        message: 'No sum insured values specified (min, max, or options)',
      });
    }
  } else {
    warnings.push({
      field: 'sumInsured',
      message: 'Sum insured information is missing',
    });
  }

  // ── Premium Range ──
  if (product.premiumRange) {
    const { illustrativeMin, illustrativeMax } = product.premiumRange;
    if (typeof illustrativeMin !== 'number' || illustrativeMin < 0) {
      errors.push({
        field: 'premiumRange.illustrativeMin',
        message: 'Illustrative minimum premium must be a non-negative number',
      });
    }
    if (typeof illustrativeMax !== 'number' || illustrativeMax < 0) {
      errors.push({
        field: 'premiumRange.illustrativeMax',
        message: 'Illustrative maximum premium must be a non-negative number',
      });
    }
    if (
      typeof illustrativeMin === 'number' &&
      typeof illustrativeMax === 'number' &&
      illustrativeMin > illustrativeMax &&
      illustrativeMax > 0
    ) {
      warnings.push({
        field: 'premiumRange',
        message: 'Illustrative min premium exceeds max — verify values',
      });
    }
    if (illustrativeMin === 0 && illustrativeMax === 0) {
      warnings.push({
        field: 'premiumRange',
        message: 'Premium range is zero — likely not extracted',
      });
    }
  } else {
    warnings.push({
      field: 'premiumRange',
      message: 'Premium range is missing',
    });
  }

  // ── Key Inclusions / Exclusions ──
  if (!product.keyInclusions || product.keyInclusions.length === 0) {
    warnings.push({
      field: 'keyInclusions',
      message: 'No key inclusions listed',
    });
  }
  if (!product.keyExclusions || product.keyExclusions.length === 0) {
    warnings.push({
      field: 'keyExclusions',
      message: 'No key exclusions listed',
    });
  }

  // ── Claim Settlement ──
  if (product.claimSettlement) {
    const { ratio } = product.claimSettlement;
    if (ratio !== null && ratio !== undefined) {
      if (typeof ratio !== 'number' || ratio < 0 || ratio > 100) {
        errors.push({
          field: 'claimSettlement.ratio',
          message: 'Claim settlement ratio must be between 0 and 100',
        });
      }
    }
  }

  // ── Network Hospitals ──
  if (product.networkHospitals) {
    if (typeof product.networkHospitals.count !== 'number' || product.networkHospitals.count < 0) {
      errors.push({
        field: 'networkHospitals.count',
        message: 'Network hospital count must be a non-negative number',
      });
    }
  }

  // ── Policy Tenure ──
  if (product.policyTenure) {
    const { min, max } = product.policyTenure;
    if (min !== null && min !== undefined && (typeof min !== 'number' || min < 0)) {
      warnings.push({
        field: 'policyTenure.min',
        message: 'Policy tenure minimum should be a non-negative number',
      });
    }
    if (max !== null && max !== undefined && (typeof max !== 'number' || max < 0)) {
      warnings.push({
        field: 'policyTenure.max',
        message: 'Policy tenure maximum should be a non-negative number',
      });
    }
  }

  // ── Confidence Score ──
  if (product.confidenceScore) {
    if (!['high', 'medium', 'low'].includes(product.confidenceScore)) {
      errors.push({
        field: 'confidenceScore',
        message: `Invalid confidence score "${product.confidenceScore}". Must be high, medium, or low.`,
      });
    }
  }

  // ── Last Verified ──
  if (product.lastVerified) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(product.lastVerified)) {
      warnings.push({
        field: 'lastVerified',
        message: 'lastVerified should be in YYYY-MM-DD format',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a new product against an existing product to check for
 * suspicious changes (e.g. drastic price changes, missing fields that
 * were previously present, insurer name change).
 */
export function validateAgainstExisting(
  newProduct: Partial<InsuranceProduct>,
  existing: InsuranceProduct
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // Insurer mismatch
  if (
    newProduct.insurerSlug &&
    newProduct.insurerSlug !== existing.insurerSlug
  ) {
    errors.push({
      field: 'insurerSlug',
      message: `Insurer slug changed from "${existing.insurerSlug}" to "${newProduct.insurerSlug}" — likely a data error`,
    });
  }

  // Category mismatch
  if (newProduct.category && newProduct.category !== existing.category) {
    errors.push({
      field: 'category',
      message: `Category changed from "${existing.category}" to "${newProduct.category}" — likely a data error`,
    });
  }

  // Sum insured drastic change (>5x increase or >80% decrease)
  if (newProduct.sumInsured && existing.sumInsured) {
    const oldMax = existing.sumInsured.max;
    const newMax = newProduct.sumInsured.max;
    if (oldMax && newMax && oldMax > 0 && newMax > 0) {
      const ratio = newMax / oldMax;
      if (ratio > 5) {
        warnings.push({
          field: 'sumInsured.max',
          message: `Sum insured max increased by ${ratio.toFixed(1)}x (${oldMax} → ${newMax}) — verify this is correct`,
        });
      }
      if (ratio < 0.2) {
        warnings.push({
          field: 'sumInsured.max',
          message: `Sum insured max decreased by ${((1 - ratio) * 100).toFixed(0)}% (${oldMax} → ${newMax}) — verify this is correct`,
        });
      }
    }
  }

  // Premium drastic change
  if (newProduct.premiumRange && existing.premiumRange) {
    const oldMin = existing.premiumRange.illustrativeMin;
    const newMin = newProduct.premiumRange.illustrativeMin;
    if (oldMin > 0 && newMin > 0) {
      const ratio = newMin / oldMin;
      if (ratio > 3) {
        warnings.push({
          field: 'premiumRange.illustrativeMin',
          message: `Premium min increased by ${ratio.toFixed(1)}x — verify`,
        });
      }
      if (ratio < 0.33) {
        warnings.push({
          field: 'premiumRange.illustrativeMin',
          message: `Premium min decreased by ${((1 - ratio) * 100).toFixed(0)}% — verify`,
        });
      }
    }
  }

  // Eligibility age range narrowing
  if (newProduct.eligibility && existing.eligibility) {
    const oldMin = existing.eligibility.minAge;
    const newMin = newProduct.eligibility.minAge;
    const oldMax = existing.eligibility.maxAge;
    const newMax = newProduct.eligibility.maxAge;

    if (newMin > oldMin + 5) {
      warnings.push({
        field: 'eligibility.minAge',
        message: `Min age increased significantly (${oldMin} → ${newMin})`,
      });
    }
    if (oldMax !== null && newMax !== null && newMax < oldMax - 10) {
      warnings.push({
        field: 'eligibility.maxAge',
        message: `Max age decreased significantly (${oldMax} → ${newMax})`,
      });
    }
  }

  // Key inclusions — if old had many and new has very few, warn
  if (
    existing.keyInclusions.length > 3 &&
    newProduct.keyInclusions &&
    newProduct.keyInclusions.length < existing.keyInclusions.length * 0.3
  ) {
    warnings.push({
      field: 'keyInclusions',
      message: `Key inclusions dropped from ${existing.keyInclusions.length} to ${newProduct.keyInclusions.length} — possible extraction issue`,
    });
  }

  // Fields that were present but are now missing
  const criticalFields: (keyof InsuranceProduct)[] = [
    'productName',
    'eligibility',
    'sumInsured',
    'premiumRange',
  ];

  for (const field of criticalFields) {
    if (
      existing[field] !== null &&
      existing[field] !== undefined &&
      (newProduct[field] === null || newProduct[field] === undefined)
    ) {
      warnings.push({
        field,
        message: `Field "${field}" was present in existing data but is missing in new data`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
