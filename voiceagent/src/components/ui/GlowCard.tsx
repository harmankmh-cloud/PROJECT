"use client";

import { motion } from "framer-motion";
import { cardHover, cardTap } from "@/lib/motion";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article";
};

export function GlowCard({ children, className = "", as = "div" }: GlowCardProps) {
  const Component = motion[as];
  return (
    <Component
      className={`card-glow-hover rounded-xl border border-border bg-surface p-6 ${className}`}
      whileHover={cardHover}
      whileTap={cardTap}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {children}
    </Component>
  );
}
