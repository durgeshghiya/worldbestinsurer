import { handler, oneOf, page } from "../_lib/http";
import { insurerSummary } from "../_lib/shape";
import { normalizeName, type InsuranceSegment, type InsurerType } from "@/lib/registry";

const TYPES = ["life", "general", "standalone-health", "reinsurer", "specialised"] as const satisfies readonly InsurerType[];
const SEGMENTS = ["life", "health", "motor", "travel", "home", "commercial", "personal-accident", "crop", "other"] as const satisfies readonly InsuranceSegment[];

/** GET /api/v1/registry/insurers?type=&segment=&q=&page=&pageSize= */
export const GET = handler(({ reg, site, q }) => {
  const type = oneOf(q, "type", TYPES);
  const segment = oneOf(q, "segment", SEGMENTS);
  const text = q.get("q")?.trim();
  const needle = text ? normalizeName(text) : "";
  const rows = reg.insurers
    .filter((i) => !type || i.insurerType.value === type)
    .filter((i) => !segment || i.segments.includes(segment))
    .filter((i) => !needle || normalizeName(i.name.value).includes(needle) || i.slug.includes(needle))
    .sort((a, b) => a.name.value.localeCompare(b.name.value))
    .map((i) => insurerSummary(i, reg, site));
  return page(rows, q);
});
