"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface QuestData {
  insuranceType: string;
  age: number;
  coverAmount: number;
  country: string;
  name: string;
  email: string;
}

interface QuestJourneyProps {
  className?: string;
}

/* ─── Constants ─── */
const INSURANCE_TYPES = [
  { id: "health", icon: "🏥", label: "Health Shield", color: "#c44058" },
  { id: "term", icon: "🛡️", label: "Life Armor", color: "#2d3a8c" },
  { id: "motor", icon: "🚗", label: "Motor Guard", color: "#2d8f6f" },
  { id: "travel", icon: "✈️", label: "Travel Ward", color: "#c47d2e" },
];

const COUNTRIES = [
  { code: "in", name: "India", flag: "🇮🇳" },
  { code: "us", name: "United States", flag: "🇺🇸" },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ae", name: "UAE", flag: "🇦🇪" },
  { code: "sg", name: "Singapore", flag: "🇸🇬" },
  { code: "au", name: "Australia", flag: "🇦🇺" },
];

const STEPS = [
  { title: "Choose Your Shield", subtitle: "Select your insurance type" },
  { title: "Set Your Power Level", subtitle: "Configure age & coverage" },
  { title: "Select Your Realm", subtitle: "Pick your country" },
  { title: "Claim Your Reward", subtitle: "Complete the quest" },
];

/* ─── Confetti burst component ─── */
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((i) => {
        const angle = (i / 20) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 60 + Math.random() * 100;
        const colors = ["#c44058", "#2d3a8c", "#2d8f6f", "#c47d2e", "#f5c542"];
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

/* ─── XP Progress Bar ─── */
function XPBar({ step, total }: { step: number; total: number }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between text-xs font-bold text-text-secondary mb-1">
        <span>LVL {step + 1}</span>
        <span>{Math.round(pct)}% XP</span>
      </div>
      <div className="relative h-4 bg-surface-dark/10 rounded-full overflow-hidden border border-white/20">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #2d3a8c, #c47d2e, #c44058)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        />
        {/* Checkpoint dots */}
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-colors z-10",
              i <= step
                ? "bg-white border-white"
                : "bg-transparent border-white/40"
            )}
            style={{ left: `${((i + 1) / total) * 100}%`, transform: "translate(-50%, -50%)" }}
          />
        ))}
      </div>
      {/* Treasure map path labels */}
      <div className="flex justify-between mt-2">
        {STEPS.map((s, i) => (
          <span
            key={i}
            className={cn(
              "text-[9px] md:text-[10px] font-medium text-center flex-1",
              i <= step ? "text-text-primary" : "text-text-secondary/50"
            )}
          >
            {i <= step ? "⚔️" : "🔒"} {s.title}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Step animations ─── */
const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.9,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
    scale: 0.9,
  }),
};

