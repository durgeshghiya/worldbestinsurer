import { handler, oneOf, page } from "../_lib/http";
import { productSummary } from "../_lib/shape";
import { normalizeName, type InsuranceSegment, type ProductType } from "@/lib/registry";

const SEGMENTS = ["life", "health", "motor", "travel", "home", "commercial", "personal-accident", "crop", "other"] as const satisfies readonly InsuranceSegment[];
const TYPES = [
  "term", "endowment", "whole-life", "money-back", "ulip", "pension", "savings", "health-indemnity",
  "health-fixed-benefit", "critical-illness", "personal-accident", "motor-private-car", "motor-two-wheeler",
  "motor-commercial", "travel", "home", "commercial", "other",
] as const satisfies readonly ProductType[];

/** GET /api/v1/registry/products?insurer=&type=&segment=&uin=&q=&page=&pageSize= */
export const GET = handler(({ reg, site, q }) => {
  const insurer = q.get("insurer");
  const type = oneOf(q, "type", TYPES);
  const segment = oneOf(q, "segment", SEGMENTS);
  const uin = q.get("uin")?.trim().toUpperCase();
  const needle = q.get("q") ? normalizeName(q.get("q")!) : "";
  const rows = reg.products
    .filter((p) => !insurer || p.insurerSlug === insurer)
    .filter((p) => !type || p.productType === type)
    .filter((p) => !segment || p.segment === segment)
    .filter((p) => !uin || p.uin?.value === uin)
    .filter((p) => !needle || normalizeName(p.name.value).includes(needle))
    .sort((a, b) => a.name.value.localeCompare(b.name.value))
    .map((p) => productSummary(p, reg, site));
  return page(rows, q);
});
