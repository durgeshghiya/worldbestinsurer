import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getAllProducts, getAllInsurers } from "@/lib/data";
import { getActiveCountries } from "@/lib/countries";
import { categories } from "@/lib/data";
import {
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";
import CompareLauncher from "@/components/CompareLauncher";

export const metadata: Metadata = {
  alternates: { canonical: "https://worldbestinsurer.com" },
};

const CATEGORY_TILES = [
  {
    slug: "health",
    title: "Health insurance",
    desc: "Hospitalization, day-care, and pre-existing conditions. Health is the deepest category we cover — sum insured, waiting periods, room rent caps, and PED limits are the four numbers that decide claim outcomes.",
  },
  {
    slug: "term-life",
    title: "Term life insurance",
    desc: "Pure protection — a large sum assured for a fixed term at the lowest possible premium. We track claim settlement ratio per insurer and policy term flexibility per plan.",
  },
  {
    slug: "motor",
    title: "Motor insurance",
    desc: "Third-party and comprehensive cover for cars and two-wheelers. The clauses that matter most are the depreciation schedule, the cashless garage network, and the no-claim bonus structure.",
  },
  {
    slug: "travel",
    title: "Travel insurance",
    desc: "Single-trip and multi-trip cover including medical evacuation, trip cancellation, lost baggage, and adventure-sport riders. The medical evacuation limit is the line item to scrutinise.",
  },
];

const SOURCES = [
  {
    name: "Regulator filings",
    desc: "IRDAI in India, NAIC in the US, APRA in Australia, MAS in Singapore, and the equivalents in our other markets — the highest-trust source for claim ratios and solvency.",
  },
  {
    name: "Policy wordings",
    desc: "The insurer's own published wordings, brochures, and rate cards — the contract language itself, read clause by clause.",
  },
  {
    name: "Annual reports",
    desc: "Insurer financials for claim settlement ratios and financial-health metrics, cross-checked against the regulator's numbers annually.",
  },
];

const PILLARS = [
  {
    href: "/learn",
    title: "Learn",
    desc: "Long-form guides on buying, comparing, and claiming. Topics like “Section 80C term insurance tax benefit” and “how to compare health plans”.",
  },
  {
    href: "/reports",
    title: "Reports",
    desc: "Annual deep-dives on market structure — currently published for India health, India motor, US health, and global travel.",
  },
  {
    href: "/finance",
    title: "Finance",
    desc: "Weekly research on the finance side of insurance — tax deductions, investment-linked products, regulatory mechanics.",
  },
  {
    href: "/insurers",
    title: "Insurers",
    desc: "Profiles of every insurer we track, with claim settlement ratios, contact directories, and headquarter locations.",
  },
  {
    href: "/faq",
    title: "FAQ",
    desc: "The questions we get asked most — about the data, about specific terms, and about how to interpret comparison output.",
  },
];

/** Shared shell so every band lines up on the same measure. */
const WRAP = "mx-auto w-full max-w-[1120px] px-5 lg:px-8";
const EYEBROW =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-primary";
const H2 =
  "mt-3 text-[26px] sm:text-[34px] font-bold tracking-[-0.025em] text-text-primary text-balance";
const PROSE = "text-[15px] leading-[1.8] text-text-secondary";

export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const totalInsurers = getAllInsurers().length;
  const activeCountries = getActiveCountries();

  const countByCat: Record<string, number> = {};
  for (const p of getAllProducts()) {
    countByCat[p.category] = (countByCat[p.category] ?? 0) + 1;
  }

  const countryData = activeCountries.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
  }));
  const categoryData = categories.map((c) => ({
    slug: c.slug,
    shortName: c.shortName,
  }));

  const stats = [
    { v: totalProducts.toLocaleString(), l: "Plans indexed" },
    { v: String(totalInsurers), l: "Insurers tracked" },
    { v: String(activeCountries.length), l: "Country markets" },
    { v: "0", l: "Affiliate links" },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://worldbestinsurer.com" }]}
      />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ── Hero: headline, the one action, and the promise ── */}
      <section className="border-b border-border-light bg-surface">
        <div className={`${WRAP} py-14 sm:py-20`}>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p className={EYEBROW}>Independent insurance comparison</p>
              <h1 className="mt-4 text-[34px] leading-[1.1] sm:text-[48px] font-bold tracking-[-0.03em] text-text-primary text-balance">
                Insurance, compared{" "}
                <span className="text-primary">on the facts.</span>
              </h1>
              <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.7] text-text-secondary">
                {totalProducts.toLocaleString()} plans from {totalInsurers}{" "}
                insurers across {activeCountries.length}{" "}
                countries — side by side, normalized, and sourced. We
                don&rsquo;t sell insurance.
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {["No affiliate links", "No commissions", "No sales calls"].map(
                  (t) => (
                    <li
                      key={t}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-text-secondary"
                    >
                      <Check
                        className="h-3.5 w-3.5 text-success"
                        aria-hidden="true"
                      />
                      {t}
                    </li>
                  )
                )}
              </ul>
            </div>

            <CompareLauncher countries={countryData} categories={categoryData} />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-border-light">
        <div className={`${WRAP} py-8`}>
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd>
                  <span className="block text-[28px] font-bold tracking-[-0.02em] text-text-primary tabular-nums">
                    {s.v}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-text-tertiary">
                    {s.l}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── What this is ── */}
      <section className={`${WRAP} py-14 sm:py-18`}>
        <p className={EYEBROW}>What this is</p>
        <h2 className={H2}>A comparison platform, not a broker.</h2>
        <div className={`mt-5 max-w-[68ch] space-y-4 ${PROSE}`}>
          <p>
            World Best Insurer is an independent insurance research and
            comparison site covering {totalProducts.toLocaleString()} plans from{" "}
            {totalInsurers} insurers across {activeCountries.length}{" "}
            markets — India, the US, UK, UAE, Singapore, Canada, Australia,
            Germany, Saudi Arabia, Japan, South Korea, and Hong Kong. We
            categorise every plan
            we track into health, term life, motor, and travel, and we publish
            the same comparable data points for each: sum insured range,
            illustrative premium, waiting periods, inclusions, exclusions, and
            source URL.
          </p>
          <p>
            We do not sell insurance. We are not a broker, an agent, or an
            aggregator with a commercial pipe to insurers. There are no
            affiliate links on this site, no per-policy commissions, no per-lead
            payments. The &ldquo;Visit insurer website&rdquo; buttons on every
            product page go straight to the insurer&rsquo;s own domain — we are
            not in that transaction.
          </p>
          <p>
            What we do is read the policy wordings, regulator filings, and
            annual reports, then publish the comparable facts in one place so
            you can do the comparison yourself in under five minutes instead of
            fifty. Every record carries a{" "}
            <Link
              href="/methodology"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              confidence score and last-verified date
            </Link>
            , and anything we could not trace to a primary source was removed
            rather than published.
          </p>
        </div>
      </section>

      {/* ── Lines of cover ── */}
      <section className="border-y border-border-light bg-surface-sunken/40">
        <div className={`${WRAP} py-14 sm:py-18`}>
          <p className={EYEBROW}>Lines of cover</p>
          <h2 className={H2}>Four lines. One method.</h2>
          <p className={`mt-4 max-w-[62ch] ${PROSE}`}>
            The four categories below cover the insurance lines an individual
            household actually buys. Open one to see the live comparison table.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CATEGORY_TILES.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6
                           shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[17px] font-semibold text-text-primary transition-colors group-hover:text-primary">
                    {c.title}
                  </h3>
                  <span className="shrink-0 text-[12px] text-text-tertiary tabular-nums">
                    {countByCat[c.slug] ?? 0} plans
                  </span>
                </div>
                <p className="mt-2.5 flex-1 text-[14px] leading-[1.75] text-text-secondary">
                  {c.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Compare
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sourcing. Numbered because the sources are ranked by trust. ── */}
      <section className={`${WRAP} py-14 sm:py-18`}>
        <p className={EYEBROW}>How we source the data</p>
        <h2 className={H2}>Three primary sources, ranked by trust.</h2>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {SOURCES.map((n, i) => (
            <li
              key={n.name}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-[12px] font-semibold text-primary tabular-nums">
                {i + 1}
              </span>
              <h3 className="mt-3 text-[15px] font-semibold text-text-primary">
                {n.name}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.7] text-text-secondary">
                {n.desc}
              </p>
            </li>
          ))}
        </ol>

        <div className={`mt-8 max-w-[68ch] space-y-4 ${PROSE}`}>
          <p>
            We do not source from third-party aggregators, secondary blogs, or
            sales material.
          </p>
          <p>
            Each record carries a confidence score reflecting whether the
            relevant fields were verified against primary sources, and a
            last-verified date you can see on every product page. We are not
            perfect — when we find an error we correct it and bump the
            timestamp. Treat every illustrative premium as exactly that,
            illustrative, and confirm the rate that applies to your profile
            directly with the insurer.
          </p>
          <p>
            For a longer write-up of how we collect, verify, and publish data,
            read our{" "}
            <Link
              href="/methodology"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              methodology
            </Link>
            . For the disclosures we publish under each regulator, see the{" "}
            <Link
              href="/disclaimer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              disclaimer
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Go deeper ── */}
      <section className="border-t border-border-light bg-surface-sunken/40">
        <div className={`${WRAP} py-14 sm:py-18`}>
          <p className={EYEBROW}>Go deeper</p>
          <h2 className={H2}>Beyond the comparison tables.</h2>
          <p className={`mt-4 max-w-[64ch] ${PROSE}`}>
            Comparison tables are the starting point. The harder questions — what
            tax deduction applies to which premium, whether a longer
            pre-existing waiting period is worth a smaller premium, how to
            escalate a rejected claim — sit in our editorial sections.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group rounded-2xl border border-border bg-surface p-5
                           shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex items-center gap-1.5 text-[15px] font-semibold text-text-primary transition-colors group-hover:text-primary">
                  {p.title}
                  <ArrowRight
                    className="h-3.5 w-3.5 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1.5 block text-[13.5px] leading-[1.7] text-text-secondary">
                  {p.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance note. The site-wide <Footer> carries the link columns, so
          this is the standalone disclosure only — the old homepage repeated
          the whole footer and shipped two <footer> elements on one page. */}
      <section className="border-t border-border-light">
        <div className={`${WRAP} py-8`}>
          <p className="max-w-[80ch] text-[12.5px] leading-[1.7] text-text-tertiary">
            World Best Insurer is an independent informational platform. We do
            not sell, distribute, or advise on insurance products. All data is
            sourced from publicly available information for comparison purposes
            only.
          </p>
        </div>
      </section>
    </>
  );
}
