import { Check } from "lucide-react";

const BADGES = [
  "PIPEDA-aware",
  "Made in BC",
  "Setup in 10 minutes",
  "No credit card required",
  "14-day free trial",
] as const;

export function TrustBadgeStrip() {
  return (
    <section className="border-b border-border bg-surface/30 py-6">
      <div className="marketing-container">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {BADGES.map((badge) => (
            <span key={badge} className="flex items-center gap-2 text-sm text-muted">
              <Check className="h-4 w-4 text-success" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
