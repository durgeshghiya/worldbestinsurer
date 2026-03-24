import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, X, ExternalLink, AlertCircle } from "lucide-react";
import { generateVSPairs, getVSPairBySlug } from "@/lib/generators";
import { formatCompact, freshnessLabel, cn } from "@/lib/utils";

export async function generateStaticParams() {
  return generateVSPairs().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pair = getVSPairBySlug(slug);
  if (!pair) return {};
  return {
    title: `${pair.productA.productName} vs ${pair.productB.productName}`,
    description: `Compare ${pair.productA.productName} and ${pair.productB.productName}. Side-by-side feature comparison for Indian consumers.`,
  };
}

export default async function VSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pair = getVSPairBySlug(slug);
  if (!pair) notFound();

  const { productA: a, productB: b } = pair;

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <Link href={`/compare/${pair.category}`} className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to {pair.category.replace("-", " ")} insurance
      </Link>

      <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] mb-2">
        {a.productName} <span className="text-text-tertiary font-normal">vs</span> {b.productName}
      </h1>
      <p className="text-[14px] text-text-secondary mb-8">
        Side-by-side comparison based on publicly available data. For educational purposes only.
      </p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-sunken">
              <th className="text-left p-4 w-1/3 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.06em]">Feature</th>
              <th className="text-left p-4 w-1/3">
                <p className="text-[11px] text-primary font-semibold">{a.insurerName.split(" ").slice(0, 2).join(" ")}</p>
                <p className="text-[14px] font-semibold text-text-primary">{a.productName}</p>
              </th>
              <th className="text-left p-4 w-1/3">
                <p className="text-[11px] text-primary font-semibold">{b.insurerName.split(" ").slice(0, 2).join(" ")}</p>
                <p className="text-[14px] font-semibold text-text-primary">{b.productName}</p>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            <R label="Cover range" va={`${formatCompact(a.sumInsured.min)} – ${formatCompact(a.sumInsured.max)}`} vb={`${formatCompact(b.sumInsured.min)} – ${formatCompact(b.sumInsured.max)}`} />
            <R label="Illustrative premium*" va={`${formatCompact(a.premiumRange.illustrativeMin)} – ${formatCompact(a.premiumRange.illustrativeMax)}/yr`} vb={`${formatCompact(b.premiumRange.illustrativeMin)} – ${formatCompact(b.premiumRange.illustrativeMax)}/yr`} />
            <R label="Entry age" va={`${a.eligibility.minAge} – ${a.eligibility.maxAge ?? "N/A"} yrs`} vb={`${b.eligibility.minAge} – ${b.eligibility.maxAge ?? "N/A"} yrs`} />
            <R label="Renewability" va={a.renewability} vb={b.renewability} />
            <R label="Claim settlement ratio" va={a.claimSettlement?.ratio ? `${a.claimSettlement.ratio}%` : "N/A"} vb={b.claimSettlement?.ratio ? `${b.claimSettlement.ratio}%` : "N/A"} />
            {a.waitingPeriod && b.waitingPeriod && (
              <>
                <R label="Initial waiting" va={a.waitingPeriod.initial} vb={b.waitingPeriod!.initial} />
                <R label="PED waiting" va={a.waitingPeriod.preExisting} vb={b.waitingPeriod!.preExisting} />
              </>
            )}
            {(a.networkHospitals || b.networkHospitals) && (
              <R label="Network hospitals" va={a.networkHospitals ? `${(a.networkHospitals.count/1000).toFixed(0)}K+` : "N/A"} vb={b.networkHospitals ? `${(b.networkHospitals.count/1000).toFixed(0)}K+` : "N/A"} />
            )}
            <tr className="hover:bg-surface-sunken/50">
              <td className="p-4 text-[12px] font-medium text-text-secondary">Key features</td>
              <td className="p-4"><FeatureList items={a.specialFeatures} /></td>
              <td className="p-4"><FeatureList items={b.specialFeatures} /></td>
            </tr>
            <tr className="hover:bg-surface-sunken/50">
              <td className="p-4 text-[12px] font-medium text-text-secondary">Riders</td>
              <td className="p-4"><FeatureList items={a.riders} /></td>
              <td className="p-4"><FeatureList items={b.riders} /></td>
            </tr>
            <tr>
              <td className="p-4" />
              <td className="p-4">
                <Link href={`/product/${a.id}`} className="text-[12px] px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors inline-block">View details</Link>
              </td>
              <td className="p-4">
                <Link href={`/product/${b.id}`} className="text-[12px] px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors inline-block">View details</Link>
              </td>
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
  return (
    <tr className="hover:bg-surface-sunken/50 transition-colors">
      <td className="p-4 text-[12px] font-medium text-text-secondary">{label}</td>
      <td className="p-4 text-[13px] font-medium text-text-primary">{va}</td>
      <td className="p-4 text-[13px] font-medium text-text-primary">{vb}</td>
    </tr>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.slice(0, 5).map((f) => (
        <li key={f} className="flex items-start gap-1.5 text-[12px] text-text-secondary">
          <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />{f}
        </li>
      ))}
    </ul>
  );
}