/* ─── Main Component ─── */
export default function QuestJourney({ className }: QuestJourneyProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [confetti, setConfetti] = useState(false);
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState<QuestData>({
    insuranceType: "",
    age: 30,
    coverAmount: 500000,
    country: "",
    name: "",
    email: "",
  });

  // Load saved data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quest-data");
      if (saved) setData(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const save = useCallback((d: QuestData) => {
    localStorage.setItem("quest-data", JSON.stringify(d));
  }, []);

  const goNext = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 800);

    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      save(data);
      setComplete(true);
      // Track quest completion for badges
      try {
        const badges = JSON.parse(localStorage.getItem("badges") || "{}");
        badges.questComplete = true;
        localStorage.setItem("badges", JSON.stringify(badges));
        window.dispatchEvent(new Event("badge-update"));
      } catch { /* ignore */ }
    }
  }, [step, data, save]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const updateData = useCallback(
    (partial: Partial<QuestData>) => {
      setData((d) => {
        const updated = { ...d, ...partial };
        save(updated);
        return updated;
      });
    },
    [save]
  );

  /* ─── Step renderers ─── */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {INSURANCE_TYPES.map((t) => (
              <motion.button
                key={t.id}
                className={cn(
                  "p-5 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors",
                  data.insuranceType === t.id
                    ? "border-current bg-white/80 shadow-lg"
                    : "border-white/30 bg-white/40 hover:bg-white/60"
                )}
                style={data.insuranceType === t.id ? { borderColor: t.color, color: t.color } : {}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateData({ insuranceType: t.id })}
              >
                <span className="text-4xl">{t.icon}</span>
                <span className="text-sm font-bold text-text-primary">{t.label}</span>
              </motion.button>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="max-w-sm mx-auto space-y-8">
            {/* Age slider */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Your Age: <span className="text-accent">{data.age}</span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={18}
                  max={70}
                  value={data.age}
                  onChange={(e) => updateData({ age: parseInt(e.target.value) })}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, #2d3a8c ${((data.age - 18) / 52) * 100}%, #e5e7eb ${((data.age - 18) / 52) * 100}%)`,
                  }}
                />
                {/* Power level visual */}
                <motion.div
                  className="mt-3 h-8 rounded-full overflow-hidden bg-surface-dark/10"
                  style={{ width: "100%" }}
                >
                  <motion.div
                    className="h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(90deg, #2d8f6f, #c47d2e)" }}
                    animate={{ width: `${Math.min(100, ((data.age - 18) / 52) * 100 + 10)}%` }}
                    transition={{ type: "spring", stiffness: 80 }}
                  >
                    ⚡ PWR
                  </motion.div>
                </motion.div>
              </div>
            </div>
            {/* Cover amount slider */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Cover Amount:{" "}
                <span className="text-accent">
                  {data.coverAmount >= 10000000
                    ? `${(data.coverAmount / 10000000).toFixed(1)} Cr`
                    : data.coverAmount >= 100000
                    ? `${(data.coverAmount / 100000).toFixed(0)} L`
                    : `${(data.coverAmount / 1000).toFixed(0)} K`}
                </span>
              </label>
              <input
                type="range"
                min={100000}
                max={50000000}
                step={100000}
                value={data.coverAmount}
                onChange={(e) => updateData({ coverAmount: parseInt(e.target.value) })}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, #c44058 ${(data.coverAmount / 50000000) * 100}%, #e5e7eb ${(data.coverAmount / 50000000) * 100}%)`,
                }}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-4">
              <motion.span
                className="text-6xl inline-block"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌍
              </motion.span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {COUNTRIES.map((c) => (
                <motion.button
                  key={c.code}
                  className={cn(
                    "p-3 rounded-xl border-2 flex items-center gap-2 transition-colors",
                    data.country === c.code
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-white/30 bg-white/40 hover:bg-white/60"
                  )}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => updateData({ country: c.code })}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="text-sm font-semibold text-text-primary">{c.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-sm mx-auto space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/60 text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder="hero@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/60 text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!data.insuranceType;
      case 1:
        return data.age >= 18 && data.coverAmount > 0;
      case 2:
        return !!data.country;
      case 3:
        return data.name.trim().length > 0 && data.email.includes("@");
      default:
        return false;
    }
  };

  if (complete) {
    return (
      <section className={cn("relative py-20", className)}>
        <ConfettiBurst active={true} />
        <motion.div
          className="max-w-md mx-auto text-center p-10 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.span
            className="text-7xl block mb-4"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            🎉
          </motion.span>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Quest Complete!
          </h2>
          <p className="text-text-secondary mb-6">
            Your personalized comparison is ready, {data.name}!
          </p>
          <motion.button
            className="px-8 py-3 rounded-full bg-primary text-white font-bold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setComplete(false);
              setStep(0);
            }}
          >
            View Results
          </motion.button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className={cn("relative py-16 md:py-24", className)}>
      <div className="max-w-2xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Begin Your Quest
        </motion.h2>
        <p className="text-center text-text-secondary mb-8">
          Answer 4 questions to unlock your personalized insurance comparison.
        </p>

        <XPBar step={step} total={STEPS.length} />

        {/* Step content with animations */}
        <div className="relative min-h-[320px] overflow-hidden">
          <ConfettiBurst active={confetti} />
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-full"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-text-primary">
                  {STEPS[step].title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {STEPS[step].subtitle}
                </p>
              </div>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <motion.button
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-semibold border-2 border-primary/20 text-primary",
              step === 0 && "invisible"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
          >
            ← Back
          </motion.button>
          <motion.button
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-bold text-white shadow-lg",
              canProceed()
                ? "bg-primary hover:shadow-xl"
                : "bg-gray-300 cursor-not-allowed"
            )}
            whileHover={canProceed() ? { scale: 1.05 } : {}}
            whileTap={canProceed() ? { scale: 0.95 } : {}}
            onClick={canProceed() ? goNext : undefined}
            disabled={!canProceed()}
          >
            {step === STEPS.length - 1 ? "Complete Quest 🏆" : "Continue →"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
