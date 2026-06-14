import { Shield, Lock, FileCheck, Globe2 } from "lucide-react";

const BADGES = [
  { icon: Shield, label: "PIPEDA-aware", detail: "Canadian privacy controls" },
  { icon: FileCheck, label: "CASL tooling", detail: "Consent & quiet hours" },
  { icon: Lock, label: "HIPAA-ready", detail: "Enterprise + BAA" },
  { icon: Globe2, label: "GDPR-ready controls", detail: "Export & deletion" },
  { icon: Shield, label: "SOC 2 aligned", detail: "Controls in progress" },
] as const;

export function ComplianceBadgeStrip() {
  return (
    <section className="border-b border-border bg-surface/20 py-8" aria-label="Compliance">
      <div className="marketing-container">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted">
          Security & compliance
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-surface/40 px-3 py-2"
              title={badge.detail}
            >
              <badge.icon className="h-4 w-4 text-primary-glow" />
              <span className="text-sm text-text">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
