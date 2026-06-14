import { Check } from "lucide-react";
import { TRIAL_MARKETING } from "@/lib/trial";
import { LanguagePills } from "./LanguagePills";
import { ReviewBadges } from "./ReviewBadges";

const BADGES = [
  "PIPEDA-aware",
  "Made in BC",
  TRIAL_MARKETING.exploreShort,
  "No card to explore",
  TRIAL_MARKETING.goLiveShort,
] as const;

export function TrustBadgeStrip() {
  return (
    <section className="border-b border-border bg-surface/30 py-6">
      <div className="marketing-container space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {BADGES.map((badge) => (
            <span key={badge} className="flex items-center gap-2 text-sm text-muted">
              <Check className="h-4 w-4 text-success" />
              {badge}
            </span>
          ))}
        </div>
        <LanguagePills />
        <ReviewBadges />
      </div>
    </section>
  );
}
