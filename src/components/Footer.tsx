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
      { name: "Insurer Directory", href: "/insurers" },
      { name: "Methodology", href: "/methodology" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About World Best Insurer", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Join Waitlist", href: "/waitlist" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "Privacy Policy", href: "/disclaimer#privacy" },
      { name: "Terms of Use", href: "/disclaimer#terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.02]" />
      <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-[#7c3aed] to-accent flex items-center justify-center">
                <span className="text-white font-bold text-[16px]">WBI</span>
              </div>
              <div>
                <span className="text-[18px] font-bold tracking-[-0.03em] text-white leading-none block">World Best Insurer</span>
                <span className="text-[8px] font-medium text-white/30 tracking-[0.12em] uppercase">Insurance</span>
              </div>
            </Link>
            <p className="text-[12.5px] text-white/35 leading-relaxed max-w-[200px]">
              The world&apos;s insurance comparison platform. 12 countries, verified data, zero sales pressure.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-[11px] text-white/30 font-medium">Data updated daily</span>
            </div>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-bold text-white/25 uppercase tracking-[0.15em] mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] text-white/45 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="py-6 border-t border-white/[0.06]">
          <p className="text-[11px] text-white/20 leading-[1.8] max-w-3xl">
            <strong className="text-white/30">Regulatory Notice:</strong> World Best Insurer is an informational and educational platform. We do not sell, distribute, or advise on insurance products. All data is sourced from publicly available information and is provided for comparison purposes only. World Best Insurer is not registered as an insurance broker, web aggregator, or intermediary with any regulatory authority. Verify all information with respective insurers.
          </p>
        </div>
        <div className="py-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20">&copy; {new Date().getFullYear()} World Best Insurer. All rights reserved.</p>
          <p className="text-[11px] text-white/15">Data for educational purposes only</p>
        </div>
      </div>
    </footer>
  );
}
