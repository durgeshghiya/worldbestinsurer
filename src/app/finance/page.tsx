import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { getAllFinanceArticles } from "@/lib/finance";
import { BreadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Finance — Insurance-adjacent research",
  description:
    "Weekly deep-researched guides on the finance side of insurance decisions — tax deductions, investment-linked products, retirement planning, and regulatory changes that move premiums.",
  alternates: {
    canonical: "https://worldbestinsurer.com/finance",
  },
};

export default function FinanceIndexPage() {
  const articles = getAllFinanceArticles();

  return (
    <div className="mx-auto max-w-[900px] px-5 lg:px-8 py-12">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "Finance", url: "https://worldbestinsurer.com/finance" },
        ]}
      />

      <div className="mb-12">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.12em] mb-2">
          Finance · Weekly
        </p>
        <h1 className="text-[32px] sm:text-[40px] font-bold text-text-primary tracking-[-0.02em] leading-tight mb-3">
          Finance research for insurance decisions
        </h1>
        <p className="text-[15px] text-text-secondary leading-relaxed max-w-[640px]">
          One deep-researched guide a week on the finance side of insurance —
          tax deductions, investment-linked products, retirement planning, and
          regulatory changes. Sourced from IRDAI, Income Tax Act, and official
          insurer filings. No AI slop, no daily filler.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="p-8 bg-surface-sunken rounded-xl text-center text-[14px] text-text-tertiary">
          First article publishing soon.
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/finance/${a.slug}`}
              className="block p-6 bg-surface rounded-2xl border border-border hover:border-primary/20 hover:shadow-sm transition-all group"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3 text-[11px] text-text-tertiary">
                <span className="font-semibold text-primary uppercase tracking-[0.1em]">
                  {a.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-text-tertiary/40" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {a.publishedAt}
                </span>
                <span className="w-1 h-1 rounded-full bg-text-tertiary/40" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {a.readTime}
                </span>
              </div>
              <h2 className="text-[19px] sm:text-[22px] font-bold text-text-primary tracking-[-0.01em] leading-snug mb-2 group-hover:text-primary transition-colors">
                {a.title}
              </h2>
              <p className="text-[13.5px] text-text-secondary leading-relaxed mb-3 line-clamp-3">
                {a.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary">
                Read the guide <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
