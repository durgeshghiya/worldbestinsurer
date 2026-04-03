import type { Metadata } from "next";
import { Phone, Globe, Search, Users } from "lucide-react";
import { getAllInsurers } from "@/lib/data";
import { VALID_COUNTRY_CODES } from "@/lib/countries";
import ContactDirectorySearch from "@/components/ContactDirectorySearch";

export const metadata: Metadata = {
  title: "Insurer Contact Directory — Phone, Email & Helplines",
  description:
    "Contact details for 248+ insurance companies across 12 countries. Find phone numbers, emails, claim helplines, grievance contacts, and social media links.",
  openGraph: {
    title: "Insurance Contact Directory — World Best Insurer",
    description:
      "Phone numbers, emails, claim helplines & social links for 248+ insurers in 12 countries.",
  },
};

export default function ContactDirectoryPage() {
  const allInsurers = getAllInsurers();
  const countryCodes = VALID_COUNTRY_CODES;

  const stats = {
    totalInsurers: allInsurers.length,
    withContact: allInsurers.filter((i) => i.contact?.customerCareNumber || i.contact?.email).length,
    countries: countryCodes.length,
    helplines: allInsurers.filter((i) => i.contact?.claimHelpline).length,
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e2b7a] via-[#2d3a8c] to-[#1a1a2e] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#c47d2e] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#c44058] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[#c47d2e] text-sm font-semibold mb-4">
              <Phone className="w-4 h-4" />
              <span>INSURER CONTACT DIRECTORY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Every Insurer.{" "}
              <span className="text-[#c47d2e]">Every Number.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mb-8">
              Phone numbers, emails, claim helplines, grievance contacts, and social
              media links for {stats.totalInsurers}+ insurance companies across{" "}
              {stats.countries} countries — all in one place.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Insurers", value: stats.totalInsurers },
                { icon: Phone, label: "Helplines", value: stats.helplines },
                { icon: Globe, label: "Countries", value: stats.countries },
                { icon: Search, label: "Searchable", value: "100%" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <s.icon className="w-5 h-5 text-[#c47d2e] mb-2" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ContactDirectorySearch
          insurers={allInsurers}
          countries={countryCodes}
        />
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-surface-sunken rounded-xl p-5 text-xs text-text-tertiary leading-relaxed">
          <strong className="text-text-secondary">Disclaimer:</strong> Contact
          information is sourced from official insurer websites and is provided for
          reference only. We verify these details periodically but cannot guarantee
          real-time accuracy. Always confirm contact details on the insurer&apos;s
          official website before use. World Best Insurer is not affiliated with
          any insurance company listed here.
        </div>
      </section>
    </main>
  );
}
