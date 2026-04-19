import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ExternalLink, Building2, Calendar, Shield, Activity } from "lucide-react";
import { getInsurerBySlug, getProductsByInsurer } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { generateInsurerVSPairs, type InsurerPair } from "@/lib/generators";
import { formatCompact } from "@/lib/utils";
import { BreadcrumbSchema } from "@/components/StructuredData";

function findInsurerPair(slug: string, countryCode: string): InsurerPair | undefined {
  // Parse slug: "hdfc-life-vs-icici-prudential"
  // Try every possible split position for the "-vs-" separator
  const vsIdx = slug.indexOf("-vs-");
  if (vsIdx === -1) return undefined;

  // There may be multiple "-vs-" in the slug, try each split
  let pos = 0;
  while (pos < slug.length) {
    const idx = slug.indexOf("-vs-", pos);
    if (idx === -1) break;

    const slugA = slug.slice(0, idx);
    const slugB = slug.slice(idx + 4);

    const a = getInsurerBySlug(slugA, countryCode);
    const b = getInsurerBySlug(slugB, countryCode);

    if (a && b) {
      return { slug, insurerA: a, insurerB: b, countryCode };
    }

    pos = idx + 1;
  }

  return undefined;
}

/* ────────────────────────────────────────────────────────── */
/*  Static params — top 100 pairs per country                */
/* ────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    const pairs = generateInsurerVSPairs(cc).slice(0, 100);
    for (const pair of pairs) {
      params.push({ country: cc, slug: pair.slug });
    }
  }
  return params;
}

export const dynamicParams = false;

/* ────────────────────────────────────────────────────────── */
/*  Metadata                                                  */
/* ────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}): Promise<Metadata> {
  const { country, slug } = await params;
  const pair = findInsurerPair(slug, country);
  const c = getCountryByCode(country);
  if (!pair || !c) return {};

  const { insurerA: a, insurerB: b } = pair;
  return {
    title: `${a.shortName} vs ${b.shortName} — Insurance Comparison in ${c.name}`,
    description: `Compare ${a.name} and ${b.name} side by side. Claim settlement ratio, products, network hospitals, and more in ${c.name}.`,
  };
}

/* ────────────────────────────────────────────────────────── */
/*  Page                                                      */
/* ────────────────────────────────────────────────────────── */

