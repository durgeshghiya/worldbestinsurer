"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Car, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";

const CarRacingGame = dynamic(() => import("./CarRacingGame"), { ssr: false });
const ShieldHeroGame = dynamic(() => import("./ShieldHeroGame"), { ssr: false });

type ActiveGame = null | "racing" | "shield";

export default function GameLauncher() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const launchGame = (game: ActiveGame) => {
    setMenuOpen(false);
    setActiveGame(game);
  };

  return (
    <>
      {/* Floating game button */}
      <motion.button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3, type: "spring" }}
      >
        <span className="text-xl">🎮</span>
        <span className="text-sm font-bold hidden sm:block">Play Game</span>
      </motion.button>

      {/* Game selection menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed bottom-20 left-6 z-50 w-[220px] rounded-xl overflow-hidden border border-white/10"
            style={{
              background: "linear-gradient(180deg, #1a1a2e, #0f0f1a)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em]">
                Mini Games
              </span>
              <button onClick={() => setMenuOpen(false)} className="text-white/30 hover:text-white/60">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2 space-y-1">
              <motion.button
                onClick={() => launchGame("shield")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#2d3a8c]/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#4f5cbf]" />
                </div>
                <div className="text-left">
                  <div className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors">
                    Shield Hero
                  </div>
                  <div className="text-[9px] text-white/30">Match risks to shields</div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => launchGame("racing")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#c44058]/20 flex items-center justify-center">
                  <Car className="w-4 h-4 text-[#c44058]" />
                </div>
                <div className="text-left">
                  <div className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors">
                    Insurance Racer
                  </div>
                  <div className="text-[9px] text-white/30">Dodge obstacles</div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game popups */}
      <AnimatePresence>
        {activeGame === "racing" && <CarRacingGame onClose={() => setActiveGame(null)} />}
        {activeGame === "shield" && <ShieldHeroGame onClose={() => setActiveGame(null)} />}
      </AnimatePresence>
    </>
  );
}
