"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  /** Viewport amount visible before triggering (0-1) */
  threshold?: number;
}

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  stagger = 0,
  className,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });

  const offset = OFFSETS[direction];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  // If stagger > 0, use container + child variants for stagger effect
  if (stagger > 0) {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <motion.div key={i} variants={itemVariants}>
                {child}
              </motion.div>
            ))
          : (
              <motion.div variants={itemVariants}>{children}</motion.div>
            )}
      </motion.div>
    );
  }

  // Simple single-element reveal
  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
