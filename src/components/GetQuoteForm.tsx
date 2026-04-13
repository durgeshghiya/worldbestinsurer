"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuoteLead {
  fullName: string;
  email: string;
  phone: string;
  insuranceType: string;
  requirement: string;
  submittedAt: string;
}

const INSURANCE_TYPES = [
  { value: "", label: "Select insurance type" },
  { value: "health", label: "Health Insurance" },
  { value: "term-life", label: "Term Life Insurance" },
  { value: "motor", label: "Motor Insurance" },
  { value: "travel", label: "Travel Insurance" },
];

export default function GetQuoteForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    insuranceType: "",
    requirement: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      // Collect UTM params from URL
      const params = new URLSearchParams(window.location.search);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || "not-provided",
          productId: `generic-${form.insuranceType || "unknown"}`,
          insurerSlug: "",
          category: form.insuranceType,
          countryCode: "in",
          utmSource: params.get("utm_source") || undefined,
          utmMedium: params.get("utm_medium") || undefined,
          utmCampaign: params.get("utm_campaign") || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Also store in localStorage as backup
        const lead: QuoteLead = {
          ...form,
          submittedAt: new Date().toISOString(),
        };
        try {
          const existing = JSON.parse(
            localStorage.getItem("wbi_quote_leads") || "[]"
          );
          existing.push(lead);
          localStorage.setItem("wbi_quote_leads", JSON.stringify(existing));
        } catch {
          // localStorage not available
        }
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.errors?.join(". ") || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div
        id="get-quote"
        className="relative rounded-3xl border border-border bg-surface/80 backdrop-blur-xl overflow-hidden shadow-lg"
      >
        <div className="h-1 bg-gradient-to-r from-accent to-emerald-400" />
        <div className="p-8 md:p-12 flex flex-col items-center text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-[20px] font-bold text-text-primary">
            Thank You!
          </h3>
          <p className="text-[14px] text-text-secondary mt-2 max-w-md">
            We&apos;ll contact you within 24 hours with personalized insurance
            recommendations.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[12px] text-text-tertiary">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Your information is safe and will never be shared.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="get-quote"
      className="relative rounded-3xl border border-border bg-surface/80 backdrop-blur-xl overflow-hidden shadow-lg"
    >
      {/* Gradient top bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-violet-500 to-accent" />

      {/* Decorative blob */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-[0.05] bg-gradient-to-br from-primary to-accent" />

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-[20px] font-bold text-text-primary">
            Get a Free Quote
          </h3>
          <p className="text-[13px] text-text-secondary mt-1">
            Tell us your requirements and our experts will find the best plans
            for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl
                text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl
                text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                transition-all duration-200"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
              Phone{" "}
              <span className="text-text-tertiary font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl
                text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                transition-all duration-200"
            />
          </div>

          {/* Insurance Type */}
          <div>
            <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
              Insurance Type <span className="text-danger">*</span>
            </label>
            <select
              required
              value={form.insuranceType}
              onChange={(e) => update("insuranceType", e.target.value)}
              className={cn(
                "w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl",
                "focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
                "transition-all duration-200 appearance-none cursor-pointer",
                form.insuranceType
                  ? "text-text-primary"
                  : "text-text-tertiary"
              )}
            >
              {INSURANCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Requirement */}
          <div>
            <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
              Brief Requirement
            </label>
            <textarea
              value={form.requirement}
              onChange={(e) => update("requirement", e.target.value)}
              placeholder="Tell us about your insurance needs..."
              rows={3}
              className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl
                text-text-primary placeholder:text-text-tertiary resize-none
                focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                transition-all duration-200"
            />
          </div>

          {/* Consent */}
          <p className="text-[10px] text-text-tertiary leading-relaxed">
            By submitting, you agree to be contacted by our insurance partners regarding your request. See our{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 text-[14px] font-semibold text-white rounded-xl",
              "bg-gradient-to-r from-primary via-violet-500 to-[#7c3aed]",
              "hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01]",
              "transition-all duration-200 btn-glow",
              "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Get Free Quote
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Error */}
          {status === "error" && errorMsg && (
            <p className="text-[11px] text-error text-center">{errorMsg}</p>
          )}
        </form>

        {/* Trust badges */}
        <div className="mt-6 pt-5 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
              <MessageSquare className="w-4 h-4 text-info" />
              <span>Free consultation</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
              <Headphones className="w-4 h-4 text-primary" />
              <span>Expert advice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
