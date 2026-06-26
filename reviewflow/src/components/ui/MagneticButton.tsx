"use client";

/**
 * MagneticButton — a primary CTA that gently follows the cursor (a "magnetic"
 * pull) and renders as a gold gradient pill. Falls back to a static button when
 * prefers-reduced-motion is set. Works as a link (href) or a button (onClick).
 */

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** How strongly the button is pulled toward the cursor (px at edge). */
  strength?: number;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 18,
  type = "button",
  ...rest
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "rl-btn-gold inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm md:text-base",
    "transition-transform will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
    className,
  );

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={classes}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}

export default MagneticButton;
