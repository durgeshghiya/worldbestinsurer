"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CarRacingGame = dynamic(() => import("./CarRacingGame"), { ssr: false });

export default function GameLauncher() {
  const [showGame, setShowGame] = useState(false);

  return (
    <>
      {/* Floating game button */}
      <motion.button
        onClick={() => setShowGame(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3, type: "spring" }}
      >
        <span className="text-xl">🏎️</span>
        <span className="text-sm font-bold hidden sm:block">Play Game</span>
      </motion.button>

      {/* Game popup */}
      <AnimatePresence>
        {showGame && <CarRacingGame onClose={() => setShowGame(false)} />}
      </AnimatePresence>
    </>
  );
}
