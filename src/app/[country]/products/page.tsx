/**
 * /in/products/ — the India product and UIN directory.
 *
 * A discovery surface: every India product on the site, with its IRDAI UIN
 * where one is verified, linking to its page. Lives under [country] (not a
 * static `in/` folder, which would shadow every other /in/ route) and is
 * generated for India only.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import { BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import { DataNotice } from "@/components/registry/RegistryBlocks";
import {
  PRODUCT_TYPE_LABEL,
  formatDate,
  latest,
  insurerVerdict,
  productDirectoryVerdict,
  productVerdict,
  registry,
  robotsFor,
  siteFacts,
} from "@/lib/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ country: "in" }];
}

const CATEGORY_LABEL: Record<string, string> = {
  health: "Health",
  "term-life": "Term life",
  motor: "Motor",
  travel: "Travel",
};

interface Row {
  id: string;
  name: string;
  insurerSlug: string;
  insurerName: string;
  insurerLinkable: boolean;
  kind: string;
  uin?: string;
  docs: number;
  updated?: string;
}

function rows(): Row[] {
  const reg = registry();
  const site = siteFacts();
  const out: Row[] = [];
  for (const p of getAllProducts("in")) {
    const rp = reg.productBySiteId.get(p.id);
    out.push({
      id: p.id,
      name: p.productName,
      insurerSlug: p.insurerSlug,
      insurerName: rp ? reg.insurerBySlug.get(rp.insurerSlug)?.name.value ?? p.insurerName : p.insurerName,
      insurerLinkable: insurerVerdict(p.insurerSlug, reg, site).indexable,
      kind: CATEGORY_LABEL[p.category] ?? p.category,
      uin: rp?.uin?.value,
      docs: rp ? reg.documentsByProduct.get(rp.slug)?.length ?? 0 : 0,
      updated: rp?.updatedAt ?? p.lastVerified,
    });
  }
  for (const rp of reg.products) {
    if (rp.siteProductId || site.siteProductExists(rp.slug)) continue;
    if (!productVerdict(rp.slug, reg, site).indexable) continue; // no links to thin pages
    out.push({
      id: rp.slug,
      name: rp.name.value,
      insurerSlug: rp.insurerSlug,
      insurerName: reg.insurerBySlug.get(rp.insurerSlug)?.name.value ?? rp.insurerSlug,
      insurerLinkable: insurerVerdict(rp.insurerSlug, reg, site).indexable,
      kind: PRODUCT_TYPE_LABEL[rp.productType],
      uin: rp.uin?.value,
      docs: reg.documentsByProduct.get(rp.slug)?.length ?? 0,
      updated: rp.updatedAt,
    });
  }
  return out.sort((a, b) => a.insurerName.localeCompare(b.insurerName) || a.name.localeCompare(b.name));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  if (country !== "in") return {};
  const all = rows();
  const withUin = all.filter((r) => r.uin).length;
  const title = "Insurance Products and UINs in India";
  const description =
    `Directory of ${all.length} insurance products listed on WorldBestInsurer, ${withUin} with their IRDAI Unique ` +
    `Identification Number (UIN) read from the insurer's own product page. Linked to official documents.`;
  return {
    title,
    description,
    alternates: { canonical: "https://worldbestinsurer.com/in/products" },
    openGraph: { title, description, url: "https://worldbestinsurer.com/in/products/", type: "website" },
    ...robotsFor(productDirectoryVerdict(registry())),
  };
}

export default async function ProductDirectoryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (country !== "in") notFound();
  const reg = registry();
  const all = rows();
  const withUin = all.filter((r) => r.uin);
  const updated = latest([...reg.products.map((p) => p.updatedAt), ...reg.documents.map((d) => d.updatedAt)]);
  const sources = [...new Set(reg.products.map((p) => reg.sourceById.get(p.name.provenance.sourceId)?.name ?? p.name.provenance.sourceId))];

  return (
    <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "India", url: "https://worldbestinsurer.com/in/" },
          { name: "Products", url: "https://worldbestinsurer.com/in/products/" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Insurance products and UINs in India",
          description:
            "Insurance products listed on WorldBestInsurer with the IRDAI UIN published on each insurer's product page, and links to the insurer's official documents.",
          url: "https://worldbestinsurer.com/in/products/",
          creator: { "@type": "Organization", name: "World Best Insurer", url: "https://worldbestinsurer.com/" },
          spatialCoverage: { "@type": "Place", name: "India" },
          ...(updated && { dateModified: updated.slice(0, 10) }),
          variableMeasured: ["Product name", "Insurer", "UIN", "Product type"],
          isAccessibleForFree: true,
        }}
      />

      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">India · Product directory</p>
      <h1 className="mt-2 text-[28px] sm:text-[38px] font-bold tracking-[-0.02em] text-text-primary">
        Insurance products and UINs in India
      </h1>
      <div className="mt-4 max-w-[72ch] space-y-3 text-[15px] leading-[1.75] text-text-secondary">
        <p>
          Every insurance product sold by an IRDAI-regulated insurer carries a Unique Identification Number (UIN),
          printed on its brochure and policy documents. The UIN identifies the exact filed version of a product, so it is
          the reliable way to confirm that two documents describe the same plan.
        </p>
        <p>
          This directory lists the {all.length} products on WorldBestInsurer. {withUin.length} show a UIN, each read
          from the insurer&apos;s own product page and re-checked against it. Where no UIN is shown, we have not yet
          verified one — the table says so rather than guessing.
        </p>
      </div>

      <dl className="mt-6 grid max-w-xl grid-cols-3 gap-4">
        {[
          { v: all.length, l: "Products" },
          { v: withUin.length, l: "With a verified UIN" },
          { v: new Set(all.map((r) => r.insurerSlug)).size, l: "Insurers" },
        ].map((s) => (
          <div key={s.l}>
            <dt className="text-[12px] text-text-tertiary">{s.l}</dt>
            <dd className="text-[26px] font-bold tabular-nums text-text-primary">{s.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-[13.5px]">
          <caption className="sr-only">Insurance products in India with UIN</caption>
          <thead>
            <tr className="border-b border-border bg-surface-sunken/60 text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              <th scope="col" className="px-4 py-2.5 font-semibold">Product</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Insurer</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Type</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">UIN</th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">Documents</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {all.map((r) => (
              <tr key={r.id} className="border-b border-border-light last:border-0">
                <th scope="row" className="px-4 py-3 font-medium">
                  <Link href={`/in/product/${r.id}/`} className="text-text-primary hover:text-primary">{r.name}</Link>
                </th>
                <td className="px-4 py-3">
                  {r.insurerLinkable ? (
                    <Link href={`/in/insurer/${r.insurerSlug}/`} className="text-text-secondary hover:text-primary">{r.insurerName}</Link>
                  ) : (
                    <span className="text-text-secondary">{r.insurerName}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary">{r.kind}</td>
                <td className="px-4 py-3 font-mono text-[12.5px] text-text-primary">
                  {r.uin ?? <span className="font-sans text-text-tertiary">Not verified yet</span>}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-text-secondary">{r.docs || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-text-tertiary tabular-nums">{formatDate(r.updated?.slice(0, 10))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <DataNotice updated={updated} sourceNames={sources} />
      </div>
    </div>
  );
}
