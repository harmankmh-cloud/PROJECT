import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { PLANS } from "@/lib/plans";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-xl font-bold text-brand-900">{BRAND.name}</p>
          <div className="flex gap-3">
            <Link href="/login" className="btn-secondary">Log in</Link>
            <Link href="/signup" className="btn-primary">Start free trial</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 md:text-5xl">
          AI phone agents that never miss a call
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Answer inbound calls, book appointments, update your CRM, and warm-transfer to humans — with enterprise compliance built in.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/signup" className="btn-primary px-6 py-3">Get started</Link>
          <Link href="#pricing" className="btn-secondary px-6 py-3">View pricing</Link>
        </div>
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
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div key={key} className="surface-card p-6">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold">${plan.monthlyPrice}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-500">+ ${plan.perMinute}/min</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
