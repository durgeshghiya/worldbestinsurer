import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, HelpCircle, CheckCircle2 } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact World Best Insurer",
  description:
    "Get in touch with World Best Insurer. Ask questions about insurance, report data issues, or explore partnership opportunities.",
  alternates: { canonical: "https://worldbestinsurer.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em] mb-2">
          Get in Touch
        </h1>
        <p className="text-[14px] text-text-tertiary max-w-md mx-auto">
          Have a question, feedback, or want to explore a partnership? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Substantive intro — three short sections covering who should write,
          what to expect, and what we cannot help with. Replaces the
          previously sparse contact stub. */}
      <div className="max-w-[760px] mx-auto mb-12 text-[14px] text-text-secondary leading-[1.85] space-y-4">
        <p>
          World Best Insurer is an independent comparison platform covering
          1,000+ insurance plans across 12 countries. The contact form below
          is the right place to write if you have spotted a data error in one
          of our product listings, want to suggest a topic for a future Learn
          article or Market Report, are exploring API access or another
          partnership, or simply want to ask a question about how the site
          works. Every message goes to the editorial team — there is no sales
          intermediary in between.
        </p>
        <p>
          Most messages get a reply within 24 hours on weekdays and within 48
          hours on weekends. If you are writing in to report a data error,
          please include the specific page URL and the field you believe is
          incorrect along with the source you are checking against. Data
          corrections jump to the top of the queue because every record on the
          site is supposed to be auditable against a primary source; if one
          is not, we want to fix it before another reader hits the same
          inaccuracy.
        </p>
        <p>
          What we cannot help with: we cannot give you personalised insurance
          advice, recommend a specific plan for your situation, quote
          premiums on behalf of an insurer, or intervene in a claim dispute.
          We are not licensed brokers, agents, or advisors — we publish data
          and let you decide. For policy-specific questions or claim issues,
          you need to contact the insurer directly (their customer-care
          numbers are listed on every{" "}
          <Link href="/insurers" className="text-primary hover:underline">
            insurer profile page
          </Link>
          ). For tax questions, consult a chartered accountant or tax
          professional in your jurisdiction. For licensed insurance advice,
          consult a registered advisor.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-8">
        {/* Contact form */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="text-[16px] font-bold text-text-primary mb-5">
            Send Us a Message
          </h2>
          <ContactForm />
          <p className="text-[10px] text-text-tertiary leading-relaxed mt-4">
            World Best Insurer is an informational platform. We cannot provide
            personalized insurance advice. For product-specific queries, contact
            the insurer directly.
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Email */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-primary" />
              <h3 className="text-[14px] font-bold text-text-primary">Email</h3>
            </div>
            <a
              href="mailto:hello@worldbestinsurer.com"
              className="text-[13px] text-primary hover:underline"
            >
              hello@worldbestinsurer.com
            </a>
          </div>

          {/* What we can help with */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-primary" />
              <h3 className="text-[14px] font-bold text-text-primary">
                We can help with
              </h3>
            </div>
            <div className="space-y-2">
              {[
                "Understanding insurance product features",
                "Comparing plans across insurers",
                "Reporting data inaccuracies",
                "Partnership and API inquiries",
                "General feedback",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span className="text-[12px] text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Response time */}
          <div className="bg-surface-sunken rounded-xl p-5">
            <p className="text-[12px] text-text-secondary">
              <strong className="text-text-primary">Response time:</strong> We
              typically respond within 24 hours on weekdays.
            </p>
          </div>

          {/* Links */}
          <div className="text-[12px] text-text-tertiary space-y-1.5">
            <p>
              For API access:{" "}
              <Link href="/developers" className="text-primary hover:underline">
                Developer docs
              </Link>
            </p>
            <p>
              For data methodology:{" "}
              <Link href="/methodology" className="text-primary hover:underline">
                Our methodology
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
