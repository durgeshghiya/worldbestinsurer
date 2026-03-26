"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const SECTION_COLORS: Record<string, string> = {
  health: "#c44058",
  term: "#2d3a8c",
  motor: "#2d8f6f",
  travel: "#c47d2e",
  default: "#2d3a8c",
};

const TRAIL_COUNT = 4;

interface MagicCursorProps {
  className?: string;
}

export default function MagicCursor({ className }: MagicCursorProps) {
  const [isTouch, setIsTouch] = useState(true); // default hidden
  const [hovering, setHovering] = useState(false);
  const [cursorColor, setCursorColor] = useState(SECTION_COLORS.default);
  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))
  );
  const [trail, setTrail] = useState(trailPositions.current);
  const rafRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 28, mass: 0.5 };
  const dotX = useSpring(mouseX, springConfig);
  const dotY = useSpring(mouseY, springConfig);

  const ringSpring = { stiffness: 150, damping: 20, mass: 0.8 };
  const ringX = useSpring(mouseX, ringSpring);
  const ringY = useSpring(mouseY, ringSpring);

  // Detect touch device
  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setIsTouch(!hasFinePointer);
  }, []);

  // Detect hover over interactives and section context
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest("a, button, [role='button'], input, select, textarea, [data-interactive]");
    setHovering(!!interactive);

    // Detect section color
    const section = target.closest("[data-section]");
    if (section) {
      const sectionType = (section as HTMLElement).dataset.section || "default";
      setCursorColor(SECTION_COLORS[sectionType] || SECTION_COLORS.default);
    } else {
      setCursorColor(SECTION_COLORS.default);
    }
  }, []);

  // Mouse movement
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  // Trail animation
  useEffect(() => {
    if (isTouch) return;

    const updateTrail = () => {
      const cx = mouseX.get();
      const cy = mouseY.get();
      const positions = trailPositions.current;

      for (let i = positions.length - 1; i > 0; i--) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.3;
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.3;
      }
      positions[0].x += (cx - positions[0].x) * 0.5;
      positions[0].y += (cy - positions[0].y) * 0.5;

      setTrail([...positions]);
      rafRef.current = requestAnimationFrame(updateTrail);
    };

    rafRef.current = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isTouch, mouseX, mouseY]);

  // Event listeners
  useEffect(() => {
    if (isTouch) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isTouch, handleMouseMove, handleMouseOver]);

  if (isTouch) return null;

  return (
    <div
      className={cn("fixed inset-0 z-[9999] pointer-events-none", className)}
      aria-hidden="true"
    >
      {/* Trail dots */}
      {trail.map((pos, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            backgroundColor: cursorColor,
            opacity: 0.3 - i * 0.06,
            transform: `translate3d(${pos.x - 2}px, ${pos.y - 2}px, 0)`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: ringX,
          y: ringY,
          borderColor: cursorColor,
          willChange: "transform, width, height",
        }}
        animate={{
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          opacity: hovering ? 0.6 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Inner dot */}
      <motion.div
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          x: dotX,
          y: dotY,
          backgroundColor: cursorColor,
          willChange: "transform",
        }}
        animate={{
          width: hovering ? 8 : 6,
          height: hovering ? 8 : 6,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </div>
  );
}
