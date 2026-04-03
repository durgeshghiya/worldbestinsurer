import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import { getArticles } from "@/lib/generators";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  title: "Insurance Guides & Education — 121 Expert Articles",
  description:
    "121 insurance guides covering health, term life, motor & travel insurance in India. Learn about claim settlement ratios, premium calculations, tax benefits, and more.",
};

const categoryColors: Record<string, string> = {
  Health: "#c44058",
  "Term Life": "#2d3a8c",
  Motor: "#2d8f6f",
  Travel: "#c47d2e",
  General: "#6b7280",
};

export default function LearnPage() {
  const articles = getArticles();

  return (
    <div>
      {/* Hero */}
      <AnimatedBackground variant="mesh" className="py-14 sm:py-18">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-[28px] sm:text-[40px] font-bold text-text-primary tracking-[-0.02em]">
                Learn About Insurance
              </h1>
            </div>
            <p className="text-[14px] text-text-secondary max-w-2xl">
              {articles.length} educational guides to help you understand insurance concepts.
              Clear, factual, and jargon-free.
            </p>
          </ScrollReveal>
        </div>
      </AnimatedBackground>

      <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article, idx) => {
            const color = categoryColors[article.category] ?? "#6b7280";
            return (
              <ScrollReveal key={article.slug} delay={Math.min(idx * 0.04, 0.3)}>
                <Link
                  href={`/learn/${article.slug}`}
                  className="group block bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-spotlight h-full"
                >
                  <div className="h-1 transition-all duration-300 group-hover:h-1.5" style={{ backgroundColor: color }} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full transition-all duration-300 group-hover:scale-105"
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
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-primary group-hover:gap-2 transition-all">
                      Read guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2}>
          <div className="mt-14 bg-aurora rounded-2xl p-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-[11px] font-bold text-accent uppercase tracking-[0.1em] mb-3">
              <Sparkles className="w-3 h-3" />
              Coming Soon
            </div>
            <h2 className="text-[18px] font-bold text-text-primary mb-2">
              More Guides Coming Soon
            </h2>
            <p className="text-[13px] text-text-secondary max-w-lg mx-auto mb-4">
              We&apos;re adding more content on tax benefits, portability, IRDAI regulations, and more.
            </p>
            <Link
              href="/waitlist"
              className="btn-bouncy inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
            >
              Get Notified <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
