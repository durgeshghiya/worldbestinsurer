"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Trophy, Zap, Shield, Heart } from "lucide-react";

interface Obstacle {
  id: number;
  lane: number;
  y: number;
  type: "car" | "truck" | "cone" | "powerup";
  emoji: string;
}

interface PowerUp {
  type: "shield" | "slow" | "double";
  remaining: number;
}

const LANES = [0, 1, 2];
const LANE_WIDTH = 80;
const GAME_WIDTH = LANE_WIDTH * 3;
const GAME_HEIGHT = 500;

const CAR_EMOJIS = ["🚗", "🚙", "🚕", "🏎️"];
const TRUCK_EMOJIS = ["🚛", "🚐", "🚌"];
const INSURANCE_FACTS = [
  "Third-party insurance is mandatory for all vehicles in India!",
  "Zero depreciation cover pays full claim without deducting part wear.",
  "NCB can save you up to 50% on your motor insurance premium!",
  "Comprehensive insurance covers both own damage and third-party liability.",
  "Electric vehicles get special insurance rates in many countries.",
  "Dash cams can help speed up your motor insurance claim process.",
  "Your car's IDV decreases each year — check it before renewal!",
  "Personal accident cover for owner-driver is mandatory in India.",
  "Engine protect add-on covers damage from waterlogging and floods.",
  "Motor insurance premiums vary by city due to theft and accident rates.",
];

