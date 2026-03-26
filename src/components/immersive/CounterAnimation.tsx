"use client";

import { useEffect, useRef } from "react";
import { useInView, useSpring, useMotionValue, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterAnimationProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Decimal places to show */
  decimals?: number;
}

export default function CounterAnimation({
  target,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
  decimals = 0,
}: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (inView) {
      motionVal.set(target);
    }
  }, [inView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = springVal.on("change", (v) => {
      if (ref.current) {
        const formatted =
          decimals > 0
            ? v.toFixed(decimals)
            : Math.round(v).toLocaleString();
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springVal, prefix, suffix, decimals]);

  return (
    <motion.span
      ref={ref}
      className={cn("tabular-nums", className)}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {prefix}0{suffix}
    </motion.span>
  );
}
