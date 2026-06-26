"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Design-token styled tooltip content (surface-elevated, border, rounded-lg,
 * shadow-lg). Pair with TooltipProvider/TooltipRoot/TooltipTrigger.
 */
export function TooltipContent({
  children,
  className,
  sideOffset = 6,
}: {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-text-primary shadow-lg",
          "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
          className
        )}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-[var(--surface-elevated)]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/**
 * Convenience wrapper: a tooltip with a 300ms open delay (per design brief).
 */
export function Tooltip({
  content,
  children,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className}>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
