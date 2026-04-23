"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Phone, Mail, User, Shield, Lock, Check, Loader2, CheckCircle2 } from "lucide-react";

interface ProductQuoteFormProps {
  productId: string;
  insurerSlug: string;
  insurerName: string;
  category: string;
  countryCode: string;
}

export default function ProductQuoteForm({
  productId,
  insurerSlug,
  insurerName,
  category,
  countryCode,
}: ProductQuoteFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const params = new URLSearchParams(window.location.search);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          productId,
          insurerSlug,
          category,
          countryCode,
          utmSource: params.get("utm_source") || undefined,
          utmMedium: params.get("utm_medium") || undefined,
          utmCampaign: params.get("utm_campaign") || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.errors?.join(". ") || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-success" />
        </div>
        <h3 className="text-[15px] font-bold text-text-primary mb-1.5">
          Request Submitted!
        </h3>
        <p className="text-[12px] text-text-tertiary leading-relaxed">
          We&apos;ll connect you with {insurerName} for a personalized quote.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <User className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Your name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-surface-sunken border border-border rounded-xl outline-none focus:border-primary/30 transition-colors text-text-primary placeholder:text-text-tertiary"
          />
        </div>
        <div className="relative">
          <Mail className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-surface-sunken border border-border rounded-xl outline-none focus:border-primary/30 transition-colors text-text-primary placeholder:text-text-tertiary"
          />
        </div>
        <div className="relative">
          <Phone className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="tel"
            placeholder="Phone number"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-surface-sunken border border-border rounded-xl outline-none focus:border-primary/30 transition-colors text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* Consent */}
        <p className="text-[10px] text-text-tertiary leading-relaxed">
          By submitting, you agree to be contacted by {insurerName} or a partner regarding this product. See our{" "}
          <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 text-[13px] font-semibold rounded-xl bg-gradient-to-r from-primary to-[#7c3aed] text-white hover:shadow-md hover:scale-[1.01] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Get Free Quote"
          )}
        </button>

        {status === "error" && errorMsg && (
          <p className="text-[11px] text-error text-center">{errorMsg}</p>
        )}
      </form>

      {/* Trust badges */}
      <div className="mt-4 pt-4 border-t border-border-light">
        <div className="flex items-center justify-center gap-4">
          {[
            { icon: Shield, label: "Secure" },
            { icon: Lock, label: "Private" },
            { icon: Check, label: "Free" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-1 text-[10px] text-text-tertiary">
              <badge.icon className="w-3 h-3 text-success" />
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
