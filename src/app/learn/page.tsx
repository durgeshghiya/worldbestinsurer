import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/generators";

export const metadata: Metadata = {
  title: "Learn About Insurance",
  description:
    "Educational guides on health insurance, term life insurance, motor insurance, and travel insurance in India.",
};

const categoryColors: Record<string, string> = {
  Health: "#ef4444",
  "Term Life": "#2563eb",
  Motor: "#16a34a",
  Travel: "#f59e0b",
  General: "#6b7280",
};

export default function LearnPage() {
  const articles = getArticles();

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">
            Learn About Insurance
          </h1>
        </div>
        <p className="text-[14px] text-text-secondary max-w-2xl">
          {articles.length} educational guides to help you understand insurance concepts.
          Clear, factual, and jargon-free.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => {
          const color = categoryColors[article.category] ?? "#6b7280";
          return (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group bg-surface rounded-xl border border-border hover:border-primary/15 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="h-1" style={{ backgroundColor: color }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${color}12`, color }}
                  >
                    {article.category}
                  </span>
                  <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>
                <h2 className="text-[14px] font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-[12.5px] text-text-secondary leading-relaxed mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-primary">
                  Read guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-surface-sunken rounded-2xl p-8 text-center">
        <h2 className="text-[18px] font-bold text-text-primary mb-2">
          More Guides Coming Soon
        </h2>
        <p className="text-[13px] text-text-secondary max-w-lg mx-auto mb-4">
          We&apos;re adding more content on tax benefits, portability, IRDAI regulations, and more.
        </p>
        <Link
          href="/waitlist"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
        >
          Get Notified <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
