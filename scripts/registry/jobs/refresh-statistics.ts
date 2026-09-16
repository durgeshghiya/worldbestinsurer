/**
 * Monthly: pull official statistics from the data.gov.in API.
 *
 * data.gov.in refuses crawlers on its website; its API is the sanctioned
 * programmatic route and needs a free key (DATA_GOV_IN_API_KEY). Without a
 * key this job does nothing and says so.
 *
 * Which datasets to read is configured, not guessed, in
 * scripts/registry/sources/data-gov-in.config.json. Each entry names a
 * resource id taken from its data.gov.in catalogue page and says how a row
 * maps to a statistic. The shipped config is empty on purpose: resource ids
 * must be copied from the catalogue by a person, never inferred.
 *
 * API rows become statistic candidates whose evidence is the row itself, and
 * go through the same verification as everything else. The API key is never
 * written to provenance.
 */

import fs from "fs";
import path from "path";
import { JobLog } from "../lib/log";
import { RegistryStore } from "../lib/store";
import { extractPlain } from "../lib/text";
import { verifyFact } from "../validators/evidence";
import { toStatistic } from "../normalizers";
import { validateStatistic } from "../../../src/lib/registry/validate";
import type { StatisticCandidate } from "../sources/candidate";
import type { InsuranceSegment, StatisticScope } from "../../../src/lib/registry/types";

interface ResourceConfig {
  /** From the dataset's data.gov.in catalogue page. */
  resourceId: string;
  /** Public page for provenance, e.g. https://www.data.gov.in/resource/... */
  catalogueUrl: string;
  /** The date the dataset was published or last updated, per its catalogue page. */
  sourceDate: string;
  metric: string;
  label: string;
  unit: string;
  scope: StatisticScope;
  /** Row field holding the numeric value. */
  valueField: string;
  /** Row field holding the reporting period, or a fixed period. */
  periodField?: string;
  fixedPeriod?: string;
  /** Row field holding an insurer name, and how names map to registry slugs. */
  insurerField?: string;
  insurerSlugs?: Record<string, string>;
  segment?: InsuranceSegment;
}

const CONFIG = path.join(process.cwd(), "scripts/registry/sources/data-gov-in.config.json");

export async function runRefreshStatistics(): Promise<void> {
  const log = new JobLog("refresh-statistics");
  const store = new RegistryStore("refresh-statistics");
  const key = process.env.DATA_GOV_IN_API_KEY;
  const resources: ResourceConfig[] = fs.existsSync(CONFIG) ? JSON.parse(fs.readFileSync(CONFIG, "utf-8")) : [];

  if (!key) {
    log.warn("skipped", { reason: "DATA_GOV_IN_API_KEY is not set — register at data.gov.in to enable" });
    store.setRun("skipped: no API key", true);
    store.commit();
    return;
  }
  if (!resources.length) {
    log.warn("skipped", { reason: "no resources configured in data-gov-in.config.json" });
    store.setRun("skipped: no resources configured", true);
    store.commit();
    return;
  }

  const ids = new Set(store.sources.map((s) => s.id));
  let added = 0;
  let held = 0;

  for (const r of resources) {
    const api = `https://api.data.gov.in/resource/${encodeURIComponent(r.resourceId)}?format=json&limit=1000&api-key=${encodeURIComponent(key)}`;
    let rows: Record<string, unknown>[];
    try {
      const res = await fetch(api, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { records?: Record<string, unknown>[] };
      rows = body.records ?? [];
    } catch (e) {
      // Log the resource, never the URL (it contains the key).
      log.error("api-failed", { resource: r.resourceId, error: String(e) });
      continue;
    }
    const retrievedAt = new Date().toISOString();

    for (const row of rows) {
      const raw = row[r.valueField];
      const value = typeof raw === "number" ? raw : Number(String(raw ?? "").replace(/,/g, ""));
      const period = r.fixedPeriod ?? String(row[r.periodField ?? ""] ?? "");
      const insurerName = r.insurerField ? String(row[r.insurerField] ?? "") : "";
      const insurerSlug = insurerName ? r.insurerSlugs?.[insurerName] : undefined;
      if (!Number.isFinite(value) || !period || (r.scope === "insurer" && !insurerSlug)) {
        log.warn("row-skipped", { resource: r.resourceId, reason: "unmapped value, period or insurer", insurerName });
        continue;
      }
      const evidence = JSON.stringify(row).slice(0, 400);
      const cand: StatisticCandidate = {
        id: `data-gov-in:${r.resourceId}:${insurerSlug ?? r.segment ?? "market"}:${period}:${r.metric}`,
        kind: "statistic",
        sourceId: "data-gov-in",
        url: r.catalogueUrl,
        sourceDate: r.sourceDate,
        reportingPeriod: period,
        subject: { scope: r.scope, insurerSlug, segment: r.segment },
        meta: { metric: r.metric, label: r.label, unit: r.unit },
        facts: { value: { value, evidence }, period: { value: period, evidence } },
      };
      const page = extractPlain(JSON.stringify(row));
      const ctx = { pageUrl: r.catalogueUrl, sourceHomepage: "https://data.gov.in/" };
      const pv = r.fixedPeriod ? { ok: true as const } : verifyFact("period", cand.facts.period, page, ctx);
      const v = pv.ok ? verifyFact("value", cand.facts.value, page, ctx) : pv;
      if (!v.ok) {
        held++;
        store.enqueueReview({ id: cand.id, kind: "statistic", reason: `verification failed: ${v.reason}`, candidate: cand });
        continue;
      }
      const rec = toStatistic(cand, {
        value: {
          value,
          provenance: { sourceId: "data-gov-in", url: r.catalogueUrl, retrievedAt, sourceDate: r.sourceDate, reportingPeriod: period, evidence, license: "Government Open Data License – India (GODL)" },
        },
      }, retrievedAt);
      const issues = validateStatistic(rec, ids);
      if (issues.length) {
        held++;
        store.enqueueReview({ id: cand.id, kind: "statistic", reason: issues.map((i) => i.message).join(" | "), candidate: cand });
        continue;
      }
      if (store.appendStatistic(rec) === "added") added++;
    }
  }
  store.setRun(`${added} statistics added, ${held} held for review`, true);
  store.commit();
  log.info("done", { added, held });
}
