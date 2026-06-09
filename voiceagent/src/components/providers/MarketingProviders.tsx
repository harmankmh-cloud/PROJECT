"use client";

import { MotionConfig } from "framer-motion";

/** Lightweight motion shell for public marketing pages (no React Query). */
export function MarketingProviders({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
