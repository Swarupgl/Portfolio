"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function TypingEffect({
  text,
  speedMs = 32,
}: {
  text: string;
  speedMs?: number;
}) {
  const [count, setCount] = useState(0);

  const safeText = useMemo(() => text ?? "", [text]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= safeText.length) return c;
        return c + 1;
      });
    }, speedMs);
    return () => window.clearInterval(id);
  }, [safeText, speedMs]);

  const shown = safeText.slice(0, count);
  const done = count >= safeText.length;

  return (
    <div className="flex items-center gap-2 text-sm text-slate-200 sm:text-base">
      <span className="font-mono tracking-tight">{shown}</span>
      <motion.span
        aria-hidden="true"
        className="h-5 w-px bg-slate-200/70"
        animate={{ opacity: done ? [1, 0.25, 1] : [1, 0.4, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
