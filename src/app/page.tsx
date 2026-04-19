import Link from "next/link";
import { getAllProducts, getAllInsurers } from "@/lib/data";
import { getActiveCountries } from "@/lib/countries";
import {
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";

/**
 * Homepage — editorial redesign, honest positioning.
 *
 * Design language borrowed from the 2026-04 Claude Design concept
 * (Fraunces serif + Inter Tight sans + navy/cream/gold palette), but the
 * copy and structure reflect what World Best Insurer actually is: an
 * independent comparison site, not an underwriter. Every claim on this
 * page should be factually defensible against the live catalog.
 */
export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const totalInsurers = getAllInsurers().length;
  const activeCountries = getActiveCountries();

  return (
    <div
      style={{
        background: "var(--ed-cream)",
        color: "var(--ed-ink)",
        fontFamily: "var(--font-editorial-sans)",
      }}
    >
      <BreadcrumbSchema items={[{ name: "Home", url: "https://worldbestinsurer.com" }]} />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ========== HERO ========== */}
      <section
        className="mx-auto grid grid-cols-1 gap-14 px-5 py-20 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:px-8 lg:py-28"
        style={{ maxWidth: 1360 }}
      >
        <div>
          <Eyebrow>
            <Dot /> Independent · No commissions · Transparent methodology
          </Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-editorial-serif)",
              fontWeight: 300,
              fontSize: "clamp(52px, 6.4vw, 104px)",
              lineHeight: 0.96,
              letterSpacing: "-0.025em",
              margin: "28px 0 0",
              color: "var(--ed-navy-deep)",
            }}
          >
            Insurance,
            <br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--ed-navy)",
              }}
            >
              compared
            </em>{" "}
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "clamp(80px, 10vw, 160px)",
                height: "0.9em",
                background: "var(--ed-gold)",
                verticalAlign: "middle",
                marginLeft: 4,
                transform: "translateY(-0.08em)",
              }}
            />
            <br />
            from every angle.
          </h1>
          <p
            style={{
              maxWidth: 540,
              marginTop: 32,
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--ed-mute)",
            }}
          >
            {totalProducts.toLocaleString()} plans from {totalInsurers} insurers across{" "}
            {activeCountries.length}{" "}countries — side-by-side. We don&apos;t sell
            insurance. We show how plans stack up so you can decide.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/compare/health" style={btnPrimary}>
              Compare plans <Arrow />
            </Link>
            <Link href="/methodology" style={btnGhost}>
              See methodology
            </Link>
          </div>
        </div>

        {/* Stats card — real numbers, no mascot illustration */}
        <div
          style={{
            border: "1px solid var(--ed-line)",
            background: "var(--ed-paper)",
            padding: "28px 32px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <Stat value={totalProducts.toLocaleString()} label="Plans indexed" />
          <Stat value={totalInsurers.toString()} label="Insurers listed" />
          <Stat value={activeCountries.length.toString()} label="Countries covered" />
          <Stat value="Free" label="No broker fee" />
        </div>
      </section>

      {/* ========== SOURCES STRIP ========== */}
      <section
        style={{
          borderTop: "1px solid var(--ed-line)",
          borderBottom: "1px solid var(--ed-line)",
          background: "var(--ed-paper)",
        }}
      >
        <div
          className="mx-auto flex flex-wrap items-center gap-x-10 gap-y-3 px-5 py-5 lg:px-8"
          style={{
            maxWidth: 1360,
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ed-mute)",
          }}
        >
          <span style={{ color: "var(--ed-navy)" }}>Data sourced from —</span>
          {[
            "IRDAI filings",
            "Official insurer sites",
            "Policy wordings",
            "Annual reports",
            "Regulator disclosures",
          ].map((s) => (
            <span
              key={s}
              style={{
                fontFamily: "var(--font-editorial-serif)",
                fontSize: 18,
                fontStyle: "italic",
                letterSpacing: 0,
                textTransform: "none",
                color: "var(--ed-navy-deep)",
                opacity: 0.72,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ========== CATEGORY GRID ========== */}
      <section className="mx-auto px-5 py-24 lg:px-8" style={{ maxWidth: 1360 }}>
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] md:items-end">
          <div>
            <Eyebrow>01 — Coverage</Eyebrow>
            <h2 style={sectionTitle}>
              Four <em style={{ fontStyle: "italic" }}>categories</em>.
            </h2>
          </div>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--ed-mute)",
              maxWidth: 540,
            }}
          >
            Each category has its own comparison table with the same column shape — claim
            settlement ratio, eligibility, waiting periods, what&apos;s excluded. Pick
            one to start.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 1, background: "var(--ed-line)", border: "1px solid var(--ed-line)" }}
        >
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group"
              style={{
                background: "var(--ed-paper)",
                padding: "36px 28px 32px",
                textDecoration: "none",
                color: "var(--ed-ink)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minHeight: 340,
                transition: "background 0.2s",
              }}
            >
              <div className="flex items-start justify-between">
                <span
                  style={{
                    fontFamily: "var(--font-editorial-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: "var(--ed-mute)",
                  }}
                >
                  0{i + 1}
                </span>
              </div>
              <div style={{ marginTop: "auto" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-editorial-serif)",
                    fontSize: 28,
                    fontWeight: 400,
                    color: "var(--ed-navy-deep)",
                    letterSpacing: "-0.02em",
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {c.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ed-mute)",
                    margin: "10px 0 18px",
                    lineHeight: 1.5,
                  }}
                >
                  {c.tagline}
                </p>
                <div
                  className="flex items-baseline justify-between"
                  style={{ paddingTop: 16, borderTop: "1px solid var(--ed-line)" }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--ed-mute)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Compare
                  </span>
                  <Arrow />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== WHY WE EXIST ========== */}
      <section style={{ background: "var(--ed-navy-deep)", color: "var(--ed-cream)" }}>
        <div
          className="mx-auto grid grid-cols-1 gap-20 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8"
          style={{ maxWidth: 1360 }}
        >
          <div>
            <Eyebrow
              style={{
                color: "color-mix(in oklab, var(--ed-cream) 60%, transparent)",
              }}
            >
              02 — Why we exist
            </Eyebrow>
            <h2 style={{ ...sectionTitle, color: "var(--ed-cream)" }}>
              Comparison.
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ed-gold)" }}>
                Not commission.
              </em>
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "color-mix(in oklab, var(--ed-cream) 75%, transparent)",
                maxWidth: 480,
                marginTop: 24,
              }}
            >
              Every insurer link goes straight to their own site. We take zero affiliate fees,
              zero per-lead payments, zero per-policy cuts. Data comes from IRDAI filings and
              official policy wordings, with a confidence score on every record.
            </p>
          </div>
          <div
            className="grid grid-cols-2"
            style={{
              gap: 1,
              background: "color-mix(in oklab, var(--ed-cream) 12%, transparent)",
              border: "1px solid color-mix(in oklab, var(--ed-cream) 12%, transparent)",
            }}
          >
            {[
              ["100%", "Independent data"],
              ["0", "Affiliate links"],
              ["Open", "Methodology"],
              ["Auditable", "Every record"],
            ].map(([v, l]) => (
              <div
                key={l}
                style={{ background: "var(--ed-navy-deep)", padding: "32px 28px" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-editorial-serif)",
                    fontSize: 42,
                    fontWeight: 300,
                    color: "var(--ed-cream)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "color-mix(in oklab, var(--ed-cream) 55%, transparent)",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="mx-auto px-5 py-24 lg:px-8" style={{ maxWidth: 1360 }}>
        <div
          style={{
            border: "1px solid var(--ed-line)",
            background: "var(--ed-paper)",
            padding: "clamp(40px, 6vw, 80px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40%",
              background: "var(--ed-gold-soft)",
              opacity: 0.4,
            }}
          />
          <div className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>03 — Begin</Eyebrow>
              <h2 style={{ ...sectionTitle, marginBottom: 20 }}>
                Compare. <em style={{ fontStyle: "italic" }}>Verify.</em>
                <br />
                Decide.
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: "var(--ed-mute)",
                  maxWidth: 480,
                  lineHeight: 1.55,
                }}
              >
                No sales calls. No email capture to see prices. Your data goes to the insurer
                you click through to — not to us.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/compare/health"
                style={{ ...btnPrimary, padding: "20px 32px", fontSize: 16 }}
              >
                Start comparing <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ Small components ============

function Eyebrow({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-editorial-mono)",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--ed-mute)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Dot() {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: 99,
        background: "var(--ed-gold)",
        display: "inline-block",
      }}
    />
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-editorial-serif)",
          fontSize: 32,
          fontWeight: 300,
          color: "var(--ed-navy-deep)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "var(--ed-mute)",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============ Styles ============

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 24px",
  fontSize: 14,
  fontFamily: "var(--font-editorial-sans)",
  fontWeight: 500,
  background: "var(--ed-navy-deep)",
  color: "var(--ed-cream)",
  border: "1px solid var(--ed-navy-deep)",
  textDecoration: "none",
  borderRadius: 0,
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 24px",
  fontSize: 14,
  fontFamily: "var(--font-editorial-sans)",
  fontWeight: 500,
  background: "transparent",
  color: "var(--ed-navy-deep)",
  border: "1px solid var(--ed-line)",
  textDecoration: "none",
  borderRadius: 0,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-editorial-serif)",
  fontWeight: 300,
  fontSize: "clamp(36px, 4.5vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: "-0.025em",
  margin: "20px 0 0",
  color: "var(--ed-navy-deep)",
};

const CATEGORIES = [
  {
    slug: "health",
    name: "Health",
    tagline: "Hospitalization, day-care, and pre-existing conditions.",
  },
  {
    slug: "term-life",
    name: "Term Life",
    tagline: "Pure protection — a large sum for your family at the lowest premium.",
  },
  {
    slug: "motor",
    name: "Motor",
    tagline: "Third-party and comprehensive cover for cars and two-wheelers.",
  },
  {
    slug: "travel",
    name: "Travel",
    tagline: "Single-trip and multi-trip cover with medical and cancellation.",
  },
];
