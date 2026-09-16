import { ApiError, handler } from "../_lib/http";
import { insurerSummary, productSummary } from "../_lib/shape";
import { normalizeName } from "@/lib/registry";

/** GET /api/v1/registry/search?q= — insurers by name, products by name or UIN. */
export const GET = handler(({ reg, site, q }) => {
  const raw = q.get("q")?.trim() ?? "";
  if (raw.length < 2) throw new ApiError(400, "q must be at least 2 characters");
  if (raw.length > 100) throw new ApiError(400, "q must be at most 100 characters");
  const needle = normalizeName(raw);
  const upper = raw.toUpperCase();
  const insurers = reg.insurers
    .filter((i) => normalizeName(i.name.value).includes(needle) || i.irdaiRegistrationNumber?.value === raw)
    .slice(0, 20)
    .map((i) => insurerSummary(i, reg, site));
  const products = reg.products
    .filter((p) => p.uin?.value === upper || (needle && normalizeName(p.name.value).includes(needle)))
    .slice(0, 20)
    .map((p) => productSummary(p, reg, site));
  return { query: raw, insurers, products };
});
