import type { Metadata } from "next";
import Link from "next/link";
import { Database, CheckCircle, AlertTriangle, Clock, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Methodology",
  description: "How World Best Insurer sources, verifies, and presents insurance comparison data. Our methodology for transparent, trustworthy comparisons.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-7 h-7 text-primary" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Data Methodology
        </h1>
      </div>
      <p className="text-muted mb-10 max-w-2xl">
        Transparency is core to World Best Insurer. Here&apos;s how we source, verify, and present
        insurance data on this platform.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" /> Data Sources
          </h2>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            We source insurance product data exclusively from legitimate, publicly
            available sources:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Official Insurer Websites", description: "Product pages, feature descriptions, eligibility criteria, and premium calculators available on insurer websites." },
              { title: "Public Brochures & PDFs", description: "Product brochures, sales literature, and benefit illustrations publicly available for download." },
              { title: "Policy Wording Documents", description: "Policy wording/terms and conditions documents made publicly available by insurers." },
              { title: "IRDAI Publications", description: "Regulatory publications, annual reports, and public data from the Insurance Regulatory and Development Authority of India." },
            ].map((source) => (
              <div key={source.title} className="bg-white rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">{source.title}</h3>
                <p className="text-xs text-muted">{source.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">
            We do NOT scrape websites in violation of terms of service or robots.txt. We do NOT use unverified third-party aggregations as primary sources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" /> Confidence Scoring
          </h2>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Every product on World Best Insurer is assigned a confidence score reflecting our
            assessment of the data&apos;s reliability:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium whitespace-nowrap">
                High
              </span>
              <p className="text-sm text-green-800">
                Data verified directly from official insurer product pages or policy
                wording documents. Cross-referenced and recently checked.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium whitespace-nowrap">
                Medium
              </span>
              <p className="text-sm text-amber-800">
                Data sourced from official product pages but not cross-verified with
                policy wording. Or sourced from reliable public literature. Premium
                figures are illustrative.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium whitespace-nowrap">
                Low
              </span>
              <p className="text-sm text-red-800">
                Data sourced from secondary sources or older publications. May be
                outdated. Verification pending. Marked clearly as unverified.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> What We Don&apos;t Do
          </h2>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">&times;</span>
              We do not fabricate or guess data. If we don&apos;t have verified information, we either omit it or clearly mark it.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">&times;</span>
              We do not rank products as &ldquo;best&rdquo; or &ldquo;recommended&rdquo; based on undisclosed criteria.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">&times;</span>
              We do not accept payment from insurers to influence data presentation or rankings.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">&times;</span>
              We do not present illustrative premiums as actual or guaranteed quotes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Update Frequency
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            We aim to review and update product data periodically. Each product listing
            displays a &ldquo;last verified&rdquo; date. Insurance products change frequently —
            new launches, premium revisions, feature updates — and there may be a lag
            between insurer changes and our updates. Always verify with the insurer
            for the most current information.
          </p>
        </section>

        <section className="bg-muted-light rounded-2xl p-6">
          <h2 className="text-base font-bold text-foreground mb-2">
            Report an Inaccuracy
          </h2>
          <p className="text-sm text-muted mb-3">
            Found incorrect or outdated data on World Best Insurer? Please let us know so we can
            correct it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary/20 rounded-lg hover:bg-white transition-colors"
          >
            Report Data Issue
          </Link>
        </section>
      </div>
    </div>
  );
}
