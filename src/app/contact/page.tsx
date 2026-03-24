import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Contact World Best Insurer",
  description: "Get in touch with World Best Insurer. Ask questions about insurance or provide feedback on our comparison platform.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Contact Us
      </h1>
      <p className="text-muted mb-10 max-w-xl">
        Have a question, feedback, or want to learn more about World Best Insurer? We&apos;d love
        to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Send Us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Subject
              </label>
              <select className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted">
                <option>General question</option>
                <option>Data correction request</option>
                <option>Feedback</option>
                <option>Partnership inquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Your message..."
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              Send Message
            </button>
            <p className="text-xs text-muted">
              Note: World Best Insurer is an informational platform. We cannot provide
              personalized insurance advice or facilitate policy purchases. For
              product-specific queries, please contact the insurer directly.
            </p>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Get Updates
            </h2>
            <p className="text-sm text-muted mb-4">
              Join our mailing list to receive updates when we add new comparison
              features, publish guides, or launch advisory services.
            </p>
            <WaitlistForm variant="inline" />
          </div>

          <div className="bg-muted-light rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              What can World Best Insurer help with?
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>Understanding insurance product features</li>
              <li>Comparing plans across insurers</li>
              <li>Learning about insurance concepts</li>
              <li>Reporting data inaccuracies</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">
              Important Notice
            </h3>
            <p className="text-xs text-amber-700 leading-relaxed">
              World Best Insurer is not able to assist with insurance policy purchases, claims
              processing, premium payments, or personalized policy
              recommendations at this time. For these services, please contact
              your insurer directly or consult a licensed insurance intermediary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
