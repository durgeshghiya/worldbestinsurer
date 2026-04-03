"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  Headphones,
  PhoneCall,
  MapPin,
  ExternalLink,
  AlertCircle,
  Building2,
} from "lucide-react";
import CopyButton from "./CopyButton";
import type { Insurer } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  health: "#c44058",
  "term-life": "#2d3a8c",
  motor: "#2d8f6f",
  travel: "#c47d2e",
};

const CATEGORY_LABELS: Record<string, string> = {
  health: "Health",
  "term-life": "Term Life",
  motor: "Motor",
  travel: "Travel",
};

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const icons: Record<string, string> = {
    twitter: "𝕏",
    facebook: "f",
    linkedin: "in",
    instagram: "📷",
    youtube: "▶",
  };
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-sunken text-text-secondary hover:bg-primary/10 hover:text-primary transition-all text-xs font-bold"
      title={platform}
    >
      {icons[platform] || platform[0]}
    </a>
  );
}

export default function ContactCard({ insurer, countryFlag }: { insurer: Insurer; countryFlag?: string }) {
  const c = insurer.contact;
  const hasContact = c && (c.phone || c.email || c.customerCareNumber || c.claimHelpline || c.address);

  return (
    <div className="bg-surface rounded-2xl border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-5 pb-3 border-b border-border/50">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <Link
              href={`/insurer/${insurer.slug}`}
              className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-1"
            >
              {insurer.shortName}
            </Link>
            <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{insurer.name}</p>
          </div>
          {countryFlag && (
            <span className="text-lg shrink-0" title={insurer.countryCode.toUpperCase()}>
              {countryFlag}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {insurer.categories.map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: CATEGORY_COLORS[cat] || "#666" }}
            >
              {CATEGORY_LABELS[cat] || cat}
            </span>
          ))}
          {insurer.headquarters && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-text-tertiary bg-surface-sunken">
              <MapPin className="w-2.5 h-2.5" />
              {insurer.headquarters}
            </span>
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="p-5 pt-3 space-y-2.5">
        {!hasContact ? (
          <p className="text-xs text-text-tertiary italic py-2">Contact details coming soon</p>
        ) : (
          <>
            {c?.customerCareNumber && (
              <div className="flex items-center gap-2.5 text-sm">
                <Headphones className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${c.customerCareNumber.replace(/\s/g, "")}`} className="text-text-primary hover:text-primary transition-colors font-medium">
                  {c.customerCareNumber}
                </a>
                <CopyButton text={c.customerCareNumber} />
              </div>
            )}

            {c?.claimHelpline && c.claimHelpline !== c.customerCareNumber && (
              <div className="flex items-center gap-2.5 text-sm">
                <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`tel:${c.claimHelpline.replace(/\s/g, "")}`} className="text-text-primary hover:text-primary transition-colors">
                  {c.claimHelpline}
                </a>
                <span className="text-[10px] text-text-tertiary">(Claims)</span>
                <CopyButton text={c.claimHelpline} />
              </div>
            )}

            {c?.phone && c.phone !== c.customerCareNumber && (
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-text-tertiary shrink-0" />
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-text-secondary hover:text-primary transition-colors">
                  {c.phone}
                </a>
                <CopyButton text={c.phone} />
              </div>
            )}

            {c?.email && (
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-text-tertiary shrink-0" />
                <a href={`mailto:${c.email}`} className="text-text-secondary hover:text-primary transition-colors truncate">
                  {c.email}
                </a>
                <CopyButton text={c.email} />
              </div>
            )}

            {c?.grievanceEmail && (
              <div className="flex items-center gap-2.5 text-sm">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <a href={`mailto:${c.grievanceEmail}`} className="text-text-secondary hover:text-primary transition-colors truncate">
                  {c.grievanceEmail}
                </a>
                <span className="text-[10px] text-text-tertiary">(Grievance)</span>
                <CopyButton text={c.grievanceEmail} />
              </div>
            )}

            {c?.address && (
              <div className="flex items-start gap-2.5 text-sm mt-1">
                <Building2 className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
                <p className="text-text-tertiary text-xs leading-relaxed line-clamp-2">{c.address}</p>
              </div>
            )}

            {c?.socialMedia && Object.keys(c.socialMedia).length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {Object.entries(c.socialMedia).map(
                  ([platform, url]) =>
                    url && <SocialIcon key={platform} platform={platform} url={url} />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-surface-sunken/50 border-t border-border/30 flex items-center justify-between">
        <Link
          href={`/insurer/${insurer.slug}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          View details
        </Link>
        <a
          href={insurer.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-text-tertiary hover:text-primary transition-colors"
        >
          Official site <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
