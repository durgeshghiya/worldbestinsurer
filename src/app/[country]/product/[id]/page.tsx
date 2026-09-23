import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  Shield,
  DollarSign,
  Users,
  RefreshCw,
  ChevronRight,
  Phone,
  Award,
  Info,
  Layers,
} from "lucide-react";
import { getAllProducts, getProductById, getProductsByCategory } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { formatCompact, freshnessLabel, cn } from "@/lib/utils";
import { ProductSchema, BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import ProductTabs from "./ProductTabs";
import ProductQuoteForm from "@/components/ProductQuoteForm";
import ProductEditorial from "@/components/ProductEditorial";
import { AdSlot } from "@/components/AdSlot";
import ReviewSection from "@/components/ReviewSection";
import AffiliateLink from "@/components/AffiliateLink";
import RegistryProductSection from "@/components/registry/RegistryProductSection";
import {
  PRODUCT_TYPE_LABEL,
  formatDate,
  productVerdict,
  siteProductVerdict,
  productView,
  registry,
  robotsFor,
  siteFacts,
} from "@/lib/registry";

export async function generateStaticParams() {
  const params: { country: string; id: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const p of getAllProducts(cc)) {
      params.push({ country: cc, id: p.id });
    }
  }
  // Registry products with no pre-existing site record get a page too.
  const site = siteFacts();
  for (const rp of registry().products) {
    if (!rp.siteProductId && !site.siteProductExists(rp.slug)) params.push({ country: "in", id: rp.slug });
  }
  return params;
}

/**
 * Does the registry hold a sourced UIN or official document for this product?
 * Asked for every country, not just India: product ids are unique across the
 * catalogue, so this returns false elsewhere today and starts returning true
 * without an edit here the moment a registry covers another market.
 */
function hasSourcedFacts(id: string): boolean {
  const reg = registry();
  const rp = reg.productBySiteId.get(id) ?? reg.productBySlug.get(id);
  return Boolean(rp && (rp.uin || reg.documentsByProduct.get(rp.slug)?.length));
}

