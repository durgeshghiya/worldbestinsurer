import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import { BreadcrumbSchema } from "@/components/StructuredData";

// Load all reports
import healthIndiaReport from "@/data/reports/health-insurance-india-2026.json";

const reports = [healthIndiaReport];

export const metadata: Metadata = {
  title: "Insurance Market Reports — World Best Insurer",
  description:
    "Original research and market analysis from the World Best Insurer editorial team. Data-driven reports on insurance markets across 12 countries.",
};

export default function ReportsIndexPage() {
  return (
    <div className="mx-auto max-w-[800px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "Reports", url: "https://worldbestinsurer.com/reports" },
        ]}
      />

      <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] mb-3">
        Market Reports
      </h1>
      <p className="text-[14px] text-text-tertiary mb-10 max-w-lg">
        Original research from the WBI editorial team. Data-driven analysis of
        insurance markets across 12 countries.
      </p>

      <div className="space-y-4">
        {reports.map((report) => (
          <Link
            key={report.slug}
            href={`/reports/${report.slug}`}
            className="block p-6 bg-surface rounded-2xl border border-border hover:border-primary/20 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
                  {report.category} · {report.country}
                </p>
                <h2 className="text-[17px] font-bold text-text-primary group-hover:text-primary transition-colors mb-1.5">
                  {report.title}
                </h2>
                <p className="text-[13px] text-text-secondary line-clamp-2">
                  {report.subtitle}
                </p>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {report.publishedAt}
                  </span>
                  <span>{report.readTime}</span>
                  <span>{report.author}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-primary shrink-0 mt-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
