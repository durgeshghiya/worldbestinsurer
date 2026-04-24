import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, ExternalLink } from "lucide-react";
import {
  getAllFinanceArticles,
  getFinanceArticleBySlug,
} from "@/lib/finance";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { AdSlot } from "@/components/AdSlot";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllFinanceArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getFinanceArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `https://worldbestinsurer.com/finance/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.lastUpdated,
      authors: [article.author],
    },
  };
}

export default async function FinanceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getFinanceArticleBySlug(slug);
  if (!article) notFound();

  const others = getAllFinanceArticles()
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[760px] px-5 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedAt,
            dateModified: article.lastUpdated,
            author: {
              "@type": "Organization",
              name: article.author,
              url: "https://worldbestinsurer.com/author/editorial-team",
            },
            publisher: {
              "@type": "Organization",
              name: "World Best Insurer",
              url: "https://worldbestinsurer.com",
            },
            mainEntityOfPage: `https://worldbestinsurer.com/finance/${article.slug}`,
            inLanguage: "en",
            articleSection: article.category,
            keywords: article.tags.join(", "),
          }),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "Finance", url: "https://worldbestinsurer.com/finance" },
          { name: article.title, url: `https://worldbestinsurer.com/finance/${article.slug}` },
        ]}
      />

      <Link
        href="/finance"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All finance guides
      </Link>

      <article>
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.12em]">
            {article.category}
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-[16px] text-text-secondary leading-relaxed mb-6">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b border-border mb-8 text-[12px] text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <Link href="/author/editorial-team" className="hover:text-primary transition-colors">
              {article.author}
            </Link>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Updated {article.lastUpdated}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
          {article.tags.length > 0 && (
            <>
              <span className="w-px h-4 bg-border" />
              <span className="flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[10.5px] font-medium bg-surface-sunken rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </span>
            </>
          )}
        </div>

        <div className="space-y-9">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-[20px] font-bold text-text-primary mb-3 tracking-[-0.01em]">
                {section.heading}
              </h2>
              <p className="text-[14.5px] text-text-secondary leading-[1.8]">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_FINANCE_ARTICLE_END} className="my-10" />

        {article.sources.length > 0 && (
          <div className="mt-10 p-5 bg-surface-sunken rounded-xl border border-border-light">
            <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.1em] mb-3">
              Sources
            </p>
            <ul className="space-y-2">
              {article.sources.map((s) => (
                <li key={s.url} className="text-[12.5px]">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    {s.title} <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 p-5 bg-surface-sunken rounded-xl border border-border-light">
          <p className="text-[11px] text-text-tertiary leading-relaxed">
            <strong>Disclaimer:</strong> This article is for educational
            purposes only and is not tax, legal, or investment advice. Tax laws
            change and individual circumstances differ — consult a qualified
            professional before acting. World Best Insurer does not sell
            insurance and has no commercial relationship with any insurer or
            tax advisor mentioned.
          </p>
        </div>
      </article>

      {others.length > 0 && (
        <div className="mt-12">
          <h3 className="text-[15px] font-semibold text-text-primary mb-4">
            More finance guides
          </h3>
          <div className="space-y-3">
            {others.map((a) => (
              <Link
                key={a.slug}
                href={`/finance/${a.slug}`}
                className="block p-4 bg-surface rounded-xl border border-border hover:border-primary/15 transition-colors"
              >
                <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.1em] mb-1">
                  {a.category}
                </p>
                <p className="text-[13.5px] font-medium text-text-primary hover:text-primary transition-colors">
                  {a.title}
                </p>
                <p className="text-[11.5px] text-text-tertiary mt-1">
                  {a.readTime} · Updated {a.lastUpdated}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
