import type { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, Shield, Users, ArrowRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About World Best Insurer",
  description: "World Best Insurer is India's smart insurance comparison and education platform. Learn about our mission, approach, and future plans.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
        About World Best Insurer
      </h1>

      <div className="prose prose-lg max-w-none">
        <div className="bg-primary-light rounded-2xl p-8 mb-10">
          <p className="text-lg text-foreground leading-relaxed font-medium mb-0">
            World Best Insurer is an informational insurance comparison and education platform
            built for Indian consumers. We aggregate publicly available data to
            help you explore and compare insurance plans — transparently and
            without sales pressure.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-muted leading-relaxed">
              Insurance in India is complex. With hundreds of products across
              dozens of insurers, comparing features, coverage, and suitability is
              time-consuming and often influenced by intermediary incentives. World Best Insurer
              exists to give consumers a neutral, data-driven starting point for
              their insurance research.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Our Approach</h2>
            </div>
            <ul className="space-y-3 text-muted">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Data from public sources:</strong> We
                  source data from official insurer websites, public product brochures,
                  policy wording documents, and IRDAI publications. We do not invent data.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Transparency on data quality:</strong>{" "}
                  Each product listing shows a confidence score and last verification date.
                  If data is unverified or illustrative, we say so clearly.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">No false claims:</strong> World Best Insurer is
                  currently an informational platform. We do not sell insurance, provide
                  personalized advice, or act as a broker or intermediary unless and until
                  we hold the relevant IRDAI registration/licence.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Educational content:</strong> Our
                  guides and articles are written to educate, not to push products. We
                  explain concepts so you can make decisions confidently.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">What We Are</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
              <ul className="space-y-2 text-sm text-green-800">
                <li>An educational and informational comparison platform</li>
                <li>A research tool for consumers exploring insurance options</li>
                <li>A content platform publishing insurance education guides</li>
                <li>A future-ready platform building towards licensed services</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-sm font-medium text-red-800 mb-2">
                What we are NOT (currently):
              </p>
              <ul className="space-y-2 text-sm text-red-700">
                <li>Not an IRDAI-licensed insurance broker</li>
                <li>Not an IRDAI-registered web aggregator</li>
                <li>Not an insurance seller or intermediary</li>
                <li>Not providing personalized insurance advice</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Future Plans
              </h2>
            </div>
            <p className="text-muted leading-relaxed mb-4">
              World Best Insurer is building towards becoming a comprehensive insurance
              platform. Our roadmap includes applying for appropriate IRDAI
              registration, integrating insurer APIs for real-time data,
              building advisory tools, and creating personalized recommendation
              engines — all within the regulatory framework.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              Join the Waitlist <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
