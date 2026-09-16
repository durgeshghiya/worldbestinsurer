/**
 * Public entry point for pages and API routes.
 *
 *   import { registry, siteFacts, insurerVerdict } from "@/lib/registry";
 */

import { getAllInsurers, getAllProducts, getProductsByInsurer } from "../data";
import { loadRegistry, type LoadedRegistry } from "./load";
import type { SiteFacts } from "./indexability";

export * from "./types";
export * from "./indexability";
export * from "./linking";
export * from "./format";
export { insurerView, productView } from "./views";
export { classifyUin, normalizeName } from "./validate";
export type { LoadedRegistry } from "./load";

/** The loaded, validated registry. */
export function registry(): LoadedRegistry {
  return loadRegistry();
}

let facts: SiteFacts | null = null;

/** Facts about the existing (pre-registry) India site data. */
export function siteFacts(): SiteFacts {
  if (facts) return facts;
  const insurers = new Set(getAllInsurers("in").map((i) => i.slug));
  const products = new Set(getAllProducts("in").map((p) => p.id));
  const counts = new Map<string, number>();
  facts = {
    siteInsurerExists: (slug) => insurers.has(slug),
    siteProductExists: (id) => products.has(id),
    siteProductCount: (slug) => {
      let n = counts.get(slug);
      if (n === undefined) {
        n = getProductsByInsurer(slug, "in").length;
        counts.set(slug, n);
      }
      return n;
    },
  };
  return facts;
}
