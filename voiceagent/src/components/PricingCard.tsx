import Link from "next/link";
import { estimatedMonthly, PLANS, type PlanKey } from "@/lib/plans";

const EXAMPLE_MINUTES = 500;

export function PricingCard({ planKey }: { planKey: PlanKey }) {
  const plan = PLANS[planKey];
  const estimate = estimatedMonthly(planKey, EXAMPLE_MINUTES);

  const cta =
    planKey === "enterprise" ? (
      <Link href="/help?intent=enterprise" className="btn-secondary mt-6 w-full text-center">
        Contact sales
      </Link>
    ) : (
      <Link href={`/signup?plan=${planKey}`} className="btn-primary mt-6 w-full text-center">
        Start free trial
      </Link>
    );

  return (
    <div className="surface-card flex h-full flex-col p-6">
      <h3 className="text-lg font-bold text-brand-900">{plan.name}</h3>
      <p className="mt-2 text-3xl font-bold text-brand-900">
        <span>{`$${plan.monthlyPrice}`}</span>
        <span className="text-sm font-normal text-slate-500">/mo</span>
      </p>
      <p className="text-sm text-slate-500">{`+ $${plan.perMinute}/min voice usage`}</p>
      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        Example: ~{EXAMPLE_MINUTES} min/mo ≈ <strong>${estimate}/mo</strong> all-in
      </p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
        {plan.features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      {cta}
    </div>
  );
}
