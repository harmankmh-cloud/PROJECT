import Link from "next/link";
import { LISTING_PLANS } from "@/lib/constants";
import { benefitActiveForProvider, lockedBenefitsForTier, PLAN_BENEFITS } from "@/lib/plan-benefits";
import { UpgradeCheckoutButton } from "@/components/UpgradeCheckoutButton";
import { FOUNDING_PRO } from "@/lib/tradie-program";
import type { ServiceProvider } from "@/lib/types";
import { isFeaturedTier } from "@/lib/schemas/db/normalize";

export function ProPlanStatus({ listing }: { listing: ServiceProvider }) {
  const tier = listing.listing_tier ?? "free";
  const plan = LISTING_PLANS.find((p) => p.id === tier);
  const isPaid = isFeaturedTier(tier) || listing.featured;
  const locked = lockedBenefitsForTier(tier === "premium" ? "free" : tier);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-label text-muted">Your plan</p>
          <p className="font-display text-xl font-bold text-foreground">{plan?.name ?? "Starter"}</p>
          <p className="mt-1 text-sm text-muted">{plan?.monthlyLabel}</p>
        </div>
        {!isPaid && listing.status === "approved" && (
          <div className="min-w-[200px]">
            <UpgradeCheckoutButton plan="featured" label={`Upgrade — ${FOUNDING_PRO.featuredPrice}`} />
          </div>
        )}
        {isPaid && (
          <Link
            href="/dashboard/pro/subscription"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Manage billing →
          </Link>
        )}
      </div>

      <ul className="mt-5 space-y-2 text-sm">
        {PLAN_BENEFITS.map((benefit) => {
          const active = benefitActiveForProvider(benefit.id, listing);
          const on = active === true;
          const partial = active === "partial";
          return (
            <li key={benefit.id} className="flex items-start gap-2">
              <span className={on ? "text-success" : partial ? "text-amber-500" : "text-muted"}>
                {on ? "✓" : partial ? "◐" : "○"}
              </span>
              <span className={on || partial ? "text-foreground" : "text-muted"}>{benefit.label}</span>
            </li>
          );
        })}
      </ul>

      {!isPaid && locked.length > 0 && (
        <p className="mt-4 text-xs text-muted">
          ◐ = preview only · Upgrade to Featured to unlock homeowner contact and top placement.
        </p>
      )}
    </div>
  );
}
