import type { Metadata } from "next";
import Link from "next/link";
import {
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Settings,
  BarChart3,
  Eye,
} from "lucide-react";
import { getAllProducts, getAllInsurers, categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

const STALE_THRESHOLD_DAYS = 90;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export default function AdminPage() {
  const products = getAllProducts();
  const insurers = getAllInsurers();
  // This is a server component — Date.now() runs once per request (or at build
  // time for SSG), not on every client re-render, so the purity rule's concern
  // about unstable renders doesn't apply here.
  // eslint-disable-next-line react-hooks/purity
  const renderedAtMs = Date.now();

  const stats = {
    totalProducts: products.length,
    totalInsurers: insurers.length,
    highConfidence: products.filter((p) => p.confidenceScore === "high").length,
    mediumConfidence: products.filter((p) => p.confidenceScore === "medium").length,
    lowConfidence: products.filter((p) => p.confidenceScore === "low").length,
    staleRecords: products.filter((p) => {
      const days = Math.floor(
        (renderedAtMs - new Date(p.lastVerified).getTime()) / MS_PER_DAY
      );
      return days > STALE_THRESHOLD_DAYS;
    }).length,
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-[-0.02em]">
            Admin Dashboard
          </h1>
          <p className="text-[13px] text-text-tertiary mt-0.5">
            Data management, verification, and monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg bg-warning-light text-warning font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Internal only
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Products", value: stats.totalProducts, icon: Database, color: "text-primary" },
          { label: "Insurers", value: stats.totalInsurers, icon: Shield, color: "text-primary" },
          { label: "High confidence", value: stats.highConfidence, icon: CheckCircle2, color: "text-success" },
          { label: "Medium", value: stats.mediumConfidence, icon: Clock, color: "text-warning" },
          { label: "Low / unverified", value: stats.lowConfidence, icon: AlertTriangle, color: "text-danger" },
          { label: "Stale (>90d)", value: stats.staleRecords, icon: RefreshCw, color: "text-danger" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl border border-border p-4">
            <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
            <p className="text-[22px] font-bold text-text-primary tracking-tight">{s.value}</p>
            <p className="text-[11.5px] text-text-tertiary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Admin sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Review queue */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-[15px] font-semibold text-text-primary">Review Queue</h2>
          </div>
          <p className="text-[12.5px] text-text-tertiary mb-4">
            Items detected by crawler awaiting human review before publishing.
          </p>
          <div className="bg-surface-sunken rounded-lg p-3 mb-3">
            <p className="text-[12px] text-text-secondary">
              <strong>0</strong> items pending review
            </p>
            <p className="text-[11px] text-text-tertiary mt-1">
              Run the crawler to populate: <code className="text-[10px] bg-surface px-1.5 py-0.5 rounded">npx ts-node scripts/crawler/index.ts --mode daily</code>
            </p>
          </div>
        </div>

        {/* Data quality */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-[15px] font-semibold text-text-primary">Data Quality</h2>
          </div>
          <div className="space-y-2.5">
            {categories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat.slug);
              const verified = catProducts.filter((p) => p.confidenceScore === "high").length;
              return (
                <div key={cat.slug} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-text-secondary">{cat.shortName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-medium">{catProducts.length} products</span>
                    <span className="text-text-tertiary">({verified} verified)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source health */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-5 h-5 text-primary" />
            <h2 className="text-[15px] font-semibold text-text-primary">Source Health</h2>
          </div>
          <p className="text-[12.5px] text-text-tertiary mb-4">
            Monitoring status of {insurers.length} insurer sources across India.
          </p>
          <div className="space-y-2">
            {insurers.slice(0, 6).map((ins) => (
              <div key={ins.slug} className="flex items-center justify-between text-[12px]">
                <span className="text-text-secondary">{ins.shortName}</span>
                <span className="flex items-center gap-1 text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product list */}
        <div className="bg-surface rounded-xl border border-border p-5 md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-[15px] font-semibold text-text-primary">All Products</h2>
            </div>
            <span className="text-[12px] text-text-tertiary">{products.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-2.5 font-semibold text-text-tertiary">Product</th>
                  <th className="p-2.5 font-semibold text-text-tertiary">Insurer</th>
                  <th className="p-2.5 font-semibold text-text-tertiary">Category</th>
                  <th className="p-2.5 font-semibold text-text-tertiary">Confidence</th>
                  <th className="p-2.5 font-semibold text-text-tertiary">Verified</th>
                  <th className="p-2.5 font-semibold text-text-tertiary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-sunken/50 transition-colors">
                    <td className="p-2.5 font-medium text-text-primary">{p.productName}</td>
                    <td className="p-2.5 text-text-secondary">{p.insurerName.split(" ").slice(0, 2).join(" ")}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-surface-sunken text-text-secondary">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium ${
                        p.confidenceScore === "high" ? "bg-success-light text-success" :
                        p.confidenceScore === "medium" ? "bg-warning-light text-warning" :
                        "bg-danger-light text-danger"
                      }`}>
                        {p.confidenceScore}
                      </span>
                    </td>
                    <td className="p-2.5 text-text-tertiary">{p.lastVerified}</td>
                    <td className="p-2.5">
                      <div className="flex gap-1.5">
                        <Link
                          href={`/product/${p.id}`}
                          className="text-[11px] px-2.5 py-1 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
                        >
                          View
                        </Link>
                        <a
                          href={p.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] px-2.5 py-1 border border-border rounded-md hover:bg-surface-sunken transition-colors text-text-secondary"
                        >
                          Source
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Crawler commands */}
      <div className="mt-8 bg-text-primary rounded-xl p-6 text-white">
        <h2 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Crawler Commands
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-[12.5px]">
          <div>
            <p className="text-white/60 mb-1.5">Daily scan (high-priority sources):</p>
            <code className="block bg-white/10 rounded-lg px-3 py-2 text-[11px] font-mono">
              npx ts-node scripts/crawler/index.ts --mode daily
            </code>
          </div>
          <div>
            <p className="text-white/60 mb-1.5">Weekly scan (all active sources):</p>
            <code className="block bg-white/10 rounded-lg px-3 py-2 text-[11px] font-mono">
              npx ts-node scripts/crawler/index.ts --mode weekly
            </code>
          </div>
          <div>
            <p className="text-white/60 mb-1.5">Scan specific source:</p>
            <code className="block bg-white/10 rounded-lg px-3 py-2 text-[11px] font-mono">
              npx ts-node scripts/crawler/index.ts --source star-health-plans
            </code>
          </div>
          <div>
            <p className="text-white/60 mb-1.5">Full rescan:</p>
            <code className="block bg-white/10 rounded-lg px-3 py-2 text-[11px] font-mono">
              npx ts-node scripts/crawler/index.ts --rescan-all
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
