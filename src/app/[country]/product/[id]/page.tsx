import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  AlertCircle,
  Clock,
  Shield,
  DollarSign,
  Users,
  RefreshCw,
  ChevronRight,
  Phone,
  Mail,
  User,
  Award,
  Info,
  Layers,
  Lock,
} from "lucide-react";
import { getAllProducts, getProductById, getProductsByCategory } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { formatCompact, freshnessLabel, cn } from "@/lib/utils";
import { ProductSchema, BreadcrumbSchema } from "@/components/StructuredData";
import ProductTabs from "./ProductTabs";
import ProductQuoteForm from "@/components/ProductQuoteForm";
import ProductEditorial from "@/components/ProductEditorial";

export async function generateStaticParams() {
  const params: { country: string; id: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const p of getAllProducts(cc)) {
      params.push({ country: cc, id: p.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; id: string }>;
}): Promise<Metadata> {
  const { country, id } = await params;
  const product = getProductById(id, country);
  const c = getCountryByCode(country);
  if (!product || !c) return {};
  return {
    title: `${product.productName} by ${product.insurerName} \u2014 ${c.name}`,
    description: `Compare ${product.productName} features, coverage, premiums, and more. ${c.name} insurance comparison on World Best Insurer.`,
    keywords: [
      product.productName,
      product.insurerName,
      product.category,
      c.name,
      "insurance comparison",
    ],
  };
}

export default async function CountryProductPage({
  params,
}: {
  params: Promise<{ country: string; id: string }>;
}) {
  const { country, id } = await params;
  const product = getProductById(id, country);
  const c = getCountryByCode(country);
  if (!product || !c) notFound();
  const p = product; // alias for brevity

  const freshness = freshnessLabel(p.lastVerified);

  // Get similar products from same category and country
  const similarProducts = getProductsByCategory(p.category, p.countryCode)
    .filter((sp) => sp.id !== p.id)
    .slice(0, 4);

  // Confidence badge config
  const confidenceBadge = {
    high: { label: "High Confidence", color: "bg-success/10 text-success border-success/20" },
    medium: { label: "Medium Confidence", color: "bg-warning/10 text-warning border-warning/20" },
    low: { label: "Low Confidence", color: "bg-error/10 text-error border-error/20" },
  }[p.confidenceScore];

  return (
    <div className="min-h-screen">
      <ProductSchema product={product} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: c.name, url: `https://worldbestinsurer.com/${country}` },
          {
            name: p.category.replace("-", " "),
            url: `https://worldbestinsurer.com/${country}/compare/${p.category}`,
          },
          {
            name: p.productName,
            url: `https://worldbestinsurer.com/${country}/product/${p.id}`,
          },
        ]}
      />

      {/* ================================================================= */}
      {/*  BREADCRUMB                                                       */}
      {/* ================================================================= */}
      <div className="bg-surface-sunken/30 border-b border-border">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-[12px] text-text-tertiary flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${country}`} className="hover:text-primary transition-colors">{c.flag} {c.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${country}/compare/${p.category}`} className="hover:text-primary transition-colors capitalize">
              {p.category.replace("-", " ")} Insurance
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary font-medium truncate max-w-[200px]">{p.productName}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* ============================================================= */}
          {/*  MAIN CONTENT COLUMN                                          */}
          {/* ============================================================= */}
          <div className="min-w-0">
            {/* Back link */}
            <Link
              href={`/${country}/compare/${p.category}`}
              className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {p.category.replace("-", " ")} insurance in {c.name}
            </Link>

            {/* =========================================================== */}
            {/*  PRODUCT HEADER                                             */}
            {/* =========================================================== */}
            <div className="mb-8">
              <p className="text-[12px] font-bold text-primary uppercase tracking-[0.15em] mb-2">
                {p.insurerName}
              </p>
              <h1 className="text-[28px] sm:text-[38px] font-extrabold text-text-primary tracking-[-0.03em] leading-tight mb-4">
                {p.productName}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category badge */}
                <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-primary-light text-primary uppercase">
                  {p.category.replace("-", " ")}
                </span>
                {/* Sub-category */}
                {p.subCategory && (
                  <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-surface-sunken text-text-secondary">
                    {p.subCategory.replace(/-/g, " ")}
                  </span>
                )}
                {/* Confidence badge */}
                <span className={cn("px-3 py-1 text-[11px] font-medium rounded-full border", confidenceBadge.color)}>
                  <Award className="w-3 h-3 inline mr-1" />
                  {confidenceBadge.label}
                </span>
                {/* Freshness badge */}
                <span
                  className={cn(
                    "px-3 py-1 text-[11px] font-medium rounded-full",
                    freshness.color === "green"
                      ? "bg-success/10 text-success"
                      : freshness.color === "amber"
                        ? "bg-warning/10 text-warning"
                        : "bg-error/10 text-error"
                  )}
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  {freshness.label}
                </span>
              </div>
              {/* Visit insurer button */}
              {p.sourceUrl && (
                <div className="mt-5">
                  <a
                    href={p.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    Visit Insurer Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* =========================================================== */}
            {/*  KEY METRICS ROW                                            */}
            {/* =========================================================== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard
                icon={<Shield className="w-5 h-5 text-indigo-500" />}
                label="Cover Range"
                value={`${formatCompact(p.sumInsured.min, p.countryCode)} \u2013 ${formatCompact(p.sumInsured.max, p.countryCode)}`}
              />
              <MetricCard
                icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
                label="Starting Premium"
                value={`${formatCompact(p.premiumRange.illustrativeMin, p.countryCode)} \u2013 ${formatCompact(p.premiumRange.illustrativeMax, p.countryCode)}/yr*`}
              />
              <MetricCard
                icon={<Users className="w-5 h-5 text-amber-500" />}
                label="Entry Age"
                value={`${p.eligibility.minAge} \u2013 ${p.eligibility.maxAge ?? "N/A"} years`}
              />
              <MetricCard
                icon={<RefreshCw className="w-5 h-5 text-teal-500" />}
                label="Renewability"
                value={p.renewability}
              />
            </div>

            {/* =========================================================== */}
            {/*  TABBED CONTENT                                             */}
            {/* =========================================================== */}
            <ProductTabs
              product={p}
              countryCode={p.countryCode}
              similarProducts={similarProducts}
            />

            {/* =========================================================== */}
            {/*  EDITORIAL ANALYSIS                                         */}
            {/* =========================================================== */}
            <ProductEditorial product={p} countryName={c.name} />

            {/* =========================================================== */}
            {/*  SIMILAR PRODUCTS                                           */}
            {/* =========================================================== */}
            {similarProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-[20px] font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  You might also like
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarProducts.slice(0, 3).map((sp) => (
                    <Link
                      key={sp.id}
                      href={`/${sp.countryCode}/product/${sp.id}`}
                      className="group card-premium bg-surface rounded-2xl border border-border p-5 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                    >
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                        {sp.insurerName}
                      </p>
                      <h3 className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors mb-2 leading-tight">
                        {sp.productName}
                      </h3>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-text-tertiary">Cover</span>
                          <span className="font-medium text-text-secondary">
                            {formatCompact(sp.sumInsured.min, sp.countryCode)} \u2013 {formatCompact(sp.sumInsured.max, sp.countryCode)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-text-tertiary">Premium</span>
                          <span className="font-medium text-text-secondary">
                            from {formatCompact(sp.premiumRange.illustrativeMin, sp.countryCode)}/yr
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:gap-2 transition-all">
                        View details <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================= */}
          {/*  SIDEBAR (desktop) / BOTTOM (mobile)                          */}
          {/* ============================================================= */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Interested card */}
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-[16px] font-bold text-text-primary">
                  Interested in this plan?
                </h3>
              </div>
              <p className="text-[12.5px] text-text-tertiary mb-5 leading-relaxed">
                Get a free quote from {p.insurerName} for this plan.
              </p>
              <ProductQuoteForm
                productId={p.id}
                insurerSlug={p.insurerSlug}
                insurerName={p.insurerName}
                category={p.category}
                countryCode={p.countryCode}
              />
            </div>

            {/* Quick info card */}
            <div className="bg-surface rounded-2xl border border-border p-5">
              <h4 className="text-[13px] font-bold text-text-primary mb-3 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-primary" /> Quick Info
              </h4>
              <div className="space-y-2.5">
                <InfoRow label="Insurer" value={p.insurerName} />
                <InfoRow label="Category" value={p.category.replace("-", " ")} />
                <InfoRow label="Country" value={`${c.flag} ${c.name}`} />
                <InfoRow label="Confidence" value={p.confidenceScore} />
                <InfoRow label="Last Verified" value={p.lastVerified} />
                {p.claimSettlement?.ratio && (
                  <InfoRow label="Claim Ratio" value={`${p.claimSettlement.ratio}%`} />
                )}
                {p.networkHospitals?.count && (
                  <InfoRow label="Network Hospitals" value={`${p.networkHospitals.count.toLocaleString()}`} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/*  DISCLAIMER FOOTER                                               */}
        {/* ================================================================= */}
        <div className="mt-12 p-5 bg-warning-light rounded-xl flex items-start gap-3 max-w-[1200px]">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-warning mb-1">Important Disclaimer</p>
            <p className="text-[11.5px] text-warning/80 leading-relaxed">
              *Data is sourced from publicly available information and may not reflect the latest changes.
              World Best Insurer does not sell insurance. Verify all details with {p.insurerName} directly.
              Confidence: {p.confidenceScore}. Last verified: {p.lastVerified}.
              Premium figures are illustrative based on {p.premiumRange.assumptions || "standard assumptions"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-[15px] font-bold text-text-primary leading-snug">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-text-tertiary">{label}</span>
      <span className="font-medium text-text-secondary capitalize">{value}</span>
    </div>
  );
}

// Trust badge uses Check icon from lucide-react (imported at top)
