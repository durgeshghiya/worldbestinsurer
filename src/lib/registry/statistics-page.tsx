/**
 * Shared body for /in/insurance-statistics/ and /in/insurance-statistics/{period}/.
 * Figures are grouped by insurer and always shown with value, unit, period,
 * source and source date. Historical periods are labelled as such.
 */

import Link from "next/link";
import type { LoadedRegistry } from "./load";
import type { RegistryStatistic } from "./types";
import { formatPeriod, latest } from "./format";
import { periodSlug } from "./linking";
import { statisticsPeriodVerdict } from "./indexability";
import { DataNotice, StatisticsTable } from "@/components/registry/RegistryBlocks";

export function periodsOf(reg: LoadedRegistry): string[] {
  return [...new Set(reg.statistics.map((s) => s.reportingPeriod))].sort().reverse();
}

export function StatisticsBody({ reg, stats, period }: { reg: LoadedRegistry; stats: RegistryStatistic[]; period?: string }) {
  const periods = periodsOf(reg);
  const newest = periods[0];
  const byInsurer = new Map<string, RegistryStatistic[]>();
  const market: RegistryStatistic[] = [];
  for (const s of stats) {
    if (s.insurerSlug) byInsurer.set(s.insurerSlug, [...(byInsurer.get(s.insurerSlug) ?? []), s]);
    else market.push(s);
  }
  const sources = [...new Set(stats.map((s) => reg.sourceById.get(s.provenance.sourceId)?.name ?? s.provenance.sourceId))];
  const updated = latest(stats.map((s) => s.recordedAt));

  if (!stats.length) {
    return (
      <p className="mt-8 rounded-xl border border-border-light bg-surface-sunken/60 p-5 text-[14px] text-text-secondary">
        No sourced statistics are published here yet. Figures appear only once they have been read from an official
        source and checked against it.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {period && newest && period !== newest && (
        <p className="rounded-xl border border-warning/30 bg-warning-light p-4 text-[13.5px] text-text-secondary">
          These are historical figures for {formatPeriod(period)}. The most recent period we hold is{" "}
          <Link href={`/in/insurance-statistics/${periodSlug(newest)}/`} className="font-medium text-primary hover:underline">
            {formatPeriod(newest)}
          </Link>.
        </p>
      )}

      {periods.length > 1 && (
        <nav aria-label="Reporting periods" className="flex flex-wrap gap-2">
          {periods.filter((p) => statisticsPeriodVerdict(p, reg).indexable).map((p) => (
            <Link
              key={p}
              href={`/in/insurance-statistics/${periodSlug(p)}/`}
              aria-current={p === period ? "page" : undefined}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:text-primary aria-[current=page]:border-primary aria-[current=page]:text-primary"
            >
              {formatPeriod(p)}
            </Link>
          ))}
        </nav>
      )}

      {market.length > 0 && (
        <section>
          <h2 className="mb-4 text-[20px] font-bold text-text-primary">Market and segment figures</h2>
          <StatisticsTable stats={market} sources={reg.sourceById} caption="Market-level insurance statistics" />
        </section>
      )}

      {[...byInsurer].sort((a, b) => a[0].localeCompare(b[0])).map(([slug, rows]) => {
        const name = reg.insurerBySlug.get(slug)?.name.value ?? slug;
        return (
          <section key={slug}>
            <h2 className="mb-4 text-[20px] font-bold text-text-primary">
              <Link href={`/in/insurer/${slug}/`} className="hover:text-primary">{name}</Link>
            </h2>
            <StatisticsTable stats={rows} sources={reg.sourceById} caption={`Statistics for ${name}`} />
          </section>
        );
      })}

      <DataNotice updated={updated} period={period ?? newest} sourceNames={sources} />
    </div>
  );
}
