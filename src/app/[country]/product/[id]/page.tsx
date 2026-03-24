import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, X, ExternalLink, AlertCircle, Clock, Shield } from "lucide-react";
import { getAllProducts, getProductById } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { formatCompact, freshnessLabel, cn } from "@/lib/utils";
import { ProductSchema, BreadcrumbSchema } from "@/components/StructuredData";

export async function generateStaticParams() {
  const params: { country: string; id: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const p of getAllProducts(cc)) {
      params.push({ country: cc, id: p.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; id: string }> }): Promise<Metadata> {
  const { country, id } = await params;
  const product = getProductById(id, country);
  const c = getCountryByCode(country);
  if (!product || !c) return {};
  return {
    title: `${product.productName} by ${product.insurerName} — ${c.name}`,
    description: `Compare ${product.productName} features, coverage, premiums, and more. ${c.name} insurance comparison on World Best Insurer.`,
    keywords: [product.productName, product.insurerName, product.category, c.name, "insurance comparison"],
  };
}

export default async function CountryProductPage({ params }: { params: Promise<{ country: string; id: string }> }) {
  const { country, id } = await params;
  const product = getProductById(id, country);
  const c = getCountryByCode(country);
  if (!product || !c) notFound();

  const currSym = c.currency.symbol;
  const freshness = freshnessLabel(product.lastVerified);

  return (
    <div className="mx-auto max-w-[1080px] px-5 lg:px-8 py-10">
      <ProductSchema product={product} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://worldbestinsurer.com" },
        { name: c.name, url: `https://worldbestinsurer.com/${country}` },
        { name: product.category.replace("-", " "), url: `https://worldbestinsurer.com/${country}/compare/${product.category}` },
        { name: product.productName, url: `https://worldbestinsurer.com/${country}/product/${product.id}` },
      ]} />

      <Link href={`/${country}/compare/${product.category}`} className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> {c.flag} {product.category.replace("-", " ")} insurance in {c.name}
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-1">{product.insurerName}</p>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">{product.productName}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-primary-light text-primary uppercase">{product.category.replace("-", " ")}</span>
            {product.subCategory && <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-surface-sunken text-text-secondary">{product.subCategory.replace(/-/g, " ")}</span>}
            <span className={cn("px-2.5 py-0.5 text-[11px] font-medium rounded-full", freshness.color === "green" ? "bg-success/10 text-success" : freshness.color === "amber" ? "bg-warning/10 text-warning" : "bg-error/10 text-error")}>
              <Clock className="w-3 h-3 inline mr-1" />{freshness.label}
            </span>
          </div>
        </div>
        {product.sourceUrl && (
          <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-border rounded-lg hover:bg-surface-sunken transition-colors shrink-0">
            Official source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Key metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Sum Insured Range" value={`${formatCompact(product.sumInsured.min, country)} – ${formatCompact(product.sumInsured.max, country)}`} />
        <MetricCard label="Illustrative Premium" value={`${formatCompact(product.premiumRange.illustrativeMin, country)} – ${formatCompact(product.premiumRange.illustrativeMax, country)}/yr*`} />
        <MetricCard label="Entry Age" value={`${product.eligibility.minAge} – ${product.eligibility.maxAge ?? "N/A"} years`} />
        <MetricCard label="Renewability" value={product.renewability} />
      </div>

      {/* Details grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {product.keyInclusions.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Key Inclusions</h2>
            <ul className="space-y-2">{product.keyInclusions.map((item) => (<li key={item} className="flex items-start gap-2 text-[13px] text-text-secondary"><Check className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />{item}</li>))}</ul>
          </div>
        )}
        {product.keyExclusions.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2"><X className="w-4 h-4 text-error" /> Key Exclusions</h2>
            <ul className="space-y-2">{product.keyExclusions.map((item) => (<li key={item} className="flex items-start gap-2 text-[13px] text-text-secondary"><X className="w-3.5 h-3.5 text-error mt-0.5 shrink-0" />{item}</li>))}</ul>
          </div>
        )}
        {product.specialFeatures.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Special Features</h2>
            <ul className="space-y-2">{product.specialFeatures.map((f) => (<li key={f} className="flex items-start gap-2 text-[13px] text-text-secondary"><Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />{f}</li>))}</ul>
          </div>
        )}
        {product.riders.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-[15px] font-bold text-text-primary mb-4">Riders / Add-ons</h2>
            <ul className="space-y-2">{product.riders.map((r) => (<li key={r} className="flex items-start gap-2 text-[13px] text-text-secondary"><Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />{r}</li>))}</ul>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-warning-light rounded-xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-[11.5px] text-warning leading-relaxed">
          *Data is sourced from publicly available information and may not reflect the latest changes.
          World Best Insurer does not sell insurance. Verify all details with {product.insurerName} directly.
          Confidence: {product.confidenceScore}. Last verified: {product.lastVerified}.
        </p>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <p className="text-[11px] text-text-tertiary mb-1">{label}</p>
      <p className="text-[15px] font-semibold text-text-primary">{value}</p>
    </div>
  );
}
