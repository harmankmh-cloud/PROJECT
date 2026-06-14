"use client";

import { motion } from "framer-motion";
import { cardHover, tapScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "li";
  onClick?: () => void;
};

export function Card({ children, className, hover = true, as = "div", onClick }: CardProps) {
  const Component = motion[as];

  return (
    <Component
      whileHover={hover ? cardHover : undefined}
      whileTap={onClick ? tapScale : undefined}
      onClick={onClick}
      className={cn(
        "rounded-[14px] border border-border bg-surface p-6 shadow-[0_2px_12px_-4px_rgba(15,15,15,0.08)] transition-colors",
        "dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.4)]",
        hover && "card-glow cursor-default",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Component>
  );
}
