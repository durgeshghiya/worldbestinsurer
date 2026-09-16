/**
 * Internal linking, computed from the data so no link is hand-maintained.
 *
 *   insurer ⇄ its products ⇄ their category hub
 *   insurer → insurers of the same type
 *   insurer → its statistics → the statistics page for that period
 *   product → the insurer's other products, and same-category products
 *
 * Only indexable targets are returned: linking to a noindex page wastes
 * the link and invites crawl of thin pages. Plan §12.
 */

import type { LoadedRegistry } from "./load";
import {
  insurerVerdict,
  productVerdict,
  statisticsPeriodVerdict,
  type SiteFacts,
} from "./indexability";
import { siteCategoryFor } from "./format";
import type { Category } from "../types";

export interface LinkTarget {
  href: string;
  label: string;
  sublabel?: string;
}

const insurerHref = (slug: string) => `/in/insurer/${slug}/`;
const productHref = (id: string) => `/in/product/${id}/`;

export function relatedInsurers(
  slug: string,
  reg: LoadedRegistry,
  site: SiteFacts,
  limit = 6
): LinkTarget[] {
  const me = reg.insurerBySlug.get(slug);
  if (!me) return [];
  return reg.insurers
    .filter((i) => i.slug !== slug && i.insurerType.value === me.insurerType.value)
    .filter((i) => insurerVerdict(i.slug, reg, site).indexable)
    .map((i) => ({
      i,
      weight: (reg.productsByInsurer.get(i.slug)?.length ?? 0) + site.siteProductCount(i.slug),
    }))
    .sort((a, b) => b.weight - a.weight || a.i.slug.localeCompare(b.i.slug))
    .slice(0, limit)
    .map(({ i }) => ({ href: insurerHref(i.slug), label: i.name.value }));
}

export function registryProductLinks(insurerSlug: string, reg: LoadedRegistry, site: SiteFacts): LinkTarget[] {
  return (reg.productsByInsurer.get(insurerSlug) ?? [])
    .map((p) => ({ p, id: p.siteProductId ?? p.slug }))
    .filter(({ id }) => productVerdict(id, reg, site).indexable)
    .map(({ p, id }) => ({
      href: productHref(id),
      label: p.name.value,
      sublabel: p.uin ? `UIN ${p.uin.value}` : undefined,
    }));
}

export function relatedProducts(
  productSlug: string,
  reg: LoadedRegistry,
  site: SiteFacts,
  limit = 6
): LinkTarget[] {
  const me = reg.productBySlug.get(productSlug);
  if (!me) return [];
  const sameInsurer = (reg.productsByInsurer.get(me.insurerSlug) ?? []).filter((p) => p.slug !== me.slug);
  const sameType = reg.products.filter(
    (p) => p.slug !== me.slug && p.insurerSlug !== me.insurerSlug && p.productType === me.productType
  );
  return [...sameInsurer, ...sameType]
    .map((p) => ({ p, id: p.siteProductId ?? p.slug }))
    .filter(({ id }) => productVerdict(id, reg, site).indexable)
    .slice(0, limit)
    .map(({ p, id }) => ({
      href: productHref(id),
      label: p.name.value,
      sublabel: reg.insurerBySlug.get(p.insurerSlug)?.name.value,
    }));
}

/** The comparison hubs an insurer's registry products point to. */
export function categoryHubsForInsurer(insurerSlug: string, reg: LoadedRegistry): Category[] {
  const cats = new Set<Category>();
  for (const p of reg.productsByInsurer.get(insurerSlug) ?? []) {
    const c = siteCategoryFor(p.productType);
    if (c) cats.add(c);
  }
  return [...cats];
}

export function statisticsPeriodLinks(insurerSlug: string, reg: LoadedRegistry): LinkTarget[] {
  const periods = new Set((reg.statisticsByInsurer.get(insurerSlug) ?? []).map((s) => s.reportingPeriod));
  return [...periods]
    .filter((p) => statisticsPeriodVerdict(p, reg).indexable)
    .sort()
    .reverse()
    .map((p) => ({ href: `/in/insurance-statistics/${periodSlug(p)}/`, label: `Insurance statistics, ${p}` }));
}

/** "FY2025-26" → "fy2025-26" for URLs. */
export function periodSlug(period: string): string {
  return period.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}
