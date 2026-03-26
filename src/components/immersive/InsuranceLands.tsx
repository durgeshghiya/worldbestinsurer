"use client";

import { useState, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Land {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  glowColor: string;
  bgClass: string;
  href: string;
  productCount: number;
}

const LANDS: Land[] = [
  {
    id: "health",
    name: "Health Haven",
    icon: "🏥",
    description: "Discover plans that protect your well-being",
    color: "#c44058",
    glowColor: "rgba(196, 64, 88, 0.4)",
    bgClass: "from-rose-500/10 to-rose-600/5",
    href: "/compare/health",
    productCount: 24,
  },
  {
    id: "term",
    name: "Protection Peak",
    icon: "🛡️",
    description: "Fortify your family's future",
    color: "#2d3a8c",
    glowColor: "rgba(45, 58, 140, 0.4)",
    bgClass: "from-indigo-500/10 to-indigo-600/5",
    href: "/compare/term-life",
    productCount: 18,
  },
  {
    id: "motor",
    name: "Motor Mountain",
    icon: "🚗",
    description: "Navigate roads with confidence",
    color: "#2d8f6f",
    glowColor: "rgba(45, 143, 111, 0.4)",
    bgClass: "from-emerald-500/10 to-emerald-600/5",
    href: "/compare/motor",
    productCount: 31,
  },
  {
    id: "travel",
    name: "Travel Tropics",
    icon: "✈️",
    description: "Explore the world worry-free",
    color: "#c47d2e",
    glowColor: "rgba(196, 125, 46, 0.4)",
    bgClass: "from-amber-500/10 to-amber-600/5",
    href: "/compare/travel",
    productCount: 15,
  },
];

interface SparklePoint {
  id: number;
  x: number;
  y: number;
}

function LandCard({ land, index }: { land: Land; index: number }) {
  const [sparkles, setSparkles] = useState<SparklePoint[]>([]);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(y * -20);
      rotateY.set(x * 20);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const newSparkles: SparklePoint[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }));
      setSparkles(newSparkles);
      setTimeout(() => setSparkles([]), 600);
    },
    []
  );

  // Diamond layout positions
  const positions = [
    { x: 0, y: -1 },   // top
    { x: 1, y: 0 },    // right
    { x: 0, y: 1 },    // bottom
    { x: -1, y: 0 },   // left
  ];
  const pos = positions[index];

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${pos.x * 140}px - 100px)`,
        top: `calc(50% + ${pos.y * 140}px - 100px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.15, type: "spring", stiffness: 120 }}
    >
      <Link href={land.href}>
        <motion.div
          className={cn(
            "relative w-[200px] h-[200px] rounded-2xl cursor-pointer",
            "bg-gradient-to-br backdrop-blur-sm",
            "border-2 border-white/20",
            "flex flex-col items-center justify-center gap-2 p-4",
            "overflow-hidden",
            land.bgClass
          )}
          style={{
            perspective: 600,
            rotateX: springX,
            rotateY: springY,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Glowing border animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: `0 0 20px ${land.glowColor}, inset 0 0 20px ${land.glowColor}` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated icon */}
          <motion.span
            className="text-5xl z-10"
            whileHover={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.2, 1],
              transition: { duration: 0.5 },
            }}
          >
            {land.icon}
          </motion.span>

          <h3 className="text-sm font-bold text-text-primary z-10 text-center">
            {land.name}
          </h3>
          <p className="text-[10px] text-text-secondary z-10 text-center leading-tight">
            {land.description}
          </p>

          {/* Product count badge */}
          <span
            className="absolute top-2 right-2 text-[10px] font-bold text-white rounded-full w-7 h-7 flex items-center justify-center z-10"
            style={{ backgroundColor: land.color }}
          >
            {land.productCount}
          </span>

          {/* Click sparkles */}
          <AnimatePresence>
            {sparkles.map((s) => (
              <motion.span
                key={s.id}
                className="absolute text-lg pointer-events-none z-20"
                initial={{ x: s.x - 10, y: s.y - 10, scale: 0, opacity: 1 }}
                animate={{
                  x: s.x - 10 + (Math.random() - 0.5) * 80,
                  y: s.y - 10 + (Math.random() - 0.5) * 80,
                  scale: 1,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                ✨
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  );
}

interface InsuranceLandsProps {
  className?: string;
}

export default function InsuranceLands({ className }: InsuranceLandsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={containerRef}
      className={cn("relative py-20 md:py-32 overflow-hidden", className)}
    >
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Explore Insurance Lands
        </motion.h2>
        <motion.p
          className="mt-3 text-text-secondary max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Navigate our theme park of protection. Click a land to begin your adventure.
        </motion.p>
      </div>

      <motion.div
        className="relative w-full max-w-lg mx-auto"
        style={{ y: parallaxY, height: 400 }}
      >
        {/* Center compass */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-5xl block">🧭</span>
        </motion.div>

        {/* Connecting lines (decorative) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle
            cx="200"
            cy="200"
            r="130"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 6"
            className="text-text-secondary/20"
          />
        </svg>

        {/* Land cards */}
        {LANDS.map((land, i) => (
          <LandCard key={land.id} land={land} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
