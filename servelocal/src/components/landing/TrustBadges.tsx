import { BadgeCheck, Shield, Star } from "lucide-react";
import { FadeUp } from "@/components/motion/FadeUp";

const BADGES = [
  { icon: BadgeCheck, label: "Profile details reviewed" },
  { icon: Shield, label: "Insurance status shown" },
  { icon: Star, label: "Real homeowner feedback" },
] as const;

export function TrustBadges() {
  return (
    <FadeUp className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm"
        >
          <Icon className="h-4 w-4 text-primary" />
          {label}
          <span className="text-success">✓</span>
        </div>
      ))}
    </FadeUp>
  );
}
