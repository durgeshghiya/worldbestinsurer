import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Calendar, ExternalLink, ArrowUpRight, BadgeCheck } from "lucide-react";
import { getAllInsurers, getProductsByInsurer } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { BreadcrumbSchema } from "@/components/StructuredData";
import {
  INSURER_TYPE_LABEL,
  insurerVerdict,
  registry,
  siteFacts,
  statisticsHubVerdict,
  productDirectoryVerdict,
  type InsurerType,
} from "@/lib/registry";

export async function generateStaticParams() {
  return VALID_COUNTRY_CODES.map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) return {};
  return {
    title: `Insurance Companies in ${c.name}`,
    description:
      country === "in"
        ? `Directory of insurance companies in India, grouped by IRDAI licence type, with registration numbers and official sources where verified.`
        : `Directory of insurance companies in ${c.name}. Compare insurers and explore their plans.`,
    alternates: { canonical: `https://worldbestinsurer.com/${country}/insurers` },
  };
}

interface Card {
  slug: string;
  name: string;
  type: string;
  typeKey?: InsurerType;
  website: string;
  headquarters?: string;
  established?: number;
  description?: string;
  registration?: string;
  products: number;
  linkable: boolean;
}

const TYPE_ORDER: InsurerType[] = ["life", "general", "standalone-health", "reinsurer", "specialised"];

export default async function CountryInsurersPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) notFound();

  const isIndia = country === "in";
  const reg = isIndia ? registry() : undefined;
  const site = isIndia ? siteFacts() : undefined;

  const cards: Card[] = getAllInsurers(country).map((ins) => {
    const ri = reg?.insurerBySlug.get(ins.slug);
    const products = getProductsByInsurer(ins.slug, country).length + (reg?.productsByInsurer.get(ins.slug)?.length ?? 0);
    return {
      slug: ins.slug,
      name: ins.shortName || ins.name,
      type: ri ? INSURER_TYPE_LABEL[ri.insurerType.value] : ins.type,
      typeKey: ri?.insurerType.value,
      website: ri?.website.value ?? ins.website,
      headquarters: ri?.headquarters?.value ?? ins.headquarters,
      established: ins.established,
      description: ins.description,
      registration: ri?.irdaiRegistrationNumber?.value,
      products,
      // Link only to pages that are offered to search; the rest stay reachable
      // from their own URL but are not promoted.
      linkable: reg && site ? insurerVerdict(ins.slug, reg, site).indexable : products > 0,
    };
  });
  if (reg && site) {
    for (const ri of reg.insurers) {
      if (site.siteInsurerExists(ri.slug)) continue;
      cards.push({
        slug: ri.slug,
        name: ri.name.value,
        type: INSURER_TYPE_LABEL[ri.insurerType.value],
        typeKey: ri.insurerType.value,
        website: ri.website.value,
        headquarters: ri.headquarters?.value,
        registration: ri.irdaiRegistrationNumber?.value,
        products: reg.productsByInsurer.get(ri.slug)?.length ?? 0,
        linkable: insurerVerdict(ri.slug, reg, site).indexable,
      });
    }
  }
  cards.sort((a, b) => a.name.localeCompare(b.name));

  // India: group by IRDAI licence type where the registry knows it.
  const groups: { title: string; items: Card[] }[] = isIndia
    ? [
        ...TYPE_ORDER.map((t) => ({ title: `${INSURER_TYPE_LABEL[t]}s`, items: cards.filter((x) => x.typeKey === t) })),
        { title: "Other insurers", items: cards.filter((x) => !x.typeKey) },
      ].filter((g) => g.items.length > 0)
    : [{ title: "", items: cards }];

  return (
    <div className="mx-auto max-w-[1320px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: c.name, url: `https://worldbestinsurer.com/${country}/` },
          { name: "Insurers", url: `https://worldbestinsurer.com/${country}/insurers/` },
        ]}
      />
      <Link href={`/${country}`} className="text-[12px] text-text-tertiary hover:text-primary mb-4 inline-block">
        ← {c.flag} {c.name}
      </Link>
      <h1 className="text-[28px] sm:text-[36px] font-extrabold text-text-primary tracking-[-0.03em] mb-2">
        Insurance Companies in {c.name}
      </h1>
      <p className="text-[15px] text-text-secondary mb-4">
        {cards.length} insurers tracked &middot; Regulated by {c.regulator}
      </p>

      {isIndia && reg && (
        <div className="mb-8 flex flex-wrap gap-2">
          {productDirectoryVerdict(reg).indexable && (
            <Link href="/in/products/" className="inline-flex rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:text-primary">
              Product &amp; UIN directory
            </Link>
          )}
          {statisticsHubVerdict(reg).indexable && (
            <Link href="/in/insurance-statistics/" className="inline-flex rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:text-primary">
              Insurance statistics
            </Link>
          )}
          <p className="w-full text-[12.5px] text-text-tertiary">
            A <BadgeCheck className="inline h-3.5 w-3.5 text-success" aria-hidden="true" /> marks an IRDAI registration
            number read from the insurer&apos;s own website.
          </p>
        </div>
      )}

      {cards.length > 0 ? (
        <div className="space-y-10">
          {groups.map((g) => (
            <section key={g.title || "all"}>
              {g.title && <h2 className="mb-4 text-[20px] font-bold text-text-primary">{g.title}</h2>}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {g.items.map((ins) => (
                  <div key={ins.slug} className="card-premium relative bg-surface rounded-2xl border border-border p-5">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-text-primary">
                          <Link href={`/${country}/insurer/${ins.slug}/`} className="hover:text-primary transition-colors">
                            {ins.name}
                          </Link>
                        </h3>
                        <p className="text-[11px] text-text-tertiary">
                          {ins.type}
                          {ins.registration && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-success">
                              <BadgeCheck className="h-3 w-3" aria-hidden="true" /> IRDAI Reg. {ins.registration}
                            </span>
                          )}
                        </p>
                      </div>
                      <a
                        href={ins.website.startsWith("http") ? ins.website : `https://${ins.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 p-1.5 text-text-tertiary hover:text-primary transition-colors"
                        aria-label={`${ins.name} official website`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {ins.description && (
                      <p className="text-[12px] text-text-secondary leading-relaxed mb-3 line-clamp-2">{ins.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-tertiary">
                      {ins.headquarters && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ins.name} ${ins.headquarters}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                          title="Search location on Google Maps"
                        >
                          <MapPin className="w-3 h-3" /> {ins.headquarters}
                        </a>
                      )}
                      {ins.established ? (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ins.established}</span>
                      ) : null}
                      <span>{ins.products} listed product{ins.products === 1 ? "" : "s"}</span>
                      <Link href={`/${country}/insurer/${ins.slug}/`} className="ml-auto inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
                        Details <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-sunken rounded-2xl">
          <p className="text-[16px] font-bold text-text-primary mb-2">Insurer directory coming soon</p>
          <p className="text-[13px] text-text-secondary">We&apos;re compiling insurer data for {c.name}.</p>
        </div>
      )}
    </div>
  );
}
