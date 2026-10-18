import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, ShieldCheck, Activity, Phone, ChevronRight, CheckCircle2, HelpCircle } from "lucide-react";
import { getInsurerBySlug } from "@/lib/data";
import { getCountryByCode } from "@/lib/countries";
import { getCityBySlug } from "@/lib/cities";
import { getCityGeoData } from "@/lib/geo";
import Breadcrumb from "@/components/Breadcrumb";
import { AdSlot } from "@/components/AdSlot";
import { BreadcrumbSchema, HospitalNetworkSchema, FAQSchema } from "@/components/StructuredData";

export const dynamicParams = true;

export async function generateStaticParams() {
  // Empty array to enforce on-demand rendering (ISR) and prevent build timeouts
  // with 78,000+ permutations.
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; slug: string; city: string }>;
}): Promise<Metadata> {
  const { country, slug, city } = await params;

  if (country !== "in") return {}; // Currently only mapping Indian cities

  const insurer = getInsurerBySlug(slug, country);
  const cityData = getCityBySlug(city);
  const c = getCountryByCode(country);

  if (!insurer || !cityData || !c) return {};

  const geo = getCityGeoData(cityData);
  const canonicalUrl = `https://worldbestinsurer.com/${country}/insurer/${slug}/hospitals/${city}/`;
  const pageTitle = `${insurer.name} Network Hospitals in ${cityData.name}, ${cityData.state} — Cashless List (2026)`;
  const pageDescription = `Find ${insurer.name} cashless network hospitals in ${cityData.name}, ${cityData.state}. Check claim settlement ratio (${insurer.claimSettlementRatio?.value || "90+"}%), pre-authorization steps, and TPA desk procedures.`;

  return {
    title: pageTitle,
    description: pageDescription,
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
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: "website",
      locale: "en_IN",
      siteName: "World Best Insurer",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
    other: {
      "geo.region": geo.regionCode,
      "geo.placename": `${geo.cityName}, ${geo.stateName}`,
      "DC.coverage": `${geo.cityName}, ${geo.stateName}, India`,
      "geo.position": `${geo.latitude};${geo.longitude}`,
      ICBM: `${geo.latitude}, ${geo.longitude}`,
    },
  };
}

