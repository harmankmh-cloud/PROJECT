/**
 * GlassCard — the glassmorphism surface from the design system:
 * bg rgba(22,20,46,.55) + backdrop-blur(16px) + 1px border rgba(255,255,255,.12),
 * 20px radius. The `.rl-glass` recipe lives in globals.css.
 */

import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  /** Adds a soft gold glow on hover. */
  glow?: boolean;
};

export function GlassCard({ children, className, glow = false, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rl-glass p-6 sm:p-8",
        glow && "transition-shadow duration-300 hover:shadow-[0_24px_60px_-20px_rgba(255,194,75,0.35)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default GlassCard;
