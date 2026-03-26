import { FileSearch, Globe, Building2, RefreshCw } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const badges = [
  {
    icon: FileSearch,
    count: 500,
    suffix: "+",
    label: "Plans Compared",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: Globe,
    count: 12,
    suffix: "",
    label: "Countries",
    color: "text-accent",
    bg: "bg-accent-light",
  },
  {
    icon: Building2,
    count: 200,
    suffix: "+",
    label: "Insurers",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: RefreshCw,
    count: 0,
    suffix: "",
    label: "Updated Daily",
    color: "text-amber-600",
    bg: "bg-amber-50",
    isText: true,
  },
] as const;

export default function TrustBadges() {
  return (
    <section className="py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.label}
              className="relative group flex flex-col items-center text-center p-5 rounded-2xl border border-border bg-surface/80 backdrop-blur-sm hover:border-primary/20 hover:shadow-md transition-all duration-300"
            >
              <div
                className={`w-11 h-11 rounded-xl ${badge.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              <div className="text-[22px] font-bold text-text-primary">
                {"isText" in badge && badge.isText ? (
                  <span className={badge.color}>Daily</span>
                ) : (
                  <AnimatedCounter
                    target={badge.count}
                    suffix={badge.suffix}
                  />
                )}
              </div>
              <p className="text-[11px] font-medium text-text-tertiary mt-0.5 uppercase tracking-wider">
                {badge.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
