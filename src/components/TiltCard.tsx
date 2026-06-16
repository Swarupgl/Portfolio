"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef } from "react";

export default function TiltCard({
  children,
  maxTilt = 10,
}: {
  children: React.ReactNode;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);

  const transform = useMotionTemplate`perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  return (
    <motion.div
      ref={ref}
      style={{ transform }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const tiltY = (px - 0.5) * (maxTilt * 2);
        const tiltX = -(py - 0.5) * (maxTilt * 2);
        rotX.set(tiltX);
        rotY.set(tiltY);
      }}
      onPointerLeave={() => {
        rotX.set(0);
        rotY.set(0);
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
