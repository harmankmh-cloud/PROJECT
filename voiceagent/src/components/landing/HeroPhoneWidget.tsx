"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export function HeroPhoneWidget() {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:mx-0">
      <motion.div
        className="absolute inset-0 rounded-full bg-violet-600/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-teal-500/30"
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-[0_0_48px_rgba(124,58,237,0.2)] backdrop-blur-sm"
      >
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Incoming call</span>
          <span className="flex items-center gap-1.5 text-teal-400">
            <span className="pulse-dot bg-teal-400" />
            Live
          </span>
        </div>
        <p className="mt-4 font-display text-2xl text-text">Sarah M.</p>
        <p className="mt-1 text-sm text-muted">Booking a Thursday appointment</p>
        <div className="mt-6 flex items-end justify-center gap-1" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-teal-400/80"
              animate={{ height: ["20%", "90%", "35%", "70%", "20%"] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.07 }}
              style={{ height: "40%" }}
            />
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-bg/60 p-3 text-xs leading-relaxed text-muted">
          <p className="text-teal-400">GreetQ</p>
          <p className="mt-1 text-text">
            Hi Sarah! I can book you for Thursday — 2 PM or 4:30 PM works. Which do you prefer?
          </p>
        </div>
        <div className="mt-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 shadow-[0_0_24px_rgba(124,58,237,0.5)]">
            <Phone className="h-6 w-6 text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