export default function CarRacingGame({ onClose }: { onClose: () => void }) {
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameover">("menu");
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(3);
  const [lives, setLives] = useState(3);
  const [powerUp, setPowerUp] = useState<PowerUp | null>(null);
  const [flash, setFlash] = useState("");
  const [fact, setFact] = useState("");
  const gameLoop = useRef<number>(0);
  const obstacleId = useRef(0);
  const frameCount = useRef(0);
  const touchStartX = useRef(0);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("wbi_racing_highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerLane((l) => Math.max(0, l - 1));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerLane((l) => Math.min(2, l + 1));
      } else if (e.key === "Escape" || e.key === "p") {
        setGameState("paused");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 30) {
      if (diff > 0) setPlayerLane((l) => Math.min(2, l + 1));
      else setPlayerLane((l) => Math.max(0, l - 1));
    }
  };

  // Game loop
  const gameStep = useCallback(() => {
    if (gameState !== "playing") return;

    frameCount.current++;
    const speedMult = powerUp?.type === "slow" ? 0.5 : 1;

    // Move obstacles
    setObstacles((prev) => {
      const moved = prev.map((o) => ({ ...o, y: o.y + speed * speedMult }));
      return moved.filter((o) => o.y < GAME_HEIGHT + 50);
    });

    // Spawn obstacles
    if (frameCount.current % Math.max(15, 30 - Math.floor(score / 200)) === 0) {
      const lane = LANES[Math.floor(Math.random() * 3)];
      const rand = Math.random();
      let type: Obstacle["type"] = "car";
      let emoji = CAR_EMOJIS[Math.floor(Math.random() * CAR_EMOJIS.length)];

      if (rand < 0.15) {
        type = "powerup";
        emoji = ["🛡️", "⏱️", "⭐"][Math.floor(Math.random() * 3)];
      } else if (rand < 0.35) {
        type = "truck";
        emoji = TRUCK_EMOJIS[Math.floor(Math.random() * TRUCK_EMOJIS.length)];
      } else if (rand < 0.45) {
        type = "cone";
        emoji = "🔺";
      }

      setObstacles((prev) => [
        ...prev,
        { id: obstacleId.current++, lane, y: -40, type, emoji },
      ]);
    }

    // Score
    if (frameCount.current % 5 === 0) {
      const mult = powerUp?.type === "double" ? 2 : 1;
      setScore((s) => s + mult);
    }

    // Speed up
    if (frameCount.current % 300 === 0) {
      setSpeed((s) => Math.min(8, s + 0.3));
    }

    // Power up timer
    if (powerUp && powerUp.remaining > 0) {
      setPowerUp((p) => p ? { ...p, remaining: p.remaining - 1 } : null);
    } else if (powerUp && powerUp.remaining <= 0) {
      setPowerUp(null);
    }

    // Collision detection
    setObstacles((prev) => {
      const collisions = prev.filter(
        (o) => o.lane === playerLane && o.y > GAME_HEIGHT - 100 && o.y < GAME_HEIGHT - 40
      );

      for (const c of collisions) {
        if (c.type === "powerup") {
          // Collect power up
          const types: PowerUp["type"][] = ["shield", "slow", "double"];
          setPowerUp({ type: types[Math.floor(Math.random() * 3)], remaining: 200 });
          setFlash("powerup");
          setTimeout(() => setFlash(""), 300);
          return prev.filter((o) => o.id !== c.id);
        }

        if (powerUp?.type === "shield") {
          setPowerUp(null);
          setFlash("shield");
          setTimeout(() => setFlash(""), 300);
          return prev.filter((o) => o.id !== c.id);
        }

        // Hit!
        setFlash("hit");
        setTimeout(() => setFlash(""), 500);
        setLives((l) => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameState("gameover");
            setFact(INSURANCE_FACTS[Math.floor(Math.random() * INSURANCE_FACTS.length)]);
            // Save high score
            setHighScore((hs) => {
              const newHs = Math.max(hs, score);
              localStorage.setItem("wbi_racing_highscore", String(newHs));
              return newHs;
            });
          }
          return newLives;
        });
        return prev.filter((o) => o.id !== c.id);
      }

      return prev;
    });

    gameLoop.current = requestAnimationFrame(gameStep);
  }, [gameState, speed, playerLane, score, powerUp]);

  useEffect(() => {
    if (gameState === "playing") {
      gameLoop.current = requestAnimationFrame(gameStep);
    }
    return () => cancelAnimationFrame(gameLoop.current);
  }, [gameState, gameStep]);

  const startGame = () => {
    setPlayerLane(1);
    setObstacles([]);
    setScore(0);
    setSpeed(3);
    setLives(3);
    setPowerUp(null);
    setFlash("");
    frameCount.current = 0;
    obstacleId.current = 0;
    setGameState("playing");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="relative bg-[#0a0a1a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        style={{ width: Math.min(360, window?.innerWidth - 32) }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏎️</span>
            <span className="text-white font-bold text-sm">Insurance Racer</span>
          </div>
          <div className="flex items-center gap-3">
            {gameState === "playing" && (
              <>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart key={i} className={cn("w-3.5 h-3.5", i < lives ? "text-red-500 fill-red-500" : "text-white/20")} />
                  ))}
                </div>
                <span className="text-[var(--accent)] font-mono font-bold text-sm">{score}</span>
              </>
            )}
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Power up indicator */}
        {powerUp && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold flex items-center gap-1">
            {powerUp.type === "shield" && <><Shield className="w-3 h-3" /> Shield Active</>}
            {powerUp.type === "slow" && <><Zap className="w-3 h-3" /> Slow Mode</>}
            {powerUp.type === "double" && <><Trophy className="w-3 h-3" /> 2x Points</>}
          </div>
        )}

        {/* Game area */}
        <div
          className={cn(
            "relative mx-auto overflow-hidden select-none",
            flash === "hit" && "animate-pulse bg-red-900/30",
            flash === "powerup" && "bg-yellow-900/20",
            flash === "shield" && "bg-blue-900/20"
          )}
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Road */}
          <div className="absolute inset-0 bg-[#1a1a2e]">
            {/* Lane lines */}
            {[1, 2].map((i) => (
              <div key={i} className="absolute top-0 bottom-0" style={{ left: LANE_WIDTH * i }}>
                {Array.from({ length: 20 }).map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-0.5 h-6 bg-white/20"
                    style={{
                      top: `${(j * 30 + (frameCount.current * speed * 0.5) % 30)}px`,
                      left: -1,
                    }}
                  />
                ))}
              </div>
            ))}
            {/* Road edges */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/30" />
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-white/30" />
          </div>

          {/* Player car */}
          {gameState === "playing" && (
            <motion.div
              className="absolute z-10 text-3xl"
              animate={{ left: playerLane * LANE_WIDTH + LANE_WIDTH / 2 - 16 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ bottom: 40 }}
            >
              🏎️
              {powerUp?.type === "shield" && (
                <div className="absolute inset-0 -m-2 rounded-full border-2 border-blue-400/50 animate-pulse" />
              )}
            </motion.div>
          )}

          {/* Obstacles */}
          {obstacles.map((o) => (
            <motion.div
              key={o.id}
              className={cn("absolute text-2xl", o.type === "powerup" && "animate-bounce")}
              style={{
                left: o.lane * LANE_WIDTH + LANE_WIDTH / 2 - 14,
                top: o.y,
              }}
            >
              {o.emoji}
            </motion.div>
          ))}

          {/* Menu overlay */}
          {gameState === "menu" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
              <div className="text-6xl mb-4">🏎️</div>
              <h3 className="text-2xl font-bold text-white mb-2">Insurance Racer</h3>
              <p className="text-white/50 text-xs mb-1 px-6 text-center">
                Dodge traffic, collect power-ups, learn insurance facts!
              </p>
              <p className="text-white/30 text-[10px] mb-6">Use ← → arrows or swipe</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-[var(--accent)] to-orange-500 text-white rounded-xl font-bold hover:brightness-110 transition-all text-sm"
              >
                Start Racing 🚀
              </button>
              {highScore > 0 && (
                <p className="text-white/30 text-xs mt-3">Best: {highScore} pts</p>
              )}
            </div>
          )}

          {/* Paused overlay */}
          {gameState === "paused" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
              <h3 className="text-xl font-bold text-white mb-4">⏸️ Paused</h3>
              <div className="flex gap-3">
                <button onClick={() => setGameState("playing")} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg font-semibold text-sm">
                  Resume
                </button>
                <button onClick={onClose} className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold text-sm">
                  Quit
                </button>
              </div>
            </div>
          )}

          {/* Game over overlay */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 px-6">
              <div className="text-5xl mb-3">{score > highScore ? "🏆" : "💥"}</div>
              <h3 className="text-xl font-bold text-white mb-1">
                {score > highScore ? "New High Score!" : "Game Over!"}
              </h3>
              <p className="text-[var(--accent)] text-2xl font-bold mb-1">{score} pts</p>
              {score > highScore && (
                <p className="text-yellow-400 text-xs mb-2">Previous best: {highScore}</p>
              )}

              {/* Insurance fact */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-4 max-w-full">
                <p className="text-[10px] text-[var(--accent)] font-semibold mb-1">💡 Did you know?</p>
                <p className="text-white/70 text-xs leading-relaxed">{fact}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={startGame} className="px-6 py-2.5 bg-gradient-to-r from-[var(--accent)] to-orange-500 text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
                  Play Again 🔄
                </button>
                <button onClick={onClose} className="px-6 py-2.5 bg-white/10 text-white rounded-xl font-semibold text-sm">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls hint */}
        {gameState === "playing" && (
          <div className="flex justify-center gap-6 py-2 bg-white/5">
            <button onClick={() => setPlayerLane((l) => Math.max(0, l - 1))} className="px-6 py-2 bg-white/10 rounded-lg text-white text-sm active:bg-white/20">
              ← Left
            </button>
            <button onClick={() => setGameState("paused")} className="px-4 py-2 bg-white/5 rounded-lg text-white/40 text-xs">
              ⏸
            </button>
            <button onClick={() => setPlayerLane((l) => Math.min(2, l + 1))} className="px-6 py-2 bg-white/10 rounded-lg text-white text-sm active:bg-white/20">
              Right →
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
