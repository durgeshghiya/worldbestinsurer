import type { Metadata } from "next";
import Link from "next/link";
import {
  Target, Eye, Shield, ArrowRight, Heart,
  CheckCircle2, XCircle, Sparkles, Rocket, BookOpen, Globe,
} from "lucide-react";
import TiltCard from "@/components/TiltCard";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import AnimatedBackground from "@/components/AnimatedBackground";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "About World Best Insurer",
  description: "World Best Insurer is India's smart insurance comparison and education platform. Learn about our mission, approach, and future plans.",
};

const values = [
  { icon: Shield, title: "Transparency", desc: "Every data point links to its official source with confidence scores.", color: "#2d3a8c" },
  { icon: Heart, title: "User First", desc: "No commissions, no pay-to-play. Just structured, unbiased data.", color: "#c44058" },
  { icon: BookOpen, title: "Education", desc: "Knowledge-first approach. Understand before you compare.", color: "#c47d2e" },
  { icon: Globe, title: "Global Reach", desc: "12 countries. Localized data. Currency-specific comparisons.", color: "#2d8f6f" },
];

const whatWeAre = [
  "Educational & informational comparison platform",
  "Research tool for consumers exploring insurance",
  "Content platform publishing insurance guides",
  "Future-ready platform building towards licensed services",
];

const whatWeAreNot = [
  "Not an IRDAI-licensed insurance broker",
  "Not an IRDAI-registered web aggregator",
  "Not an insurance seller or intermediary",
  "Not providing personalized insurance advice",
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <AnimatedBackground variant="aurora" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary/10 text-[11px] font-bold text-primary uppercase tracking-[0.1em] mb-5">
                <Sparkles className="w-3 h-3" />
                About Us
              </div>
              <h1 className="text-[36px] sm:text-[52px] font-bold text-text-primary tracking-[-0.03em] leading-[1.1] mb-5">
                Insurance comparison,{" "}
                <span className="text-gradient">reimagined.</span>
              </h1>
              <p className="text-[16px] sm:text-[18px] text-text-secondary leading-relaxed max-w-2xl">
                World Best Insurer is an informational comparison and education platform
                built for Indian consumers. We aggregate publicly available data to help
                you explore insurance plans — transparently and without sales pressure.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </AnimatedBackground>

      <SectionDivider variant="gradient" />

      {/* Values */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">
              Our Values
            </h2>
            <p className="text-[14px] text-text-secondary mt-2 max-w-md mx-auto">
              Every design choice is guided by these principles
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.08}>
              <TiltCard className="h-full rounded-2xl bg-surface border border-border">
                <div className="p-6 text-center h-full">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${v.color}12` }}
                  >
                    <v.icon className="w-7 h-7" style={{ color: v.color }} />
                  </div>
                  <h3 className="text-[15px] font-bold text-text-primary mb-2">{v.title}</h3>
                  <p className="text-[12px] text-text-tertiary leading-relaxed">{v.desc}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <SectionDivider variant="dots" />

      {/* Mission */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-[22px] font-bold text-text-primary">Our Mission</h2>
            </div>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
              Insurance in India is complex. With hundreds of products across dozens of insurers,
              comparing features and suitability is time-consuming and often influenced by
              intermediary incentives. We exist to give consumers a neutral, data-driven starting
              point for their insurance research.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-[22px] font-bold text-text-primary">Our Approach</h2>
            </div>
            <div className="space-y-3">
              {[
                { title: "Data from public sources", desc: "Official insurer websites, product brochures, policy documents, and IRDAI publications." },
                { title: "Transparency on data quality", desc: "Each listing shows a confidence score and last verification date." },
                { title: "No false claims", desc: "We don't sell insurance or provide advice unless we hold relevant IRDAI registration." },
                { title: "Educational content", desc: "Our guides educate, not push products. We explain concepts for confident decisions." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-surface-sunken">
                  <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[13px] font-semibold text-text-primary">{item.title}</span>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* What We Are / Are Not */}
          <ScrollReveal delay={0.15}>
            <div className="space-y-5">
              <TiltCard tiltAmount={4} className="rounded-2xl overflow-hidden border border-success/20 bg-success-light">
                <div className="h-1 bg-success" />
                <div className="p-6">
                  <h3 className="text-[15px] font-bold text-success mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    What We Are
                  </h3>
                  <div className="space-y-2.5">
                    {whatWeAre.map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                        </div>
                        <span className="text-[12px] text-success/90 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>

              <TiltCard tiltAmount={4} className="rounded-2xl overflow-hidden border border-danger/20 bg-danger-light">
                <div className="h-1 bg-danger" />
                <div className="p-6">
                  <h3 className="text-[15px] font-bold text-danger mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    What We Are NOT
                  </h3>
                  <div className="space-y-2.5">
                    {whatWeAreNot.map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                          <XCircle className="w-3 h-3 text-danger" />
                        </div>
                        <span className="text-[12px] text-danger/90 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Future Plans CTA */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d3a8c] rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-[10%] w-[300px] h-[300px] rounded-full bg-[#c47d2e]/10 blur-[100px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-5">
                <Rocket className="w-7 h-7 text-[#c47d2e]" />
              </div>
              <h2 className="text-[24px] sm:text-[32px] font-bold text-white tracking-[-0.02em] mb-3">
                What&apos;s Next?
              </h2>
              <p className="text-[14px] text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
                We&apos;re building towards IRDAI registration, real-time insurer APIs,
                advisory tools, and personalized recommendation engines — all within the regulatory framework.
              </p>
              <Link
                href="/waitlist"
                className="btn-glow btn-bouncy inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
              >
                Join the Waitlist <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
