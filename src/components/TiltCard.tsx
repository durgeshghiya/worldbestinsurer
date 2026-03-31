"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnabled?: boolean;
  scaleOnHover?: number;
}

export default function TiltCard({
  children,
  className,
  tiltAmount = 8,
  glareEnabled = true,
  scaleOnHover = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * tiltAmount * -1,
      y: (x - 0.5) * tiltAmount,
    });
    setGlare({ x: x * 100, y: y * 100, opacity: 0.12 });

    // Update CSS spotlight vars
    ref.current.style.setProperty("--mouse-x", `${x * 100}%`);
    ref.current.style.setProperty("--mouse-y", `${y * 100}%`);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={cn("card-tilt card-spotlight relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: tilt.x === 0 && tilt.y === 0 ? 1 : scaleOnHover,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {glareEnabled && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{
            background: `radial-gradient(300px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
            transition: "opacity 0.2s ease",
          }}
        />
      )}
    </motion.div>
  );
}
