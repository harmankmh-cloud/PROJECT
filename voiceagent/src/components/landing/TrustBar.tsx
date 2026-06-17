import Link from "next/link";
import { Activity, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { getTrustBadges, type MarketingLocale } from "@/lib/marketing-chrome";

const TRUST_ICONS = [ShieldCheck, Leaf, MapPin, Activity] as const;

/** Global trust signals — rendered inside the footer so every public page carries them. */
export function TrustBar({ locale = "en" }: { locale?: MarketingLocale }) {
  const badges = getTrustBadges(locale);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-b border-border/60 pb-8">
      {badges.map((badge, i) => {
        const Icon = TRUST_ICONS[i];
        return (
          <Link
            key={badge.label}
            href={badge.href}
            className="flex items-center gap-2 text-sm text-muted transition hover:text-text"
          >
            <Icon className={`h-4 w-4 ${i < 2 ? "text-success" : "text-violet-400"}`} />
            {badge.label}
          </Link>
        );
      })}
    </div>
  );
}
