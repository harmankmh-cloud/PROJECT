import Link from "next/link";
import { LISTING_PLANS } from "@/lib/constants";
import { SERVELOCAL_PRICING } from "@/lib/pricing";

export function PricingCards() {
  return (
    <div>
      <p className="mb-6 text-center text-sm text-slate-600">
        Thumbtack: {SERVELOCAL_PRICING.competitors.thumbtackLead}. HomeStars:{" "}
        {SERVELOCAL_PRICING.competitors.homeStars}. ServeLocal: one flat fee, your phone on your profile.
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        {LISTING_PLANS.map((plan) => {
          const waitlist = "waitlistOnly" in plan && plan.waitlistOnly;
          const strike = "strikePrice" in plan ? plan.strikePrice : null;
          return (
            <div
              key={plan.id}
              className={
                plan.highlight
                  ? "pricing-card-highlight relative overflow-hidden"
                  : "surface-card relative overflow-hidden p-6 sm:p-8"
              }
            >
              {plan.highlight && (
                <span className="absolute right-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase text-brand-950">
                  Founding Pro
                </span>
              )}
              {waitlist && (
                <span className="absolute right-4 top-4 rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] font-bold uppercase text-slate-600">
                  Waitlist
                </span>
              )}
              <p className="section-eyebrow">{plan.name}</p>
              <p className="font-display mt-2 text-4xl text-brand-950">
                {plan.priceLabel}
                {strike && (
                  <span className="ml-2 text-lg font-normal text-slate-400 line-through">{strike}</span>
                )}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {plan.setupLabel} · {plan.monthlyLabel}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-teal-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={waitlist ? "/join?plan=featured" : `/join?plan=${plan.id}`}
                className={`mt-8 block w-full py-3.5 text-center ${plan.highlight ? "btn-gold" : "btn-ghost"}`}
              >
                {waitlist ? "Start with Featured Pro" : `Choose ${plan.name}`}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
