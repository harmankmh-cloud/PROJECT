import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/plans";
import { TRIAL_MARKETING } from "@/lib/trial";

const DISPLAY_PLANS: { key: PlanKey; tagline: string; popular?: boolean }[] = [
  { key: "starter", tagline: "Perfect for solo shops" },
  { key: "growth", tagline: "Best for growing businesses", popular: true },
  { key: "pro", tagline: "For multi-location teams" },
];

/** Server-rendered pricing for crawlers and no-JS users. */
export function PricingTableStatic() {
  return (
    <section className="py-16 md:py-24">
      <div className="marketing-container">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl text-text md:text-4xl">Simple, honest pricing</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Flat monthly with minutes included. Cheaper than a part-time receptionist — and yours never
            calls in sick.
          </p>
        </div>

        <div className="mb-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">GreetQ monthly pricing plans in CAD</caption>
            <thead>
              <tr className="border-b border-border bg-surface">
                <th scope="col" className="p-4 font-medium text-muted">
                  Plan
                </th>
                <th scope="col" className="p-4 font-medium text-muted">
                  Monthly price (CAD)
                </th>
                <th scope="col" className="p-4 font-medium text-muted">
                  Included minutes
                </th>
                <th scope="col" className="p-4 font-medium text-muted">
                  Overage
                </th>
              </tr>
            </thead>
            <tbody>
              {DISPLAY_PLANS.map(({ key }) => {
                const plan = PLANS[key];
                return (
                  <tr key={key} className="border-b border-border/50">
                    <td className="p-4 font-medium text-text">{plan.name}</td>
                    <td className="p-4 text-text">${plan.monthlyPrice}/mo</td>
                    <td className="p-4 text-muted">{plan.includedMinutes.toLocaleString()} min</td>
                    <td className="p-4 text-muted">${plan.perMinute}/min</td>
                  </tr>
                );
              })}
              <tr>
                <td className="p-4 font-medium text-text">Enterprise</td>
                <td className="p-4 text-muted" colSpan={3}>
                  Custom pricing — SSO, HIPAA, dedicated onboarding
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DISPLAY_PLANS.map(({ key, tagline, popular }) => {
            const plan = PLANS[key];
            return (
              <article
                key={key}
                className={`card-glow relative rounded-xl border border-border p-6 ${popular ? "ring-2 ring-violet-500/50" : ""}`}
              >
                {popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                ) : null}
                <p className="text-sm font-semibold text-violet-400">{plan.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-text">${plan.monthlyPrice}</span>
                  <span className="text-muted">/mo</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {plan.includedMinutes.toLocaleString()} min included · then ${plan.perMinute}/min
                </p>
                <p className="mt-3 text-sm text-muted">{tagline}</p>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  {plan.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="h-4 w-4 shrink-0 text-teal-400" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${key}`}
                  className="btn-primary mt-8 flex w-full justify-center rounded-full px-5 py-2.5 text-sm font-semibold"
                >
                  {TRIAL_MARKETING.cta}
                </Link>
              </article>
            );
          })}
        </div>

        <div className="card-glow mx-auto mt-10 max-w-xl rounded-xl border border-border p-6 text-center">
          <p className="font-display text-lg text-text">Enterprise</p>
          <p className="mt-2 text-sm text-muted">
            Unlimited scale, SSO, HIPAA mode, dedicated onboarding, and custom SLAs.
          </p>
          <Link href="/help?intent=enterprise" className="mt-4 inline-block text-sm font-semibold text-violet-400">
            Contact sales →
          </Link>
        </div>
      </div>
    </section>
  );
}
