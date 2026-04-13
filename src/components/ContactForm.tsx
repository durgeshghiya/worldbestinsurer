"use client";

import { useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General question");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.errors?.join(". ") || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="text-[18px] font-bold text-text-primary mb-2">Message Sent!</h3>
        <p className="text-[13px] text-text-tertiary">
          We&apos;ll get back to you within 24 hours at {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
          Your Name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl outline-none focus:border-primary/30 text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
          Email <span className="text-error">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl outline-none focus:border-primary/30 text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
          Subject
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl outline-none focus:border-primary/30 text-text-primary"
        >
          <option>General question</option>
          <option>Data correction request</option>
          <option>Feedback</option>
          <option>Partnership inquiry</option>
          <option>API access request</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
          Message <span className="text-error">*</span>
        </label>
        <textarea
          required
          minLength={5}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className="w-full px-4 py-3 text-[13px] bg-surface-sunken border border-border rounded-xl outline-none focus:border-primary/30 text-text-primary placeholder:text-text-tertiary resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 text-[13px] font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Send Message
      </button>

      {status === "error" && errorMsg && (
        <p className="text-[11px] text-error text-center">{errorMsg}</p>
      )}
    </form>
  );
}
