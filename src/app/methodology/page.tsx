import type { Metadata } from "next";
import Link from "next/link";
import {
  Database, CheckCircle2, AlertTriangle, Clock, Eye,
  ArrowRight, FileText, BookOpen, Shield, Landmark,
} from "lucide-react";
import TiltCard from "@/components/TiltCard";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import AnimatedBackground from "@/components/AnimatedBackground";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Data Methodology",
  description: "How World Best Insurer sources, verifies, and presents insurance comparison data. Our methodology for transparent, trustworthy comparisons.",
};

const sources = [
  { icon: FileText, title: "Official Insurer Websites", desc: "Product pages, feature descriptions, eligibility criteria, and premium calculators.", color: "#2d3a8c" },
  { icon: BookOpen, title: "Public Brochures & PDFs", desc: "Product brochures, sales literature, and benefit illustrations publicly available.", color: "#c47d2e" },
  { icon: Shield, title: "Policy Wording Documents", desc: "Policy terms and conditions documents made publicly available by insurers.", color: "#2d8f6f" },
  { icon: Landmark, title: "IRDAI Publications", desc: "Regulatory publications, annual reports, and public data from IRDAI.", color: "#c44058" },
];

const dontDo = [
  "We do not fabricate or guess data. Missing data is omitted or marked clearly.",
  "We do not rank products as \"best\" or \"recommended\" based on undisclosed criteria.",
  "We do not accept payment from insurers to influence data presentation.",
  "We do not present illustrative premiums as actual or guaranteed quotes.",
];

export default function MethodologyPage() {
  return (
    <div>
      {/* Hero */}
      <AnimatedBackground variant="mesh" className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light mb-5 animate-bounce-in">
              <Database className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-[32px] sm:text-[44px] font-bold text-text-primary tracking-[-0.03em] mb-3">
              Data Methodology
            </h1>
            <p className="text-[15px] text-text-secondary max-w-2xl">
              Transparency is core to World Best Insurer. Here&apos;s how we source, verify,
              and present insurance data on this platform.
            </p>
          </ScrollReveal>
        </div>
      </AnimatedBackground>

      {/* Data Sources */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <ScrollReveal>
          <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em] mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Data Sources
          </h2>
          <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
            We source insurance product data exclusively from legitimate, publicly available sources.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {sources.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.08}>
              <TiltCard tiltAmount={5} className="h-full rounded-xl bg-surface border border-border">
                <div className="p-5 flex items-start gap-4 h-full">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${s.color}12` }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-text-primary mb-1">{s.title}</h3>
                    <p className="text-[12px] text-text-tertiary leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
        <p className="text-[10px] text-text-tertiary">
          We do NOT scrape websites in violation of terms of service or robots.txt. We do NOT use unverified third-party aggregations as primary sources.
        </p>
      </section>

      <SectionDivider variant="dots" />

      {/* Confidence Scoring */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <ScrollReveal>
          <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em] mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Confidence Scoring
          </h2>
          <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
            Every product is assigned a confidence score reflecting our assessment of data reliability.
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {[
            {
              level: "High",
              desc: "Data verified directly from official insurer product pages or policy wording documents. Cross-referenced and recently checked.",
              colors: { bg: "bg-success-light", border: "border-success/20", text: "text-success", badge: "bg-success/10 text-success" },
              bar: "bg-success",
              width: "100%",
            },
            {
              level: "Medium",
              desc: "Data sourced from official product pages but not cross-verified with policy wording. Premium figures are illustrative.",
              colors: { bg: "bg-warning-light", border: "border-warning/20", text: "text-warning", badge: "bg-warning/10 text-warning" },
              bar: "bg-warning",
              width: "65%",
            },
            {
              level: "Low",
              desc: "Data from secondary sources or older publications. May be outdated. Verification pending. Marked clearly as unverified.",
              colors: { bg: "bg-danger-light", border: "border-danger/20", text: "text-danger", badge: "bg-danger/10 text-danger" },
              bar: "bg-danger",
              width: "30%",
            },
          ].map((score, i) => (
            <ScrollReveal key={score.level} delay={i * 0.1}>
              <div className={`${score.colors.bg} ${score.colors.border} border rounded-xl p-5`}>
                <div className="flex items-start gap-4">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${score.colors.badge} shrink-0`}>
                    {score.level}
                  </span>
                  <div className="flex-1">
                    <p className={`text-[13px] ${score.colors.text} leading-relaxed`}>
                      {score.desc}
                    </p>
                    <div className="mt-3 h-1.5 rounded-full bg-black/5 overflow-hidden">
                      <div className={`h-full rounded-full ${score.bar} transition-all`} style={{ width: score.width }} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <SectionDivider variant="gradient" />

      {/* What We Don't Do + Update Frequency */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal>
            <h2 className="text-[22px] font-bold text-text-primary mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              What We Don&apos;t Do
            </h2>
            <div className="space-y-3">
              {dontDo.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-danger-light/50 border border-danger/10"
                >
                  <div className="w-5 h-5 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[12px] text-danger font-bold">&times;</span>
                  </div>
                  <span className="text-[12px] text-text-secondary leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="text-[22px] font-bold text-text-primary mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Update Frequency
            </h2>
            <div className="bg-surface rounded-xl border border-border p-6">
              <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
                We review and update product data periodically. Each listing shows a &ldquo;last verified&rdquo;
                date. Insurance products change frequently and there may be a lag between insurer
                changes and our updates.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Premium data", freq: "Every 90 days", color: "#2d8f6f" },
                  { label: "Product features", freq: "Every 180 days", color: "#c47d2e" },
                  { label: "Insurer data", freq: "Annually", color: "#2d3a8c" },
                  { label: "CSR data", freq: "IRDAI annual report", color: "#c44058" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                    <span className="text-[12px] text-text-primary font-medium">{item.label}</span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${item.color}12`, color: item.color }}
                    >
                      {item.freq}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Report CTA */}
            <div className="mt-6 bg-surface-sunken rounded-xl p-6">
              <h3 className="text-[14px] font-bold text-text-primary mb-2">Report an Inaccuracy</h3>
              <p className="text-[12px] text-text-secondary mb-4">
                Found incorrect or outdated data? Please let us know so we can correct it.
              </p>
              <Link
                href="/contact"
                className="btn-bouncy inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-primary bg-primary-light rounded-lg hover:bg-primary/10 transition-colors"
              >
                Report Data Issue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
