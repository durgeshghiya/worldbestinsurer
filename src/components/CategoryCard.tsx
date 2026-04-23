import Link from "next/link";
import { Heart, Shield, Car, Plane, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryInfo } from "@/lib/types";

const icons: Record<string, typeof Heart> = {
  health: Heart,
  "term-life": Shield,
  motor: Car,
  travel: Plane,
};

const gradients: Record<string, string> = {
  health: "from-rose-500 to-pink-600",
  "term-life": "from-indigo-500 to-violet-600",
  motor: "from-emerald-500 to-teal-600",
  travel: "from-amber-500 to-orange-600",
};

const glows: Record<string, string> = {
  health: "group-hover:shadow-[0_8px_40px_rgba(244,63,94,0.15)]",
  "term-life": "group-hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)]",
  motor: "group-hover:shadow-[0_8px_40px_rgba(6,214,160,0.15)]",
  travel: "group-hover:shadow-[0_8px_40px_rgba(245,158,11,0.15)]",
};

export default function CategoryCard({ category }: { category: CategoryInfo }) {
  const Icon = icons[category.slug] ?? Shield;
  const gradient = gradients[category.slug] ?? "from-gray-500 to-gray-600";
  const glow = glows[category.slug] ?? "";

  return (
    <Link
      href={`/compare/${category.slug}`}
      className={cn("group card-premium bg-surface rounded-2xl border border-border p-6", glow)}
    >
      <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300", gradient)}>
        <Icon className="w-7 h-7 text-white" />
      </div>

      <h3 className="text-[17px] font-bold text-text-primary group-hover:text-primary transition-colors mb-1">
        {category.name}
      </h3>
      <p className="text-[12.5px] text-text-tertiary leading-relaxed mb-4">
        {category.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-text-secondary">
          {category.productCount} plans
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
          Explore <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
