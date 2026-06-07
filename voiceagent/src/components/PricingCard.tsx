import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { estimatedMonthly, PLANS, type PlanKey } from "@/lib/plans";

const EXAMPLE_MINUTES = 500;

export function PricingCard({ planKey, highlighted = false }: { planKey: PlanKey; highlighted?: boolean }) {
  const plan = PLANS[planKey];
  const estimate = estimatedMonthly(planKey, EXAMPLE_MINUTES);
  const isEnterprise = planKey === "enterprise";

  const cta = isEnterprise ? (
    <Link href="/help?intent=enterprise" className="btn-secondary block w-full rounded-xl py-4 text-center font-bold">
      Contact Sales
    </Link>
  ) : (
    <Link
      href={`/signup?plan=${planKey}`}
      className={`block w-full rounded-xl py-4 text-center font-bold transition-all ${
        highlighted
          ? "bg-gradient-to-r from-violet-500 to-electric-cyan text-ghost-white shadow-[0_0_24px_rgba(34,211,238,0.3)] hover:shadow-[0_0_32px_rgba(34,211,238,0.45)]"
          : "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
      }`}
    >
      Start free trial
    </Link>
  );

  if (isEnterprise) {
    return (
      <div className="glow-border flex h-full flex-col rounded-3xl bg-gradient-to-br from-surface-container to-brand-900 p-8 text-on-surface transition-all hover:shadow-[0_0_32px_rgba(167,139,250,0.15)]">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-ghost-white">{plan.name}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-ghost-white">{`$${plan.monthlyPrice}`}</span>
            <span className="text-on-surface-variant">/mo</span>
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">{`+ $${plan.perMinute}/min voice usage`}</p>
        </div>
        <ul className="mb-10 flex-grow space-y-4 text-sm">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2 text-on-surface-variant">
              <MaterialIcon name="verified" className="shrink-0 text-primary text-[20px]" />
              {f}
            </li>
          ))}
        </ul>
        {cta}
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all ${
        highlighted
          ? "z-10 scale-105 border-primary/40 bg-surface-container shadow-[0_0_32px_rgba(79,219,200,0.15)]"
          : "border-glass-border-subtle bg-surface-container/60 hover:border-primary/25"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-electric-cyan px-4 py-1 text-xs font-bold text-ghost-white">
          MOST POPULAR
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-ghost-white">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-ghost-white">{`$${plan.monthlyPrice}`}</span>
          <span className="text-on-surface-variant">/mo</span>
        </div>
        <p className="mt-2 text-xs text-on-surface-variant">{`+ $${plan.perMinute}/min voice usage`}</p>
        <p className="mt-2 text-xs text-slate-text">
          ~{EXAMPLE_MINUTES} min/mo ≈ <strong className="text-on-surface">${estimate}/mo</strong> all-in
        </p>
      </div>
      <ul className="mb-10 flex-grow space-y-4 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2 text-on-surface-variant">
            <MaterialIcon name="check" className="text-[20px] text-primary" />
            {f}
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}
