import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { PricingCard } from "@/components/PricingCard";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";
import {
  FAQ_ITEMS,
  INTEGRATIONS,
  SETUP_STEPS,
  TESTIMONIALS,
  TRUST_STATS,
  USE_CASES,
} from "@/lib/marketing-content";
import type { PlanKey } from "@/lib/plans";

const PLAN_KEYS: PlanKey[] = ["starter", "pro", "enterprise"];

export const metadata: Metadata = {
  title: "AI phone agents that never miss a call",
  description:
    "Intellivo answers inbound calls, books appointments, syncs CRM, and warm-transfers to your team. Built for salons, clinics, and local service businesses.",
  alternates: { canonical: "/" },
  keywords: [
    "AI receptionist",
    "AI phone agent",
    "voice AI for small business",
    "appointment booking phone AI",
    "HIPAA phone agent",
    "HubSpot voice integration",
  ],
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `https://${BRAND.domain}`,
    description:
      "AI phone agents for local businesses with inbound answering, booking, CRM sync, and compliance tooling.",
    offers: {
      "@type": "Offer",
      price: "99",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />

      <main id="main-content">
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="page-eyebrow">Voice AI for local businesses</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-brand-900 md:text-5xl lg:text-6xl">
            AI phone agents that never miss a call
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Answer inbound calls, book appointments, update your CRM, and warm-transfer to humans — with
            audit logs and compliance tooling built in.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="btn-primary px-8 py-3.5 text-base">
              Start free trial
            </Link>
            <Link href="/help?intent=demo" className="btn-secondary px-8 py-3.5 text-base">
              Book a demo
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            No credit card to explore · Sandbox testing included ·{" "}
            <Link href="/security" className="text-teal-600 hover:underline">
              Security details
            </Link>
          </p>
        </section>

        <section className="border-y border-slate-200/80 bg-white/60 py-10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl text-brand-900">{s.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="mx-auto max-w-6xl px-6 py-20">
          <p className="section-eyebrow text-center">How it works</p>
          <h2 className="font-display mt-2 text-center text-3xl text-brand-900">Go live in an afternoon</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Intellivo is a full voice AI platform — not just a chatbot wrapper. Configure agents, knowledge,
            flows, and telephony from one dashboard.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SETUP_STEPS.map((step) => (
              <div key={step.step} className="surface-card p-6">
                <span className="font-display text-3xl text-teal-600">{step.step}</span>
                <h3 className="mt-3 font-semibold text-brand-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Inbound AI receptionist",
                desc: "Natural voice conversations with live transcription, knowledge retrieval, and intent detection.",
              },
              {
                title: "Warm transfer with context",
                desc: "Escalate to your team with full transcript, caller intent, and summary — no repeat explanations.",
              },
              {
                title: "Compliance & audit trail",
                desc: "TCPA consent tracking, configurable retention, audit logs, and Enterprise HIPAA mode with BAA.",
              },
            ].map((f) => (
              <div key={f.title} className="surface-card p-6">
                <h3 className="font-semibold text-brand-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="use-cases" className="bg-brand-950 py-20 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <p className="section-eyebrow text-center text-teal-400">Who we serve</p>
            <h2 className="font-display mt-2 text-center text-3xl">Built for operators, not engineers</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-white/55">
              Whether you run one location or twenty, Intellivo handles routine calls so your staff focuses on
              in-person work.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {USE_CASES.map((uc) => (
                <div
                  key={uc.industry}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-400">{uc.industry}</p>
                  <h3 className="mt-2 text-lg font-semibold">{uc.headline}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {uc.points.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="integrations" className="mx-auto max-w-6xl px-6 py-20">
          <p className="section-eyebrow text-center">Integrations</p>
          <h2 className="font-display mt-2 text-center text-3xl text-brand-900">Connects to your stack</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((int) => (
              <div key={int.name} className="surface-card p-5">
                <h3 className="font-semibold text-brand-900">{int.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{int.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            OAuth setup for HubSpot and Google Calendar in the dashboard.{" "}
            <Link href="/signup" className="text-teal-600 hover:underline">
              Start free trial
            </Link>
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="section-eyebrow text-center">Social proof</p>
          <h2 className="font-display mt-2 text-center text-3xl text-brand-900">Teams using voice AI today</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.company} className="surface-card p-6">
                <p className="text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-xs text-slate-500">
                  — {t.name}, {t.company}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold text-brand-900">Pricing</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
            Monthly subscription plus metered voice minutes. Transparent estimates at ~500 min/mo.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PLAN_KEYS.map((key) => (
              <PricingCard key={key} planKey={key} />
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold text-brand-900">Frequently asked questions</h2>
          <div className="mt-8">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
          <div className="surface-dark rounded-3xl p-10 text-white sm:p-14">
            <h2 className="font-display text-3xl">Ready to stop missing calls?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              Create your agent, test in the sandbox, and connect your line when you are ready.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="btn-gold px-8 py-3.5">
                Start free trial
              </Link>
              <Link
                href="/help?intent=demo"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white hover:bg-white/10"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingFooter />
    </div>
  );
}
