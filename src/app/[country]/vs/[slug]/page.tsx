import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, AlertCircle, HelpCircle } from "lucide-react";
import { generateVSPairs, getVSPairBySlug } from "@/lib/generators";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { formatCompact } from "@/lib/utils";
import VSEditorial from "@/components/VSEditorial";
import { AdSlot } from "@/components/AdSlot";
import { BreadcrumbSchema, VSPairSchema, FAQSchema } from "@/components/StructuredData";

export const dynamicParams = true;

export async function generateStaticParams() {
  // Return empty array to rely entirely on on-demand rendering (dynamicParams = true).
  // This prevents the build from timing out when trying to statically render 54,000+ combinations.
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}): Promise<Metadata> {
  const { country, slug } = await params;
  const pair = getVSPairBySlug(slug, country);
  const c = getCountryByCode(country);
  if (!pair || !c) return {};

  const { productA: a, productB: b } = pair;
  const canonicalUrl = `https://worldbestinsurer.com/${country}/vs/${slug}/`;
  const title = `${a.productName} vs ${b.productName} — ${c.name} (2026 Comparison)`;
  const description = `Compare ${a.productName} by ${a.insurerName} and ${b.productName} by ${b.insurerName} in ${c.name}. Side-by-side analysis of premiums, sum insured, exclusions, and waiting periods.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "World Best Insurer",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CountryVSPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
  const pair = getVSPairBySlug(slug, country);
  const c = getCountryByCode(country);
  if (!pair || !c) {
    permanentRedirect(c ? `/${country}/compare/health/` : "/compare/health/");
  }

  const { productA: a, productB: b } = pair;
  const canonicalUrl = `https://worldbestinsurer.com/${country}/vs/${slug}/`;
  const catLabel = pair.category.replace("-", " ");

  const faqs = [
    {
      q: `What is the main difference between ${a.productName} and ${b.productName}?`,
      a: `${a.productName} is offered by ${a.insurerName} with an illustrative sum insured of ${formatCompact(a.sumInsured.min, country)} to ${formatCompact(a.sumInsured.max, country)}, whereas ${b.productName} is backed by ${b.insurerName} covering ${formatCompact(b.sumInsured.min, country)} to ${formatCompact(b.sumInsured.max, country)}. Each plan features unique policy wording regarding waiting periods and restore benefits.`,
    },
    {
      q: `Which plan has a lower starting premium, ${a.productName} or ${b.productName}?`,
      a: `Illustrative premiums start at approximately ${formatCompact(a.premiumRange.illustrativeMin, country)}/year for ${a.productName} and ${formatCompact(b.premiumRange.illustrativeMin, country)}/year for ${b.productName}. Actual quotes vary based on applicant age, lifestyle, medical history, and selected deductible.`,
    },
    {
      q: `Are pre-existing conditions covered under both ${a.productName} and ${b.productName}?`,
      a: `Both policies cover declared pre-existing diseases after the completion of their statutory waiting periods (subject to underwriting acceptance and regulatory caps).`,
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: c.name, url: `https://worldbestinsurer.com/${country}/` },
          { name: `Compare ${catLabel}`, url: `https://worldbestinsurer.com/${country}/compare/${pair.category}/` },
          { name: `${a.productName} vs ${b.productName}`, url: canonicalUrl },
        ]}
      />
      <VSPairSchema
        title={`${a.productName} vs ${b.productName}`}
        description={`Side-by-side comparison of ${a.productName} by ${a.insurerName} and ${b.productName} by ${b.insurerName} in ${c.name}.`}
        url={canonicalUrl}
        itemA={{ name: a.productName, brand: a.insurerName, url: `https://worldbestinsurer.com/${country}/product/${a.id}/` }}
        itemB={{ name: b.productName, brand: b.insurerName, url: `https://worldbestinsurer.com/${country}/product/${b.id}/` }}
      />
      <FAQSchema questions={faqs} />

      <Link
        href={`/${country}/compare/${pair.category}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {c.flag} {catLabel} insurance in {c.name}
      </Link>

      <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] mb-2">
        {a.productName} <span className="text-text-tertiary font-normal">vs</span> {b.productName}
      </h1>
      <p className="text-[14px] text-text-secondary mb-8">
        Side-by-side comparison in {c.name}. Verified regulatory and policy data. For educational purposes only.
      </p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-sunken">
              <th className="text-left p-4 w-1/3 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.06em]">Feature</th>
              <th className="text-left p-4 w-1/3">
                <Link href={`/${country}/insurer/${a.insurerSlug}/`} className="text-[11px] text-primary font-semibold hover:underline block mb-0.5">
                  {a.insurerName}
                </Link>
                <Link href={`/${country}/product/${a.id}/`} className="text-[14px] font-semibold text-text-primary hover:text-primary transition-colors block">
                  {a.productName}
                </Link>
              </th>
              <th className="text-left p-4 w-1/3">
                <Link href={`/${country}/insurer/${b.insurerSlug}/`} className="text-[11px] text-primary font-semibold hover:underline block mb-0.5">
                  {b.insurerName}
                </Link>
                <Link href={`/${country}/product/${b.id}/`} className="text-[14px] font-semibold text-text-primary hover:text-primary transition-colors block">
                  {b.productName}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            <R label="Cover range" va={`${formatCompact(a.sumInsured.min, country)} – ${formatCompact(a.sumInsured.max, country)}`} vb={`${formatCompact(b.sumInsured.min, country)} – ${formatCompact(b.sumInsured.max, country)}`} />
            <R label="Premium range*" va={`${formatCompact(a.premiumRange.illustrativeMin, country)} – ${formatCompact(a.premiumRange.illustrativeMax, country)}/yr`} vb={`${formatCompact(b.premiumRange.illustrativeMin, country)} – ${formatCompact(b.premiumRange.illustrativeMax, country)}/yr`} />
            <R label="Entry age" va={`${a.eligibility.minAge} – ${a.eligibility.maxAge ?? "N/A"} yrs`} vb={`${b.eligibility.minAge} – ${b.eligibility.maxAge ?? "N/A"} yrs`} />
            <R label="Renewability" va={a.renewability} vb={b.renewability} />
            {a.claimSettlement && b.claimSettlement && (
              <R label="Claim settlement" va={a.claimSettlement.ratio ? `${a.claimSettlement.ratio}%` : "N/A"} vb={b.claimSettlement?.ratio ? `${b.claimSettlement?.ratio}%` : "N/A"} />
            )}
            <tr className="hover:bg-surface-sunken/50">
              <td className="p-4 text-[12px] font-medium text-text-secondary">Key features</td>
              <td className="p-4"><FL items={a.specialFeatures} /></td>
              <td className="p-4"><FL items={b.specialFeatures} /></td>
            </tr>
            <tr>
              <td className="p-4" />
              <td className="p-4"><Link href={`/${country}/product/${a.id}/`} className="text-[12px] px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors inline-block">View details</Link></td>
              <td className="p-4"><Link href={`/${country}/product/${b.id}/`} className="text-[12px] px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors inline-block">View details</Link></td>
            </tr>
          </tbody>
        </table>
      </div>

      <VSEditorial a={a} b={b} countryName={c.name} />

      {/* Comparison FAQ Block */}
      <div className="my-8 bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Comparison FAQs: {a.productName} vs {b.productName}
        </h2>
        <div className="space-y-6 divide-y divide-border">
          {faqs.map((faq, idx) => (
            <div key={idx} className={idx > 0 ? "pt-5" : ""}>
              <h3 className="text-base font-medium text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_VS_END} className="my-8" />

      <div className="mt-6 p-4 bg-warning-light rounded-xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-[11.5px] text-warning leading-relaxed">
          *Illustrative premiums from public sources. Actual premiums vary. World Best Insurer does not sell insurance. Verify with insurers directly.
        </p>
      </div>
    </div>
  );
}

function R({ label, va, vb }: { label: string; va: string; vb: string }) {
  return (<tr className="hover:bg-surface-sunken/50 transition-colors"><td className="p-4 text-[12px] font-medium text-text-secondary">{label}</td><td className="p-4 text-[13px] font-medium text-text-primary">{va}</td><td className="p-4 text-[13px] font-medium text-text-primary">{vb}</td></tr>);
}

function FL({ items }: { items: string[] }) {
  return (<ul className="space-y-1">{items.slice(0, 5).map((f) => (<li key={f} className="flex items-start gap-1.5 text-[12px] text-text-secondary"><Check className="w-3 h-3 text-success mt-0.5 shrink-0" />{f}</li>))}</ul>);
}
