import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, User, CalendarDays } from "lucide-react";
import { getArticles, getArticleBySlug } from "@/lib/generators";
import WaitlistForm from "@/components/WaitlistForm";
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { AdSlot } from "@/components/AdSlot";

export async function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = getArticles().filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-[720px] px-5 lg:px-8 py-10">
      <ArticleSchema article={article} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "Insurance Guides", url: "https://worldbestinsurer.com/learn" },
          { name: article.title, url: `https://worldbestinsurer.com/learn/${article.slug}` },
        ]}
      />
      <Link href="/learn" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> All guides
      </Link>

      <article>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-primary-light text-primary">{article.category}</span>
          <span className="text-[12px] text-text-tertiary flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
        </div>

        <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-[16px] text-text-secondary leading-relaxed mb-5 font-medium">
          {article.excerpt}
        </p>

        {/* Author byline — E-E-A-T signal for AdSense */}
        <div className="flex items-center gap-4 py-4 border-t border-b border-border mb-8 text-[12px] text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <Link href="/author/editorial-team" className="hover:text-primary transition-colors">WBI Editorial Team</Link>
          </span>
          <span className="w-px h-4 bg-border" />
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Updated April 2026</span>
          </span>
          <span className="w-px h-4 bg-border" />
          <span>Verified with insurer sources</span>
        </div>

        <div className="prose prose-sm max-w-none text-[14.5px] text-text-secondary leading-[1.8]">
          {article.content.split(". ").reduce((acc: string[][], sentence, i) => {
            const paragraphIndex = Math.floor(i / 3);
            if (!acc[paragraphIndex]) acc[paragraphIndex] = [];
            acc[paragraphIndex].push(sentence);
            return acc;
          }, []).map((sentences, i) => (
            <p key={i} className="mb-4">{sentences.join(". ")}{sentences[sentences.length - 1].endsWith(".") ? "" : "."}</p>
          ))}
        </div>

        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_LEARN_ARTICLE_END} className="my-8" />

        <div className="mt-8 p-5 bg-surface-sunken rounded-xl border border-border-light">
          <p className="text-[11px] text-text-tertiary leading-relaxed">
            <strong>Disclaimer:</strong> This article is for educational purposes only. World Best Insurer does not provide personalized insurance advice. Please consult a licensed insurance advisor for recommendations specific to your situation. Data mentioned may change — verify with insurers directly.
          </p>
        </div>
      </article>

      {/* CTA */}
      <div className="mt-10 bg-text-primary rounded-xl p-6 text-center">
        <h3 className="text-[16px] font-semibold text-white mb-2">Compare plans on World Best Insurer</h3>
        <p className="text-[13px] text-white/60 mb-4">Explore and compare insurance products with transparent, verified data.</p>
        <Link href="/compare/health" className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-medium bg-white text-text-primary rounded-lg hover:bg-white/90 transition-colors">
          Start comparing
        </Link>
      </div>

      {/* Related */}
      {allArticles.length > 0 && (
        <div className="mt-12">
          <h3 className="text-[16px] font-semibold text-text-primary mb-4">More guides</h3>
          <div className="space-y-3">
            {allArticles.map((a) => (
              <Link key={a.slug} href={`/learn/${a.slug}`} className="block p-4 bg-surface rounded-xl border border-border hover:border-primary/15 transition-colors">
                <p className="text-[13.5px] font-medium text-text-primary hover:text-primary transition-colors">{a.title}</p>
                <p className="text-[12px] text-text-tertiary mt-1">{a.readTime} &middot; {a.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
