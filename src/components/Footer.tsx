import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const sections = [
  {
    title: "Compare",
    links: [
      { name: "Health Insurance", href: "/compare/health" },
      { name: "Term Life Insurance", href: "/compare/term-life" },
      { name: "Motor Insurance", href: "/compare/motor" },
      { name: "Travel Insurance", href: "/compare/travel" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Insurance Guides", href: "/learn" },
      { name: "Market Insights", href: "/insights" },
      { name: "Insurer Directory", href: "/insurers" },
      { name: "Contact Directory", href: "/contact-directory" },
      { name: "Methodology", href: "/methodology" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Early Access", href: "/waitlist" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Use", href: "/disclaimer#terms" },
    ],
  },
];

const markets = [
  { code: "in", flag: "🇮🇳" }, { code: "us", flag: "🇺🇸" }, { code: "uk", flag: "🇬🇧" },
  { code: "ae", flag: "🇦🇪" }, { code: "sg", flag: "🇸🇬" }, { code: "ca", flag: "🇨🇦" },
  { code: "au", flag: "🇦🇺" }, { code: "de", flag: "🇩🇪" }, { code: "sa", flag: "🇸🇦" },
  { code: "jp", flag: "🇯🇵" }, { code: "kr", flag: "🇰🇷" }, { code: "hk", flag: "🇭🇰" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f0f1a] text-white relative overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-grid opacity-[0.015]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8">
        {/* ── Main grid ── */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-white font-black text-[9px] tracking-[0.05em]">WBI</span>
              </div>
              <span className="text-[14px] font-bold tracking-[-0.02em] text-white/90">
                World Best Insurer
              </span>
            </Link>
            <p className="text-[12px] text-white/30 leading-[1.7] max-w-[260px] mb-5">
              The world&apos;s insurance comparison platform. Transparent data across 12 markets, zero sales pressure.
            </p>
            {/* Market flags */}
            <div className="flex flex-wrap gap-1.5">
              {markets.map((m) => (
                <Link
                  key={m.code}
                  href={`/${m.code}`}
                  className="text-[14px] hover:scale-125 transition-transform duration-200"
                  title={m.code.toUpperCase()}
                >
                  {m.flag}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[12.5px] text-white/40 hover:text-white/80 transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-0.5 group-hover:translate-y-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Regulatory notice ── */}
        <div className="py-5 border-t border-white/[0.04]">
          <p className="text-[10.5px] text-white/15 leading-[1.8] max-w-3xl">
            <span className="text-white/25 font-medium">Regulatory Notice</span> — World Best Insurer is an informational platform. We do not sell, distribute, or advise on insurance products. All data is sourced from publicly available information for comparison purposes only. We are not registered as an insurance broker, web aggregator, or intermediary. Verify all information with respective insurers.
          </p>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-4 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10.5px] text-white/15">
            &copy; {new Date().getFullYear()} World Best Insurer
          </p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            <span className="text-[10px] text-white/20">Data refreshed daily</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
