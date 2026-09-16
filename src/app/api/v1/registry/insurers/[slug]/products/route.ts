import { ApiError, handler, page, slugParam } from "../../../_lib/http";
import { productSummary } from "../../../_lib/shape";

/** GET /api/v1/registry/insurers/{slug}/products */
export const GET = handler<{ slug: string }>(({ reg, site, q, params }) => {
  const slug = slugParam(params.slug);
  if (!reg.insurerBySlug.has(slug)) throw new ApiError(404, "insurer not found");
  const rows = (reg.productsByInsurer.get(slug) ?? [])
    .slice()
    .sort((a, b) => a.name.value.localeCompare(b.name.value))
    .map((p) => productSummary(p, reg, site));
  return page(rows, q);
});
