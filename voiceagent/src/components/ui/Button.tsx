"use client";

import { Loader2 } from "lucide-react";

type Variant = "primary" | "ghost" | "outline" | "secondary";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] focus-visible:ring-primary/50",
  ghost: "bg-transparent text-text hover:bg-white/5 focus-visible:ring-white/20",
  outline:
    "border border-border bg-transparent text-text hover:border-primary/40 hover:bg-white/5 focus-visible:ring-primary/30",
  secondary:
    "border border-white/10 bg-white/5 text-text hover:bg-white/10 focus-visible:ring-white/20",
};

type ButtonProps = {
  variant?: Variant;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.97] hover:scale-[1.02]";

export function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  disabled,
  type = "button",
  onClick,
}: ButtonProps) {
  const classNames = `${baseClass} ${variants[variant]} ${className}`;
  const content = loading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span className="sr-only">Loading</span>
    </>
  ) : (
    children
  );

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
