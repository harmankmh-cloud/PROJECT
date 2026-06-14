"use client";

import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "secondary" | "ghost-dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/25 hover:shadow-primary/35",
  ghost: "bg-transparent text-text hover:bg-surface border border-transparent",
  "ghost-dark": "bg-transparent text-slate-50 hover:bg-slate-800 border border-slate-700",
  outline: "border border-slate-700 bg-transparent text-slate-50 hover:border-primary/50 hover:bg-slate-800",
  secondary: "bg-secondary text-white hover:bg-blue-600",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  pill?: boolean;
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  loading,
  pill,
  className,
  children,
  disabled,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60",
        pill ? "rounded-full" : "rounded-xl",
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}
