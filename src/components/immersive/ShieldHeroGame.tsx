"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, Shield, Car, Plane, Zap, Star, Trophy,
  AlertTriangle, Flame, CloudLightning, Stethoscope,
  CarFront, Luggage, Skull, ShieldCheck, ShieldOff,
  Sparkles, Volume2, VolumeX,
} from "lucide-react";

// ─── Types ───
interface Risk {
  id: number;
  type: "health" | "term-life" | "motor" | "travel";
  label: string;
  icon: string;
  y: number;
  x: number; // 0-100 percentage
  speed: number;
  points: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  life: number;
}

interface ShieldFlash {
  id: number;
  type: string;
  x: number;
  y: number;
}

type GameState = "menu" | "playing" | "paused" | "gameover";
type InsuranceType = "health" | "term-life" | "motor" | "travel";

// ─── Constants ───
const CATEGORY_CONFIG: Record<InsuranceType, { color: string; glow: string; label: string; Icon: typeof Heart }> = {
  health:      { color: "#c44058", glow: "rgba(196,64,88,0.4)",   label: "Health",    Icon: Heart },
  "term-life": { color: "#2d3a8c", glow: "rgba(45,58,140,0.4)",  label: "Term Life", Icon: Shield },
  motor:       { color: "#2d8f6f", glow: "rgba(45,143,111,0.4)", label: "Motor",     Icon: Car },
  travel:      { color: "#c47d2e", glow: "rgba(196,125,46,0.4)", label: "Travel",    Icon: Plane },
};

const RISK_TEMPLATES: { type: InsuranceType; label: string; icon: string }[] = [
  { type: "health", label: "Hospital Bill", icon: "stethoscope" },
  { type: "health", label: "Surgery Cost", icon: "heart" },
  { type: "health", label: "Medicine Expense", icon: "pill" },
  { type: "health", label: "Critical Illness", icon: "alert" },
  { type: "term-life", label: "Income Loss", icon: "skull" },
  { type: "term-life", label: "Loan Default", icon: "alert" },
  { type: "term-life", label: "Family Risk", icon: "shield" },
  { type: "motor", label: "Car Accident", icon: "car" },
  { type: "motor", label: "Vehicle Theft", icon: "alert" },
  { type: "motor", label: "Road Damage", icon: "flame" },
  { type: "travel", label: "Flight Delay", icon: "plane" },
  { type: "travel", label: "Lost Luggage", icon: "luggage" },
  { type: "travel", label: "Medical Abroad", icon: "stethoscope" },
];

const ICON_MAP: Record<string, typeof Heart> = {
  stethoscope: Stethoscope, heart: Heart, pill: Zap, alert: AlertTriangle,
  skull: Skull, shield: ShieldOff, car: CarFront, flame: Flame,
  plane: Plane, luggage: Luggage, lightning: CloudLightning,
};

