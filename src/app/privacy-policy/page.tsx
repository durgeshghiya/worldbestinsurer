import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Bell, Trash2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — World Best Insurer",
  description:
    "World Best Insurer's Privacy Policy. Learn how we collect, use, and protect your personal information in compliance with the DPDP Act 2023 and IT Act 2000.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "13 April 2026";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm text-text-tertiary font-medium">Legal</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
        Privacy Policy
      </h1>
      <p className="text-text-secondary text-sm mb-2">
        Last updated: {lastUpdated}
      </p>
      <p className="text-text-secondary text-sm mb-8 max-w-2xl">
        This Privacy Policy explains how World Best Insurer (&quot;we&quot;, &quot;our&quot;, or
        &quot;us&quot;) collects, uses, and safeguards information when you visit{" "}
        <strong>worldbestinsurer.com</strong>. We are committed to protecting
        your privacy and complying with applicable Indian data protection laws.
      </p>

      {/* Quick nav */}
      <nav className="mb-10 p-5 bg-surface rounded-2xl border border-border">
        <p className="text-sm font-semibold text-text-primary mb-3">
          Contents
        </p>
        <ol className="space-y-1.5 text-sm text-primary">
          <li>
            <a href="#who-we-are" className="hover:underline">
              1. Who We Are
            </a>
          </li>
          <li>
            <a href="#information-collected" className="hover:underline">
              2. Information We Collect
            </a>
          </li>
          <li>
            <a href="#how-we-use" className="hover:underline">
              3. How We Use Your Information
            </a>
          </li>
          <li>
            <a href="#sharing" className="hover:underline">
              4. Sharing of Information
            </a>
          </li>
          <li>
            <a href="#cookies" className="hover:underline">
              5. Cookies and Tracking
            </a>
          </li>
          <li>
            <a href="#data-retention" className="hover:underline">
              6. Data Retention
            </a>
          </li>
          <li>
            <a href="#your-rights" className="hover:underline">
              7. Your Rights
            </a>
          </li>
          <li>
            <a href="#children" className="hover:underline">
              8. Children&apos;s Privacy
            </a>
          </li>
          <li>
            <a href="#security" className="hover:underline">
              9. Security
            </a>
          </li>
          <li>
            <a href="#changes" className="hover:underline">
              10. Changes to This Policy
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:underline">
              11. Contact Us
            </a>
          </li>
        </ol>
      </nav>

      <div className="space-y-12 text-sm text-text-secondary leading-relaxed">
        {/* 1. Who We Are */}
        <section id="who-we-are">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold text-text-primary">
              1. Who We Are
            </h2>
          </div>
          <p className="mb-3">
            World Best Insurer is an independent, informational insurance
            comparison platform. We publish educational content and comparative
            data on insurance products across 12 countries to help consumers
            make informed decisions.
          </p>
          <p className="mb-3">
            We are{" "}
            <strong>
              not registered with IRDAI or any insurance regulator
            </strong>{" "}
            as an insurer, broker, agent, or web aggregator. We do not sell,
            solicit, or distribute insurance policies. No insurance transaction
            can be initiated or completed through this website.
          </p>
          <p>
            This policy applies to all visitors and users of
            worldbestinsurer.com and its subdomains.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section id="information-collected">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold text-text-primary">
              2. Information We Collect
            </h2>
          </div>

          <h3 className="text-base font-semibold text-text-primary mt-5 mb-2">
            2.1 Information You Provide Voluntarily
          </h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Email address</strong> — when you subscribe to our
              waitlist or contact us via the contact form.
            </li>
            <li>
              <strong>Name</strong> — if you include it in a contact form
              submission.
            </li>
            <li>
              <strong>Message content</strong> — the text of queries or
              feedback you send us.
            </li>
          </ul>
          <p className="mb-4">
            We do <strong>not</strong> collect sensitive personal data including
            financial information, insurance policy details, health data,
            government ID numbers, or payment card information.
          </p>

          <h3 className="text-base font-semibold text-text-primary mt-5 mb-2">
            2.2 Automatically Collected Data
          </h3>
          <p className="mb-3">
            When you visit our website, certain information is automatically
            collected by our analytics and hosting infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Usage data</strong> — pages visited, time on page, scroll
              depth, clicks, and navigation paths.
            </li>
            <li>
              <strong>Device and browser information</strong> — browser type and
              version, operating system, screen resolution.
            </li>
            <li>
              <strong>Referral source</strong> — the URL of the page that
              referred you to our website.
            </li>
            <li>
              <strong>Approximate location</strong> — country and city level,
              derived from IP address. We do not store precise GPS or location
              data.
            </li>
            <li>
              <strong>IP address</strong> — for security, fraud prevention, and
              geographic analytics. IP addresses are anonymised or pseudonymised
              where possible.
            </li>
          </ul>
        </section>

        {/* 3. How We Use */}
        <section id="how-we-use">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold text-text-primary">
              3. How We Use Your Information
            </h2>
          </div>
          <p className="mb-3">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Communication</strong> — to respond to your enquiries,
              and to send you updates about World Best Insurer if you have
              opted in via the waitlist.
            </li>
            <li>
              <strong>Platform improvement</strong> — to understand which
              content, categories, and features are most useful so we can
              improve the website experience.
            </li>
            <li>
              <strong>Analytics</strong> — to measure website performance,
              identify technical issues, and understand audience demographics at
              an aggregate level.
            </li>
            <li>
              <strong>Security</strong> — to detect and prevent fraudulent
              activity, spam, and abuse.
            </li>
            <li>
              <strong>Legal compliance</strong> — to comply with applicable laws
              and respond to lawful requests from authorities.
            </li>
          </ul>
          <p className="mt-4">
            We do <strong>not</strong> use your data for targeted advertising,
            profiling for insurance sales, or selling your data to third parties.
          </p>
        </section>

        {/* 4. Sharing */}
        <section id="sharing">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            4. Sharing of Information
          </h2>
          <p className="mb-3">
            We do not sell, rent, or trade your personal information. We may
            share limited information with:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Service providers</strong> — third-party vendors who
              assist us in operating the website, including hosting providers
              (Vercel), analytics services, and email platforms. These providers
              are contractually bound to protect your data and use it only for
              the services they provide to us.
            </li>
            <li>
              <strong>Legal requirements</strong> — if required to do so by law,
              court order, or governmental authority, or to protect the rights,
              property, or safety of World Best Insurer, our users, or the public.
            </li>
            <li>
              <strong>Business transfers</strong> — in the event of a merger,
              acquisition, or sale of assets, your information may be
              transferred as part of that transaction, subject to equivalent
              privacy protections.
            </li>
          </ul>
        </section>

        {/* 5. Cookies */}
        <section id="cookies">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            5. Cookies and Tracking Technologies
          </h2>
          <p className="mb-3">
            We use cookies and similar tracking technologies to enhance your
            experience on our website. Cookies are small text files stored on
            your device.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-surface rounded-xl border border-border">
              <p className="font-medium text-text-primary mb-1">
                Essential Cookies
              </p>
              <p>
                Required for the website to function correctly — session
                management, security tokens, and preference storage. These
                cannot be disabled.
              </p>
            </div>
            <div className="p-4 bg-surface rounded-xl border border-border">
              <p className="font-medium text-text-primary mb-1">
                Analytics Cookies
              </p>
              <p>
                Used to collect anonymous usage statistics to improve the
                website. We use tools like Google Analytics with IP
                anonymisation enabled. You can opt out via your browser settings
                or ad-opt-out tools.
              </p>
            </div>
          </div>
          <p className="mt-4">
            You can control cookies through your browser settings. Disabling
            certain cookies may affect website functionality.
          </p>
        </section>

        {/* 6. Data Retention */}
        <section id="data-retention">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold text-text-primary">
              6. Data Retention
            </h2>
          </div>
          <p className="mb-3">
            We retain personal data only as long as necessary for the purposes
            described in this policy or as required by law.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Waitlist email addresses</strong> — retained until you
              unsubscribe or request deletion.
            </li>
            <li>
              <strong>Contact form submissions</strong> — retained for up to 12
              months to allow us to respond and for audit purposes.
            </li>
            <li>
              <strong>Analytics data</strong> — aggregated and anonymised data
              may be retained indefinitely for trend analysis; individual session
              data is typically retained for up to 26 months by analytics
              providers.
            </li>
          </ul>
        </section>

        {/* 7. Your Rights */}
        <section id="your-rights">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            7. Your Rights
          </h2>
          <p className="mb-3">
            Under the Digital Personal Data Protection Act, 2023 (DPDP Act) and
            other applicable laws, you have the following rights regarding your
            personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Right to access</strong> — request a copy of the personal
              data we hold about you.
            </li>
            <li>
              <strong>Right to correction</strong> — request correction of
              inaccurate or incomplete data.
            </li>
            <li>
              <strong>Right to erasure</strong> — request deletion of your
              personal data, subject to legal retention obligations.
            </li>
            <li>
              <strong>Right to withdraw consent</strong> — unsubscribe from
              marketing communications at any time via the unsubscribe link in
              any email or by contacting us.
            </li>
            <li>
              <strong>Right to grievance redressal</strong> — raise a complaint
              about how your data is processed.
            </li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:privacy@worldbestinsurer.com"
              className="text-primary hover:underline"
            >
              privacy@worldbestinsurer.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        {/* 8. Children */}
        <section id="children">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            8. Children&apos;s Privacy
          </h2>
          <p>
            Our website is not directed at children under the age of 18. We do
            not knowingly collect personal information from minors. If you
            believe a child has provided us with personal data, please contact
            us and we will delete it promptly.
          </p>
        </section>

        {/* 9. Security */}
        <section id="security">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold text-text-primary">
              9. Security
            </h2>
          </div>
          <p className="mb-3">
            We implement industry-standard security measures to protect your
            data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All data in transit is encrypted via HTTPS (TLS 1.2+).</li>
            <li>
              Our hosting infrastructure (Vercel) provides enterprise-grade
              security and compliance certifications.
            </li>
            <li>
              Access to personal data is restricted to authorised personnel on a
              need-to-know basis.
            </li>
            <li>
              We conduct regular reviews of our data practices and security
              posture.
            </li>
          </ul>
          <p className="mt-3">
            While we take reasonable precautions, no system is completely
            secure. We cannot guarantee the absolute security of information
            transmitted over the internet.
          </p>
        </section>

        {/* 10. Changes */}
        <section id="changes">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or applicable law. The updated policy will
            be posted on this page with a revised &quot;Last updated&quot; date. We
            encourage you to review this policy periodically. Continued use of
            the website after changes constitutes acceptance of the updated
            policy.
          </p>
        </section>

        {/* 11. Contact */}
        <section id="contact">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold text-text-primary">
              11. Contact Us
            </h2>
          </div>
          <p className="mb-4">
            For questions, requests, or complaints about this Privacy Policy or
            our data practices:
          </p>
          <div className="p-5 bg-surface rounded-2xl border border-border">
            <p className="font-semibold text-text-primary mb-1">
              World Best Insurer
            </p>
            <p className="mb-1">
              Email:{" "}
              <a
                href="mailto:privacy@worldbestinsurer.com"
                className="text-primary hover:underline"
              >
                privacy@worldbestinsurer.com
              </a>
            </p>
            <p>Website: worldbestinsurer.com</p>
          </div>
        </section>

        {/* Related links */}
        <div className="pt-6 border-t border-border">
          <p className="text-text-tertiary text-xs mb-3">Related legal pages</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/disclaimer"
              className="text-sm text-primary hover:underline"
            >
              Disclaimer &amp; Terms of Use
            </Link>
            <Link
              href="/methodology"
              className="text-sm text-primary hover:underline"
            >
              Data Methodology
            </Link>
            <Link
              href="/about"
              className="text-sm text-primary hover:underline"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
