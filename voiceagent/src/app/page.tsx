import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { LegalStrip } from "@/components/LegalStrip";
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
  TESTIMONIALS,
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
    `${BRAND.name} answers inbound calls, books appointments, syncs CRM, and warm-transfers to your team. Built for salons, clinics, and local service businesses.`,
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
        name: BRAND.legalName,
        alternateName: BRAND.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
        description: BRAND.productCategory,
        email: BRAND.contact.email,
        telephone: BRAND.contact.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: BRAND.location.city,
          addressRegion: BRAND.location.region,
          addressCountry: BRAND.location.country,
        },
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
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col overflow-x-hidden">
      <SkipToContent />
      <MarketingHeader />

      <main id="main-content" className="pt-20">
        <section className="border-b border-glass-border-subtle bg-surface-container/50 py-3" aria-label="Company notice">
          <div className="marketing-container text-center text-xs text-on-surface-variant sm:text-left">
            <p>
              <span className="font-semibold text-ghost-white">{BRAND.legalName}</span> — {BRAND.tagline}. Based in{" "}
              {BRAND.location.label}.
            </p>
          </div>
        </section>

        {/* Hero */}
        <section className="hero-mesh relative overflow-hidden pb-[120px] pt-12">
          <div className="marketing-container grid items-center gap-6 md:grid-cols-2">
            <div className="z-10 text-center md:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                <MaterialIcon name="verified" className="text-[18px]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Voice AI for local businesses</span>
              </div>
              <h1 className="font-display mb-6 text-4xl leading-tight text-ghost-white md:text-5xl lg:text-[48px] lg:leading-[1.1]">
                AI phone agents that{" "}
                <span className="text-accent">never miss a call</span>
              </h1>
              <p className="mx-auto mb-10 max-w-xl text-lg text-on-surface-variant md:mx-0">
                Answer inbound calls, book appointments, update your CRM, and warm-transfer to humans — with audit
                logs and compliance tooling built in.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <Link href="/signup" className="btn-primary rounded-full px-8 py-4 text-sm">
                  Start free trial
                  <MaterialIcon name="arrow_forward" className="ml-2 text-[18px]" />
                </Link>
                <Link href="/help?intent=demo" className="btn-secondary rounded-full px-8 py-4 text-sm">
                  Book a demo
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-text">
                No credit card to explore ·{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sandbox testing included
                </Link>{" "}
                ·{" "}
                <Link href="/security" className="text-primary hover:underline">
                  Security details
                </Link>
              </p>
            </div>
            <HeroCallPreview />
          </div>
        </section>

        {/* Trust bar */}
        <section className="relative overflow-hidden border-y border-glass-border-subtle bg-surface-container/40 py-12 backdrop-blur-xl">
          <div className="marketing-container grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {TRUST_STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-ghost-white md:text-[32px]">{s.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="py-[120px]" id="process">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <p className="section-eyebrow mb-3">Process</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">Go live in an afternoon</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
                {BRAND.name} is a full voice AI platform — not just a chatbot wrapper. Configure agents, knowledge, flows,
                and telephony from one dashboard.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { n: "01", icon: "smart_toy", title: "Create your agent", desc: "Set greeting, system prompt, and escalation number. Test in the sandbox first." },
                { n: "02", icon: "settings_phone", title: "Connect your number", desc: `Point Telnyx or Twilio to ${BRAND.name} webhooks. Map the line to your agent.` },
                { n: "03", icon: "auto_stories", title: "Add knowledge & flows", desc: "Upload FAQs, hours, and services. Publish flows for booking and warm transfer." },
                { n: "04", icon: "query_stats", title: "Go live & measure", desc: "Review transcripts, analytics, and quality scores. Tune from real caller intents." },
              ].map((step) => (
                <div key={step.n} className="surface-card-hover p-8">
                  <span className="text-xs font-bold text-primary">{step.n}</span>
                  <div className="mb-4 mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MaterialIcon name={step.icon} filled className="text-[24px]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-ghost-white">{step.title}</h3>
                  <p className="text-sm text-on-surface-variant">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-[120px]" id="product">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <p className="section-eyebrow mb-3">Capabilities</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">Everything you need on day one</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
                View all features in the dashboard — inbound AI, warm transfer, outbound campaigns, analytics, and
                compliance.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {HOME_FEATURES.map((f) => (
                <div key={f.title} className="surface-card-hover group p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-electric-cyan group-hover:text-ghost-white">
                    <MaterialIcon name={f.icon} filled className="text-[24px]" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-ghost-white">{f.title}</h3>
                  <p className="mb-6 text-sm text-on-surface-variant">{f.desc}</p>
                  <ul className="space-y-3">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                        <MaterialIcon name="check_circle" className="text-[18px] text-primary" />
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
        <section className="border-t border-glass-border-subtle bg-surface-container/30 py-[120px]" id="solutions">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <p className="section-eyebrow mb-3">Solutions</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">Built for operators, not engineers</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
                {BRAND.name} handles routine calls so your staff focuses on in-person work.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group col-span-1 flex flex-col items-center gap-8 overflow-hidden rounded-3xl border border-glass-border-subtle bg-surface-container/60 p-10 md:col-span-2 md:flex-row">
                <div className="order-2 flex-1 md:order-1">
                  <span className="mb-2 block text-sm font-semibold text-primary">{salon.industry}</span>
                  <h3 className="mb-4 text-2xl font-bold text-ghost-white">{salon.headline}</h3>
                  <ul className="mb-8 space-y-3">
                    {salon.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[18px] text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <blockquote className="border-l-2 border-primary/40 pl-4 text-sm italic text-on-surface-variant">
                    &ldquo;{salon.outcome}&rdquo;
                  </blockquote>
                  {"outcomeAttribution" in salon && salon.outcomeAttribution ? (
                    <p className="mt-2 text-xs text-slate-text">— {salon.outcomeAttribution}</p>
                  ) : null}
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

              <div className="glow-border flex flex-col justify-between rounded-3xl bg-gradient-to-br from-surface-container to-brand-900 p-10">
                <div>
                  <span className="mb-2 block text-sm font-semibold text-primary">{clinic.industry}</span>
                  <h3 className="mb-4 text-2xl font-bold text-ghost-white">{clinic.headline}</h3>
                  <p className="mb-6 text-sm text-on-surface-variant">{clinic.outcome}</p>
                  <ul className="space-y-3">
                    {clinic.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[18px] text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-3xl border border-glass-border-subtle bg-surface-container/60 p-10">
                <div>
                  <span className="mb-2 block text-sm font-semibold text-primary">{home.industry}</span>
                  <h3 className="mb-4 text-2xl font-bold text-ghost-white">{home.headline}</h3>
                  <p className="mb-6 text-sm text-on-surface-variant">{home.outcome}</p>
                  <ul className="mb-6 space-y-3">
                    {home.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[18px] text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Image
                  src={HOME_SERVICES_IMAGE}
                  alt="Home service technician"
                  width={480}
                  height={280}
                  className="mb-6 rounded-2xl opacity-80 transition-all duration-500 hover:opacity-100"
                />
                <div className="border-t border-glass-border-subtle pt-6">
                  <p className="text-xs font-semibold text-primary">SMS follow-up on Growth and Pro plans</p>
                </div>
              </div>

              <div
                className="col-span-1 flex flex-col gap-8 overflow-hidden rounded-3xl border border-glass-border-subtle bg-surface-container/60 p-10 md:col-span-2 md:flex-row"
                id="integrations"
              >
                <div className="flex-1">
                  <span className="mb-2 block text-sm font-semibold text-primary">{pro.industry}</span>
                  <h3 className="mb-4 text-2xl font-bold text-ghost-white">{pro.headline}</h3>
                  <p className="mb-6 text-sm text-on-surface-variant">{pro.outcome}</p>
                  <ul className="mb-6 space-y-3">
                    {pro.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[18px] text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4 opacity-70 transition-all hover:opacity-100">
                    <Image src={HUBSPOT_LOGO} alt="HubSpot" width={100} height={24} className="h-6 w-auto brightness-200" />
                    <div className="h-6 w-px bg-outline-variant" />
                    <Image src={ZAPIER_LOGO} alt="Zapier" width={80} height={24} className="h-6 w-auto brightness-200" />
                  </div>
                </div>
                <div className="flex-1 rounded-2xl border border-glass-border-subtle bg-obsidian/60 p-6">
                  <div className="space-y-3">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-surface-container-high" />
                    <div className="h-3 w-full animate-pulse rounded bg-surface-container-high" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-surface-container-high" />
                    <div className="mt-4 border-t border-glass-border-subtle pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/20" />
                        <div className="h-2 w-1/3 rounded bg-surface-container-highest" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-t border-glass-border-subtle bg-surface-container/30 py-[120px]" id="testimonials">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <p className="section-eyebrow mb-3">Trusted by operators</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">What teams say after going live</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
                Local businesses use {BRAND.name} to cover evenings, weekends, and peak hours without adding headcount.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="surface-card-hover flex flex-col justify-between p-8"
                >
                  <blockquote className="text-sm leading-relaxed text-on-surface-variant">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-glass-border-subtle pt-6">
                    <p className="font-semibold text-ghost-white">{t.name}</p>
                    <p className="text-xs text-slate-text">
                      {t.role}, {t.company} · {t.industry}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-[120px]" id="pricing">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <p className="section-eyebrow mb-3">Pricing</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">Transparent usage-based plans</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
                Sandbox testing is free — no credit card required to explore.
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
        <section className="py-[120px]" id="faq">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-display mb-12 text-center text-3xl font-bold text-ghost-white">
              Frequently asked questions
            </h2>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        <LegalStrip />

        {/* CTA */}
        <section className="py-[120px]">
          <div className="marketing-container">
            <div className="glow-border relative overflow-hidden rounded-[40px] bg-gradient-to-br from-surface-container via-brand-900 to-obsidian p-12 text-center md:p-20">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-1/4 -top-1/2 h-[1000px] w-[1000px] rounded-full bg-violet-500 blur-[120px]" />
                <div className="absolute -bottom-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-electric-cyan blur-[100px]" />
              </div>
              <h2 className="font-display relative z-10 mb-6 text-4xl font-extrabold text-ghost-white md:text-5xl">
                Ready to stop missing calls?
              </h2>
              <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg text-on-surface-variant">
                Create your agent, test in the sandbox, and connect your line when you are ready.
              </p>
              <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/signup" className="btn-primary rounded-full px-10 py-5 font-bold">
                  Start free trial
                </Link>
                <Link href="/help?intent=demo" className="btn-secondary rounded-full px-10 py-5 font-bold">
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
