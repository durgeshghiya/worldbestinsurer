/**
 * Registry monitoring for /admin: coverage, job health, source access,
 * recent changes, the review queue, index eligibility and sitemap size.
 * Reads the same modules the public pages use, so it reports what is live.
 */

import fs from "fs";
import path from "path";
import type { ChangeRecord, ReviewItem } from "@/lib/registry";
import {
  formatDate,
  insurerVerdict,
  productVerdict,
  registry,
  siteFacts,
} from "@/lib/registry";
import { getAllInsurers } from "@/lib/data";
import { REGISTRY_DIR } from "@/lib/registry/load";
import { SITEMAP_GROUPS, sitemapGroup } from "@/lib/sitemap";

function readChangelog(): ChangeRecord[] {
  const dir = path.join(REGISTRY_DIR, "changelog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .sort()
    .slice(-2) // the monitor only looks back 30 days
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as ChangeRecord[]);
}

/** Start of the monitor's 30-day look-back window. */
function windowStart(): number {
  return Date.now() - 30 * 86_400_000;
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "warn" | "bad" }) {
  const color = tone === "bad" ? "text-danger" : tone === "warn" ? "text-warning" : "text-text-primary";
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-[11px] text-text-tertiary">{label}</p>
      <p className={`mt-1 text-[22px] font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

export default function RegistryMonitor() {
  const reg = registry();
  const site = siteFacts();
  const review = JSON.parse(fs.readFileSync(path.join(REGISTRY_DIR, "review-queue.json"), "utf-8")) as ReviewItem[];
  const changes = readChangelog();
  const since = windowStart();
  const recent = changes.filter((c) => Date.parse(c.at) >= since);
  const newProducts = new Set(recent.filter((c) => c.kind === "product" && c.from === null).map((c) => c.key));
  const changedProducts = new Set(recent.filter((c) => c.kind === "product" && c.from !== null).map((c) => c.key));
  const duplicates = reg.issues.filter((i) => i.code.startsWith("duplicate"));
  const blockedCrawl = reg.sources.filter((s) => s.accessMethod === "crawl" && s.robots !== "allowed");
  const manual = reg.sources.filter((s) => s.accessMethod === "manual");

  const insurerSlugs = new Set([...getAllInsurers("in").map((i) => i.slug), ...reg.insurers.map((i) => i.slug)]);
  const insurerVerdicts = [...insurerSlugs].map((s) => insurerVerdict(s, reg, site));
  const registryOnlyProducts = reg.products.filter((p) => !p.siteProductId && !site.siteProductExists(p.slug));
  const productVerdicts = registryOnlyProducts.map((p) => ({ p, v: productVerdict(p.slug, reg, site) }));
  const sitemap = SITEMAP_GROUPS.map((g) => ({ g, n: sitemapGroup(g).length }));
  const brokenDocs = reg.documents.filter((d) => d.lastStatus !== undefined && (d.lastStatus < 200 || d.lastStatus >= 400));

  return (
    <section className="mb-10 space-y-6" aria-labelledby="registry-monitor">
      <div>
        <h2 id="registry-monitor" className="text-[18px] font-bold text-text-primary">Public data registry (India)</h2>
        <p className="text-[12.5px] text-text-tertiary">
          From src/data/registry/in · schema v{reg.meta.schemaVersion} · run jobs with <code>npm run registry</code>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <Stat label="Insurers" value={reg.insurers.length} />
        <Stat label="Products" value={reg.products.length} />
        <Stat label="Documents" value={reg.documents.length} />
        <Stat label="Statistics" value={reg.statistics.length} />
        <Stat label="Review queue" value={review.length} tone={review.length ? "warn" : undefined} />
        <Stat label="Duplicates" value={duplicates.length} tone={duplicates.length ? "bad" : undefined} />
        <Stat label="Broken documents" value={brokenDocs.length} tone={brokenDocs.length ? "bad" : undefined} />
        <Stat label="Blocked crawl sources" value={blockedCrawl.length} tone={blockedCrawl.length ? "bad" : undefined} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Last job runs</h3>
          <table className="w-full text-left text-[12.5px]">
            <tbody>
              {Object.entries(reg.meta.lastRun).map(([job, r]) => (
                <tr key={job} className="border-t border-border-light first:border-0">
                  <th scope="row" className="py-1.5 pr-3 font-medium text-text-secondary">{job}</th>
                  <td className="py-1.5 pr-3 tabular-nums text-text-tertiary">{formatDate(r.at.slice(0, 10))}</td>
                  <td className={`py-1.5 pr-3 font-semibold ${r.ok ? "text-success" : "text-danger"}`}>{r.ok ? "ok" : "failed"}</td>
                  <td className="py-1.5 text-text-secondary">{r.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Index eligibility</h3>
          <ul className="space-y-1 text-[12.5px] text-text-secondary">
            <li>India insurer pages: <strong className="text-text-primary">{insurerVerdicts.filter((v) => v.indexable).length}</strong> indexable, {insurerVerdicts.filter((v) => !v.indexable).length} noindex</li>
            <li>Registry-only product pages: <strong className="text-text-primary">{productVerdicts.filter((x) => x.v.indexable).length}</strong> indexable, {productVerdicts.filter((x) => !x.v.indexable).length} noindex</li>
            <li>New products (30 days): {newProducts.size} · changed: {changedProducts.size}</li>
            <li>Manual-only sources: {manual.map((s) => s.name).join(", ") || "none"}</li>
            {blockedCrawl.length > 0 && (
              <li className="text-danger">Crawl sources now blocked: {blockedCrawl.map((s) => `${s.name} (${s.robots})`).join(", ")}</li>
            )}
          </ul>
          <h4 className="mb-1 mt-3 text-[12px] font-semibold text-text-primary">Sitemap URLs</h4>
          <p className="text-[12.5px] text-text-secondary">
            {sitemap.map((x) => `${x.g} ${x.n}`).join(" · ")} · total {sitemap.reduce((a, x) => a + x.n, 0)}
          </p>
        </div>
      </div>

      {productVerdicts.some((x) => !x.v.indexable) && (
        <details className="rounded-xl border border-border bg-surface p-4">
          <summary className="cursor-pointer text-[13px] font-semibold text-text-primary">Why registry product pages are noindex</summary>
          <ul className="mt-2 space-y-1 text-[12.5px] text-text-secondary">
            {productVerdicts.filter((x) => !x.v.indexable).map(({ p, v }) => (
              <li key={p.slug}><code>{p.slug}</code> — {v.reasons.join("; ")}</li>
            ))}
          </ul>
        </details>
      )}

      {review.length > 0 && (
        <details open className="rounded-xl border border-warning/40 bg-warning-light p-4">
          <summary className="cursor-pointer text-[13px] font-semibold text-text-primary">Review queue ({review.length})</summary>
          <ul className="mt-2 space-y-1 text-[12.5px] text-text-secondary">
            {review.map((r) => (
              <li key={r.id}><code>{r.id}</code> ({r.kind}) — {r.reason}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
