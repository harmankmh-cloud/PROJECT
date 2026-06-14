"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ReputationGauge({ score = 87 }: { score?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="-rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-border)" strokeWidth="10" />
        {mounted && (
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-text">{score}</span>
        <span className="text-xs text-muted">/ 100</span>
      </div>
    </div>
  );
}
