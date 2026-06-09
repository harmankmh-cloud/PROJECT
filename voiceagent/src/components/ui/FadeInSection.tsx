"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FadeInSection({
  children,
  className = "",
  delay = 0,
  /** When true, animates on mount instead of waiting for scroll into view (hero content). */
  onMount = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onMount?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (onMount) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
