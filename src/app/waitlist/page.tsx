import type { Metadata } from "next";
import { Bell, Zap, Shield, BarChart3, Users, Sparkles } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import TiltCard from "@/components/TiltCard";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import CounterAnimation from "@/components/immersive/CounterAnimation";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Get early access to World Best Insurer's insurance advisory features. Join our waitlist for updates on new comparison tools and services.",
};

const features = [
  {
    icon: Zap,
    title: "Early Access",
    description: "Get early access to new comparison features and tools before public launch.",
    color: "#c47d2e",
  },
  {
    icon: Shield,
    title: "Advisory Launch",
    description: "Be notified when we launch licensed advisory and recommendation services.",
    color: "#2d3a8c",
  },
  {
    icon: BarChart3,
    title: "Market Insights",
    description: "Receive periodic insights on insurance market trends and new product launches.",
    color: "#2d8f6f",
  },
];

export default function WaitlistPage() {
  return (
    <div>
      {/* Hero */}
      <AnimatedBackground variant="aurora" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-[#4f5cbf] mb-6 animate-bounce-in"
              style={{ boxShadow: "0 8px 40px rgba(45,58,140,0.3)" }}
            >
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-[36px] sm:text-[52px] font-bold text-text-primary tracking-[-0.03em] leading-[1.1] mb-4">
              Join the{" "}
              <span className="text-gradient">Waitlist</span>
            </h1>
            <p className="text-[16px] text-text-secondary max-w-lg mx-auto mb-3">
              Be the first to know when we launch new features, advisory services,
              and enhanced comparison tools.
            </p>

            {/* Social proof */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-[12px] text-text-tertiary mb-10">
              <div className="flex -space-x-1.5">
                {["#c44058", "#2d3a8c", "#2d8f6f", "#c47d2e"].map((color) => (
                  <div
                    key={color}
                    className="w-5 h-5 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span>
                <CounterAnimation target={1247} className="font-bold text-text-primary" /> people already joined
              </span>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.15}>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-lg animate-pulse-slow" />
                <div className="relative bg-surface rounded-2xl border border-border p-8 shadow-lg">
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </AnimatedBackground>

      {/* Features */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-[11px] font-bold text-accent uppercase tracking-[0.1em] mb-3">
              <Sparkles className="w-3 h-3" />
              What you get
            </div>
            <h2 className="text-[24px] sm:text-[32px] font-bold text-text-primary tracking-[-0.02em]">
              Why Join Early?
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {features.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <TiltCard className="h-full rounded-2xl bg-surface border border-border">
                <div className="p-6 text-center h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-[14px] font-bold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-text-tertiary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>

        <p className="text-[11px] text-center text-text-tertiary mt-10">
          We respect your privacy. Your email will only be used for World Best Insurer updates. Unsubscribe anytime.
        </p>
      </section>
    </div>
  );
}
