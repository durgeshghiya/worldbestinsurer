"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfettiButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  colors?: string[];
  particleCount?: number;
}

const DEFAULT_COLORS = ["#c47d2e", "#2d3a8c", "#c44058", "#2d8f6f", "#e09a4a", "#4f5cbf"];

export default function ConfettiButton({
  children,
  className,
  onClick,
  disabled,
  colors = DEFAULT_COLORS,
  particleCount = 24,
}: ConfettiButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);

  const spawnConfetti = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "confetti-particle";
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
        const velocity = 60 + Math.random() * 80;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity - 40; // bias upward

        Object.assign(particle.style, {
          left: `${centerX}px`,
          top: `${centerY}px`,
          backgroundColor: color,
          width: `${4 + Math.random() * 4}px`,
          height: `${4 + Math.random() * 4}px`,
          borderRadius: Math.random() > 0.5 ? "50%" : "1px",
          position: "fixed",
          zIndex: "99999",
          pointerEvents: "none",
          animation: "none",
        });

        document.body.appendChild(particle);

        const startTime = performance.now();
        const duration = 800 + Math.random() * 400;

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);

          const x = dx * eased;
          const y = dy * eased + 200 * t * t; // gravity
          const rotation = 720 * t;
          const scale = 1 - t * 0.7;
          const opacity = 1 - t;

          particle.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
          particle.style.opacity = `${opacity}`;

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            particle.remove();
          }
        };
        requestAnimationFrame(animate);
      }

      onClick?.(e);
    },
    [onClick, colors, particleCount]
  );

  return (
    <motion.button
      ref={containerRef}
      className={cn("btn-bouncy relative", className)}
      onClick={spawnConfetti}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
