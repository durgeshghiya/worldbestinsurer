import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { generateVSPairs, getVSPairBySlug } from "@/lib/generators";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { formatCompact } from "@/lib/utils";

// Only prerendered slugs resolve; unknown slugs 404 at routing (no runtime cost).
// Kept in lockstep with sitemap.ts so Google never discovers a URL that won't resolve.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const p of generateVSPairs(cc).slice(0, 50)) {
      params.push({ country: cc, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; slug: string }> }): Promise<Metadata> {
  const { country, slug } = await params;
  const pair = getVSPairBySlug(slug, country);
  const c = getCountryByCode(country);
  if (!pair || !c) return {};
  return {
    title: `${pair.productA.productName} vs ${pair.productB.productName} — ${c.name}`,
    description: `Compare ${pair.productA.productName} and ${pair.productB.productName} in ${c.name}. Side-by-side feature comparison.`,
  };
}

export default async function CountryVSPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  const pair = getVSPairBySlug(slug, country);
  const c = getCountryByCode(country);
  if (!pair || !c) notFound();

  const { productA: a, productB: b } = pair;

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <Link href={`/${country}/compare/${pair.category}`} className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> {c.flag} {pair.category.replace("-", " ")} insurance in {c.name}
      </Link>

      <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] mb-2">
        {a.productName} <span className="text-text-tertiary font-normal">vs</span> {b.productName}
      </h1>
      <p className="text-[14px] text-text-secondary mb-8">Side-by-side comparison in {c.name}. For educational purposes only.</p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-sunken">
              <th className="text-left p-4 w-1/3 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.06em]">Feature</th>
              <th className="text-left p-4 w-1/3">
                <p className="text-[11px] text-primary font-semibold">{a.insurerName}</p>
                <p className="text-[14px] font-semibold text-text-primary">{a.productName}</p>
              </th>
              <th className="text-left p-4 w-1/3">
                <p className="text-[11px] text-primary font-semibold">{b.insurerName}</p>
                <p className="text-[14px] font-semibold text-text-primary">{b.productName}</p>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            <R label="Cover range" va={`${formatCompact(a.sumInsured.min, country)} – ${formatCompact(a.sumInsured.max, country)}`} vb={`${formatCompact(b.sumInsured.min, country)} – ${formatCompact(b.sumInsured.max, country)}`} />
            <R label="Premium range*" va={`${formatCompact(a.premiumRange.illustrativeMin, country)} – ${formatCompact(a.premiumRange.illustrativeMax, country)}/yr`} vb={`${formatCompact(b.premiumRange.illustrativeMin, country)} – ${formatCompact(b.premiumRange.illustrativeMax, country)}/yr`} />
            <R label="Entry age" va={`${a.eligibility.minAge} – ${a.eligibility.maxAge ?? "N/A"} yrs`} vb={`${b.eligibility.minAge} – ${b.eligibility.maxAge ?? "N/A"} yrs`} />
            <R label="Renewability" va={a.renewability} vb={b.renewability} />
            {a.claimSettlement && b.claimSettlement && (
              <R label="Claim settlement" va={a.claimSettlement.ratio ? `${a.claimSettlement.ratio}%` : "N/A"} vb={b.claimSettlement?.ratio ? `${b.claimSettlement.ratio}%` : "N/A"} />
            )}
            <tr className="hover:bg-surface-sunken/50">
              <td className="p-4 text-[12px] font-medium text-text-secondary">Key features</td>
              <td className="p-4"><FL items={a.specialFeatures} /></td>
              <td className="p-4"><FL items={b.specialFeatures} /></td>
            </tr>
            <tr>
              <td className="p-4" />
              <td className="p-4"><Link href={`/${country}/product/${a.id}`} className="text-[12px] px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors inline-block">View details</Link></td>
              <td className="p-4"><Link href={`/${country}/product/${b.id}`} className="text-[12px] px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors inline-block">View details</Link></td>
            </tr>
          </tbody>
        </table>
      </div>

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
