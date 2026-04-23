import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Calendar, TrendingUp, ExternalLink } from "lucide-react";
import { getAllInsurers } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";

export async function generateStaticParams() {
  return VALID_COUNTRY_CODES.map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) return {};
  return {
    title: `Insurance Companies in ${c.name}`,
    description: `Directory of insurance companies in ${c.name}. Compare insurers, view claim ratios, and explore plans.`,
  };
}

export default async function CountryInsurersPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) notFound();

  const insurers = getAllInsurers(country);

  return (
    <div className="mx-auto max-w-[1320px] px-5 lg:px-8 py-10">
      <Link href={`/${country}`} className="text-[12px] text-text-tertiary hover:text-primary mb-4 inline-block">
        ← {c.flag} {c.name}
      </Link>
      <h1 className="text-[28px] sm:text-[36px] font-extrabold text-text-primary tracking-[-0.03em] mb-2">
        Insurance Companies in {c.name}
      </h1>
      <p className="text-[15px] text-text-secondary mb-8">
        {insurers.length} insurers tracked &middot; Regulated by {c.regulator}
      </p>

      {insurers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {insurers.map((ins) => (
            <div key={ins.slug} className="card-premium bg-surface rounded-2xl border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[15px] font-bold text-text-primary">{ins.shortName}</h3>
                  <p className="text-[11px] text-text-tertiary">{ins.type}</p>
                </div>
                <a href={ins.website} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 text-text-tertiary hover:text-primary transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed mb-3 line-clamp-2">{ins.description}</p>
              <div className="flex flex-wrap gap-2 text-[11px] text-text-tertiary">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ins.headquarters}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ins.established}</span>
                {ins.claimSettlementRatio?.value && (
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> CSR {ins.claimSettlementRatio.value}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-sunken rounded-2xl">
          <p className="text-[16px] font-bold text-text-primary mb-2">Insurer directory coming soon</p>
          <p className="text-[13px] text-text-secondary">We&apos;re compiling insurer data for {c.name}.</p>
        </div>
      )}
    </div>
  );
}
