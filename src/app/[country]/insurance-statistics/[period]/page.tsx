import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { formatPeriod, periodSlug, registry, robotsFor, statisticsPeriodVerdict } from "@/lib/registry";
import { StatisticsBody, periodsOf } from "@/lib/registry/statistics-page";

export const dynamicParams = false;

export function generateStaticParams() {
  const out = periodsOf(registry()).map((p) => ({ country: "in", period: periodSlug(p) }));
  // Next needs at least one param set for a static route; an unmatched
  // placeholder renders 404 and is never linked or listed.
  return out.length ? out : [{ country: "in", period: "none" }];
}

function resolve(slug: string): string | undefined {
  return periodsOf(registry()).find((p) => periodSlug(p) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; period: string }> }): Promise<Metadata> {
  const { country, period } = await params;
  const p = country === "in" ? resolve(period) : undefined;
  if (!p) return {};
  const reg = registry();
  const n = reg.statistics.filter((s) => s.reportingPeriod === p).length;
  const title = `Insurance Statistics for India, ${formatPeriod(p)}`;
  const description = `${n} published insurance figures for ${formatPeriod(p)}, each with its unit, source and source date.`;
  return {
    title,
    description,
    alternates: { canonical: `https://worldbestinsurer.com/in/insurance-statistics/${period}` },
    openGraph: { title, description, url: `https://worldbestinsurer.com/in/insurance-statistics/${period}/`, type: "website" },
    ...robotsFor(statisticsPeriodVerdict(p, reg)),
  };
}

export default async function StatisticsPeriodPage({ params }: { params: Promise<{ country: string; period: string }> }) {
  const { country, period } = await params;
  const p = country === "in" ? resolve(period) : undefined;
  if (!p) notFound();
  const reg = registry();
  return (
    <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "India", url: "https://worldbestinsurer.com/in/" },
          { name: "Insurance statistics", url: "https://worldbestinsurer.com/in/insurance-statistics/" },
          { name: formatPeriod(p), url: `https://worldbestinsurer.com/in/insurance-statistics/${period}/` },
        ]}
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">India · {formatPeriod(p)}</p>
      <h1 className="mt-2 text-[28px] sm:text-[38px] font-bold tracking-[-0.02em] text-text-primary">
        Insurance statistics for India, {formatPeriod(p)}
      </h1>
      <p className="mt-4 max-w-[72ch] text-[15px] leading-[1.75] text-text-secondary">
        Published figures that describe {formatPeriod(p)}, as reported by the source cited on each row.
      </p>
      <StatisticsBody reg={reg} stats={reg.statistics.filter((s) => s.reportingPeriod === p)} period={p} />
    </div>
  );
}
