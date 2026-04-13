import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import { getActiveCountries } from "@/lib/countries";
import { categories } from "@/lib/data";
import {
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";
import HomeSelector from "@/components/HomeSelector";

export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const activeCountries = getActiveCountries();

  // Serialize for client component
  const countryData = activeCountries.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
  }));
  const categoryData = categories.map((c) => ({
    slug: c.slug,
    shortName: c.shortName,
  }));

  return (
    <div className="bg-white min-h-screen">
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://worldbestinsurer.com" }]}
      />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ─── Main content ─── */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-5">
        <div className="text-center max-w-[600px] mx-auto">
          {/* Headline */}
          <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] leading-[1.1] text-gray-900 mb-4">
            Compare insurance plans worldwide
          </h1>

          {/* Subline */}
          <p className="text-[15px] sm:text-[17px] text-gray-400 mb-10">
            {totalProducts}+ plans &middot; {activeCountries.length} countries &middot; verified data
          </p>

          {/* Dropdowns + button */}
          <div className="flex justify-center mb-16">
            <HomeSelector countries={countryData} categories={categoryData} />
          </div>
        </div>
      </main>

      {/* ─── Minimal footer line ─── */}
      <footer className="border-t border-gray-100 py-6 px-5">
        <div className="max-w-[600px] mx-auto text-center">
          <p className="text-[11px] text-gray-300">
            We do not sell insurance. Data from official sources.
            {" "}&middot;{" "}
            <Link href="/methodology" className="underline hover:text-gray-400">Methodology</Link>
            {" "}&middot;{" "}
            <Link href="/disclaimer" className="underline hover:text-gray-400">Disclaimer</Link>
            {" "}&middot;{" "}
            <Link href="/privacy-policy" className="underline hover:text-gray-400">Privacy</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
