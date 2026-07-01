import { BadgeCheck, Shield, Star } from "lucide-react";
import { FadeUp } from "@/components/motion/FadeUp";
import { cn } from "@/lib/utils";

const BADGES = [
  { icon: BadgeCheck, label: "Profile details reviewed" },
  { icon: Shield, label: "Insurance status shown" },
  { icon: Star, label: "Real homeowner feedback" },
] as const;

export function TrustBadges({ dark = false }: { dark?: boolean }) {
  return (
    <FadeUp className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm",
            dark
              ? "border border-white/20 bg-white/10 text-slate-100"
              : "border border-border bg-surface text-foreground"
          )}
        >
          <Icon className={cn("h-4 w-4", dark ? "text-amber-300" : "text-primary")} />
          {label}
          <span className={dark ? "text-emerald-300" : "text-success"}>✓</span>
        </div>
      ))}
    </FadeUp>
  );
}