/** India registry lookup by page id. A site product links via siteProductId. */
function registryFor(country: string, id: string) {
  if (country !== "in") return undefined;
  const reg = registry();
  const rp = reg.productBySiteId.get(id) ?? reg.productBySlug.get(id);
  return rp ? { reg, rp, site: siteFacts() } : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; id: string }>;
}): Promise<Metadata> {
  const { country, id } = await params;
  const product = getProductById(id, country);
  const c = getCountryByCode(country);
  const r = registryFor(country, id);
  if ((!product && !r) || !c) return {};
  const canonical = `https://worldbestinsurer.com/${country}/product/${id}`;

  if (!product && r) {
    const v = productView(r.rp, r.reg);
    const ins = v.insurer?.name.value ?? r.rp.insurerSlug;
    const uin = r.rp.uin?.value;
    const title = `${v.name} by ${ins}${uin ? ` — UIN ${uin}` : ""}`;
    const description =
      `${v.name} from ${ins}: ${PRODUCT_TYPE_LABEL[r.rp.productType].toLowerCase()} insurance` +
      (uin ? `, UIN ${uin}` : "") +
      `. Official documents and product details, each linked to the insurer's own page. Updated ${formatDate(v.updated?.slice(0, 10))}.`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: `${canonical}/`, type: "website" },
      ...robotsFor(productVerdict(id, r.reg, r.site)),
    };
  }

  const uin = r?.rp.uin?.value;
  return {
    title: `${product!.productName} by ${product!.insurerName}${uin ? ` (UIN ${uin})` : ""} \u2014 ${c.name}`,
    description: `Compare ${product!.productName} by ${product!.insurerName}: features, coverage, premiums, and more${uin ? `. IRDAI UIN ${uin}` : ""}. ${c.name} insurance comparison on World Best Insurer.`,
    keywords: [
      product!.productName,
      product!.insurerName,
      product!.category,
      c.name,
      "insurance comparison",
    ],
    alternates: { canonical },
    // A catalogue page earns its place in search by carrying a sourced fact.
    ...robotsFor(siteProductVerdict(country, hasSourcedFacts(id))),
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
  const r = registryFor(country, id);
  if (!c || (!product && !r)) {
    permanentRedirect(c ? `/${country}/compare/health/` : "/compare/health/");
  }

  // Registry-only product: a data page on the same URL pattern.
  if (!product && r) {
    const v = productView(r.rp, r.reg);
    const ins = v.insurer;
    return (
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-10">
        <BreadcrumbSchema
          items={[
            { name: "Home", url: "https://worldbestinsurer.com/" },
            { name: c.name, url: `https://worldbestinsurer.com/${country}/` },
            { name: "Products", url: "https://worldbestinsurer.com/in/products/" },
            { name: v.name, url: `https://worldbestinsurer.com/${country}/product/${id}/` },
          ]}
        />
        {/* Only what the page shows: no price, offer or rating is asserted. */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: v.name,
            url: `https://worldbestinsurer.com/${country}/product/${id}/`,
            category: `${PRODUCT_TYPE_LABEL[r.rp.productType]} insurance`,
            ...(ins && { brand: { "@type": "Brand", name: ins.name.value } }),
            ...(r.rp.uin && {
              productID: r.rp.uin.value,
              identifier: { "@type": "PropertyValue", propertyID: "IRDAI UIN", value: r.rp.uin.value },
            }),
          }}
        />
        <nav className="flex items-center gap-1.5 text-[12px] text-text-tertiary flex-wrap mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${country}`} className="hover:text-primary transition-colors">{c.flag} {c.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/in/products/" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-secondary">{v.name}</span>
        </nav>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          {PRODUCT_TYPE_LABEL[r.rp.productType]}
        </p>
        <h1 className="mt-1 text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">{v.name}</h1>
        <p className="mt-2 text-[15px] text-text-secondary">
          {ins ? (
            <>by <Link href={`/in/insurer/${ins.slug}/`} className="font-medium text-primary hover:underline">{ins.name.value}</Link></>
          ) : null}
          {r.rp.uin && <> · UIN <span className="font-mono text-text-primary">{r.rp.uin.value}</span></>}
        </p>
        <p className="mt-4 max-w-[70ch] text-[14px] leading-relaxed text-text-secondary">
          This page lists what the insurer publishes about {v.name}. We do not have premium or benefit figures
          for this product, so none are shown — read the official documents below for the full terms.
        </p>
        <RegistryProductSection product={r.rp} reg={r.reg} site={r.site} />
      </div>
    );
  }

  if (!product) {
    permanentRedirect(c ? `/${country}/compare/health/` : "/compare/health/");
  }
  const p = product; // alias for brevity

  const freshness = freshnessLabel(p.lastVerified);

  // Get similar products from same category and country
  const peersInCategory = getProductsByCategory(p.category, p.countryCode);
  const similarProducts = peersInCategory
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
      <ProductSchema product={product} uin={r?.rp.uin?.value} />
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
              <Link
                href={`/${country}/insurer/${p.insurerSlug}/`}
                className="text-[12px] font-bold text-primary uppercase tracking-[0.15em] mb-2 hover:underline inline-block"
              >
                {p.insurerName}
              </Link>
              <h1 className="text-[28px] sm:text-[38px] font-extrabold text-text-primary tracking-[-0.03em] leading-tight mb-4">
                {p.productName}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category badge */}
                <Link
                  href={`/${country}/compare/${p.category}/`}
                  className="px-3 py-1 text-[11px] font-semibold rounded-full bg-primary-light text-primary uppercase hover:bg-primary/20 transition-colors"
                >
                  {p.category.replace("-", " ")}
                </Link>
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
              {/* Visit insurer button — with click tracking + affiliate disclosure */}
              {p.sourceUrl && (
                <div className="mt-5">
                  <AffiliateLink
                    productId={p.id}
                    insurerSlug={p.insurerSlug}
                    countryCode={p.countryCode}
                    sourceUrl={p.sourceUrl}
                  />
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
              similarProducts={similarProducts}
            />

            {r && <RegistryProductSection product={r.rp} reg={r.reg} site={r.site} />}

            {/* In-content placement: sits between the spec tables and the
                editorial, i.e. after the reader has had real content. */}
            <AdSlot
              slot={process.env.NEXT_PUBLIC_AD_SLOT_PRODUCT_MID}
              className="my-8"
            />

            {/* =========================================================== */}
            {/*  EDITORIAL ANALYSIS                                         */}
            {/* =========================================================== */}
            <ProductEditorial product={p} countryName={c.name} peers={peersInCategory} />

            <AdSlot
              slot={process.env.NEXT_PUBLIC_AD_SLOT_PRODUCT_END}
              className="my-8"
            />

            {/* =========================================================== */}
            {/*  REVIEWS                                                     */}
            {/* =========================================================== */}
            <ReviewSection productId={p.id} />

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
