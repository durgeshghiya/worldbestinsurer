"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const PARTICLE_ICONS = ["🛡️", "❤️", "☂️", "✨"];
const PARTICLE_COUNT = 35;

interface Particle {
  x: number;
  y: number;
  baseX: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  driftSpeed: number;
  icon: string;
  phase: number;
}

interface FloatingParticlesProps {
  className?: string;
}

export default function FloatingParticles({ className }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const elementsRef = useRef<HTMLDivElement[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const size = 8 + Math.random() * 16;
      const x = Math.random() * width;
      particles.push({
        x,
        y: Math.random() * height,
        baseX: x,
        size,
        opacity: 0.1 + Math.random() * 0.3,
        speed: 0.2 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.5,
        driftSpeed: 0.5 + Math.random() * 1.5,
        icon: PARTICLE_ICONS[i % PARTICLE_ICONS.length],
        phase: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { offsetWidth: w, offsetHeight: h } = container;
    particlesRef.current = initParticles(w, h);

    // Create DOM elements
    elementsRef.current = particlesRef.current.map((p) => {
      const el = document.createElement("div");
      el.textContent = p.icon;
      el.style.position = "absolute";
      el.style.willChange = "transform, opacity";
      el.style.pointerEvents = "none";
      el.style.userSelect = "none";
      el.style.fontSize = `${p.size}px`;
      el.style.lineHeight = "1";
      container.appendChild(el);
      return el;
    });

    let time = 0;
    const animate = () => {
      time += 0.016;
      const mx = mouseX.get();
      const my = mouseY.get();

      particlesRef.current.forEach((p, i) => {
        // Float upward
        p.y -= p.speed;
        // Horizontal drift (sinusoidal)
        p.x = p.baseX + Math.sin(time * p.driftSpeed + p.phase) * 30;

        // Mouse repulsion
        if (mx > 0 && my > 0) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 3;
          }
        }

        // Reset when off screen
        if (p.y < -30) {
          p.y = h + 20;
          p.baseX = Math.random() * w;
          p.x = p.baseX;
        }

        const el = elementsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
          el.style.opacity = `${p.opacity}`;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      elementsRef.current.forEach((el) => el.remove());
      elementsRef.current = [];
    };
  }, [initParticles, mouseX, mouseY]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    },
    [mouseX, mouseY]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className={cn(
        "absolute inset-0 z-0 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
      style={{ pointerEvents: "auto" }}
    />
  );
}
