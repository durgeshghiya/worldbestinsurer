import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Globe, Award, ChevronRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getArticles } from "@/lib/generators";
import authorData from "@/data/authors.json";

interface Author {
  slug: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  expertise: string[];
  articlesWritten: number;
  countriesCovered: number;
  linkedIn: string | null;
}

const authors: Author[] = authorData.authors;

export async function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) return {};
  return {
    title: `${author.name} — ${author.role} at World Best Insurer`,
    description: author.bio.slice(0, 160),
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();

  const allArticles = getArticles().slice(0, 8);

  return (
    <div className="mx-auto max-w-[720px] px-5 lg:px-8 py-10">
      {/* Person schema for E-E-A-T */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: author.name,
            jobTitle: author.role,
            url: `https://worldbestinsurer.com/author/${author.slug}`,
            worksFor: {
              "@type": "Organization",
              name: "World Best Insurer",
              url: "https://worldbestinsurer.com",
            },
            knowsAbout: author.expertise,
            description: author.bio,
          }),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "Authors", url: "https://worldbestinsurer.com/author/editorial-team" },
          { name: author.name, url: `https://worldbestinsurer.com/author/${author.slug}` },
        ]}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      {/* Author header */}
      <div className="mb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-[24px] font-bold text-primary">
          {author.name.charAt(0)}
        </div>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] mb-1">
          {author.name}
        </h1>
        <p className="text-[14px] text-primary font-medium mb-1">{author.role}</p>
        <p className="text-[12px] text-text-tertiary">{author.credentials}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <BookOpen className="w-4 h-4 text-text-tertiary mx-auto mb-1.5" />
          <p className="text-[18px] font-bold text-text-primary">{author.articlesWritten}</p>
          <p className="text-[10px] text-text-tertiary">Articles</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <Globe className="w-4 h-4 text-text-tertiary mx-auto mb-1.5" />
          <p className="text-[18px] font-bold text-text-primary">{author.countriesCovered}</p>
          <p className="text-[10px] text-text-tertiary">Countries</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <Award className="w-4 h-4 text-text-tertiary mx-auto mb-1.5" />
          <p className="text-[18px] font-bold text-text-primary">High</p>
          <p className="text-[10px] text-text-tertiary">Confidence</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <h2 className="text-[16px] font-bold text-text-primary mb-3">About</h2>
        <p className="text-[14px] text-text-secondary leading-[1.8]">{author.bio}</p>
      </div>

      {/* Expertise */}
      <div className="mb-10">
        <h2 className="text-[16px] font-bold text-text-primary mb-3">Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {author.expertise.map((e) => (
            <span
              key={e}
              className="px-3 py-1.5 text-[11px] font-medium bg-primary/5 text-primary rounded-lg"
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Recent articles */}
      <div>
        <h2 className="text-[16px] font-bold text-text-primary mb-4">Recent Articles</h2>
        <div className="space-y-2.5">
          {allArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-primary/15 transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                  {a.title}
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5">
                  {a.readTime} &middot; {a.category}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/learn"
            className="text-[13px] text-primary font-medium hover:underline"
          >
            View all {author.articlesWritten} articles →
          </Link>
        </div>
      </div>
    </div>
  );
}
