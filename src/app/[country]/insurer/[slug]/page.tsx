import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Calendar, Building2, TrendingUp, ArrowUpRight } from "lucide-react";
import { getAllInsurers, getInsurerBySlug, getProductsByInsurer } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { formatCompact } from "@/lib/utils";

export async function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const i of getAllInsurers(cc)) {
      params.push({ country: cc, slug: i.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; slug: string }> }): Promise<Metadata> {
  const { country, slug } = await params;
  const insurer = getInsurerBySlug(slug, country);
  const c = getCountryByCode(country);
  if (!insurer || !c) return {};
  return {
    title: `${insurer.shortName} Insurance Plans in ${c.name}`,
    description: `Explore ${insurer.shortName} insurance plans on World Best Insurer. Compare products available in ${c.name}.`,
  };
}

export default async function CountryInsurerPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  const insurer = getInsurerBySlug(slug, country);
  const c = getCountryByCode(country);
  if (!insurer || !c) notFound();

  const products = getProductsByInsurer(slug, country);

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <Link href={`/${country}/insurers`} className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> {c.flag} All insurers in {c.name}
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
            <p className="text-[11px] text-text-tertiary">Network</p>
            <p className="text-[15px] font-semibold text-text-primary">{(insurer.networkHospitals / 1000).toFixed(0)}K+</p>
          </div>
        )}
      </div>

      <h2 className="text-[20px] font-bold text-text-primary mb-4">Products on World Best Insurer ({products.length})</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {products.map((p) => (
          <Link key={p.id} href={`/${country}/product/${p.id}`}
            className="group bg-surface rounded-xl border border-border hover:border-primary/15 hover:shadow-md transition-all p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-medium text-primary uppercase tracking-[0.06em] mb-0.5">{p.category.replace("-", " ")}</p>
                <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors">{p.productName}</h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex gap-4 mt-3 text-[12px] text-text-secondary">
              <span>Cover: {formatCompact(p.sumInsured.min, country)}–{formatCompact(p.sumInsured.max, country)}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 bg-surface-sunken rounded-xl text-[11px] text-text-tertiary">
        All data is from publicly available sources. Visit the insurer&apos;s official website for current information.
      </div>
    </div>
  );
}
