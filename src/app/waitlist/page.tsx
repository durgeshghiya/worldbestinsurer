import type { Metadata } from "next";
import { Bell, Zap, Shield, BarChart3 } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Get early access to World Best Insurer's insurance advisory features. Join our waitlist for updates on new comparison tools and services.",
};

export default function WaitlistPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light mb-5">
          <Bell className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Join the WBI Waitlist
        </h1>
        <p className="text-lg text-muted max-w-lg mx-auto">
          Be the first to know when we launch new features, advisory services,
          and enhanced comparison tools.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8 mb-10">
        <WaitlistForm />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {[
          {
            icon: Zap,
            title: "Early Access",
            description:
              "Get early access to new comparison features and tools before public launch.",
          },
          {
            icon: Shield,
            title: "Advisory Launch",
            description:
              "Be notified when World Best Insurer launches licensed advisory and recommendation services.",
          },
          {
            icon: BarChart3,
            title: "Market Insights",
            description:
              "Receive periodic insights on insurance market trends and new product launches.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="text-center p-5 bg-muted-light rounded-xl"
          >
            <item.icon className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-muted">{item.description}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-muted mt-8">
        We respect your privacy. Your email will only be used for World Best Insurer updates.
        You can unsubscribe at any time.
      </p>
    </div>
  );
}
