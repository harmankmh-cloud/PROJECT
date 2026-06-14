"use client";

import { motion } from "framer-motion";

const PIECES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  delay: (i % 8) * 0.05,
  color: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#0d9488" : "#a78bfa",
}));

export function OnboardingConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PIECES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 h-2 w-2 rounded-sm"
          style={{ left: p.left, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: 400, opacity: 0, rotate: 360 }}
          transition={{ duration: 2.5, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
