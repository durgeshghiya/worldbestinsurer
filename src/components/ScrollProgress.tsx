"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
      springProgress.set(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [springProgress]);

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: springProgress }}
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 0.01 ? 1 : 0 }}
      transition={{ opacity: { duration: 0.2 } }}
    />
  );
}
