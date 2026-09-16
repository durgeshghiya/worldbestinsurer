import { ApiError, handler, slugParam } from "../../_lib/http";
import { productDetail } from "../../_lib/shape";

/** GET /api/v1/registry/products/{slug} */
export const GET = handler<{ slug: string }>(({ reg, site, params }) => {
  const p = reg.productBySlug.get(slugParam(params.slug));
  if (!p) throw new ApiError(404, "product not found");
  return productDetail(p, reg, site);
});