export default async function InsurerVSPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
  const pair = findInsurerPair(slug, country);
  const c = getCountryByCode(country);
  if (!pair || !c) notFound();

  const { insurerA: a, insurerB: b } = pair;

  const productsA = getProductsByInsurer(a.slug, country);
  const productsB = getProductsByInsurer(b.slug, country);

  // Shared categories
  const sharedCats = a.categories.filter((cat) => b.categories.includes(cat));

  return (
    <div className="mx-auto max-w-[900px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: c.name, url: `https://worldbestinsurer.com/${country}` },
          { name: "Insurers", url: `https://worldbestinsurer.com/${country}/insurers` },
          { name: `${a.shortName} vs ${b.shortName}`, url: `https://worldbestinsurer.com/${country}/vs/insurer/${slug}` },
        ]}
      />

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `Which is better, ${a.shortName} or ${b.shortName}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `The better choice depends on your needs. ${a.shortName} has a claim settlement ratio of ${a.claimSettlementRatio?.value ?? "N/A"}% while ${b.shortName} has ${b.claimSettlementRatio?.value ?? "N/A"}%. ${a.shortName} offers ${productsA.length} products and ${b.shortName} offers ${productsB.length} products in ${c.name}. Compare specific plans on World Best Insurer.`,
                },
              },
              {
                "@type": "Question",
                name: `How does ${a.shortName} claim settlement compare to ${b.shortName}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${a.shortName} has a claim settlement ratio of ${a.claimSettlementRatio?.value ?? "data not available"}%${a.claimSettlementRatio?.year ? ` (${a.claimSettlementRatio.year})` : ""}. ${b.shortName} has a claim settlement ratio of ${b.claimSettlementRatio?.value ?? "data not available"}%${b.claimSettlementRatio?.year ? ` (${b.claimSettlementRatio.year})` : ""}.`,
                },
              },
            ],
          }),
        }}
      />

      <Link
        href={`/${country}/insurers`}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All insurers in {c.name}
      </Link>

      {/* Title */}
      <h1 className="text-[26px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] mb-2">
        {a.shortName} vs {b.shortName}
      </h1>
      <p className="text-[14px] text-text-tertiary mb-10">
        Side-by-side comparison in {c.name}
      </p>

      {/* ─── Comparison table ─── */}
      <div className="rounded-2xl border border-border overflow-hidden mb-10">
        {/* Header row */}
        <div className="grid grid-cols-3 bg-surface-sunken">
          <div className="p-4 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            Metric
          </div>
          <div className="p-4 text-center">
            <p className="text-[14px] font-bold text-text-primary">{a.shortName}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[14px] font-bold text-text-primary">{b.shortName}</p>
          </div>
        </div>

        <CompareRow label="Full Name" valA={a.name} valB={b.name} />
        <CompareRow
          label="Established"
          valA={a.established ? String(a.established) : "—"}
          valB={b.established ? String(b.established) : "—"}
          icon={<Calendar className="w-3.5 h-3.5" />}
        />
        <CompareRow label="Headquarters" valA={a.headquarters} valB={b.headquarters} icon={<Building2 className="w-3.5 h-3.5" />} />
        <CompareRow
          label="Claim Settlement"
          valA={a.claimSettlementRatio?.value ? `${a.claimSettlementRatio.value}%` : "—"}
          valB={b.claimSettlementRatio?.value ? `${b.claimSettlementRatio.value}%` : "—"}
          icon={<Activity className="w-3.5 h-3.5" />}
          highlight
        />
        <CompareRow
          label="Network Hospitals"
          valA={a.networkHospitals ? a.networkHospitals.toLocaleString() : "—"}
          valB={b.networkHospitals ? b.networkHospitals.toLocaleString() : "—"}
          icon={<Shield className="w-3.5 h-3.5" />}
        />
        <CompareRow
          label="Products in {c.name}"
          valA={String(productsA.length)}
          valB={String(productsB.length)}
        />
        <CompareRow
          label="Categories"
          valA={a.categories.join(", ")}
          valB={b.categories.join(", ")}
        />
        <CompareRow
          label="Listed"
          valA={a.listed ? "Yes" : "No"}
          valB={b.listed ? "Yes" : "No"}
        />

        {/* Action row */}
        <div className="grid grid-cols-3 border-t border-border bg-surface">
          <div className="p-4" />
          <div className="p-4 text-center">
            <Link
              href={`/${country}/insurer/${a.slug}`}
              className="text-[12px] font-semibold text-primary hover:underline"
            >
              View {a.shortName} →
            </Link>
          </div>
          <div className="p-4 text-center">
            <Link
              href={`/${country}/insurer/${b.slug}`}
              className="text-[12px] font-semibold text-primary hover:underline"
            >
              View {b.shortName} →
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Product-level comparisons ─── */}
      {sharedCats.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[18px] font-bold text-text-primary mb-5">
            Compare Their Products
          </h2>
          {sharedCats.map((cat) => {
            const catProductsA = productsA.filter((p) => p.category === cat);
            const catProductsB = productsB.filter((p) => p.category === cat);
            if (catProductsA.length === 0 && catProductsB.length === 0) return null;

            return (
              <div key={cat} className="mb-6">
                <h3 className="text-[14px] font-semibold text-text-secondary capitalize mb-3">
                  {cat.replace("-", " ")} Insurance
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* A's products */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                      {a.shortName}
                    </p>
                    {catProductsA.length === 0 ? (
                      <p className="text-[12px] text-text-tertiary italic">No products</p>
                    ) : (
                      catProductsA.map((p) => (
                        <Link
                          key={p.id}
                          href={`/${country}/product/${p.id}`}
                          className="block p-3 bg-surface rounded-lg border border-border hover:border-primary/15 transition-colors group"
                        >
                          <p className="text-[12px] font-medium text-text-primary group-hover:text-primary truncate">
                            {p.productName}
                          </p>
                          <p className="text-[10px] text-text-tertiary mt-0.5">
                            {formatCompact(p.sumInsured.min, country)} – {formatCompact(p.sumInsured.max, country)}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                  {/* B's products */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                      {b.shortName}
                    </p>
                    {catProductsB.length === 0 ? (
                      <p className="text-[12px] text-text-tertiary italic">No products</p>
                    ) : (
                      catProductsB.map((p) => (
                        <Link
                          key={p.id}
                          href={`/${country}/product/${p.id}`}
                          className="block p-3 bg-surface rounded-lg border border-border hover:border-primary/15 transition-colors group"
                        >
                          <p className="text-[12px] font-medium text-text-primary group-hover:text-primary truncate">
                            {p.productName}
                          </p>
                          <p className="text-[10px] text-text-tertiary mt-0.5">
                            {formatCompact(p.sumInsured.min, country)} – {formatCompact(p.sumInsured.max, country)}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Disclaimer ─── */}
      <div className="p-4 bg-surface-sunken rounded-xl text-[11px] text-text-tertiary leading-relaxed">
        Data sourced from official insurer websites and regulatory publications.
        Claim settlement ratios are from publicly available regulatory reports.
        Verify all information directly with the insurers.{" "}
        <Link href="/methodology" className="text-primary hover:underline">
          Our methodology
        </Link>
      </div>
    </div>
  );
}

/* ─── Sub-component ─── */

function CompareRow({
  label,
  valA,
  valB,
  icon,
  highlight,
}: {
  label: string;
  valA: string;
  valB: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`grid grid-cols-3 border-t border-border ${highlight ? "bg-primary/[0.02]" : ""}`}>
      <div className="p-4 flex items-center gap-1.5 text-[12px] text-text-secondary font-medium">
        {icon && <span className="text-text-tertiary">{icon}</span>}
        {label}
      </div>
      <div className="p-4 text-center text-[13px] text-text-primary font-medium">
        {valA}
      </div>
      <div className="p-4 text-center text-[13px] text-text-primary font-medium">
        {valB}
      </div>
    </div>
  );
}
