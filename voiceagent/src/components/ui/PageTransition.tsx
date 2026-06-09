"use client";

/**
 * No opacity animation — content must be visible on first paint (Comet, no-JS, slow hydration).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div data-motion-root>{children}</div>;
}
