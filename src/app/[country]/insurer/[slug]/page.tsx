import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Calendar, Building2, TrendingUp, ArrowUpRight, Mail, Headphones, PhoneCall, AlertCircle } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { getAllInsurers, getInsurerBySlug, getProductsByInsurer } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import InsurerEditorial from "@/components/InsurerEditorial";
import { AdSlot } from "@/components/AdSlot";
import { formatCompact } from "@/lib/utils";
import { BreadcrumbSchema } from "@/components/StructuredData";
import RegistryInsurerSection from "@/components/registry/RegistryInsurerSection";
import {
  INSURER_TYPE_LABEL,
  formatDate,
  insurerVerdict,
  insurerView,
  registry,
  robotsFor,
  siteFacts,
} from "@/lib/registry";

export async function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const i of getAllInsurers(cc)) {
      params.push({ country: cc, slug: i.slug });
    }
  }
  // Registry insurers that have no pre-existing site record get a page too.
  const site = siteFacts();
  for (const ri of registry().insurers) {
    if (!site.siteInsurerExists(ri.slug)) params.push({ country: "in", slug: ri.slug });
  }
  return params;
}

/** India registry lookups; undefined elsewhere so other countries are untouched. */
function registryFor(country: string, slug: string) {
  if (country !== "in") return undefined;
  const reg = registry();
  const ri = reg.insurerBySlug.get(slug);
  return ri ? { reg, ri, site: siteFacts() } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; slug: string }> }): Promise<Metadata> {
  const { country, slug } = await params;
  const insurer = getInsurerBySlug(slug, country);
  const c = getCountryByCode(country);
  const r = registryFor(country, slug);
  if ((!insurer && !r) || !c) return {};
  const canonical = `https://worldbestinsurer.com/${country}/insurer/${slug}`;

  if (r) {
    // Title, description and index decision all derive from the record.
    const v = insurerView(r.ri, r.reg);
    const reg = r.ri.irdaiRegistrationNumber?.value;
    const count = v.products.length + (insurer ? getProductsByInsurer(slug, country).length : 0);
    const title = `${v.name}: Registration, Products & Official Documents`;
    const description =
      `${v.name} — ${INSURER_TYPE_LABEL[r.ri.insurerType.value].toLowerCase()}` +
      (reg ? `, IRDAI registration no. ${reg}` : "") +
      `. ${count} listed product${count === 1 ? "" : "s"}, official documents and published figures, each linked to its source. ` +
      `Updated ${formatDate(v.updated?.slice(0, 10))}.`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: `${canonical}/`, type: "website" },
      ...robotsFor(insurerVerdict(slug, r.reg, r.site)),
    };
  }

  return {
    title: `${(insurer!.shortName || insurer!.name)} Insurance Plans in ${c.name}`,
    description: `Explore ${(insurer!.shortName || insurer!.name)} insurance plans on World Best Insurer. Compare products available in ${c.name}.`,
    alternates: { canonical },
    // Insurers with verified contact directories or products are indexable
    ...(getProductsByInsurer(slug, country).length === 0 &&
      !Boolean(insurer!.contact?.customerCareNumber || insurer!.contact?.email || insurer!.contact?.phone)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function CountryInsurerPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  const insurer = getInsurerBySlug(slug, country);
  const c = getCountryByCode(country);
  const r = registryFor(country, slug);
  if (!c || (!insurer && !r)) {
    permanentRedirect(c ? `/${country}/insurers/` : "/insurers/");
  }

  const crumbs = (
    <BreadcrumbSchema
      items={[
        { name: "Home", url: "https://worldbestinsurer.com/" },
        { name: c.name, url: `https://worldbestinsurer.com/${country}/` },
        { name: "Insurers", url: `https://worldbestinsurer.com/${country}/insurers/` },
        { name: insurer ? insurer.shortName || insurer.name : r!.ri.name.value, url: `https://worldbestinsurer.com/${country}/insurer/${slug}/` },
      ]}
    />
  );

  // Registry-only insurer: a data page on the same URL pattern.
  if (!insurer && r) {
    const ri = r.ri;
    return (
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
        {crumbs}
        <Link href={`/${country}/insurers`} className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> {c.flag} All insurers in {c.name}
        </Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              {INSURER_TYPE_LABEL[ri.insurerType.value]}
            </p>
            <h1 className="mt-1 text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">{ri.name.value}</h1>
            {ri.legalName && ri.legalName.value !== ri.name.value && (
              <p className="text-[14px] text-text-secondary mt-1">{ri.legalName.value}</p>
            )}
            <p className="text-[14px] text-text-secondary mt-3 max-w-[70ch] leading-relaxed">
              {ri.name.value} is listed as {INSURER_TYPE_LABEL[ri.insurerType.value].toLowerCase()}
              {ri.irdaiRegistrationNumber ? ` with IRDAI registration number ${ri.irdaiRegistrationNumber.value}` : ""}.
              {" "}The information below is taken from the sources cited beside each value.
            </p>
          </div>
          <a href={ri.website.value} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-border rounded-lg hover:bg-surface-sunken transition-colors shrink-0">
            Official website <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <RegistryInsurerSection insurer={ri} reg={r.reg} site={r.site} siteProductNames={[]} />
      </div>
    );
  }

  if (!insurer) {
    permanentRedirect(c ? `/${country}/insurers/` : "/insurers/");
  }
  const products = getProductsByInsurer(slug, country);
  const peers = getAllInsurers(country);

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      {crumbs}
      <Link href={`/${country}/insurers`} className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> {c.flag} All insurers in {c.name}
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">{(insurer.shortName || insurer.name)}</h1>
          <p className="text-[14px] text-text-secondary mt-1">{insurer.name}</p>
          <p className="text-[13px] text-text-tertiary mt-2">{insurer.description}</p>
        </div>
        <a href={r?.ri.website.value ?? insurer.website} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-border rounded-lg hover:bg-surface-sunken transition-colors shrink-0">
          Official website <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-surface rounded-xl border border-border p-5">
          <MapPin className="w-4 h-4 text-primary mb-2" />
          <p className="text-[11px] text-text-tertiary">Headquarters</p>
          <p className="text-[15px] font-semibold text-text-primary">{insurer.headquarters}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5">
          <Calendar className="w-4 h-4 text-primary mb-2" />
          <p className="text-[11px] text-text-tertiary">Established</p>
          <p className="text-[15px] font-semibold text-text-primary">{insurer.established}</p>
        </div>
        {insurer.claimSettlementRatio?.value != null && (
          <div className="bg-surface rounded-xl border border-border p-5">
            <TrendingUp className="w-4 h-4 text-primary mb-2" />
            <p className="text-[11px] text-text-tertiary">Claim Settlement Ratio</p>
            <p className="text-[15px] font-semibold text-text-primary">{insurer.claimSettlementRatio.value}%</p>
            <p className="text-[10px] text-text-tertiary">{insurer.claimSettlementRatio.year} (unverified)</p>
          </div>
        )}
        {insurer.networkHospitals && (
          <div className="bg-surface rounded-xl border border-border p-5">
            <Building2 className="w-4 h-4 text-primary mb-2" />
            <p className="text-[11px] text-text-tertiary">Network</p>
            <p className="text-[15px] font-semibold text-text-primary">{insurer.networkHospitals >= 1000 ? `${Math.round(insurer.networkHospitals / 1000)}K+` : insurer.networkHospitals}</p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {insurer.contact && (insurer.contact.customerCareNumber || insurer.contact.email || insurer.contact.phone) && (
        <div className="mb-10">
          <h2 className="text-[20px] font-bold text-text-primary mb-4">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl border border-border p-5 space-y-3">
              {insurer.contact.customerCareNumber && (
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-tertiary">Customer Care</p>
                    <div className="flex items-center gap-1">
                      <a href={`tel:${insurer.contact.customerCareNumber.replace(/\s/g, "")}`} className="text-[14px] font-semibold text-text-primary hover:text-primary transition-colors">
                        {insurer.contact.customerCareNumber}
                      </a>
                      <CopyButton text={insurer.contact.customerCareNumber} />
                    </div>
                  </div>
                </div>
              )}
              {insurer.contact.claimHelpline && insurer.contact.claimHelpline !== insurer.contact.customerCareNumber && (
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-tertiary">Claim Helpline</p>
                    <div className="flex items-center gap-1">
                      <a href={`tel:${insurer.contact.claimHelpline.replace(/\s/g, "")}`} className="text-[14px] font-semibold text-text-primary hover:text-primary transition-colors">
                        {insurer.contact.claimHelpline}
                      </a>
                      <CopyButton text={insurer.contact.claimHelpline} />
                    </div>
                  </div>
                </div>
              )}
              {insurer.contact.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-text-tertiary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-tertiary">Email</p>
                    <div className="flex items-center gap-1">
                      <a href={`mailto:${insurer.contact.email}`} className="text-[14px] text-text-primary hover:text-primary transition-colors truncate">
                        {insurer.contact.email}
                      </a>
                      <CopyButton text={insurer.contact.email} />
                    </div>
                  </div>
                </div>
              )}
              {insurer.contact.grievanceEmail && (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-tertiary">Grievance</p>
                    <div className="flex items-center gap-1">
                      <a href={`mailto:${insurer.contact.grievanceEmail}`} className="text-[14px] text-text-primary hover:text-primary transition-colors truncate">
                        {insurer.contact.grievanceEmail}
                      </a>
                      <CopyButton text={insurer.contact.grievanceEmail} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {(insurer.contact.address || insurer.contact.socialMedia) && (
              <div className="bg-surface rounded-xl border border-border p-5 space-y-3">
                {insurer.contact.address && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] text-text-tertiary">Registered Office</p>
                      <p className="text-[13px] text-text-secondary leading-relaxed">{insurer.contact.address}</p>
                    </div>
                  </div>
                )}
                {insurer.contact.socialMedia && Object.entries(insurer.contact.socialMedia).some(([, v]) => v) && (
                  <div>
                    <p className="text-[11px] text-text-tertiary mb-2">Social Media</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(insurer.contact.socialMedia).map(([platform, url]) =>
                        url ? (
                          <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-sunken rounded-lg text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors capitalize">
                            {platform}
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <h2 className="text-[20px] font-bold text-text-primary mb-4">
        {products.length > 0
          ? `Products on World Best Insurer (${products.length})`
          : "Products on World Best Insurer"}
      </h2>
      {products.length === 0 && (
        <div className="mb-8 p-6 bg-surface-sunken rounded-xl border border-border-light">
          <p className="text-[14px] text-text-secondary leading-relaxed">
            We do not currently list any plans from this insurer. Records that
            could not be traced to a primary source were removed rather than
            published, so a short list here reflects what we can verify, not the
            insurer&apos;s actual range.
          </p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {products.map((p) => (
          <Link key={p.id} href={`/${country}/product/${p.id}`}
            className="group bg-surface rounded-xl border border-border hover:border-primary/15 hover:shadow-md transition-all p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-medium text-primary uppercase tracking-[0.06em] mb-0.5">{p.category.replace("-", " ")}</p>
                <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors">{p.productName}</h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex gap-4 mt-3 text-[12px] text-text-secondary">
              <span>Cover: {formatCompact(p.sumInsured.min, country)}–{formatCompact(p.sumInsured.max, country)}</span>
            </div>
          </Link>
        ))}
      </div>

      {r && (
        <RegistryInsurerSection
          insurer={r.ri}
          reg={r.reg}
          site={r.site}
          siteProductNames={products.map((p) => p.productName)}
        />
      )}

      <InsurerEditorial
        insurer={insurer}
        countryName={c.name}
        peers={peers}
        products={products}
      />

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_INSURER_END} className="my-10" />

      <div className="mt-10 p-4 bg-surface-sunken rounded-xl text-[11px] text-text-tertiary">
        All data is from publicly available sources. Visit the insurer&apos;s official website for current information.
      </div>
    </div>
  );
}
