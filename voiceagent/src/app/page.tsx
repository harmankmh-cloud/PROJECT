import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroCallPreview } from "@/components/HeroCallPreview";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PricingCard } from "@/components/PricingCard";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";
import {
  FAQ_ITEMS,
  HOME_FEATURES,
  HOME_SERVICES_IMAGE,
  HUBSPOT_LOGO,
  SALON_IMAGE,
  TRUST_STATS,
  USE_CASES,
  ZAPIER_LOGO,
} from "@/lib/marketing-content";
import type { PlanKey } from "@/lib/plans";

const PLAN_KEYS: PlanKey[] = ["starter", "growth", "pro", "enterprise"];

const salon = USE_CASES.find((u) => u.variant === "salon")!;
const clinic = USE_CASES.find((u) => u.variant === "clinic")!;
const home = USE_CASES.find((u) => u.variant === "home")!;
const pro = USE_CASES.find((u) => u.variant === "pro")!;

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
  const siteUrl = `https://${BRAND.domain}`;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
        sameAs: ["https://www.linkedin.com/company/intellivohealth"],
      },
      {
        "@type": "WebSite",
        name: BRAND.name,
        url: siteUrl,
        description: BRAND.tagline,
      },
      {
        "@type": "SoftwareApplication",
        name: BRAND.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description:
          "AI phone agents for local businesses with inbound answering, booking, CRM sync, and compliance tooling.",
        offers: {
          "@type": "Offer",
          price: "99",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface">
      <SkipToContent />
      <MarketingHeader />

      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="hero-mesh relative overflow-hidden pb-[120px] pt-12">
          <div className="marketing-container grid items-center gap-6 md:grid-cols-2">
            <div className="z-10 text-center md:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-electric-blue/20 bg-electric-blue/10 px-3 py-1 text-electric-blue">
                <MaterialIcon name="verified" className="text-[18px]" />
                <span className="text-xs font-semibold uppercase tracking-wider">The Future of Local Business</span>
              </div>
              <h1 className="font-display mb-6 text-4xl leading-tight text-gradient md:text-5xl lg:text-[48px] lg:leading-[56px]">
                AI phone agents that never miss a call
              </h1>
              <p className="mx-auto mb-10 max-w-xl text-lg text-slate-text md:mx-0">
                Answer inbound calls, book appointments, update your CRM, and warm-transfer to humans — with audit
                logs and compliance tooling built in.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <Link
                  href="/signup"
                  className="rounded-full bg-primary px-8 py-4 text-sm font-semibold text-on-primary shadow-lg transition-all hover:shadow-xl"
                >
                  Start free trial
                </Link>
                <Link
                  href="/help?intent=demo"
                  className="rounded-full border border-outline-variant/30 bg-surface-container-low px-8 py-4 text-sm font-semibold text-primary transition-all hover:bg-surface-container-high"
                >
                  Book a demo
                </Link>
              </div>
              <p className="mt-6 text-xs text-on-primary-container/60">
                No credit card to explore · Sandbox testing included
              </p>
            </div>
            <HeroCallPreview />
          </div>
        </section>

        {/* Trust bar */}
        <section className="relative overflow-hidden bg-primary-container py-12">
          <div className="marketing-container grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {TRUST_STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-on-primary md:text-[32px]">{s.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-on-primary-container">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-[120px]" id="product">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold text-on-surface">Everything you need on day one</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-text">
                Intellivo is a full voice AI platform — not just a chatbot wrapper. Configure agents, knowledge, and
                flows in one dashboard.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {HOME_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-outline-variant/20 bg-surface p-8 transition-all duration-300 hover:border-electric-blue/50"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-blue/10 text-electric-blue transition-colors group-hover:bg-electric-blue group-hover:text-white">
                    <MaterialIcon name={f.icon} filled className="text-[24px]" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-on-surface">{f.title}</h3>
                  <p className="mb-6 text-sm text-slate-text">{f.desc}</p>
                  <ul className="space-y-3">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs font-semibold">
                        <MaterialIcon name="check_circle" className="text-[18px] text-green-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions bento */}
        <section className="bg-surface-container-low py-[120px]" id="solutions">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold text-on-surface">Built for operators, not engineers</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-text">
                Intellivo handles routine calls so your staff focuses on in-person work.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Salon */}
              <div className="group col-span-1 flex flex-col items-center gap-8 overflow-hidden rounded-3xl border border-outline-variant/10 bg-white p-10 shadow-sm md:col-span-2 md:flex-row">
                <div className="order-2 flex-1 md:order-1">
                  <span className="mb-2 block text-sm font-semibold text-electric-blue">{salon.industry}</span>
                  <h3 className="mb-4 text-2xl font-bold text-on-surface">{salon.headline}</h3>
                  <ul className="mb-8 space-y-4">
                    {salon.points.map((p) => (
                      <li key={p} className="flex gap-3 text-slate-text">
                        <span className="text-xl text-electric-blue">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs font-semibold italic text-on-tertiary-container">
                    &ldquo;{salon.outcome}&rdquo;
                  </p>
                </div>
                <div className="order-1 flex-1 md:order-2">
                  <Image
                    src={SALON_IMAGE}
                    alt="Modern salon interior"
                    width={560}
                    height={360}
                    className="rounded-2xl shadow-lg transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Clinic */}
              <div className="flex flex-col justify-between rounded-3xl border border-glass-border bg-primary-container p-10 text-white">
                <div>
                  <span className="mb-2 block text-sm font-semibold text-tertiary-fixed">{clinic.industry}</span>
                  <h3 className="mb-6 text-2xl font-bold">{clinic.headline}</h3>
                  <p className="mb-8 text-on-primary-container">{clinic.outcome}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <MaterialIcon name="health_and_safety" className="text-tertiary-fixed" />
                    <span className="text-xs font-semibold">Enterprise HIPAA Mode</span>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <MaterialIcon name="calendar_month" className="text-tertiary-fixed" />
                    <span className="text-xs font-semibold">Google Calendar Sync</span>
                  </div>
                </div>
              </div>

              {/* Home services */}
              <div className="flex flex-col justify-between rounded-3xl border border-outline-variant/10 bg-white p-10 shadow-sm">
                <div>
                  <span className="mb-2 block text-sm font-semibold text-electric-blue">{home.industry}</span>
                  <h3 className="mb-4 text-2xl font-bold text-on-surface">{home.headline}</h3>
                  <p className="mb-6 text-slate-text">{home.points[0]}</p>
                </div>
                <Image
                  src={HOME_SERVICES_IMAGE}
                  alt="Home service technician"
                  width={480}
                  height={280}
                  className="mb-6 rounded-2xl grayscale transition-all duration-500 hover:grayscale-0"
                />
                <div className="border-t border-outline-variant/10 pt-6">
                  <p className="text-xs font-semibold text-on-tertiary-container">SMS follow-up on Growth+ plans</p>
                </div>
              </div>

              {/* Professional services */}
              <div
                className="col-span-1 flex flex-col gap-8 overflow-hidden rounded-3xl border border-outline-variant/10 bg-gradient-to-br from-white to-surface-container-high p-10 shadow-sm md:col-span-2 md:flex-row"
                id="integrations"
              >
                <div className="flex-1">
                  <span className="mb-2 block text-sm font-semibold text-electric-blue">{pro.industry}</span>
                  <h3 className="mb-4 text-2xl font-bold text-on-surface">{pro.headline}</h3>
                  <p className="mb-6 text-slate-text">{pro.points[1]}</p>
                  <div className="flex items-center gap-4 opacity-60 grayscale transition-all hover:grayscale-0">
                    <Image src={HUBSPOT_LOGO} alt="HubSpot" width={100} height={24} className="h-6 w-auto" />
                    <div className="h-6 w-px bg-outline-variant" />
                    <Image src={ZAPIER_LOGO} alt="Zapier" width={80} height={24} className="h-6 w-auto" />
                  </div>
                </div>
                <div className="flex-1 rounded-2xl border border-white bg-surface-container p-6">
                  <div className="space-y-3">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-electric-blue/20" />
                        <div className="h-2 w-1/3 rounded bg-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-[120px]" id="pricing">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold text-on-surface">Simple, predictable pricing</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-text">
                Monthly subscription plus metered voice minutes. Sandbox testing is always free.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PLAN_KEYS.map((key) => (
                <PricingCard key={key} planKey={key} highlighted={key === "growth"} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-surface py-[120px]" id="faq">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-display mb-12 text-center text-3xl font-bold text-on-surface">
              Frequently asked questions
            </h2>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-[120px]">
          <div className="marketing-container">
            <div className="relative overflow-hidden rounded-[40px] bg-primary p-12 text-center text-white md:p-20">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -left-1/4 -top-1/2 h-[1000px] w-[1000px] rounded-full bg-electric-blue blur-[100px]" />
              </div>
              <h2 className="font-display relative z-10 mb-6 text-4xl font-extrabold md:text-5xl">
                Ready to stop missing calls?
              </h2>
              <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg text-on-primary-container">
                Create your agent, test in the sandbox, and connect your line when you are ready. No credit card
                required.
              </p>
              <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-full bg-white px-10 py-5 font-bold text-primary shadow-xl transition-transform hover:scale-105 active:scale-95"
                >
                  Start free trial
                </Link>
                <Link
                  href="/help?intent=demo"
                  className="rounded-full border border-white/20 bg-white/10 px-10 py-5 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <MarketingFooter />
    </div>
  );
}
