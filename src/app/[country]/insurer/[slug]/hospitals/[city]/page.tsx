import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, ShieldCheck, Activity, Phone, ChevronRight, CheckCircle2 } from "lucide-react";
import { getInsurerBySlug } from "@/lib/data";
import { getCountryByCode } from "@/lib/countries";
import { getCityBySlug } from "@/lib/cities";
import Breadcrumb from "@/components/Breadcrumb";
import { AdSlot } from "@/components/AdSlot";

export const dynamicParams = true;

export async function generateStaticParams() {
  // Empty array to enforce on-demand rendering (ISR) and prevent build timeouts
  // with 100,000+ permutations.
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; slug: string; city: string }> }): Promise<Metadata> {
  const { country, slug, city } = await params;
  
  if (country !== "in") return {}; // Currently only mapping Indian cities

  const insurer = getInsurerBySlug(slug, country);
  const cityData = getCityBySlug(city);
  const c = getCountryByCode(country);

  if (!insurer || !cityData || !c) return {};

  return {
    title: `${insurer.name} Network Hospitals in ${cityData.name} — Cashless List`,
    description: `Find ${insurer.name} cashless network hospitals in ${cityData.name}, ${cityData.state}. Check claim settlement ratio, claim process, and local branch contacts.`,
    alternates: {
      canonical: `https://worldbestinsurer.com/${country}/insurer/${slug}/hospitals/${city}`,
    },
  };
}

export default async function LocalNetworkPage({ params }: { params: Promise<{ country: string; slug: string; city: string }> }) {
  const { country, slug, city } = await params;

  if (country !== "in") notFound();

  const insurer = getInsurerBySlug(slug, country);
  const cityData = getCityBySlug(city);

  if (!insurer || !cityData) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
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
        <p className="mt-3 text-muted max-w-3xl">
          Access cashless medical treatments across {insurer.name}'s network hospitals in {cityData.name}, {cityData.state}. 
          With a claim settlement ratio of {insurer.claimSettlementRatio?.value || "90+"}%, policyholders in {cityData.name} can expect smooth processing for planned and emergency hospitalizations.
        </p>
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_INSURER_TOP} format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Cashless Treatment in {cityData.name}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              When you choose a network hospital in {cityData.name}, {insurer.name} settles your medical bills directly with the hospital. This means you do not have to pay out of pocket for covered treatments (subject to copayment or deductible clauses in your policy).
            </p>
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="font-medium text-sm text-foreground mb-3 uppercase tracking-wide">Why Choose Cashless?</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Direct billing between the hospital and {insurer.name}.</span>
                </li>
                <li className="flex gap-2 items-start text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>No need to arrange large amounts of cash during medical emergencies in {cityData.name}.</span>
                </li>
                <li className="flex gap-2 items-start text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Faster discharge process compared to reimbursement claims.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              How to File a Cashless Claim in {cityData.name}
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-foreground">Locate a Network Hospital</h4>
                  <p className="text-sm text-text-secondary mt-1">Find a hospital in {cityData.name} that is partnered with {insurer.name} for cashless facilities.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-foreground">Intimate the Insurer</h4>
                  <p className="text-sm text-text-secondary mt-1">Notify {insurer.name} at least 48 hours before a planned hospitalization, or within 24 hours of an emergency admission.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-foreground">Submit Pre-authorization</h4>
                  <p className="text-sm text-text-secondary mt-1">Show your health card at the {cityData.name} hospital's TPA desk. They will fill out a pre-authorization form and send it to the insurer.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h4 className="font-medium text-foreground">Treatment & Discharge</h4>
                  <p className="text-sm text-text-secondary mt-1">Once approved, receive your treatment. At discharge, {insurer.name} will settle the eligible amount directly with the hospital.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold text-lg mb-4">{insurer.name} Quick Facts</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Claim Settlement Ratio</span>
                <div className="font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  {insurer.claimSettlementRatio?.value ? `${insurer.claimSettlementRatio.value}%` : '90+%'}
                </div>
              </div>
              <div className="h-px bg-border w-full"></div>
              <div>
                <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Network Hospitals</span>
                <div className="font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  {insurer.networkHospitals ? `${insurer.networkHospitals}+ Hospitals` : 'N/A'}
                </div>
              </div>
              <div className="h-px bg-border w-full"></div>
              <div>
                <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Helpline</span>
                <div className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  {insurer.contact?.phone || "Check official website"}
                </div>
              </div>
            </div>

            <a
              href={insurer.website || "#"}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Visit Official Website
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
