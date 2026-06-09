"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="card-glow-hover rounded-xl border border-border bg-surface p-5 shadow-[0_0_16px_rgba(124,58,237,0.06)]"
      whileHover={{ y: -2, boxShadow: "0 0 28px rgba(124,58,237,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-text">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </motion.div>
  );
}
