"use client";

/**
 * Marketing sections must be visible without JS (Comet, crawlers, slow hydration).
 * Framer Motion opacity animations caused blank pages — this is a plain wrapper.
 */
export function FadeInSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onMount?: boolean;
}) {
  return <div className={className}>{children}</div>;
}
