import type { Metadata } from "next";
import { Mail, MessageSquare, Send, HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import TiltCard from "@/components/TiltCard";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import AnimatedBackground from "@/components/AnimatedBackground";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Contact World Best Insurer",
  description: "Get in touch with World Best Insurer. Ask questions about insurance or provide feedback on our comparison platform.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <AnimatedBackground variant="mesh" className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light mb-5 animate-bounce-in">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-[32px] sm:text-[44px] font-bold text-text-primary tracking-[-0.03em] mb-3">
              Get in Touch
            </h1>
            <p className="text-[15px] text-text-secondary max-w-lg mx-auto">
              Have a question, feedback, or want to learn more? We&apos;d love to hear from you.
            </p>
          </ScrollReveal>
        </div>
      </AnimatedBackground>

      <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <ScrollReveal>
            <TiltCard tiltAmount={3} className="rounded-2xl bg-surface border border-border overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="p-7">
                <h2 className="text-[18px] font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Send Us a Message
                </h2>
                <form className="space-y-5">
                  <div className="input-animated relative">
                    <input
                      type="text"
                      placeholder=" "
                      className="w-full bg-transparent px-4 pt-5 pb-2 text-[14px] text-text-primary outline-none peer"
                    />
                    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary pointer-events-none transition-all duration-200 peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-primary">
                      Your Name
                    </label>
                  </div>
                  <div className="input-animated relative">
                    <input
                      type="email"
                      placeholder=" "
                      className="w-full bg-transparent px-4 pt-5 pb-2 text-[14px] text-text-primary outline-none peer"
                    />
                    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary pointer-events-none transition-all duration-200 peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-primary">
                      Email Address
                    </label>
                  </div>
                  <div className="input-animated relative">
                    <select className="w-full bg-transparent px-4 py-3.5 text-[14px] text-text-secondary outline-none appearance-none">
                      <option>General question</option>
                      <option>Data correction request</option>
                      <option>Feedback</option>
                      <option>Partnership inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="input-animated relative">
                    <textarea
                      rows={4}
                      placeholder=" "
                      className="w-full bg-transparent px-4 pt-6 pb-3 text-[14px] text-text-primary outline-none resize-none peer"
                    />
                    <label className="absolute left-4 top-4 text-[14px] text-text-tertiary pointer-events-none transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-primary">
                      Your Message
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn-glow btn-bouncy w-full py-3 text-[14px] font-semibold text-white bg-[#1a1a2e] rounded-xl"
                  >
                    Send Message
                  </button>
                  <p className="text-[10px] text-text-tertiary leading-relaxed">
                    World Best Insurer is an informational platform. We cannot provide personalized insurance advice. For product-specific queries, contact the insurer directly.
                  </p>
                </form>
              </div>
            </TiltCard>
          </ScrollReveal>

          {/* Info Cards */}
          <div className="space-y-5">
            <ScrollReveal delay={0.1}>
              <TiltCard tiltAmount={4} className="rounded-2xl bg-surface border border-border overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-accent to-primary" />
                <div className="p-6">
                  <h2 className="text-[16px] font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent" />
                    Get Updates
                  </h2>
                  <p className="text-[13px] text-text-secondary mb-4">
                    Join our mailing list for new features, guides, and advisory service updates.
                  </p>
                  <WaitlistForm variant="inline" />
                </div>
              </TiltCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <TiltCard tiltAmount={4} className="rounded-2xl bg-surface border border-border p-6">
                <h3 className="text-[14px] font-bold text-text-primary mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  What can we help with?
                </h3>
                <div className="space-y-2">
                  {[
                    "Understanding insurance product features",
                    "Comparing plans across insurers",
                    "Learning about insurance concepts",
                    "Reporting data inaccuracies",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      <span className="text-[12px] text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="rounded-2xl bg-warning-light border border-[#c47d2e]/20 p-6">
                <h3 className="text-[14px] font-bold text-[#92600e] mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Important Notice
                </h3>
                <p className="text-[11px] text-[#92600e]/80 leading-relaxed">
                  World Best Insurer cannot assist with policy purchases, claims processing, premium payments, or personalized recommendations. For these services, contact your insurer directly or a licensed intermediary.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
