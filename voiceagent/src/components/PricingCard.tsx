import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { estimatedMonthly, PLANS, type PlanKey } from "@/lib/plans";

const EXAMPLE_MINUTES = 500;

export function PricingCard({ planKey, highlighted = false }: { planKey: PlanKey; highlighted?: boolean }) {
  const plan = PLANS[planKey];
  const estimate = estimatedMonthly(planKey, EXAMPLE_MINUTES);
  const isEnterprise = planKey === "enterprise";

  const cta = isEnterprise ? (
    <Link
      href="/help?intent=enterprise"
      className="block w-full rounded-xl bg-white py-4 text-center font-bold text-on-surface transition-all hover:bg-surface-container-high"
    >
      Contact Sales
    </Link>
  ) : (
    <Link
      href={`/signup?plan=${planKey}`}
      className={`block w-full rounded-xl py-4 text-center font-bold transition-all ${
        highlighted
          ? "bg-electric-blue text-white shadow-lg hover:bg-blue-600"
          : "border border-on-surface text-on-surface hover:bg-on-surface hover:text-white"
      }`}
    >
      Start free trial
    </Link>
  );

  if (isEnterprise) {
    return (
      <div className="flex h-full flex-col rounded-3xl bg-primary-container p-8 text-white transition-all hover:shadow-xl">
        <div className="mb-8">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold">{`$${plan.monthlyPrice}`}</span>
            <span className="text-on-primary-container">/mo</span>
          </div>
          <p className="mt-2 text-xs text-on-primary-container">{`+ $${plan.perMinute}/min voice usage`}</p>
        </div>
        <ul className="mb-10 flex-grow space-y-4 text-sm">
          {plan.features.slice(0, 3).map((f) => (
            <li key={f} className="flex gap-2">
              <MaterialIcon name="verified" className="text-tertiary-fixed text-[20px]" />
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
      className={`relative flex h-full flex-col rounded-3xl border bg-white p-8 transition-all hover:shadow-lg ${
        highlighted ? "z-10 scale-105 border-2 border-electric-blue shadow-xl" : "border-outline-variant/20"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-electric-blue px-4 py-1 text-xs font-bold text-white">
          MOST POPULAR
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-on-surface">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{`$${plan.monthlyPrice}`}</span>
          <span className="text-slate-text">/mo</span>
        </div>
        <p className="mt-2 text-xs text-slate-text">{`+ $${plan.perMinute}/min voice usage`}</p>
        <p className="mt-2 text-xs text-slate-500">
          ~{EXAMPLE_MINUTES} min/mo ≈ <strong>${estimate}/mo</strong> all-in
        </p>
      </div>
      <ul className="mb-10 flex-grow space-y-4 text-sm">
        {plan.features.map((f) => (
          <li key={f} className={`flex gap-2 ${highlighted ? "text-on-surface" : "text-slate-text"}`}>
            <MaterialIcon name="check" className="text-[20px] text-electric-blue" />
            {f}
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}
