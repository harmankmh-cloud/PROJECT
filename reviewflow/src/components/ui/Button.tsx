"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "secondary";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-light shadow-sm hover:shadow-md",
  ghost: "bg-transparent text-text hover:bg-surface",
  outline: "border border-border bg-white text-text hover:border-primary/40",
  secondary: "border border-border bg-surface text-text hover:bg-white",
};

type ButtonProps = {
  variant?: Variant;
  loading?: boolean;
  pill?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function Button({
  variant = "primary",
  loading,
  pill,
  className = "",
  children,
  disabled,
  type = "button",
  onClick,
}: ButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const classNames = cn(
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60",
    pill ? "rounded-full" : "rounded-xl",
    variants[variant],
    className
  );

  const content = loading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span className="sr-only">Loading</span>
    </>
  ) : (
    children
  );

  if (!mounted) {
    return (
      <button type={type} className={classNames} disabled={disabled || loading} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
    >
      {content}
    </motion.button>
  );
}
