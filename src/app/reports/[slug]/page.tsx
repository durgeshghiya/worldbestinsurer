import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User} from "lucide-react";
import { BreadcrumbSchema } from "@/components/StructuredData";

// Load all reports
import healthIndiaReport from "@/data/reports/health-insurance-india-2026.json";
import motorIndiaReport from "@/data/reports/motor-insurance-india-2026.json";
import healthUsReport from "@/data/reports/health-insurance-us-2026.json";
import travelGlobalReport from "@/data/reports/travel-insurance-global-2026.json";

interface ReportSection {
  heading: string;
  body: string;
}

interface Report {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  author: string;
  category: string;
  country: string;
  readTime: string;
  sections: ReportSection[];
}

const reports: Report[] = [healthIndiaReport, motorIndiaReport, healthUsReport, travelGlobalReport];

export async function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = reports.find((r) => r.slug === slug);
  if (!report) return {};
  return {
    title: `${report.title} — World Best Insurer Research`,
    description: report.subtitle,
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = reports.find((r) => r.slug === slug);
  if (!report) notFound();

  return (
    <div className="mx-auto max-w-[750px] px-5 lg:px-8 py-10">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Report",
            name: report.title,
            description: report.subtitle,
            datePublished: report.publishedAt,
            author: {
              "@type": "Organization",
              name: "World Best Insurer",
              url: "https://worldbestinsurer.com",
            },
            publisher: {
              "@type": "Organization",
              name: "World Best Insurer",
              url: "https://worldbestinsurer.com",
            },
            url: `https://worldbestinsurer.com/reports/${report.slug}`,
            about: `${report.category} in ${report.country}`,
            inLanguage: "en",
          }),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "Reports", url: "https://worldbestinsurer.com/reports" },
          { name: report.title, url: `https://worldbestinsurer.com/reports/${report.slug}` },
        ]}
      />

      <Link
        href="/reports"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All reports
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
          {report.category} · {report.country}
        </p>
        <h1 className="text-[28px] sm:text-[38px] font-bold text-text-primary tracking-[-0.02em] leading-tight mb-3">
          {report.title}
        </h1>
        <p className="text-[15px] text-text-secondary leading-relaxed mb-5">
          {report.subtitle}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-tertiary py-4 border-t border-b border-border">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <Link href="/author/editorial-team" className="hover:text-primary transition-colors">
              {report.author}
            </Link>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {report.publishedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {report.readTime} read
          </span>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="mb-10 p-5 bg-surface rounded-xl border border-border">
        <p className="text-[12px] font-semibold text-text-primary mb-3">In this report</p>
        <ol className="space-y-1.5">
          {report.sections.map((section, i) => (
            <li key={i}>
              <a
                href={`#section-${i}`}
                className="text-[13px] text-primary hover:underline"
              >
                {i + 1}. {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="space-y-10">
        {report.sections.map((section, i) => (
          <section key={i} id={`section-${i}`}>
            <h2 className="text-[20px] font-bold text-text-primary mb-4">
              {section.heading}
            </h2>
            <div className="text-[14px] text-text-secondary leading-[1.85]">
              {section.body.split(/(?<=\.) (?=\d+\.)/).map((para, pi) => (
                <p key={pi} className="mb-4">{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 p-6 bg-surface rounded-2xl border border-border text-center">
        <p className="text-[15px] font-semibold text-text-primary mb-2">
          Compare plans mentioned in this report
        </p>
        <p className="text-[12px] text-text-tertiary mb-4">
          Use our comparison tool to see detailed features, premiums, and coverage side by side.
        </p>
        <Link
          href="/in/compare/health"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Compare Health Plans →
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-surface-sunken rounded-xl text-[11px] text-text-tertiary leading-relaxed">
        This report is for educational purposes only. World Best Insurer does not sell insurance
        and has no commercial relationship with the insurers mentioned. Data is sourced from
        IRDAI annual reports and official insurer websites. Verify all information directly with
        insurers before making purchase decisions.
      </div>
    </div>
  );
}
