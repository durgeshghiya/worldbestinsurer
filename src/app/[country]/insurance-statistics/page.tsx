import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import { registry, robotsFor, statisticsHubVerdict, latest } from "@/lib/registry";
import { StatisticsBody, periodsOf } from "@/lib/registry/statistics-page";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ country: "in" }];
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  if (country !== "in") return {};
  const reg = registry();
  const title = "Insurance Statistics for India — Sourced Figures by Insurer";
  const description = `${reg.statistics.length} published insurance figures for Indian insurers, each shown with its unit, reporting period, source and source date.`;
  return {
    title,
    description,
    alternates: { canonical: "https://worldbestinsurer.com/in/insurance-statistics" },
    openGraph: { title, description, url: "https://worldbestinsurer.com/in/insurance-statistics/", type: "website" },
    ...robotsFor(statisticsHubVerdict(reg)),
  };
}

export default async function StatisticsHub({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (country !== "in") notFound();
  const reg = registry();
  const updated = latest(reg.statistics.map((s) => s.recordedAt));
  return (
    <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "India", url: "https://worldbestinsurer.com/in/" },
          { name: "Insurance statistics", url: "https://worldbestinsurer.com/in/insurance-statistics/" },
        ]}
      />
      {reg.statistics.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Insurance statistics for India",
            description: "Published insurance figures for Indian insurers with value, unit, reporting period and source.",
            url: "https://worldbestinsurer.com/in/insurance-statistics/",
            creator: { "@type": "Organization", name: "World Best Insurer", url: "https://worldbestinsurer.com/" },
            spatialCoverage: { "@type": "Place", name: "India" },
            temporalCoverage: periodsOf(reg).join(", "),
            ...(updated && { dateModified: updated.slice(0, 10) }),
            isAccessibleForFree: true,
          }}
        />
      )}
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">India · Official figures</p>
      <h1 className="mt-2 text-[28px] sm:text-[38px] font-bold tracking-[-0.02em] text-text-primary">
        Insurance statistics for India
      </h1>
      <p className="mt-4 max-w-[72ch] text-[15px] leading-[1.75] text-text-secondary">
        Figures published by insurers and public bodies, reproduced with the unit, reporting period and source date
        they were published with. We do not estimate, extrapolate or rank. A figure is shown only for the period it
        describes — historical values are never presented as current.
      </p>

      <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-text-primary text-sm">Interactive Benchmark Explorer</div>
          <p className="text-xs text-text-secondary mt-0.5">
            Compare official IRDAI Claim Settlement Ratios, Solvency Margins, and Cashless Hospital Networks across all 34 life and general insurers.
          </p>
        </div>
        <Link
          href="/tools/claim-settlement-ratio-tracker/"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors shadow-xs"
        >
          Open CSR Explorer →
        </Link>
      </div>

      <StatisticsBody reg={reg} stats={reg.statistics} />
    </div>
  );
}
