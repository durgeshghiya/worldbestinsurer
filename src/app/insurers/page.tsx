import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, MapPin, Calendar, Building2, TrendingUp } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllInsurers, getProductsByInsurer } from "@/lib/data";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Insurance Companies Directory — 248+ Insurers in 12 Countries",
  description: "Browse 248+ insurance companies across India, US, UK, UAE & 8 more countries. Compare claim settlement ratios, network hospitals, headquarters, and product offerings.",
};

export default function InsurersPage() {
  const insurers = getAllInsurers();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Insurer Directory" }]} />
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Insurer Directory
        </h1>
        <p className="mt-3 text-muted max-w-2xl">
          Explore India&apos;s leading insurance companies. View their profiles, available
          plans, and key metrics. All data is from publicly available sources.
        </p>
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_INSURERS_TOP} format="horizontal" className="mb-6" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {insurers.map((insurer) => {
          const products = getProductsByInsurer(insurer.slug);
          return (
            <div
              key={insurer.slug}
              className="bg-white rounded-2xl border border-border hover:border-primary/20 hover:shadow-md transition-all p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link href={`/insurer/${insurer.slug}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    {insurer.shortName}
                  </Link>
                  <p className="text-xs text-muted">{insurer.name}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary-light text-primary font-medium">
                  {insurer.type.replace(/-/g, " ")}
                </span>
              </div>

              <p className="text-sm text-muted mb-4 leading-relaxed">
                {insurer.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-muted">
                  <MapPin className="w-3.5 h-3.5" />
                  {insurer.headquarters}
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  Est. {insurer.established}
                </div>
                {insurer.claimSettlementRatio?.value && (
                  <div className="flex items-center gap-1.5 text-muted">
                    <TrendingUp className="w-3.5 h-3.5" />
                    CSR: {insurer.claimSettlementRatio?.value}%
                  </div>
                )}
                {insurer.networkHospitals && (
                  <div className="flex items-center gap-1.5 text-muted">
                    <Building2 className="w-3.5 h-3.5" />
                    {(insurer.networkHospitals / 1000).toFixed(0)}K+ hospitals
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {insurer.categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/compare/${cat}`}
                    className="text-xs px-2 py-0.5 rounded-md bg-muted-light text-muted hover:text-primary transition-colors"
                  >
                    {cat.replace("-", " ")}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted">
                  {products.length} plans on World Best Insurer
                </span>
                <a
                  href={insurer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Official site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-muted-light rounded-xl text-xs text-muted text-center">
        All insurer information is from publicly available sources. Claim settlement ratios are indicative and sourced from IRDAI annual reports (unverified). Visit insurer websites for official data.
      </div>
    </div>
  );
}
