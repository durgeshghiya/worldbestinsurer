import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getAllInsurers } from "@/lib/data";
import { getActiveCountries } from "@/lib/countries";
import { categories } from "@/lib/data";
import {
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";
import ImmersiveStage from "@/components/ImmersiveStage";
import CompareLauncher from "@/components/CompareLauncher";

export const metadata: Metadata = {
  alternates: { canonical: "https://worldbestinsurer.com" },
};

const CATEGORY_TILES = [
  {
    slug: "health",
    title: "Health insurance",
    accent: "#ff5d7e",
    desc: "Hospitalization, day-care, and pre-existing conditions. Health is the deepest category we cover — sum insured, waiting periods, room rent caps, and PED limits are the four numbers that decide claim outcomes.",
  },
  {
    slug: "term-life",
    title: "Term life insurance",
    accent: "#7c8cff",
    desc: "Pure protection — a large sum assured for a fixed term at the lowest possible premium. We track claim settlement ratio per insurer and policy term flexibility per plan.",
  },
  {
    slug: "motor",
    title: "Motor insurance",
    accent: "#34d399",
    desc: "Third-party and comprehensive cover for cars and two-wheelers. The clauses that matter most are the depreciation schedule, the cashless garage network, and the no-claim bonus structure.",
  },
  {
    slug: "travel",
    title: "Travel insurance",
    accent: "#f5b14c",
    desc: "Single-trip and multi-trip cover including medical evacuation, trip cancellation, lost baggage, and adventure-sport riders. The medical evacuation limit is the line item to scrutinise.",
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

  return (
    <div className="imm-home">
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://worldbestinsurer.com" }]}
      />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ═══════ STAGE — boot artwork, HUD, wordmark ═══════ */}
      <ImmersiveStage>
        <h1 className="imm-wordmark">
          WORLD BEST INSURER
          <span className="sr-only"> — compare insurance plans worldwide</span>
        </h1>
        <p className="imm-tagline">Insurance, compared from every angle.</p>
      </ImmersiveStage>

      <div className="imm-content">
        {/* ═══════ COMPARE ═══════ */}
        <section className="imm-section" id="compare">
          <div className="imm-reveal">
            <p className="imm-eyebrow">
              01 <b>/ Start</b>
            </p>
            <h2 className="imm-h2">
              {totalProducts.toLocaleString()}+ plans.{" "}
              <span className="dim">Two selections.</span>
            </h2>
            <div className="imm-prose">
              <p>
                {totalProducts.toLocaleString()}+ plans from {totalInsurers}+
                insurers across {activeCountries.length}{" "}countries —
                side-by-side, normalized, and ranked on the facts. We
                don&rsquo;t sell insurance.
              </p>
            </div>
          </div>
          <div className="imm-reveal">
            <CompareLauncher countries={countryData} categories={categoryData} />
          </div>
        </section>

        {/* ═══════ STATS ═══════ */}
        <div className="imm-reveal imm-stats" role="list" aria-label="Platform statistics">
          {[
            { v: totalProducts.toLocaleString(), s: "+", l: "Plans indexed" },
            { v: String(totalInsurers), s: "+", l: "Insurers tracked" },
            { v: String(activeCountries.length), s: "", l: "Country markets" },
            { v: "0", s: "", l: "Affiliate links" },
          ].map((x) => (
            <div key={x.l} className="imm-stat" role="listitem">
              <div className="imm-stat-value">
                {x.v}
                {x.s && <sup>{x.s}</sup>}
              </div>
              <div className="imm-stat-label">{x.l}</div>
            </div>
          ))}
        </div>

        {/* ═══════ NOT A BROKER ═══════ */}
        <section className="imm-section">
          <div className="imm-reveal">
            <p className="imm-eyebrow">
              02 <b>/ What this is</b>
            </p>
            <h2 className="imm-h2">
              A comparison platform.{" "}
              <span className="dim">Not a broker.</span>
            </h2>
          </div>
          <div className="imm-prose imm-reveal">
            <p>
              World Best Insurer is an independent insurance research and
              comparison site covering {totalProducts.toLocaleString()}+ plans
              from {totalInsurers}+ insurers across {activeCountries.length}{" "}
              markets — India, the US, UK, UAE, Singapore, Canada, Australia,
              Germany, Saudi Arabia, Japan, South Korea, and Hong Kong. We
              categorise every plan we track into health, term life, motor,
              and travel, and we publish the same comparable data points for
              each: sum insured range, illustrative premium, claim settlement
              ratio, waiting periods, inclusions, exclusions, and source URL.
            </p>
            <p>
              We do not sell insurance. We are not a broker, an agent, or an
              aggregator with a commercial pipe to insurers. There are no
              affiliate links on this site, no per-policy commissions, no
              per-lead payments. The &ldquo;Visit insurer website&rdquo;
              buttons on every product page go straight to the
              insurer&rsquo;s own domain — we are not in that transaction.
            </p>
            <p>
              What we do is read the policy wordings, regulator filings, and
              annual reports, then publish the comparable facts in one place
              so you can do the comparison yourself in under five minutes
              instead of fifty. Every record has a{" "}
              <Link href="/methodology">
                confidence score and last-verified date
              </Link>
              ; nothing on this site is a guess.
            </p>
          </div>
          <div className="imm-chips imm-reveal">
            <span className="imm-chip">No affiliate links</span>
            <span className="imm-chip">No commissions</span>
            <span className="imm-chip">No sales calls</span>
          </div>
        </section>

        {/* ═══════ CATALOG ═══════ */}
        <section className="imm-section">
          <div className="imm-reveal">
            <p className="imm-eyebrow">
              03 <b>/ Lines of cover</b>
            </p>
            <h2 className="imm-h2">
              Four lines. <span className="dim">One method.</span>
            </h2>
            <div className="imm-prose">
              <p>
                The four categories below cover the insurance lines an
                individual household actually buys. Click into one to see the
                live comparison table.
              </p>
            </div>
          </div>
          <div className="imm-tiles imm-reveal">
            {CATEGORY_TILES.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="imm-tile"
                style={{ "--tile-accent": c.accent } as React.CSSProperties}
              >
                <div className="imm-tile-head">
                  <span className="imm-tile-name">{c.title}</span>
                  <span className="imm-tile-count">
                    {countByCat[c.slug] ?? 0} plans
                  </span>
                </div>
                <p className="imm-tile-desc">{c.desc}</p>
                <span className="imm-tile-cta">Compare →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════ DATA SOURCING ═══════ */}
        <section className="imm-section">
          <div className="imm-reveal">
            <p className="imm-eyebrow">
              04 <b>/ Trust</b>
            </p>
            <h2 className="imm-h2">
              How we source <span className="dim">the data.</span>
            </h2>
          </div>

          <div className="imm-pipeline imm-reveal">
            {[
              {
                step: "Step 01",
                name: "Regulator filings",
                desc: "IRDAI in India, NAIC in the US, APRA in Australia, MAS in Singapore, and the equivalents in our other markets — the highest-trust source for claim ratios and solvency.",
              },
              {
                step: "Step 02",
                name: "Policy wordings",
                desc: "The insurer's own published wordings, brochures, and rate cards — the contract language itself, read clause by clause.",
              },
              {
                step: "Step 03",
                name: "Annual reports",
                desc: "Insurer financials for claim settlement ratios and financial-health metrics, cross-checked against the regulator's numbers annually.",
              },
            ].map((n) => (
              <div key={n.step} className="imm-node">
                <div className="imm-node-step">{n.step}</div>
                <div className="imm-node-name">{n.name}</div>
                <div className="imm-node-desc">{n.desc}</div>
              </div>
            ))}
          </div>

          <div className="imm-prose imm-reveal">
            <p>
              Three primary sources, ranked by trust. We do not source from
              third-party aggregators, secondary blogs, or sales material.
            </p>
            <p>
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
            <p>
              For a longer write-up of how we collect, verify, and publish
              data, read our <Link href="/methodology">methodology page</Link>
              . For the disclosures we are required to publish under each
              regulator, see the <Link href="/disclaimer">disclaimer</Link>.
            </p>
          </div>
        </section>

        {/* ═══════ PILLARS ═══════ */}
        <section className="imm-section">
          <div className="imm-reveal">
            <p className="imm-eyebrow">
              05 <b>/ Go deeper</b>
            </p>
            <h2 className="imm-h2">
              Beyond the <span className="dim">comparison tables.</span>
            </h2>
            <div className="imm-prose">
              <p>
                Comparison tables are the starting point. The harder questions
                — what tax deduction applies to which premium, whether a
                longer pre-existing waiting period is worth a smaller premium,
                which insurer&rsquo;s claim record is genuinely reliable — sit
                in our editorial sections.
              </p>
            </div>
          </div>
          <div className="imm-pillars imm-reveal">
            {PILLARS.map((p) => (
              <Link key={p.href} href={p.href} className="imm-pillar">
                <span className="imm-pillar-name">{p.title}</span>
                <span className="imm-pillar-desc">{p.desc}</span>
                <span className="imm-pillar-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════ COMPLIANCE ═══════ */}
        <footer className="imm-footer">
          <p>
            World Best Insurer is an independent informational platform. We do
            not sell, distribute, or advise on insurance products. All data is
            sourced from publicly available information for comparison
            purposes only.
          </p>
          <div className="imm-footer-links">
            <Link href="/methodology">Methodology</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/about">About</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
