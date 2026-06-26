"use client";

/**
 * Reveal — a Framer Motion wrapper that slides its children up and fades them
 * in as they scroll into view. Honours prefers-reduced-motion (renders static).
 *
 * Use for headings and sections across the redesigned site:
 *   <Reveal><h2>…</h2></Reveal>
 *   <Reveal delay={0.1} as="section">…</Reveal>
 */

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds to delay the animation (useful for staggering). */
  delay?: number;
  /** Pixels to translate up from. Defaults to 24. */
  y?: number;
  /** Animate only the first time it enters the viewport. Defaults to true. */
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
