"use client";

import { motion } from "framer-motion";

const STEPS = [
  "Business",
  "Hours",
  "Greeting",
  "Calendar",
  "Go live",
] as const;

export function OnboardingProgress({ step }: { step: number }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>
          Step {step + 1} of {STEPS.length}
        </span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-3 hidden gap-2 sm:flex">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={`text-xs ${i <= step ? "font-medium text-violet-400" : "text-muted"}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
