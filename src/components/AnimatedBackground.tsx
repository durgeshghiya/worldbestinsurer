import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "aurora" | "mesh" | "grid" | "dots" | "radial-warm" | "radial-cool";

interface AnimatedBackgroundProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  as?: "section" | "div";
}

const variantClasses: Record<Variant, string> = {
  aurora: "bg-aurora",
  mesh: "bg-mesh",
  grid: "bg-grid",
  dots: "bg-dots",
  "radial-warm": "bg-radial-warm",
  "radial-cool": "bg-radial-cool",
};

export default function AnimatedBackground({
  children,
  variant = "aurora",
  className,
  as: Tag = "section",
}: AnimatedBackgroundProps) {
  return (
    <Tag className={cn("relative overflow-hidden", variantClasses[variant], className)}>
      {children}
    </Tag>
  );
}
