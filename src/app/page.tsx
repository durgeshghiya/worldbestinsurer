import Link from "next/link";
import { getAllProducts, getAllInsurers } from "@/lib/data";
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
  const totalInsurers = getAllInsurers().length;
  const activeCountries = getActiveCountries();

  // Per-category counts for the substantive copy section below.
  const countByCat: Record<string, number> = {};
  for (const p of getAllProducts()) {
    countByCat[p.category] = (countByCat[p.category] ?? 0) + 1;
  }

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

      {/* ─── Hero ─── */}
      <section className="flex flex-col items-center justify-center px-5 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="text-center max-w-[640px] mx-auto">
          <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] leading-[1.1] text-gray-900 mb-4">
            Compare insurance plans worldwide
          </h1>
          <p className="text-[15px] sm:text-[17px] text-gray-500 mb-10">
            {totalProducts.toLocaleString()}+ plans
            <span className="mx-2 text-gray-300">&middot;</span>
            {totalInsurers}+ insurers
            <span className="mx-2 text-gray-300">&middot;</span>
            {activeCountries.length} countries
            <span className="mx-2 text-gray-300">&middot;</span>
            verified data
          </p>
          <div className="flex justify-center mb-4">
            <HomeSelector countries={countryData} categories={categoryData} />
          </div>
        </div>
      </section>

      {/* ─── What this site is ─── */}
      <section className="border-t border-gray-100 py-16 sm:py-20 px-5">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[22px] sm:text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-4">
            A comparison platform — not a broker
          </h2>
          <p className="text-[15px] text-gray-700 leading-[1.75] mb-4">
            World Best Insurer is an independent insurance research and
            comparison site covering {totalProducts.toLocaleString()}+ plans
            from {totalInsurers}+ insurers across {activeCountries.length}{" "}
            markets — India, the US, UK, UAE, Singapore, Canada, Australia,
            Germany, Saudi Arabia, Japan, South Korea, and Hong Kong. We
            categorise every plan we track into health, term life, motor, and
            travel, and we publish the same comparable data points for each:
            sum insured range, illustrative premium, claim settlement ratio,
            waiting periods, inclusions, exclusions, and source URL.
          </p>
          <p className="text-[15px] text-gray-700 leading-[1.75] mb-4">
            We do not sell insurance. We are not a broker, an agent, or an
            aggregator with a commercial pipe to insurers. There are no
            affiliate links on this site, no per-policy commissions, no
            per-lead payments. The &ldquo;Visit insurer website&rdquo; buttons
            on every product page go straight to the insurer&rsquo;s own
            domain — we are not in that transaction.
          </p>
          <p className="text-[15px] text-gray-700 leading-[1.75]">
            What we do is read the policy wordings, regulator filings, and
            annual reports, then publish the comparable facts in one place so
            you can do the comparison yourself in under five minutes instead
            of fifty. Every record has a{" "}
            <Link href="/methodology" className="text-primary hover:underline">
              confidence score and last-verified date
            </Link>
            ; nothing on this site is a guess.
          </p>
        </div>
      </section>

      {/* ─── What's in the catalog ─── */}
      <section className="border-t border-gray-100 py-16 sm:py-20 px-5 bg-gray-50/50">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[22px] sm:text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-4">
            What&rsquo;s in the catalog
          </h2>
          <p className="text-[15px] text-gray-700 leading-[1.75] mb-6">
            The four categories below cover the insurance lines an individual
            household actually buys. Click into one to see the live
            comparison table.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                slug: "health",
                title: "Health insurance",
                count: countByCat.health ?? 0,
                desc:
                  "Hospitalization, day-care, and pre-existing conditions. Health is the deepest category we cover — sum insured, waiting periods, room rent caps, and PED limits are the four numbers that decide claim outcomes.",
              },
              {
                slug: "term-life",
                title: "Term life insurance",
                count: countByCat["term-life"] ?? 0,
                desc:
                  "Pure protection — a large sum assured for a fixed term at the lowest possible premium. We track claim settlement ratio per insurer and policy term flexibility per plan.",
              },
              {
                slug: "motor",
                title: "Motor insurance",
                count: countByCat.motor ?? 0,
                desc:
                  "Third-party and comprehensive cover for cars and two-wheelers. The clauses that matter most are the depreciation schedule, the cashless garage network, and the no-claim bonus structure.",
              },
              {
                slug: "travel",
                title: "Travel insurance",
                count: countByCat.travel ?? 0,
                desc:
                  "Single-trip and multi-trip cover including medical evacuation, trip cancellation, lost baggage, and adventure-sport riders. The medical evacuation limit is the line item to scrutinise.",
              },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-[15px] font-bold text-gray-900">
                    {c.title}
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    {c.count} plans
                  </span>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  {c.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How we source data ─── */}
      <section className="border-t border-gray-100 py-16 sm:py-20 px-5">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[22px] sm:text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-4">
            How we source the data
          </h2>
          <p className="text-[15px] text-gray-700 leading-[1.75] mb-4">
            Three primary sources, ranked by trust: regulator filings (IRDAI
            in India, NAIC in the US, APRA in Australia, MAS in Singapore,
            and the equivalents in our other markets); the insurer&rsquo;s
            own published policy wordings, brochures, and rate cards; and
            insurer annual reports for claim settlement ratios and financial
            health metrics. We do not source from third-party aggregators,
            secondary blogs, or sales material.
          </p>
          <p className="text-[15px] text-gray-700 leading-[1.75] mb-4">
            Each data record carries a confidence score (high / medium /
            low) reflecting whether all relevant fields were verified
            against primary sources within the last ninety days. Records
            that age past that window get flagged for re-verification; you
            can see the &ldquo;Last verified&rdquo; date on every product
            page. We are not perfect — when we find an error we correct it
            and bump the verification timestamp, but we recommend you treat
            every illustrative premium as exactly that, illustrative, and
            confirm the rate that applies to your profile directly with the
            insurer.
          </p>
          <p className="text-[15px] text-gray-700 leading-[1.75]">
            For a longer write-up of how we collect, verify, and publish
            data, read our{" "}
            <Link href="/methodology" className="text-primary hover:underline">
              methodology page
            </Link>
            . For the disclosures we are required to publish under each
            regulator, see the{" "}
            <Link href="/disclaimer" className="text-primary hover:underline">
              disclaimer
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─── Editorial pillars ─── */}
      <section className="border-t border-gray-100 py-16 sm:py-20 px-5 bg-gray-50/50">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[22px] sm:text-[28px] font-bold tracking-[-0.02em] text-gray-900 mb-4">
            Beyond the comparison tables
          </h2>
          <p className="text-[15px] text-gray-700 leading-[1.75] mb-6">
            Comparison tables are the starting point. The harder questions —
            what tax deduction applies to which premium, whether a longer
            pre-existing waiting period is worth a smaller premium, which
            insurer&rsquo;s claim record is genuinely reliable — sit in our
            editorial sections.
          </p>
          <ul className="space-y-3 text-[14.5px] text-gray-700">
            <li>
              <strong className="text-gray-900">
                <Link href="/learn" className="hover:text-primary">
                  Learn:
                </Link>
              </strong>{" "}
              long-form guides on buying, comparing, and claiming. Topics
              like &ldquo;Section 80C term insurance tax benefit&rdquo; and
              &ldquo;how to compare health plans&rdquo;.
            </li>
            <li>
              <strong className="text-gray-900">
                <Link href="/reports" className="hover:text-primary">
                  Reports:
                </Link>
              </strong>{" "}
              annual deep-dives on market structure — currently published
              for India health, India motor, US health, and global travel.
            </li>
            <li>
              <strong className="text-gray-900">
                <Link href="/finance" className="hover:text-primary">
                  Finance:
                </Link>
              </strong>{" "}
              weekly research on the finance side of insurance — tax
              deductions, investment-linked products, regulatory mechanics.
            </li>
            <li>
              <strong className="text-gray-900">
                <Link href="/insurers" className="hover:text-primary">
                  Insurers:
                </Link>
              </strong>{" "}
              profiles of every insurer we track, with claim settlement
              ratios, contact directories, and headquarter locations.
            </li>
            <li>
              <strong className="text-gray-900">
                <Link href="/faq" className="hover:text-primary">
                  FAQ:
                </Link>
              </strong>{" "}
              the questions we get asked most — about the data, about
              specific terms, about how to interpret comparison output.
            </li>
          </ul>
        </div>
      </section>

      {/* ─── Footer line ─── */}
      <footer className="border-t border-gray-100 py-8 px-5">
        <div className="max-w-[760px] mx-auto text-center">
          <p className="text-[12px] text-gray-400 leading-relaxed">
            World Best Insurer is an independent informational platform. We
            do not sell, distribute, or advise on insurance products.
          </p>
          <p className="text-[11px] text-gray-300 mt-2">
            <Link href="/methodology" className="underline hover:text-gray-500">
              Methodology
            </Link>
            {" "}&middot;{" "}
            <Link href="/disclaimer" className="underline hover:text-gray-500">
              Disclaimer
            </Link>
            {" "}&middot;{" "}
            <Link href="/privacy-policy" className="underline hover:text-gray-500">
              Privacy
            </Link>
            {" "}&middot;{" "}
            <Link href="/contact" className="underline hover:text-gray-500">
              Contact
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
