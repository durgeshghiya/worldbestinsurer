/**
 * Server components for registry data. They reuse the site's card and table
 * styles so registry pages look native, and they make provenance visible:
 * every fact row links to where it came from.
 *
 * Wording rule: OFFICIAL DATA (what a source says) is shown as a table with a
 * source column. WORLDBESTINSURER ANALYSIS is labelled as such. Nothing here
 * speaks for an insurer or a regulator.
 */

import Link from "next/link";
import { ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import type {
  LinkTarget,
  Provenance,
  RegistryDocument,
  RegistryStatistic,
  Source,
  Sourced,
} from "@/lib/registry";
import {
  NOT_AVAILABLE,
  formatDate,
  formatPeriod,
  formatStatValue,
} from "@/lib/registry";

const DOC_LABEL: Record<RegistryDocument["kind"], string> = {
  "policy-wording": "Policy wording",
  prospectus: "Prospectus",
  brochure: "Brochure",
  "customer-information-sheet": "Customer information sheet",
  "product-information": "Product information",
  "proposal-form": "Proposal form",
  "claim-form": "Claim form",
  "public-disclosure": "Public disclosure",
  "annual-report": "Annual report",
};

export function SourceLink({ p, sources }: { p: Provenance; sources: Map<string, Source> }) {
  const src = sources.get(p.sourceId);
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center gap-1 text-primary hover:underline"
      title={p.evidence ? `Quoted: “${p.evidence}”` : undefined}
    >
      {src?.name ?? p.sourceId}
      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
    </a>
  );
}

export interface FactRow {
  label: string;
  fact?: Sourced<string>;
  /** Render a value differently from its raw form (e.g. a link). */
  display?: React.ReactNode;
}

/** Official data: label, value (or "not available"), source, retrieved. */
export function FactTable({
  caption,
  rows,
  sources,
}: {
  caption: string;
  rows: FactRow[];
  sources: Map<string, Source>;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[560px] text-left text-[13.5px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-surface-sunken/60 text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            <th scope="col" className="px-4 py-2.5 font-semibold">Field</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Value</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Source</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Retrieved</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-border-light align-top last:border-0">
              <th scope="row" className="px-4 py-3 font-medium text-text-secondary">{r.label}</th>
              <td className="px-4 py-3 text-text-primary">
                {r.fact ? (r.display ?? r.fact.value) : <span className="text-text-tertiary">{NOT_AVAILABLE}</span>}
              </td>
              <td className="px-4 py-3">{r.fact ? <SourceLink p={r.fact.provenance} sources={sources} /> : "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-text-tertiary tabular-nums">
                {r.fact ? formatDate(r.fact.provenance.retrievedAt.slice(0, 10)) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocumentList({ docs, sources }: { docs: RegistryDocument[]; sources: Map<string, Source> }) {
  if (!docs.length) {
    return <p className="text-[14px] text-text-tertiary">{NOT_AVAILABLE}</p>;
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {docs.map((d) => {
        const down = d.lastStatus !== undefined && (d.lastStatus < 200 || d.lastStatus >= 400);
        return (
          <li key={d.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                  {DOC_LABEL[d.kind]}
                </p>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-0.5 block break-words text-[14px] font-medium text-text-primary hover:text-primary"
                >
                  {d.title} <span className="sr-only">(opens the insurer&apos;s official document)</span>
                </a>
                <p className="mt-1 text-[12px] text-text-tertiary">
                  {down ? (
                    <span className="text-danger">Unavailable when last checked ({formatDate(d.lastCheckedAt?.slice(0, 10))})</span>
                  ) : (
                    <>Checked {formatDate(d.lastCheckedAt?.slice(0, 10))} · linked from <SourceLink p={d.provenance} sources={sources} /></>
                  )}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function StatisticsTable({
  stats,
  sources,
  caption,
}: {
  stats: RegistryStatistic[];
  sources: Map<string, Source>;
  caption: string;
}) {
  if (!stats.length) return <p className="text-[14px] text-text-tertiary">{NOT_AVAILABLE}</p>;
  const rows = [...stats].sort(
    (a, b) => b.reportingPeriod.localeCompare(a.reportingPeriod) || a.label.localeCompare(b.label)
  );
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[620px] text-left text-[13.5px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-surface-sunken/60 text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            <th scope="col" className="px-4 py-2.5 font-semibold">Metric</th>
            <th scope="col" className="px-4 py-2.5 text-right font-semibold">Value</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Period</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Source</th>
            <th scope="col" className="px-4 py-2.5 font-semibold" title="Publication date, or the date we saw the figure when the source prints none">Source date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-b border-border-light last:border-0">
              <th scope="row" className="px-4 py-3 font-medium text-text-secondary">{s.label}</th>
              <td className="px-4 py-3 text-right font-semibold text-text-primary tabular-nums">{formatStatValue(s)}</td>
              <td className="px-4 py-3 text-text-secondary">{formatPeriod(s.reportingPeriod)}</td>
              <td className="px-4 py-3"><SourceLink p={s.provenance} sources={sources} /></td>
              <td className="whitespace-nowrap px-4 py-3 text-text-tertiary tabular-nums">
                {s.provenance.sourceDateIsObserved ? `Seen ${formatDate(s.provenance.sourceDate)}` : formatDate(s.provenance.sourceDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LinkGrid({ links, empty }: { links: LinkTarget[]; empty?: string }) {
  if (!links.length) return empty ? <p className="text-[14px] text-text-tertiary">{empty}</p> : null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="group flex h-full items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold text-text-primary group-hover:text-primary">{l.label}</span>
              {l.sublabel && <span className="mt-0.5 block text-[12px] text-text-tertiary">{l.sublabel}</span>}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-text-tertiary group-hover:text-primary" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export interface Faq {
  q: string;
  a: string;
}

/** Visible FAQ. Pair with FAQSchema using the same items — never schema alone. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <dl className="divide-y divide-border-light rounded-xl border border-border bg-surface">
      {items.map((f) => (
        <div key={f.q} className="px-5 py-4">
          <dt className="text-[15px] font-semibold text-text-primary">{f.q}</dt>
          <dd className="mt-1.5 text-[14px] leading-[1.75] text-text-secondary">{f.a}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Freshness, provenance and non-affiliation — shown on every registry page. */
export function DataNotice({
  updated,
  period,
  sourceNames,
}: {
  updated?: string;
  period?: string;
  sourceNames: string[];
}) {
  return (
    <div className="rounded-xl border border-border-light bg-surface-sunken/60 p-4 text-[12.5px] leading-relaxed text-text-secondary">
      <p>
        <strong className="text-text-primary">Last updated:</strong> {formatDate(updated?.slice(0, 10))}
        {period && (
          <>
            {" · "}
            <strong className="text-text-primary">Data period:</strong> {formatPeriod(period)}
          </>
        )}
      </p>
      <p className="mt-1">
        <strong className="text-text-primary">Source:</strong>{" "}
        {sourceNames.length ? sourceNames.join(", ") : NOT_AVAILABLE} — each value above links to the exact page it was read from.
      </p>
      <p className="mt-1 text-text-tertiary">
        Tables marked “official data” reproduce what the cited source states. WorldBestInsurer compiles this
        information independently and is not affiliated with IRDAI, the Government of India, or any insurer.
        Confirm details with the insurer before you buy.
      </p>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, id }: { eyebrow?: string; title: string; id?: string }) {
  return (
    <div className="mb-4" id={id}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-[20px] font-bold tracking-[-0.01em] text-text-primary">{title}</h2>
    </div>
  );
}
