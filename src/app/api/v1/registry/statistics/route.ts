import { handler, oneOf, page } from "../_lib/http";
import { statisticShape } from "../_lib/shape";

/** GET /api/v1/registry/statistics?scope=&insurer=&metric=&period=&page=&pageSize= */
export const GET = handler(({ reg, q }) => {
  const scope = oneOf(q, "scope", ["insurer", "segment", "market"] as const);
  const insurer = q.get("insurer");
  const metric = q.get("metric");
  const period = q.get("period");
  const rows = reg.statistics
    .filter((s) => !scope || s.scope === scope)
    .filter((s) => !insurer || s.insurerSlug === insurer)
    .filter((s) => !metric || s.metric === metric)
    .filter((s) => !period || s.reportingPeriod === period)
    .slice()
    .sort((a, b) => b.reportingPeriod.localeCompare(a.reportingPeriod) || a.metric.localeCompare(b.metric))
    .map(statisticShape);
  return page(rows, q);
});
