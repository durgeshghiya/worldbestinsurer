import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  ExternalLink,
  AlertCircle,
  Shield,
  Clock,
  Star,
} from "lucide-react";
import { getAllProducts, getProductById, formatCurrencyFull, formatCurrency } from "@/lib/data";
import { ProductSchema, BreadcrumbSchema } from "@/components/StructuredData";

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  const categoryLabels: Record<string, string> = {
    health: "Health Insurance",
    "term-life": "Term Life Insurance",
    motor: "Motor Insurance",
    travel: "Travel Insurance",
  };
  const catLabel = categoryLabels[product.category] ?? product.category;
  const insurerShortMeta = product.insurerName.split(" ").slice(0, 2).join(" ");

  return {
    title: `${product.productName} by ${insurerShortMeta}`,
    description: `Compare ${product.productName} by ${product.insurerName} — a ${catLabel} plan. Coverage from ${product.sumInsured.min ?? "N/A"} to ${product.sumInsured.max ?? "N/A"}. ${product.specialFeatures.slice(0, 2).join(". ")}. Verified data on World Best Insurer.`,
    keywords: [
      product.productName,
      product.insurerName,
      catLabel,
      `${insurerShortMeta} insurance`,
      `${product.subCategory} insurance India`,
      "insurance comparison India",
    ],
    alternates: {
      canonical: `https://worldbestinsurer.com/product/${product.id}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quoteUrl: string | undefined = (product as any).quoteUrl;
  const insurerShort = product.insurerName.split(" ").slice(0, 2).join(" ");

  const categoryLabels: Record<string, string> = {
    health: "Health Insurance",
    "term-life": "Term Life Insurance",
    motor: "Motor Insurance",
    travel: "Travel Insurance",
  };

  return (
    <>
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <ProductSchema product={product} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          {
            name: `Compare ${categoryLabels[product.category] ?? product.category}`,
            url: `https://worldbestinsurer.com/compare/${product.category}`,
          },
          {
            name: product.productName,
            url: `https://worldbestinsurer.com/product/${product.id}`,
          },
        ]}
      />
      {/* Breadcrumb */}
      <Link
        href={`/compare/${product.category}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {product.category.replace("-", " ")} insurance
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-primary mb-1">
          {product.insurerName}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {product.productName}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">
            {product.subCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              product.confidenceScore === "high"
                ? "bg-green-50 text-green-700"
                : product.confidenceScore === "medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            Data: {product.confidenceScore}
          </span>
          <span className="text-xs text-muted">
            Last verified: {product.lastVerified}
          </span>
        </div>
      </div>

      {/* Get Quote CTA */}
      {quoteUrl && (
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <a
            href={quoteUrl as string}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            Get Quote from {insurerShort}
          </a>
          <a
            href={quoteUrl as string}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-green-600 text-green-700 hover:bg-green-50 font-medium rounded-xl transition-colors text-sm"
          >
            Buy Online
          </a>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          This information is for educational purposes only. Data sourced from
          publicly available information. World Best Insurer does not sell insurance. Please
          verify all details with {product.insurerName} before making any decision.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-border p-5">
              <p className="text-xs text-muted mb-1">Sum Insured Range</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(product.sumInsured.min)} &ndash;{" "}
                {formatCurrency(product.sumInsured.max)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-5">
              <p className="text-xs text-muted mb-1">Illustrative Premium*</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrencyFull(product.premiumRange.illustrativeMin)} &ndash;{" "}
                {formatCurrencyFull(product.premiumRange.illustrativeMax)}/yr
              </p>
              <p className="text-[10px] text-muted mt-1">
                *{product.premiumRange.assumptions}
              </p>
            </div>
            {product.claimSettlement?.ratio != null && (
              <div className="bg-white rounded-xl border border-border p-5">
                <p className="text-xs text-muted mb-1">Claim Settlement Ratio</p>
                <p className="text-xl font-bold text-foreground">
                  {product.claimSettlement.ratio}%
                </p>
                <p className="text-[10px] text-muted mt-1">
                  {product.claimSettlement.year} &middot; {product.claimSettlement.source}
                </p>
              </div>
            )}
            {product.networkHospitals && (
              <div className="bg-white rounded-xl border border-border p-5">
                <p className="text-xs text-muted mb-1">Network Hospitals</p>
                <p className="text-xl font-bold text-foreground">
                  {(product.networkHospitals.count / 1000).toFixed(0)}K+
                </p>
                <p className="text-[10px] text-muted mt-1">
                  {product.networkHospitals.source}
                </p>
              </div>
            )}
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-success" /> Key Inclusions
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {product.keyInclusions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" /> Key Exclusions
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {product.keyExclusions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Waiting Periods */}
          {product.waitingPeriod && product.waitingPeriod.initial !== "N/A" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Waiting Periods
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Initial</p>
                  <p className="text-sm font-semibold">{product.waitingPeriod.initial}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Pre-Existing Diseases</p>
                  <p className="text-sm font-semibold">{product.waitingPeriod.preExisting}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Specific Diseases</p>
                  <p className="text-sm font-semibold">{product.waitingPeriod.specific}</p>
                </div>
              </div>
            </div>
          )}

          {/* Special Features */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Special Features
            </h2>
            <ul className="space-y-2">
              {product.specialFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick info */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Info</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Entry Age</dt>
                <dd className="font-medium">
                  {product.eligibility.minAge} &ndash; {product.eligibility.maxAge ?? "N/A"} years
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Renewability</dt>
                <dd className="font-medium">{product.renewability}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Policy Tenure</dt>
                <dd className="font-medium">
                  {product.policyTenure.options.length
                    ? product.policyTenure.options.join(", ") + " years"
                    : `${product.policyTenure.min ?? "?"} – ${product.policyTenure.max ?? "?"} years`}
                </dd>
              </div>
            </dl>
          </div>

          {/* Riders */}
          {product.riders.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Available Riders
              </h3>
              <ul className="space-y-2">
                {product.riders.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm">
                    <Shield className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Data Source</h3>
            <p className="text-xs text-muted mb-2">
              Source type: {product.sourceType.replace(/-/g, " ")}
            </p>
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Visit insurer page <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[10px] text-muted mt-3 leading-relaxed">
              {product.notes}
            </p>
          </div>

          {/* CTA */}
          <div className="bg-primary-light rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Interested in this plan?
            </h3>
            <p className="text-xs text-muted mb-3">
              Verify details directly with {insurerShort}. World Best Insurer currently provides comparison information only.
            </p>
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              Visit Insurer Website
            </a>
            <Link
              href="/waitlist"
              className="block text-center py-2.5 text-sm font-medium text-primary mt-2 border border-primary/20 rounded-lg hover:bg-white transition-colors"
            >
              Get Notified When Advisory Launches
            </Link>
          </div>
        </div>
      </div>
    </div>

      {/* Sticky mobile CTA */}
      {quoteUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur border-t border-gray-200 md:hidden">
          <a
            href={quoteUrl as string}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm shadow-lg"
          >
            <ExternalLink className="w-4 h-4" />
            Get Quote — {insurerShort}
          </a>
        </div>
      )}
    </>
  );
}
