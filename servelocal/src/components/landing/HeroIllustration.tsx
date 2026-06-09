"use client";

import { motion } from "framer-motion";
import { Droplets, Home, Paintbrush, Snowflake, Wrench, Zap } from "lucide-react";

const ICONS = [
  { Icon: Wrench, color: "text-amber-500", delay: 0, x: -80, y: -60 },
  { Icon: Zap, color: "text-sky-500", delay: 0.2, x: 90, y: -50 },
  { Icon: Droplets, color: "text-blue-500", delay: 0.4, x: -70, y: 70 },
  { Icon: Paintbrush, color: "text-rose-500", delay: 0.6, x: 85, y: 65 },
  { Icon: Snowflake, color: "text-cyan-400", delay: 0.8, x: 0, y: -90 },
] as const;

export function HeroIllustration() {
  return (
    <div className="relative mx-auto flex h-[320px] w-full max-w-md items-center justify-center sm:h-[380px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/10 via-sky-400/5 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="flex h-40 w-48 flex-col items-center justify-end rounded-t-3xl border-2 border-amber-400/30 bg-gradient-to-b from-amber-50 to-amber-100/50 shadow-xl dark:from-amber-950/40 dark:to-amber-900/20 sm:h-48 sm:w-56">
          <div className="absolute -top-12 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[80px] border-r-[80px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-400/40 sm:-top-14 sm:border-l-[96px] sm:border-r-[96px] sm:border-b-[72px]" />
          <div className="mb-4 flex gap-3">
            <div className="h-8 w-8 rounded-lg border border-amber-400/30 bg-sky-400/20" />
            <div className="h-8 w-8 rounded-lg border border-amber-400/30 bg-amber-400/20" />
          </div>
          <div className="mb-6 h-12 w-16 rounded-t-xl border-2 border-amber-400/40 bg-amber-200/30 dark:bg-amber-800/30" />
        </div>
        <div className="absolute -bottom-2 left-1/2 h-4 w-56 -translate-x-1/2 rounded-full bg-black/10 blur-md dark:bg-black/30" />
      </motion.div>

      {ICONS.map(({ Icon, color, delay, x, y }) => (
        <motion.div
          key={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [y, y - 8, y],
          }}
          transition={{
            opacity: { delay, duration: 0.4 },
            scale: { delay, type: "spring", stiffness: 300 },
            y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-surface shadow-lg ${color}`}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      ))}

      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-8 hidden rounded-full border border-border bg-surface p-2 shadow-md sm:flex"
      >
        <Home className="h-4 w-4 text-amber-500" />
      </motion.div>
    </div>
  );
}
