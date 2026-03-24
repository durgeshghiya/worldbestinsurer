"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "default" | "inline" | "hero" | "dark";
}

export default function WaitlistForm({ variant = "default" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
  };

  if (status === "success") {
    return (
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-2xl animate-scale-in",
        variant === "dark" ? "bg-white/10 border border-white/10" : "bg-accent-light border border-accent/20"
      )}>
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
          <Check className={cn("w-5 h-5", variant === "dark" ? "text-accent" : "text-accent")} />
        </div>
        <div>
          <p className={cn("text-[13px] font-semibold", variant === "dark" ? "text-white" : "text-text-primary")}>
            You&apos;re on the list!
          </p>
          <p className={cn("text-[11.5px]", variant === "dark" ? "text-white/50" : "text-text-tertiary")}>
            We&apos;ll send updates to {email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        "flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-200",
        variant === "dark"
          ? "bg-white/10 border border-white/10 focus-within:border-white/20 focus-within:bg-white/[0.12]"
          : "bg-surface border border-border focus-within:border-primary/30 focus-within:shadow-glow shadow-sm"
      )}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={cn(
            "flex-1 px-4 py-2.5 text-[14px] bg-transparent outline-none placeholder:text-opacity-40 min-w-0",
            variant === "dark"
              ? "text-white placeholder:text-white/30"
              : "text-text-primary placeholder:text-text-tertiary"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-200",
            variant === "dark"
              ? "bg-white text-surface-dark hover:bg-white/90"
              : "bg-gradient-to-r from-primary to-[#7c3aed] text-white hover:shadow-md hover:scale-[1.02]"
          )}
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
      <p className={cn("text-[10.5px] mt-2.5 flex items-center gap-1", variant === "dark" ? "text-white/25" : "text-text-tertiary")}>
        <Sparkles className="w-3 h-3" />
        No spam. Get notified about launches and new features only.
      </p>
    </form>
  );
}
