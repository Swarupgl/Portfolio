"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RotatingBanner() {
  const roles = ["AI Researcher", "IoT Engineer", "Systems Architect"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold tracking-wide text-cyan-100 backdrop-blur-sm mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)] w-[180px] sm:w-[220px] h-9 sm:h-10 relative overflow-hidden">
      <span className="absolute left-4 sm:left-6 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <div className="ml-5 relative w-full h-full flex items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 whitespace-nowrap"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
