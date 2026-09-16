import { ApiError, handler, page, slugParam } from "../../../_lib/http";
import { statisticShape } from "../../../_lib/shape";

/** GET /api/v1/registry/insurers/{slug}/statistics?metric=&period= */
export const GET = handler<{ slug: string }>(({ reg, q, params }) => {
  const slug = slugParam(params.slug);
  if (!reg.insurerBySlug.has(slug)) throw new ApiError(404, "insurer not found");
  const metric = q.get("metric");
  const period = q.get("period");
  const rows = (reg.statisticsByInsurer.get(slug) ?? [])
    .filter((s) => !metric || s.metric === metric)
    .filter((s) => !period || s.reportingPeriod === period)
    .slice()
    .sort((a, b) => b.reportingPeriod.localeCompare(a.reportingPeriod) || a.metric.localeCompare(b.metric))
    .map(statisticShape);
  return page(rows, q);
});
