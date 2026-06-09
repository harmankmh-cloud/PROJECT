"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cardTap } from "@/lib/motion";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-violet-600 text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]",
  ghost: "border border-border/80 bg-white/5 text-text hover:border-violet-500/40 hover:bg-white/10",
  outline: "border border-violet-500/30 bg-transparent text-text hover:bg-violet-500/10",
};

type GlowButtonProps = {
  variant?: Variant;
  href?: string;
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:opacity-60";

export function GlowButton({
  variant = "primary",
  href,
  className = "",
  children,
  loading,
  type = "button",
  onClick,
  disabled,
}: GlowButtonProps) {
  const classes = `${base} ${styles[variant]} ${className}`;
  const content = loading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span className="sr-only">Loading</span>
    </>
  ) : (
    children
  );

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: cardTap,
    className: classes,
  };

  if (href) {
    return (
      <motion.span whileHover={{ scale: 1.02 }} whileTap={cardTap} className="inline-flex">
        <Link href={href} className={classes}>
          {content}
          {variant === "primary" ? <span className="btn-shimmer pointer-events-none" aria-hidden /> : null}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={cardTap}
      className={classes}
    >
      {content}
      {variant === "primary" ? <span className="btn-shimmer pointer-events-none" aria-hidden /> : null}
    </motion.button>
  );
}
