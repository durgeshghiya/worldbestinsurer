import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer, Privacy Policy & Terms of Use",
  description: "Legal disclaimers, privacy policy, and terms of use for the World Best Insurer comparison platform.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
        Legal Notices
      </h1>

      <nav className="mb-10 p-4 bg-muted-light rounded-xl">
        <p className="text-sm font-medium text-foreground mb-2">On this page:</p>
        <ul className="space-y-1 text-sm">
          <li><a href="#disclaimer" className="text-primary hover:underline">Regulatory Disclaimer</a></li>
          <li><a href="#data" className="text-primary hover:underline">Data Disclaimer</a></li>
          <li><a href="#privacy" className="text-primary hover:underline">Privacy Policy</a></li>
          <li><a href="#terms" className="text-primary hover:underline">Terms of Use</a></li>
        </ul>
      </nav>

      <div className="space-y-12 text-sm text-muted leading-relaxed">
        {/* Regulatory Disclaimer */}
        <section id="disclaimer">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Regulatory Disclaimer
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-4">
            <p className="text-amber-800 font-medium mb-3">
              Important: Please read this disclaimer carefully.
            </p>
            <ul className="space-y-3 text-amber-700">
              <li>
                World Best Insurer (this website) is an <strong>informational and educational platform</strong>.
                It is NOT registered with the Insurance Regulatory and Development Authority
                of India (IRDAI) as an insurance broker, web aggregator, corporate agent,
                or any other category of insurance intermediary.
              </li>
              <li>
                World Best Insurer does NOT sell, solicit, recommend, advise on, or distribute
                insurance policies of any kind. No transaction for the purchase of
                insurance can be initiated, completed, or facilitated through this website.
              </li>
              <li>
                Information displayed on this website is compiled from publicly available
                sources including official insurer websites, public brochures, policy
                wording documents, and regulatory publications. This information is
                provided purely for educational and comparison purposes.
              </li>
              <li>
                World Best Insurer does NOT guarantee the accuracy, completeness, timeliness, or
                reliability of any data displayed. Insurance products, terms, premiums,
                and features are subject to change by insurers at any time without notice
                to World Best Insurer.
              </li>
              <li>
                Any premium figures shown are <strong>illustrative only</strong> and sourced
                from publicly available calculators or brochures. Actual premiums depend on
                individual factors and must be obtained directly from the insurer.
              </li>
              <li>
                Users must verify all information directly with the respective insurance
                company before making any insurance-related decisions. World Best Insurer accepts no
                liability for decisions made based on information provided on this platform.
              </li>
              <li>
                Insurance is a subject matter of solicitation. IRDAI Registration Number
                and other regulatory details of individual insurers are available on the
                IRDAI website (irdai.gov.in) and on each insurer&apos;s official website.
              </li>
            </ul>
          </div>
        </section>

        {/* Data Disclaimer */}
        <section id="data">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Data Disclaimer
          </h2>
          <p className="mb-3">
            World Best Insurer aggregates information from publicly accessible sources. Our data
            methodology includes:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Sourcing data from official insurer product pages and brochures</li>
            <li>Cross-referencing with publicly available policy wording documents</li>
            <li>Marking each data point with a confidence score (high/medium/low)</li>
            <li>Displaying the date of last verification for each product</li>
            <li>Clearly labelling illustrative or unverified data</li>
          </ul>
          <p>
            Despite our best efforts, data may contain inaccuracies or become outdated.
            World Best Insurer does not warrant that the information is error-free. For the most
            current and accurate information, please contact the insurer directly.
          </p>
          <p className="mt-3">
            See our <Link href="/methodology" className="text-primary underline">Data Methodology</Link> page for more details.
          </p>
        </section>

        {/* Privacy Policy */}
        <section id="privacy">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Privacy Policy
          </h2>
          <p className="mb-4">
            This Privacy Policy describes how World Best Insurer collects, uses, and protects
            personal information. This policy complies with applicable Indian laws
            including the Information Technology Act, 2000, IT (Reasonable Security
            Practices and Procedures and Sensitive Personal Data or Information)
            Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP Act)
            to the extent applicable.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Information We Collect
          </h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Email address</strong> — if you voluntarily submit it through our
              waitlist or contact forms
            </li>
            <li>
              <strong>Name</strong> — if you voluntarily provide it in a contact form
            </li>
            <li>
              <strong>Usage data</strong> — anonymous analytics data such as pages visited,
              referral source, and device type, collected through standard analytics tools
            </li>
          </ul>
          <p className="mb-3">
            We do NOT collect sensitive personal data such as financial information,
            health data, or identity documents. We do NOT collect insurance policy
            details.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            How We Use Information
          </h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>To communicate with you about World Best Insurer updates (if you opted in)</li>
            <li>To improve the website experience</li>
            <li>To respond to your queries</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Data Sharing
          </h3>
          <p className="mb-3">
            We do not sell, trade, or share your personal information with third
            parties for marketing purposes. We may use third-party service providers
            (email services, analytics) who process data on our behalf under strict
            confidentiality agreements.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Your Rights
          </h3>
          <p className="mb-3">
            Under the DPDP Act 2023, you have the right to access, correct, and
            request deletion of your personal data. To exercise these rights, contact
            us at the address listed on our <Link href="/contact" className="text-primary underline">Contact</Link> page.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Cookies
          </h3>
          <p>
            This website may use essential cookies for functionality and analytics
            cookies for understanding usage patterns. You can control cookie preferences
            through your browser settings.
          </p>
        </section>

        {/* Terms of Use */}
        <section id="terms">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Terms of Use
          </h2>
          <p className="mb-4">
            By accessing and using World Best Insurer (this website), you agree to the following terms:
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Nature of Service
          </h3>
          <p className="mb-3">
            World Best Insurer provides informational content about insurance products available in
            India. This is an educational resource, not a transactional platform. No
            insurance can be purchased, applied for, or bound through this website.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            No Professional Advice
          </h3>
          <p className="mb-3">
            Content on this website does not constitute professional insurance, financial,
            legal, or tax advice. The information is general in nature and should not be
            relied upon as a substitute for professional consultation tailored to your
            individual circumstances.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Limitation of Liability
          </h3>
          <p className="mb-3">
            World Best Insurer shall not be liable for any direct, indirect, incidental, consequential,
            or punitive damages arising from your use of this website or reliance on
            information provided herein. You use this website at your own risk.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            External Links
          </h3>
          <p className="mb-3">
            This website contains links to insurer websites and other external resources.
            World Best Insurer is not responsible for the content, accuracy, or practices of linked
            websites. Links are provided for your convenience and do not imply endorsement.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Intellectual Property
          </h3>
          <p className="mb-3">
            All original content on this website (text, design, code) is the property of
            World Best Insurer. Insurance product data is attributed to respective insurers and public
            sources. Insurer names and trademarks belong to their respective owners.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Governing Law
          </h3>
          <p className="mb-3">
            These terms are governed by the laws of India. Any disputes shall be subject
            to the jurisdiction of courts in India.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Changes to These Terms
          </h3>
          <p>
            We may update these terms from time to time. Continued use of the website
            after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted">
            Last updated: March 2026. For questions about these legal notices, please{" "}
            <Link href="/contact" className="text-primary underline">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