export default async function LocalNetworkPage({
  params,
}: {
  params: Promise<{ country: string; slug: string; city: string }>;
}) {
  const { country, slug, city } = await params;

  if (country !== "in") notFound();

  const insurer = getInsurerBySlug(slug, country);
  const cityData = getCityBySlug(city);

  if (!insurer || !cityData) notFound();

  const geo = getCityGeoData(cityData);
  const csr = insurer.claimSettlementRatio?.value ? `${insurer.claimSettlementRatio.value}%` : "90+%";

  const faqs = [
    {
      q: `How do I avail cashless hospitalization with ${insurer.name} in ${cityData.name}?`,
      a: `To avail cashless medical treatment in ${cityData.name}, visit an empanelled ${insurer.name} network hospital. Present your health health card and government ID at the hospital's Third Party Administrator (TPA) or insurance desk. For planned hospitalizations, submit pre-authorization 48 hours prior; for emergency admissions, intimation must be made within 24 hours.`,
    },
    {
      q: `What happens if a hospital in ${cityData.name} is not in ${insurer.name}'s cashless network?`,
      a: `If the medical facility in ${cityData.name} is a non-network hospital, you can still receive treatment via reimbursement. Settle the hospital bills out-of-pocket upon discharge, collect original discharge summaries, itemized bills, and payment receipts, and submit a reimbursement claim to ${insurer.name} within 15 to 30 days.`,
    },
    {
      q: `What documents are required for pre-authorization in ${cityData.name}?`,
      a: `Required documents include the completed pre-authorization form (available at the hospital TPA desk), doctor's admission advice notes, diagnostic reports, policy card with policy number, and a valid photo identification (Aadhaar, PAN card, or Passport).`,
    },
    {
      q: `What is ${insurer.name}'s Claim Settlement Ratio?`,
      a: `${insurer.name} maintains a statutory Claim Settlement Ratio of approximately ${csr}, indicating strong claim fulfillment for policyholders residing in ${cityData.name} and across ${cityData.state}.`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Insurers", url: "https://worldbestinsurer.com/in/insurers/" },
          { name: insurer.name, url: `https://worldbestinsurer.com/in/insurer/${slug}/` },
          { name: `Hospitals in ${cityData.name}`, url: `https://worldbestinsurer.com/in/insurer/${slug}/hospitals/${city}/` },
        ]}
      />
      <HospitalNetworkSchema insurer={insurer} cityName={cityData.name} stateName={cityData.state} geo={geo} />
      <FAQSchema questions={faqs} />

      <Breadcrumb
        items={[
          { label: "Insurers", href: `/${country}/insurers` },
          { label: insurer.name, href: `/${country}/insurer/${slug}` },
          { label: `Hospitals in ${cityData.name}` },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {insurer.name} Network Hospitals in {cityData.name}
        </h1>
        <p className="mt-3 text-muted max-w-3xl leading-relaxed">
          Access cashless medical treatments across {insurer.name}'s network hospitals in {cityData.name}, {cityData.state}. 
          With an official Claim Settlement Ratio of {csr}, policyholders in {cityData.name} can expect prompt TPA desk pre-authorization for both planned surgeries and emergency admissions.
        </p>
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_INSURER_TOP} format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Cashless Treatment Overview in {cityData.name}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              When you choose a network hospital in {cityData.name}, {insurer.name} coordinates directly with the hospital's TPA desk to settle admissible medical expenses. This minimizes out-of-pocket strain during acute healthcare events, subject to deductible or copayment stipulations.
            </p>
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="font-medium text-sm text-foreground mb-3 uppercase tracking-wide">Key Benefits of Cashless Hospitalization</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Zero Direct Payment:</strong> Hospital medical bills within policy limits are settled directly by {insurer.name}.</span>
                </li>
                <li className="flex gap-2 items-start text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Emergency Readiness:</strong> Immediate admission across empanelled healthcare facilities in {cityData.name}.</span>
                </li>
                <li className="flex gap-2 items-start text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Streamlined Discharge:</strong> Faster settlement without waiting weeks for reimbursement claim approval.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Step-by-Step Cashless Claim Process in {cityData.name}
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-foreground">Locate Empanelled Facility</h4>
                  <p className="text-sm text-text-secondary mt-1">Select an accredited network hospital in {cityData.name} partnered with {insurer.name}.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-foreground">Intimate TPA Desk</h4>
                  <p className="text-sm text-text-secondary mt-1">Notify the insurer 48 hours prior to planned hospitalizations, or within 24 hours of an emergency admission in {cityData.name}.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-foreground">Submit Pre-authorization Request</h4>
                  <p className="text-sm text-text-secondary mt-1">Present your health card and photo identification at the hospital TPA desk. The hospital transmits pre-authorization directly to {insurer.name}.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h4 className="font-medium text-foreground">Direct Discharge Settlement</h4>
                  <p className="text-sm text-text-secondary mt-1">Upon medical clearance, {insurer.name} approves the final invoice and settles eligible expenses directly with the hospital.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Localized FAQ Section */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions: {insurer.name} in {cityData.name}
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
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold text-lg mb-4">{insurer.name} Institutional Overview</h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Claim Settlement Ratio (CSR)</span>
                <div className="font-medium flex items-center gap-2 text-foreground">
                  <Activity className="w-4 h-4 text-primary" />
                  {csr}
                </div>
              </div>
              <div className="h-px bg-border w-full"></div>
              <div>
                <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Network Hospitals Nationwide</span>
                <div className="font-medium flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-primary" />
                  {insurer.networkHospitals ? `${insurer.networkHospitals.toLocaleString()}+ Hospitals` : "Empanelled Network"}
                </div>
              </div>
              <div className="h-px bg-border w-full"></div>
              <div>
                <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Coverage Location</span>
                <div className="font-medium flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {cityData.name}, {cityData.state}
                </div>
              </div>
              <div className="h-px bg-border w-full"></div>
              <div>
                <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Toll-Free Claims Helpline</span>
                <div className="font-medium flex items-center gap-2 text-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  {insurer.contact?.phone || "Check official policy schedule"}
                </div>
              </div>
            </div>

            {insurer.website && (
              <a
                href={insurer.website}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Visit Insurer Portal
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
