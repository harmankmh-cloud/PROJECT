import Link from "next/link";
import { LISTING_PLANS } from "@/lib/constants";

export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {LISTING_PLANS.map((plan) => (
        <div
          key={plan.id}
          className={
            plan.highlight
              ? "pricing-card-highlight relative overflow-hidden"
              : "surface-card relative overflow-hidden p-6 sm:p-8"
          }
        >
          {plan.highlight && (
            <span className="absolute right-4 top-4 rounded-full bg-accent-600 px-3 py-1 text-[10px] font-bold uppercase text-white">
              Most popular
            </span>
          )}
          <p className="section-eyebrow">{plan.name}</p>
          <p className="font-display mt-2 text-4xl text-brand-950">{plan.priceLabel}</p>
          <p className="mt-1 text-sm text-slate-500">{plan.setupLabel} · {plan.monthlyLabel}</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-accent-600">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/join?plan=${plan.id}`}
            className={`mt-8 block w-full py-3.5 text-center ${plan.highlight ? "btn-gold" : "btn-ghost"}`}
          >
            Choose {plan.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
