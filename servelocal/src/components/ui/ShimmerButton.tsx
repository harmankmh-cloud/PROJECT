"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { tapScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ShimmerButtonProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const baseClass = cn(
  "btn-shimmer relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold text-white",
  "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-[length:200%_100%]",
  "shadow-[0_4px_24px_-4px_rgba(245,158,11,0.5)]",
  "transition-all duration-300 hover:bg-right hover:shadow-[0_8px_32px_-4px_rgba(245,158,11,0.6)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-60"
);

export function ShimmerButton({
  className,
  children,
  size = "md",
  href,
  type = "button",
  disabled,
  onClick,
}: ShimmerButtonProps) {
  const classes = cn(baseClass, sizes[size], className);

  if (href) {
    return (
      <motion.div whileTap={tapScale} className={cn("inline-flex", className)}>
        <Link href={href} onClick={onClick} className={classes}>
          <span className="relative z-10">{children}</span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : tapScale}
      className={classes}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
