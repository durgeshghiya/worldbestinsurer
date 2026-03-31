import { cn } from "@/lib/utils";

type Variant = "wave" | "dots" | "zigzag" | "gradient" | "space";

interface SectionDividerProps {
  variant?: Variant;
  className?: string;
  flip?: boolean;
}

export default function SectionDivider({
  variant = "dots",
  className,
  flip = false,
}: SectionDividerProps) {
  if (variant === "wave") {
    return (
      <div className={cn("relative h-12 overflow-hidden", flip && "rotate-180", className)}>
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-12"
        >
          <path
            d="M0 24C240 4 480 44 720 24C960 4 1200 44 1440 24V48H0V24Z"
            fill="var(--background)"
            opacity="0.5"
          />
          <path
            d="M0 32C240 12 480 52 720 32C960 12 1200 52 1440 32V48H0V32Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex justify-center items-center gap-2 py-10", className)}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: i === 2 ? 6 : 4,
              height: i === 2 ? 6 : 4,
              backgroundColor: i === 2 ? "var(--accent)" : "var(--border-strong)",
              opacity: i === 0 || i === 4 ? 0.4 : i === 2 ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "zigzag") {
    return <div className={cn("divider-zigzag", className)} />;
  }

  if (variant === "gradient") {
    return (
      <div className={cn("py-8 flex justify-center", className)}>
        <div className="w-48 h-[1.5px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>
    );
  }

  // "space" — just vertical breathing room
  return <div className={cn("h-8 sm:h-12", className)} />;
}
