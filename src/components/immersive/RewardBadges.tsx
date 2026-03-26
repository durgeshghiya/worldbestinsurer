"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  check: (stats: BadgeStats) => boolean;
}

interface BadgeStats {
  pagesVisited: number;
  articlesRead: number;
  comparisons: number;
  countriesViewed: number;
  questComplete: boolean;
}

const BADGES: Badge[] = [
  {
    id: "explorer",
    name: "Explorer",
    icon: "🧭",
    description: "Visit 3+ pages",
    color: "#c47d2e",
    check: (s) => s.pagesVisited >= 3,
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: "📚",
    description: "Read 2+ articles",
    color: "#2d3a8c",
    check: (s) => s.articlesRead >= 2,
  },
  {
    id: "comparator",
    name: "Comparator",
    icon: "⚖️",
    description: "Compare 2+ products",
    color: "#2d8f6f",
    check: (s) => s.comparisons >= 2,
  },
  {
    id: "globetrotter",
    name: "Globe Trotter",
    icon: "🌍",
    description: "View 3+ countries",
    color: "#c44058",
    check: (s) => s.countriesViewed >= 3,
  },
  {
    id: "guru",
    name: "Insurance Guru",
    icon: "🧙",
    description: "Complete the quest",
    color: "#8b5cf6",
    check: (s) => s.questComplete,
  },
];

function getStats(): BadgeStats {
  try {
    const badges = JSON.parse(localStorage.getItem("badges") || "{}");
    return {
      pagesVisited: badges.pagesVisited || 0,
      articlesRead: badges.articlesRead || 0,
      comparisons: badges.comparisons || 0,
      countriesViewed: badges.countriesViewed || 0,
      questComplete: badges.questComplete || false,
    };
  } catch {
    return { pagesVisited: 0, articlesRead: 0, comparisons: 0, countriesViewed: 0, questComplete: false };
  }
}

function trackPageVisit() {
  try {
    const badges = JSON.parse(localStorage.getItem("badges") || "{}");
    const visited = new Set(badges.visitedPages || []);
    visited.add(window.location.pathname);
    badges.visitedPages = Array.from(visited);
    badges.pagesVisited = visited.size;
    localStorage.setItem("badges", JSON.stringify(badges));
    window.dispatchEvent(new Event("badge-update"));
  } catch { /* ignore */ }
}

/* ─── Celebration confetti for badge unlock ─── */
function CelebrationBurst() {
  const pieces = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      {pieces.map((i) => {
        const angle = (i / 16) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 30 + Math.random() * 40;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-accent"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

interface RewardBadgesProps {
  className?: string;
}

export default function RewardBadges({ className }: RewardBadgesProps) {
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<BadgeStats>(getStats);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);
  const [prevUnlocked, setPrevUnlocked] = useState<Set<string>>(new Set());

  const refreshStats = useCallback(() => {
    const s = getStats();
    setStats(s);

    // Check for newly unlocked badges
    const currentUnlocked = new Set(
      BADGES.filter((b) => b.check(s)).map((b) => b.id)
    );
    for (const id of currentUnlocked) {
      if (!prevUnlocked.has(id)) {
        setNewlyUnlocked(id);
        setTimeout(() => setNewlyUnlocked(null), 2000);
        break;
      }
    }
    setPrevUnlocked(currentUnlocked);
  }, [prevUnlocked]);

  useEffect(() => {
    trackPageVisit();
    refreshStats();

    const handler = () => refreshStats();
    window.addEventListener("badge-update", handler);
    return () => window.removeEventListener("badge-update", handler);
  }, [refreshStats]);

  const unlockedCount = BADGES.filter((b) => b.check(stats)).length;

  return (
    <div
      className={cn("fixed bottom-4 right-4 z-50", className)}
    >
      {/* Toggle button */}
      <motion.button
        className="relative w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center text-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setExpanded((e) => !e)}
      >
        🏆
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
            {unlockedCount}
          </span>
        )}
      </motion.button>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="absolute bottom-16 right-0 w-72 rounded-2xl bg-white shadow-2xl border border-white/40 p-4 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h3 className="text-sm font-bold text-text-primary mb-3">
              Achievements ({unlockedCount}/{BADGES.length})
            </h3>
            <div className="space-y-3">
              {BADGES.map((badge) => {
                const unlocked = badge.check(stats);
                const isNew = newlyUnlocked === badge.id;
                return (
                  <motion.div
                    key={badge.id}
                    className={cn(
                      "relative flex items-center gap-3 p-2 rounded-xl transition-colors",
                      unlocked ? "bg-surface" : "bg-gray-50 opacity-60"
                    )}
                    animate={isNew ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {isNew && <CelebrationBurst />}
                    {/* Badge icon */}
                    <div
                      className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0",
                        unlocked ? "bg-white shadow-md" : "bg-gray-200"
                      )}
                      style={
                        unlocked
                          ? { boxShadow: `0 0 12px ${badge.color}40` }
                          : {}
                      }
                    >
                      {unlocked ? badge.icon : "🔒"}
                      {/* Sparkle ring for unlocked */}
                      {unlocked && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2px solid ${badge.color}`,
                          }}
                          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary">
                        {badge.name}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {badge.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
