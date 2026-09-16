import { ApiError, handler, slugParam } from "../../_lib/http";
import { insurerDetail } from "../../_lib/shape";

/** GET /api/v1/registry/insurers/{slug} */
export const GET = handler<{ slug: string }>(({ reg, site, params }) => {
  const ins = reg.insurerBySlug.get(slugParam(params.slug));
  if (!ins) throw new ApiError(404, "insurer not found");
  return insurerDetail(ins, reg, site);
});