// ─── Component ───
export default function ShieldHeroGame({ onClose }: { onClose: () => void }) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shieldFlashes, setShieldFlashes] = useState<ShieldFlash[]>([]);
  const [combo, setCombo] = useState<string | null>(null);
  const [shieldsBlocked, setShieldsBlocked] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [screenShake, setScreenShake] = useState(false);

  const frameRef = useRef<number>(0);
  const tickRef = useRef<number>(0);
  const riskIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const flashIdRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("wbi_shield_highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Spawn particles burst
  const spawnParticles = useCallback((x: number, y: number, color: string, count = 12) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x, y, color,
        angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
        speed: 2 + Math.random() * 4,
        life: 1,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Shield flash effect
  const spawnFlash = useCallback((type: string, x: number, y: number) => {
    const id = flashIdRef.current++;
    setShieldFlashes((prev) => [...prev, { id, type, x, y }]);
    setTimeout(() => setShieldFlashes((prev) => prev.filter((f) => f.id !== id)), 600);
  }, []);

  // Handle shield selection
  const handleShield = useCallback(
    (selectedType: InsuranceType) => {
      if (gameState !== "playing") return;

      // Find the lowest (closest to bottom) risk
      const sortedRisks = [...risks].sort((a, b) => b.y - a.y);
      const targetRisk = sortedRisks[0];
      if (!targetRisk) return;

      const cfg = CATEGORY_CONFIG[selectedType];

      if (targetRisk.type === selectedType) {
        // Correct match!
        const streakBonus = Math.min(streak, 5) * 5;
        const levelBonus = level * 2;
        const pts = targetRisk.points + streakBonus + levelBonus;

        setScore((s) => s + pts);
        setStreak((s) => s + 1);
        setShieldsBlocked((s) => s + 1);

        // Particles + flash
        const rect = gameAreaRef.current?.getBoundingClientRect();
        const px = rect ? (targetRisk.x / 100) * rect.width : 150;
        spawnParticles(px, targetRisk.y, cfg.color, 16);
        spawnFlash(selectedType, px, targetRisk.y);

        // Combo text
        if (streak >= 2) {
          setCombo(`${streak + 1}x Combo! +${pts}`);
          setTimeout(() => setCombo(null), 1000);
        }

        setRisks((prev) => prev.filter((r) => r.id !== targetRisk.id));
      } else {
        // Wrong shield
        setStreak(0);
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 300);

        // Red particles
        const rect = gameAreaRef.current?.getBoundingClientRect();
        const px = rect ? (targetRisk.x / 100) * rect.width : 150;
        spawnParticles(px, targetRisk.y, "#ef4444", 8);
      }
    },
    [gameState, risks, streak, level, spawnParticles, spawnFlash]
  );

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const loop = () => {
      tickRef.current++;

      // Spawn risks
      const spawnRate = Math.max(40, 80 - level * 5);
      if (tickRef.current % spawnRate === 0) {
        const template = RISK_TEMPLATES[Math.floor(Math.random() * RISK_TEMPLATES.length)];
        const newRisk: Risk = {
          id: riskIdRef.current++,
          type: template.type,
          label: template.label,
          icon: template.icon,
          y: -60,
          x: 15 + Math.random() * 70,
          speed: 0.8 + level * 0.15 + Math.random() * 0.3,
          points: 10 + level * 2,
        };
        setRisks((prev) => [...prev, newRisk]);
      }

      // Move risks
      setRisks((prev) => {
        const updated = prev.map((r) => ({ ...r, y: r.y + r.speed }));
        const escaped = updated.filter((r) => r.y > 520);
        if (escaped.length > 0) {
          setLives((l) => {
            const newLives = l - escaped.length;
            if (newLives <= 0) {
              setGameState("gameover");
            }
            return Math.max(0, newLives);
          });
          setStreak(0);
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), 400);
        }
        return updated.filter((r) => r.y <= 520);
      });

      // Decay particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed - 0.5,
            life: p.life - 0.025,
            speed: p.speed * 0.96,
          }))
          .filter((p) => p.life > 0)
      );

      // Level up every 100 points
      setScore((s) => {
        const newLevel = Math.floor(s / 100) + 1;
        if (newLevel !== level) setLevel(newLevel);
        return s;
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState, level]);

  // Save high score on game over
  useEffect(() => {
    if (gameState === "gameover" && score > highScore) {
      setHighScore(score);
      localStorage.setItem("wbi_shield_highscore", String(score));
    }
  }, [gameState, score, highScore]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setStreak(0);
    setRisks([]);
    setParticles([]);
    setShieldsBlocked(0);
    tickRef.current = 0;
    setGameState("playing");
  };

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "1") handleShield("health");
      if (e.key === "2") handleShield("term-life");
      if (e.key === "3") handleShield("motor");
      if (e.key === "4") handleShield("travel");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameState, handleShield]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

        {/* Game container */}
        <motion.div
          className="relative w-full max-w-[420px] rounded-2xl overflow-hidden"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            x: screenShake ? [0, -4, 4, -2, 2, 0] : 0,
          }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            background: "linear-gradient(180deg, #0a0a1a 0%, #111133 50%, #0d0d25 100%)",
            boxShadow: "0 0 80px rgba(45,58,140,0.3), 0 0 40px rgba(196,125,46,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          {/* ═══ MENU ═══ */}
          {gameState === "menu" && (
            <motion.div
              className="p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Animated shield icon */}
              <motion.div
                className="relative w-24 h-24 mx-auto mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c47d2e]/30 to-[#2d3a8c]/30 blur-xl" />
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#2d3a8c] to-[#1a1a4e] border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-[#c47d2e]" />
                </div>
                {/* Orbiting dots */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: Object.values(CATEGORY_CONFIG)[i].color }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "linear" }}
                    // Position in orbit
                    initial={false}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: Object.values(CATEGORY_CONFIG)[i].color,
                        position: "absolute",
                        left: `${48 + 44 * Math.cos((Math.PI * 2 * i) / 4)}px`,
                        top: `${48 + 44 * Math.sin((Math.PI * 2 * i) / 4)}px`,
                      }}
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <h2 className="text-[26px] font-bold text-white tracking-[-0.02em] mb-1">
                Shield Hero
              </h2>
              <p className="text-[13px] text-white/40 mb-6 leading-relaxed max-w-[280px] mx-auto">
                Protect your family from life&apos;s risks! Match each falling risk with the
                correct insurance shield before it reaches the bottom.
              </p>

              {/* Shield legend */}
              <div className="grid grid-cols-2 gap-2 mb-6 mx-auto max-w-[300px]">
                {(Object.entries(CATEGORY_CONFIG) as [InsuranceType, typeof CATEGORY_CONFIG.health][]).map(([key, cfg]) => {
                  const Icon = cfg.Icon;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]"
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                      <span className="text-[11px] text-white/60 font-medium">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>

              {highScore > 0 && (
                <div className="flex items-center justify-center gap-1.5 mb-4 text-[12px] text-white/30">
                  <Trophy className="w-3.5 h-3.5 text-[#c47d2e]" />
                  Best: {highScore} pts
                </div>
              )}

              <motion.button
                onClick={startGame}
                className="px-8 py-3 rounded-xl text-[14px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #2d3a8c, #4f5cbf)",
                  boxShadow: "0 4px 20px rgba(45,58,140,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
                whileHover={{ scale: 1.04, boxShadow: "0 6px 30px rgba(45,58,140,0.6)" }}
                whileTap={{ scale: 0.96 }}
              >
                Start Game
              </motion.button>

              <p className="mt-4 text-[10px] text-white/20">
                Keyboard: 1=Health  2=Life  3=Motor  4=Travel
              </p>
            </motion.div>
          )}

          {/* ═══ PLAYING ═══ */}
          {(gameState === "playing" || gameState === "gameover") && (
            <div>
              {/* HUD */}
              <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="text-[11px] text-white/40">
                    <span className="text-white font-bold text-[16px]">{score}</span> pts
                  </div>
                  {streak >= 3 && (
                    <motion.div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c47d2e]/20 border border-[#c47d2e]/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key={streak}
                    >
                      <Zap className="w-3 h-3 text-[#c47d2e]" />
                      <span className="text-[10px] text-[#c47d2e] font-bold">{streak}x</span>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06]">
                    <Star className="w-3 h-3 text-[#c47d2e]" />
                    <span className="text-[10px] text-white/60 font-medium">Lv.{level}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 1, opacity: 0.2 }}
                        transition={i < lives ? { duration: 0.3 } : {}}
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={i < lives ? "#c44058" : "transparent"}
                          style={{ color: i < lives ? "#c44058" : "#333" }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Game area */}
              <div
                ref={gameAreaRef}
                className="relative overflow-hidden"
                style={{ height: "420px" }}
              >
                {/* Background grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Bottom safe zone glow */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red-500/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

                {/* Falling risks */}
                <AnimatePresence>
                  {risks.map((risk) => {
                    const cfg = CATEGORY_CONFIG[risk.type];
                    const RiskIcon = ICON_MAP[risk.icon] ?? AlertTriangle;
                    return (
                      <motion.div
                        key={risk.id}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `${risk.x}%`,
                          top: `${risk.y}px`,
                          transform: "translateX(-50%)",
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="w-12 h-12 rounded-xl flex items-center justify-center border"
                          style={{
                            backgroundColor: `${cfg.color}20`,
                            borderColor: `${cfg.color}40`,
                            boxShadow: `0 0 20px ${cfg.glow}, 0 4px 12px rgba(0,0,0,0.3)`,
                          }}
                          animate={{
                            y: [0, -3, 0],
                            rotate: [-2, 2, -2],
                          }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          <RiskIcon className="w-5 h-5" style={{ color: cfg.color }} />
                        </motion.div>
                        <span
                          className="mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                          style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}
                        >
                          {risk.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Shield flash effects */}
                <AnimatePresence>
                  {shieldFlashes.map((flash) => {
                    const cfg = CATEGORY_CONFIG[flash.type as InsuranceType];
                    return (
                      <motion.div
                        key={flash.id}
                        className="absolute pointer-events-none"
                        style={{
                          left: flash.x,
                          top: flash.y,
                          transform: "translate(-50%, -50%)",
                        }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <div
                          className="w-16 h-16 rounded-full"
                          style={{
                            background: `radial-gradient(circle, ${cfg?.color ?? "#fff"}60 0%, transparent 70%)`,
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Particles */}
                {particles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                    style={{
                      left: p.x,
                      top: p.y,
                      backgroundColor: p.color,
                      opacity: p.life,
                      boxShadow: `0 0 4px ${p.color}`,
                      transform: `scale(${p.life})`,
                    }}
                  />
                ))}

                {/* Combo text */}
                <AnimatePresence>
                  {combo && (
                    <motion.div
                      className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="px-4 py-2 rounded-xl bg-[#c47d2e]/90 backdrop-blur-sm">
                        <span className="text-[14px] font-black text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          {combo}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shield buttons */}
              {gameState === "playing" && (
                <div className="grid grid-cols-4 gap-2 p-3 border-t border-white/[0.06]">
                  {(Object.entries(CATEGORY_CONFIG) as [InsuranceType, typeof CATEGORY_CONFIG.health][]).map(
                    ([key, cfg], i) => {
                      const Icon = cfg.Icon;
                      return (
                        <motion.button
                          key={key}
                          onClick={() => handleShield(key)}
                          className="relative flex flex-col items-center gap-1 py-3 rounded-xl border transition-all active:scale-95"
                          style={{
                            backgroundColor: `${cfg.color}12`,
                            borderColor: `${cfg.color}30`,
                          }}
                          whileHover={{
                            backgroundColor: `${cfg.color}25`,
                            boxShadow: `0 0 20px ${cfg.glow}`,
                          }}
                          whileTap={{ scale: 0.92 }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${cfg.color}20` }}
                          >
                            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                          </div>
                          <span className="text-[9px] font-bold" style={{ color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <span className="absolute top-1 right-1.5 text-[8px] text-white/20 font-mono">
                            {i + 1}
                          </span>
                        </motion.button>
                      );
                    }
                  )}
                </div>
              )}

              {/* ═══ GAME OVER OVERLAY ═══ */}
              <AnimatePresence>
                {gameState === "gameover" && (
                  <motion.div
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <motion.div
                      className="relative text-center p-8"
                      initial={{ scale: 0.7, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      {/* Trophy animation */}
                      <motion.div
                        className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                        style={{
                          background: score > highScore
                            ? "linear-gradient(135deg, #c47d2e, #e09a4a)"
                            : "linear-gradient(135deg, #2d3a8c, #4f5cbf)",
                          boxShadow: score > highScore
                            ? "0 0 40px rgba(196,125,46,0.4)"
                            : "0 0 40px rgba(45,58,140,0.3)",
                        }}
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <Trophy className="w-10 h-10 text-white" />
                      </motion.div>

                      {score >= highScore && score > 0 && (
                        <motion.div
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c47d2e]/20 border border-[#c47d2e]/30 mb-3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          <Sparkles className="w-3 h-3 text-[#c47d2e]" />
                          <span className="text-[11px] font-bold text-[#c47d2e]">New High Score!</span>
                        </motion.div>
                      )}

                      <h3 className="text-[24px] font-bold text-white mb-1">Game Over</h3>
                      <div className="text-[36px] font-black text-white mb-2">{score}</div>
                      <p className="text-[12px] text-white/40 mb-1">points earned</p>

                      {/* Stats */}
                      <div className="flex items-center justify-center gap-4 mt-4 mb-6">
                        <div className="text-center">
                          <div className="text-[16px] font-bold text-white">{shieldsBlocked}</div>
                          <div className="text-[10px] text-white/30">Risks Blocked</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                          <div className="text-[16px] font-bold text-white">Lv.{level}</div>
                          <div className="text-[10px] text-white/30">Level Reached</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                          <div className="text-[16px] font-bold text-[#c47d2e]">{highScore}</div>
                          <div className="text-[10px] text-white/30">Best Score</div>
                        </div>
                      </div>

                      {/* Insurance fact */}
                      <div className="mx-auto max-w-[280px] px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6">
                        <p className="text-[10px] text-white/30 leading-relaxed">
                          <span className="text-[#c47d2e] font-semibold">Did you know?</span>{" "}
                          {level >= 3
                            ? "The average claim settlement ratio of Indian life insurers is over 97%. Your family deserves that protection!"
                            : "Over 65% of Indian households lack adequate health insurance coverage. Compare plans to find the right fit!"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 justify-center">
                        <motion.button
                          onClick={startGame}
                          className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white"
                          style={{
                            background: "linear-gradient(135deg, #2d3a8c, #4f5cbf)",
                            boxShadow: "0 4px 20px rgba(45,58,140,0.4)",
                          }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          Play Again
                        </motion.button>
                        <motion.button
                          onClick={onClose}
                          className="px-6 py-2.5 rounded-xl text-[13px] font-medium text-white/50 bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors"
                          whileTap={{ scale: 0.96 }}
                        >
                          Close
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
