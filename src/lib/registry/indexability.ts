/**
 * Indexability — the single decision behind both the robots meta tag and
 * sitemap membership. Because both read this module, a URL cannot be in a
 * sitemap while carrying noindex.
 *
 * Every verdict carries its reasons, so the SEO audit and the admin page can
 * say exactly why a page is or is not offered to search.
 *
 * Plan §13.
 */

import type { LoadedRegistry } from "./load";
import { classifyUin } from "./validate";

export interface Verdict {
  indexable: boolean;
  reasons: string[];
}

/** Facts about the pre-registry site data, injected so this module stays pure. */
export interface SiteFacts {
  /** insurer slug → number of existing site products */
  siteProductCount: (insurerSlug: string) => number;
  siteInsurerExists: (slug: string) => boolean;
  siteProductExists: (id: string) => boolean;
}

export const THRESHOLDS = {
  productDirectoryMinProducts: 10,
  statisticsHubMin: 5,
  statisticsPeriodMin: 5,
  comparisonSharedStatsMin: 3,
  registryProductOptionalFieldsMin: 2,
  registryInsurerDocumentsMin: 2,
} as const;

export function insurerVerdict(slug: string, reg: LoadedRegistry, site: SiteFacts): Verdict {
  const ri = reg.insurerBySlug.get(slug);
  const siteExists = site.siteInsurerExists(slug);
  const siteProducts = site.siteProductCount(slug);
  const regProducts = reg.productsByInsurer.get(slug)?.length ?? 0;
  const stats = reg.statisticsByInsurer.get(slug)?.length ?? 0;
  const docs = reg.documentsByInsurer.get(slug)?.length ?? 0;

  if (!siteExists && !ri) return { indexable: false, reasons: ["unknown insurer"] };

  const reasons: string[] = [];
  if (siteProducts + regProducts > 0) reasons.push(`${siteProducts + regProducts} listed product(s)`);
  if (stats > 0) reasons.push(`${stats} sourced statistic(s)`);
  if (ri?.irdaiRegistrationNumber && docs >= THRESHOLDS.registryInsurerDocumentsMin)
    reasons.push(`IRDAI registration and ${docs} official document(s)`);

  if (reasons.length === 0) {
    return {
      indexable: false,
      reasons: ["no products, statistics or documented registration — nothing to rank for"],
    };
  }
  // A registry-only insurer must at least carry sourced identity.
  if (!siteExists && ri && (!ri.name || !ri.website)) {
    return { indexable: false, reasons: ["registry record lacks a sourced name or website"] };
  }
  return { indexable: true, reasons };
}

export function productVerdict(id: string, reg: LoadedRegistry, site: SiteFacts): Verdict {
  if (site.siteProductExists(id)) {
    // Existing products survived two integrity audits; their status is unchanged.
    return { indexable: true, reasons: ["existing audited product"] };
  }
  const rp = reg.productBySlug.get(id);
  if (!rp) return { indexable: false, reasons: ["unknown product"] };

  const missing: string[] = [];
  if (!rp.uin) missing.push("UIN");
  else if (classifyUin(rp.uin.value).format === "unknown") missing.push("a UIN in a recognised format");
  const docs = reg.documentsByProduct.get(id)?.length ?? 0;
  if (docs < 1) missing.push("an official document");
  const optional = [rp.policyTerm, rp.eligibility, rp.premiumFrequency, rp.sumInsured].filter(Boolean).length;
  if (optional < THRESHOLDS.registryProductOptionalFieldsMin)
    missing.push(`at least ${THRESHOLDS.registryProductOptionalFieldsMin} of term / eligibility / premium frequency / sum insured (has ${optional})`);

  if (missing.length) return { indexable: false, reasons: missing.map((m) => `missing ${m}`) };
  return {
    indexable: true,
    reasons: [`UIN ${rp.uin!.value}`, `${docs} official document(s)`, `${optional} sourced product facts`],
  };
}

export function productDirectoryVerdict(reg: LoadedRegistry): Verdict {
  const n = reg.products.filter((p) => p.uin).length;
  return n >= THRESHOLDS.productDirectoryMinProducts
    ? { indexable: true, reasons: [`${n} products with a UIN`] }
    : { indexable: false, reasons: [`only ${n} products with a UIN (needs ${THRESHOLDS.productDirectoryMinProducts})`] };
}

export function statisticsHubVerdict(reg: LoadedRegistry): Verdict {
  const n = reg.statistics.length;
  return n >= THRESHOLDS.statisticsHubMin
    ? { indexable: true, reasons: [`${n} sourced statistics`] }
    : { indexable: false, reasons: [`only ${n} sourced statistics (needs ${THRESHOLDS.statisticsHubMin})`] };
}

export function statisticsPeriodVerdict(period: string, reg: LoadedRegistry): Verdict {
  const n = reg.statistics.filter((s) => s.reportingPeriod === period).length;
  return n >= THRESHOLDS.statisticsPeriodMin
    ? { indexable: true, reasons: [`${n} statistics for ${period}`] }
    : { indexable: false, reasons: [`only ${n} statistics for ${period} (needs ${THRESHOLDS.statisticsPeriodMin})`] };
}

/** Two insurers are worth comparing only on shared, same-period sourced figures. */
export function comparisonVerdict(a: string, b: string, reg: LoadedRegistry): Verdict {
  const key = (s: { metric: string; reportingPeriod: string }) => `${s.metric}|${s.reportingPeriod}`;
  const as = new Set((reg.statisticsByInsurer.get(a) ?? []).map(key));
  const shared = (reg.statisticsByInsurer.get(b) ?? []).filter((s) => as.has(key(s))).length;
  return shared >= THRESHOLDS.comparisonSharedStatsMin
    ? { indexable: true, reasons: [`${shared} comparable statistics`] }
    : { indexable: false, reasons: [`only ${shared} comparable statistics (needs ${THRESHOLDS.comparisonSharedStatsMin})`] };
}

/** Next.js `robots` metadata fragment for a verdict. */
export function robotsFor(v: Verdict): { robots?: { index: false; follow: true } } {
  return v.indexable ? {} : { robots: { index: false, follow: true } };
}
