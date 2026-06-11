"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Full-viewport canvas artwork for the immersive homepage.
 *
 * Draws (2D canvas, additive blending):
 *  - a central circular emblem filled with flickering '/' '\' '0' '1' glyphs
 *  - a boot sequence: percent counter 0→100 while contour rings draw in
 *  - 14 concentric organic contour rings that breathe and warp away from
 *    the cursor
 *  - mirrored wing strokes hugging the left/right viewport edges
 *  - on scroll, rings disperse into drifting particles while the content
 *    below scrolls up over the stage
 *
 * Progressive enhancement contract:
 *  - Without JS: children (H1 wordmark + tagline) and all page content are
 *    fully visible; the canvas simply stays black.
 *  - With prefers-reduced-motion: one static frame is drawn (no loop, no
 *    boot, no dispersion scroll choreography).
 *  - rAF pauses when the stage leaves the viewport or the tab is hidden.
 */
export default function ImmersiveStage({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !stage || !canvas) return;

    const root = document.querySelector(".imm-home");
    root?.classList.add("imm-js");

    const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (motionOK) root?.classList.add("imm-anim");

    // ── Reveal-on-scroll for content sections (page-wide) ──
    const revealEls = document.querySelectorAll(".imm-reveal");
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealIO.observe(el));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Geometry / state ──
    const RINGS = 14;
    const PTS = 150;
    let W = 0, H = 0, CX = 0, CY = 0, DPR = 1, emblemR = 168;

    type Cell = { x: number; y: number; ch: string; a: number };
    let cells: Cell[] = [];

    type Particle = { ang: number; baseR: number; dist: number; sp: number; sz: number; al: number };
    let particles: Particle[] = [];

    const GLYPHS = ["/", "/", "/", "\\", "0", "1"];

    function rebuild() {
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      W = stage!.clientWidth;
      H = stage!.clientHeight;
      canvas!.width = Math.round(W * DPR);
      canvas!.height = Math.round(H * DPR);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      CX = W / 2;
      CY = H * 0.46;
      emblemR = W < 640 ? 110 : 168;

      // Glyph grid clipped to the emblem circle
      cells = [];
      const step = W < 640 ? 12 : 14;
      for (let y = -emblemR; y <= emblemR; y += step) {
        for (let x = -emblemR; x <= emblemR; x += step) {
          if (x * x + y * y <= emblemR * emblemR * 0.92) {
            cells.push({
              x: CX + x,
              y: CY + y,
              ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
              a: 0.06 + Math.random() * 0.22,
            });
          }
        }
      }

      // Dispersion particles seeded around the ring band
      particles = [];
      const maxR = Math.min(W, H) * 0.52;
      for (let i = 0; i < 220; i++) {
        particles.push({
          ang: Math.random() * Math.PI * 2,
          baseR: emblemR + 30 + Math.random() * (maxR - emblemR - 30),
          dist: 120 + Math.random() * 420,
          sp: 0.5 + Math.random(),
          sz: 0.6 + Math.random() * 1.5,
          al: 0.2 + Math.random() * 0.5,
        });
      }
    }
    rebuild();

    // ── Input state ──
    let mx = -9999, my = -9999;       // warp source (lerped)
    let tmx = -9999, tmy = -9999;     // warp target
    let cx2 = -9999, cy2 = -9999;     // custom cursor (lerped)
    let scrollP = 0;                  // dispersion progress 0..1
    let booted = !motionOK;           // reduced motion skips boot
    const bootStart = performance.now();
    const BOOT_MS = 1450;

    function onMove(e: PointerEvent) {
      const r = stage!.getBoundingClientRect();
      tmx = e.clientX - r.left;
      tmy = e.clientY - r.top;
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    }
    function onLeave() {
      tmx = -9999;
      tmy = -9999;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    }
    function onScroll() {
      const vh = window.innerHeight;
      scrollP = Math.min(1, Math.max(0, window.scrollY / (vh * 0.8)));
    }

    if (motionOK && finePointer) {
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
    }
    if (motionOK) window.addEventListener("scroll", onScroll, { passive: true });

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    // ── Frame ──
    function draw(now: number) {
      const t = now / 1000;
      ctx!.clearRect(0, 0, W, H);

      // boot progress
      let bp = 1;
      if (motionOK) {
        bp = Math.min(1, (now - bootStart) / BOOT_MS);
        if (bp >= 1 && !booted) {
          booted = true;
          stage!.classList.add("imm-booted");
        }
      } else {
        stage!.classList.add("imm-booted");
      }
      const bpe = ease(bp);

      // lerp warp + custom cursor
      mx += (tmx - mx) * 0.12;
      my += (tmy - my) * 0.12;
      if (cursorRef.current && finePointer) {
        cx2 += (tmx - cx2) * 0.22;
        cy2 += (tmy - cy2) * 0.22;
        cursorRef.current.style.transform = `translate(${cx2}px, ${cy2}px)`;
      }

      const p = scrollP;
      const ringAlphaGlobal = Math.pow(1 - p, 1.6);

      ctx!.globalCompositeOperation = "lighter";

      // ── Glyph emblem ──
      const fontPx = W < 640 ? 10 : 11;
      ctx!.font = `${fontPx}px var(--font-geist-mono), ui-monospace, monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      // flicker a few cells per frame
      if (motionOK) {
        const n = Math.max(2, (cells.length * 0.018) | 0);
        for (let k = 0; k < n; k++) {
          const c = cells[(Math.random() * cells.length) | 0];
          c.ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          c.a = Math.random() < 0.1 ? 0.38 + Math.random() * 0.15 : 0.06 + Math.random() * 0.22;
        }
      }
      const emblemAlpha = (0.35 + 0.65 * bpe) * ringAlphaGlobal;
      for (const c of cells) {
        ctx!.fillStyle = `rgba(126, 200, 235, ${c.a * emblemAlpha})`;
        ctx!.fillText(c.ch, c.x, c.y);
      }

      // boot counter
      if (motionOK && bp < 1) {
        const pct = Math.floor(bpe * 100);
        ctx!.font = `600 ${W < 640 ? 44 : 62}px var(--font-geist-mono), ui-monospace, monospace`;
        ctx!.fillStyle = "rgba(159, 232, 255, 0.92)";
        ctx!.fillText(String(pct), CX, CY);
      }

      // ── Contour rings ──
      const sigma = 150;
      for (let i = 0; i < RINGS; i++) {
        // staggered draw-in during boot
        const ra = Math.min(1, Math.max(0, bpe * RINGS * 1.2 - i));
        if (ra <= 0.01) continue;
        const base = emblemR + 26 + i * (16 + i * 1.7);
        const breathe = 1 + 0.018 * Math.sin(t * 0.7 + i * 0.5);
        const aAmp = Math.min(0.19, 0.05 + i * 0.012);
        const bAmp = 0.03 + i * 0.006;
        const warpK = 30 * (1 - i / (RINGS * 1.4));
        const alpha = (0.10 + 0.45 * (1 - i / RINGS)) * ra * ringAlphaGlobal;
        if (alpha <= 0.005) continue;

        ctx!.beginPath();
        for (let j = 0; j <= PTS; j++) {
          const th = (j / PTS) * Math.PI * 2;
          const lobe =
            aAmp * Math.cos(2 * th + i * 0.22 + t * 0.05) +
            bAmp * Math.cos(4 * th - i * 0.31 - t * 0.04);
          let r = base * breathe * (1 + lobe);
          // dispersion drift
          if (p > 0) r += p * (60 + i * 26) * (0.6 + 0.4 * Math.sin(i * 1.7 + th * 3));
          let x = CX + Math.cos(th) * r;
          let y = CY + Math.sin(th) * r * 0.94; // slight vertical squash
          // cursor warp
          const dx = x - mx, dy = y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < sigma * sigma * 9) {
            const push = warpK * Math.exp(-d2 / (2 * sigma * sigma));
            const d = Math.sqrt(d2) || 1;
            x += (dx / d) * push;
            y += (dy / d) * push;
          }
          if (j === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.closePath();
        ctx!.strokeStyle = `rgba(96, 178, 230, ${alpha})`;
        ctx!.lineWidth = 1.6;
        ctx!.shadowColor = "rgba(80, 190, 255, 0.55)";
        ctx!.shadowBlur = 12;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
        ctx!.strokeStyle = `rgba(180, 230, 255, ${alpha * 0.55})`;
        ctx!.lineWidth = 0.7;
        ctx!.stroke();
      }

      // ── Wing strokes at the viewport edges ──
      const wingAlpha = 0.5 * bpe * ringAlphaGlobal;
      if (wingAlpha > 0.01 && W > 720) {
        for (const side of [-1, 1]) {
          for (let j = 0; j < 4; j++) {
            const baseX = CX + side * (W * 0.5 - 64 - j * 30);
            ctx!.beginPath();
            const y0 = H * 0.16, y1 = H * 0.84;
            for (let y = y0; y <= y1; y += 12) {
              let x = baseX + Math.sin(y * 0.012 + t * 0.5 + j * 1.3) * 10 * (1 + j * 0.25);
              const dx = x - mx, dy = y - my;
              const d2 = dx * dx + dy * dy;
              if (d2 < 90000) {
                const push = 18 * Math.exp(-d2 / 45000);
                x += side * push;
              }
              if (y === y0) ctx!.moveTo(x, y);
              else ctx!.lineTo(x, y);
            }
            ctx!.strokeStyle = `rgba(96, 178, 230, ${wingAlpha * (0.25 + j * 0.1)})`;
            ctx!.lineWidth = 1.1;
            ctx!.shadowColor = "rgba(80, 190, 255, 0.4)";
            ctx!.shadowBlur = 8;
            ctx!.stroke();
            ctx!.shadowBlur = 0;
          }
        }
      }

      // ── Dispersion particles ──
      if (p > 0.02) {
        for (const pt of particles) {
          const r = pt.baseR + pt.dist * p * pt.sp;
          const x = CX + Math.cos(pt.ang) * r;
          const y = CY + Math.sin(pt.ang) * r * 0.94;
          ctx!.fillStyle = `rgba(150, 210, 240, ${pt.al * p * (1 - p * 0.4)})`;
          ctx!.fillRect(x, y, pt.sz, pt.sz);
        }
      }

      ctx!.globalCompositeOperation = "source-over";
    }

    // ── Loop management ──
    let raf = 0;
    let running = false;
    function loop(now: number) {
      draw(now);
      if (running && motionOK) raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    if (motionOK) {
      start();
    } else {
      // Single static settled frame
      draw(performance.now() + BOOT_MS + 1);
    }

    const visIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 }
    );
    if (motionOK) visIO.observe(wrap);

    function onVis() {
      if (document.hidden) stop();
      else if (motionOK) start();
    }
    document.addEventListener("visibilitychange", onVis);

    function onResize() {
      rebuild();
      if (!motionOK) draw(performance.now() + BOOT_MS + 1);
    }
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      visIO.disconnect();
      revealIO.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="imm-stage-wrap">
      <div ref={stageRef} className="imm-stage">
        <canvas ref={canvasRef} className="imm-canvas" aria-hidden="true" />

        {/* Corner-anchored HUD */}
        <div className="imm-hud" aria-label="Site navigation">
          <Link href="/" className="imm-hud-item imm-hud-tl">WBI</Link>
          <nav className="imm-hud-item imm-hud-tr">
            <a href="#compare">Compare</a>
            <Link href="/methodology">Methodology</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <span className="imm-hud-item imm-hud-bl">
            <span className="imm-live-dot" aria-hidden="true" />
            Data: Live
          </span>
          <a href="#compare" className="imm-hud-item imm-hud-br">
            Scroll <span aria-hidden="true">↓</span>
          </a>
        </div>

        {/* Server-rendered wordmark + tagline */}
        <div className="imm-center">{children}</div>

        {/* Custom cursor (fine pointers only) */}
        <div ref={cursorRef} className="imm-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
