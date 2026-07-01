"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CalendarCheck2, Droplets, Home, Paintbrush, Snowflake, Wrench, Zap } from "lucide-react";

const ICONS = [
  { Icon: Wrench, color: "text-amber-300", delay: 0, x: -98, y: -72 },
  { Icon: Zap, color: "text-sky-300", delay: 0.15, x: 108, y: -64 },
  { Icon: Droplets, color: "text-blue-200", delay: 0.3, x: -88, y: 86 },
  { Icon: Paintbrush, color: "text-rose-300", delay: 0.45, x: 96, y: 80 },
  { Icon: Snowflake, color: "text-cyan-200", delay: 0.6, x: 0, y: -102 },
] as const;

export function HeroIllustration() {
  return (
    <div className="relative mx-auto flex h-[360px] w-full max-w-xl items-center justify-center sm:h-[420px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/25 via-sky-300/20 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="relative flex h-44 w-56 flex-col items-center justify-end rounded-t-3xl border-2 border-amber-200/50 bg-gradient-to-b from-amber-100/80 to-amber-200/55 shadow-[0_20px_65px_-20px_rgba(15,23,42,0.6)] sm:h-52 sm:w-64">
          <div className="absolute -top-14 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[92px] border-r-[92px] border-b-[70px] border-l-transparent border-r-transparent border-b-amber-200/65 sm:border-l-[108px] sm:border-r-[108px] sm:border-b-[82px]" />
          <div className="mb-4 flex gap-3">
            <div className="h-8 w-8 rounded-lg border border-amber-300/60 bg-sky-200/80" />
            <div className="h-8 w-8 rounded-lg border border-amber-300/60 bg-amber-100/90" />
          </div>
          <div className="mb-6 h-14 w-20 rounded-t-xl border-2 border-amber-300/70 bg-amber-50/85" />
        </div>
        <div className="absolute -bottom-2 left-1/2 h-4 w-64 -translate-x-1/2 rounded-full bg-black/30 blur-md" />
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
          className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-xl backdrop-blur ${color}`}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      ))}

      <motion.div
        animate={{ rotate: [0, 4, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-7 hidden rounded-full border border-white/20 bg-white/10 p-2.5 shadow-md backdrop-blur sm:flex"
      >
        <Home className="h-4 w-4 text-amber-200" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="absolute bottom-8 left-4 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs text-slate-100 shadow-lg backdrop-blur"
      >
        <p className="flex items-center gap-1.5 font-semibold text-white">
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
          Profile quality checked
        </p>
        <p className="mt-1 text-slate-300">Better details before you contact.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.45 }}
        className="absolute right-2 top-8 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs text-slate-100 shadow-lg backdrop-blur"
      >
        <p className="flex items-center gap-1.5 font-semibold text-white">
          <CalendarCheck2 className="h-3.5 w-3.5 text-amber-300" />
          Faster homeowner flow
        </p>
        <p className="mt-1 text-slate-300">Search, compare, and move quickly.</p>
      </motion.div>
    </div>
  );
}
