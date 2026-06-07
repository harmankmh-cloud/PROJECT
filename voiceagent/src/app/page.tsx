import Link from "next/link";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { PricingCard } from "@/components/PricingCard";
import type { PlanKey } from "@/lib/plans";

const PLAN_KEYS: PlanKey[] = ["starter", "pro", "enterprise"];

export default function HomePage() {
  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <MarketingHeader />

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl tracking-tight text-brand-900 md:text-5xl">
          AI phone agents that never miss a call
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Answer inbound calls, book appointments, update your CRM, and warm-transfer to humans — with
          enterprise compliance built in.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/signup" className="btn-primary px-6 py-3">
            Get started
          </Link>
          <Link href="#pricing" className="btn-secondary px-6 py-3">
            View pricing
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">TCPA-ready · HIPAA available on Enterprise</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Inbound AI receptionist", desc: "Answer FAQs, route calls, book appointments 24/7." },
            { title: "Warm transfer", desc: "Hand off to humans with full transcript and context." },
            { title: "Enterprise compliance", desc: "TCPA, HIPAA-ready, SOC 2 prep, audit logs." },
          ].map((f) => (
            <div key={f.title} className="surface-card p-6">
              <h3 className="font-semibold text-brand-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-brand-900">Pricing</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
          Monthly subscription plus metered voice minutes. See estimated totals below.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PLAN_KEYS.map((key) => (
            <PricingCard key={key} planKey={key} />
          ))}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
