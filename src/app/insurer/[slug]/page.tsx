import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Calendar, Building2, TrendingUp, ArrowUpRight } from "lucide-react";
import { getAllInsurers, getInsurerBySlug, getProductsByInsurer } from "@/lib/data";
import { cn, formatCompact } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllInsurers().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const insurer = getInsurerBySlug(slug);
  if (!insurer) return {};
  return {
    title: `${insurer.shortName} Insurance Plans`,
    description: `Explore ${insurer.shortName} insurance plans on World Best Insurer. Compare products, view claim settlement ratio, and more.`,
  };
}

export default async function InsurerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insurer = getInsurerBySlug(slug);
  if (!insurer) notFound();

  const products = getProductsByInsurer(slug);

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <Link href="/insurers" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> All insurers
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">{insurer.shortName}</h1>
          <p className="text-[14px] text-text-secondary mt-1">{insurer.name}</p>
          <p className="text-[13px] text-text-tertiary mt-2">{insurer.description}</p>
        </div>
        <a href={insurer.website} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-border rounded-lg hover:bg-surface-sunken transition-colors shrink-0">
          Official website <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-surface rounded-xl border border-border p-5">
          <MapPin className="w-4 h-4 text-primary mb-2" />
          <p className="text-[11px] text-text-tertiary">Headquarters</p>
          <p className="text-[15px] font-semibold text-text-primary">{insurer.headquarters}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5">
          <Calendar className="w-4 h-4 text-primary mb-2" />
          <p className="text-[11px] text-text-tertiary">Established</p>
          <p className="text-[15px] font-semibold text-text-primary">{insurer.established}</p>
        </div>
        {insurer.claimSettlementRatio && (
          <div className="bg-surface rounded-xl border border-border p-5">
            <TrendingUp className="w-4 h-4 text-primary mb-2" />
            <p className="text-[11px] text-text-tertiary">Claim Settlement Ratio</p>
            <p className="text-[15px] font-semibold text-text-primary">{insurer.claimSettlementRatio.value}%</p>
            <p className="text-[10px] text-text-tertiary">{insurer.claimSettlementRatio.year} (unverified)</p>
          </div>
        )}
        {insurer.networkHospitals && (
          <div className="bg-surface rounded-xl border border-border p-5">
            <Building2 className="w-4 h-4 text-primary mb-2" />
            <p className="text-[11px] text-text-tertiary">Network Hospitals</p>
            <p className="text-[15px] font-semibold text-text-primary">{(insurer.networkHospitals / 1000).toFixed(0)}K+</p>
          </div>
        )}
      </div>

      <h2 className="text-[20px] font-bold text-text-primary mb-4">
        Products on World Best Insurer ({products.length})
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}
            className="group bg-surface rounded-xl border border-border hover:border-primary/15 hover:shadow-md transition-all p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-medium text-primary uppercase tracking-[0.06em] mb-0.5">{p.category.replace("-", " ")}</p>
                <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors">{p.productName}</h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex gap-4 mt-3 text-[12px] text-text-secondary">
              <span>Cover: {formatCompact(p.sumInsured.min)}–{formatCompact(p.sumInsured.max)}</span>
              <span>From {formatCompact(p.premiumRange.illustrativeMin)}/yr*</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 bg-surface-sunken rounded-xl text-[11px] text-text-tertiary">
        All data is from publicly available sources. Claim settlement ratios are indicative. Visit the insurer&apos;s official website for current information.
      </div>
    </div>
  );
}
