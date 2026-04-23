import type { Metadata } from "next";
import { Code2, Key, Zap, Shield, Globe} from "lucide-react";

export const metadata: Metadata = {
  title: "Developer API — World Best Insurer",
  description:
    "Access insurance comparison data via REST API. Products, insurers, and comparison data across 12 countries. Free tier: 100 requests/day.",
};

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/products",
    description: "List insurance products with filtering",
    params: [
      { name: "country", type: "string", desc: "Country code (in, us, uk, ae, sg, etc.)" },
      { name: "category", type: "string", desc: "health, term-life, motor, or travel" },
      { name: "id", type: "string", desc: "Get a specific product by ID" },
      { name: "limit", type: "number", desc: "Max results (default 50, max 200)" },
      { name: "offset", type: "number", desc: "Pagination offset" },
    ],
    example: '/api/v1/products?country=in&category=health&limit=10&apiKey=YOUR_KEY',
  },
  {
    method: "GET",
    path: "/api/v1/insurers",
    description: "List insurers with product counts",
    params: [
      { name: "country", type: "string", desc: "Country code" },
      { name: "slug", type: "string", desc: "Get a specific insurer by slug" },
      { name: "limit", type: "number", desc: "Max results (default 50, max 200)" },
    ],
    example: '/api/v1/insurers?country=in&apiKey=YOUR_KEY',
  },
  {
    method: "GET",
    path: "/api/v1/compare",
    description: "Side-by-side comparison of 2-4 products",
    params: [
      { name: "products", type: "string", desc: "Comma-separated product IDs (2-4)" },
    ],
    example: '/api/v1/compare?products=hdfc-optima-secure,star-comprehensive&apiKey=YOUR_KEY',
  },
];

const tiers = [
  { name: "Free", price: "$0", limit: "100 req/day", features: ["All endpoints", "12 countries", "JSON response"] },
  { name: "Starter", price: "$49/mo", limit: "5,000 req/day", features: ["Everything in Free", "Priority support", "CSV export"] },
  { name: "Pro", price: "$199/mo", limit: "50,000 req/day", features: ["Everything in Starter", "Webhooks", "Bulk export", "SLA 99.9%"] },
  { name: "Enterprise", price: "Custom", limit: "Unlimited", features: ["Everything in Pro", "Dedicated support", "Custom integration", "On-premise option"] },
];

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="text-[12px] font-bold text-primary uppercase tracking-wider">
            Developer API
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[38px] font-bold text-text-primary tracking-[-0.02em] mb-3">
          Insurance Data API
        </h1>
        <p className="text-[15px] text-text-secondary max-w-lg">
          Access insurance product comparison data across 12 countries via REST API.
          Products, insurers, premiums, claim settlement ratios, and more.
        </p>
      </div>

      {/* Quick start */}
      <div className="mb-12 p-6 bg-gray-900 rounded-2xl text-white">
        <h2 className="text-[16px] font-bold mb-3">Quick Start</h2>
        <div className="bg-black/30 rounded-xl p-4 font-mono text-[13px] overflow-x-auto">
          <p className="text-gray-400"># Get health insurance products in India</p>
          <p className="text-green-400 mt-1">
            curl &quot;https://worldbestinsurer.com/api/v1/products?country=in&amp;category=health&amp;apiKey=wbi_demo_2026_public&quot;
          </p>
        </div>
        <p className="text-[12px] text-gray-400 mt-3">
          Demo key: <code className="bg-black/30 px-2 py-0.5 rounded text-green-400">wbi_demo_2026_public</code> (100 requests/day)
        </p>
      </div>

      {/* Authentication */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-text-tertiary" />
          <h2 className="text-[20px] font-bold text-text-primary">Authentication</h2>
        </div>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
          Pass your API key via the <code className="bg-surface-sunken px-1.5 py-0.5 rounded text-[13px]">x-api-key</code> header
          or the <code className="bg-surface-sunken px-1.5 py-0.5 rounded text-[13px]">apiKey</code> query parameter.
        </p>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <p className="font-mono text-[12px] text-text-secondary">
            curl -H &quot;x-api-key: YOUR_API_KEY&quot; https://worldbestinsurer.com/api/v1/products
          </p>
        </div>
      </div>

      {/* Endpoints */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-text-tertiary" />
          <h2 className="text-[20px] font-bold text-text-primary">Endpoints</h2>
        </div>

        <div className="space-y-6">
          {endpoints.map((ep) => (
            <div key={ep.path} className="bg-surface rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded uppercase">
                  {ep.method}
                </span>
                <code className="text-[13px] font-semibold text-text-primary">{ep.path}</code>
              </div>
              <p className="text-[13px] text-text-secondary mb-3">{ep.description}</p>

              {/* Params */}
              <div className="border-t border-border pt-3 mb-3">
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
                  Query Parameters
                </p>
                <div className="space-y-1.5">
                  {ep.params.map((p) => (
                    <div key={p.name} className="flex items-start gap-2 text-[12px]">
                      <code className="bg-surface-sunken px-1.5 py-0.5 rounded text-primary font-medium shrink-0">
                        {p.name}
                      </code>
                      <span className="text-text-tertiary">{p.type}</span>
                      <span className="text-text-secondary">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-[11px] text-green-400 overflow-x-auto">
                {ep.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-text-tertiary" />
          <h2 className="text-[20px] font-bold text-text-primary">Coverage</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Countries", value: "12" },
            { label: "Products", value: "399+" },
            { label: "Insurers", value: "248+" },
            { label: "Categories", value: "4" },
          ].map((s) => (
            <div key={s.label} className="bg-surface rounded-xl border border-border p-4 text-center">
              <p className="text-[20px] font-bold text-text-primary">{s.value}</p>
              <p className="text-[11px] text-text-tertiary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-text-tertiary" />
          <h2 className="text-[20px] font-bold text-text-primary">Pricing</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-surface rounded-xl border p-5 ${
                tier.name === "Pro" ? "border-primary shadow-sm" : "border-border"
              }`}
            >
              <p className="text-[14px] font-bold text-text-primary">{tier.name}</p>
              <p className="text-[20px] font-bold text-text-primary mt-1">{tier.price}</p>
              <p className="text-[11px] text-text-tertiary mb-3">{tier.limit}</p>
              <ul className="space-y-1.5">
                {tier.features.map((f) => (
                  <li key={f} className="text-[11px] text-text-secondary flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-tertiary mt-4 text-center">
          Contact us at <a href="mailto:api@worldbestinsurer.com" className="text-primary hover:underline">api@worldbestinsurer.com</a> for Starter, Pro, or Enterprise access.
        </p>
      </div>

      {/* Rate limits */}
      <div className="p-5 bg-surface-sunken rounded-xl text-[12px] text-text-tertiary leading-relaxed">
        <p className="font-semibold text-text-secondary mb-1">Rate Limits & Terms</p>
        <p>
          Free tier: 100 requests per day. Rate limits are enforced per API key.
          Data is sourced from official insurer websites and regulatory publications.
          By using this API, you agree to attribute World Best Insurer as the data source.
          The API is for non-commercial use on the free tier. Commercial use requires a paid plan.
        </p>
      </div>
    </div>
  );
}
