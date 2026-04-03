import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getAllInsurers } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import ContactDirectorySearch from "@/components/ContactDirectorySearch";

export async function generateStaticParams() {
  return VALID_COUNTRY_CODES.map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) return {};
  return {
    title: `Insurance Contact Directory — ${c.name}`,
    description: `Phone numbers, emails, claim helplines & contact details for insurance companies in ${c.name}.`,
  };
}

export default async function CountryContactDirectoryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) notFound();

  const insurers = getAllInsurers(country);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e2b7a] via-[#2d3a8c] to-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-[#c47d2e] text-sm font-semibold mb-3">
            <Phone className="w-4 h-4" />
            <span>{c.flag} {c.name.toUpperCase()} CONTACT DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            Insurance Contacts in{" "}
            <span className="text-[#c47d2e]">{c.name}</span>
          </h1>
          <p className="text-base text-white/70 max-w-2xl">
            Phone numbers, emails, claim helplines and social links for{" "}
            {insurers.length} insurance companies in {c.name}.
          </p>
        </div>
      </section>

      {/* Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ContactDirectorySearch
          insurers={insurers}
          countries={[country]}
        />
      </section>
    </main>
  );
}
