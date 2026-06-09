import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroCallPreview } from "@/components/HeroCallPreview";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { PricingCard } from "@/components/PricingCard";
import { SkipToContent } from "@/components/SkipToContent";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { BRAND } from "@/lib/brand";
import { FAQ_ITEMS, HOME_FEATURES } from "@/lib/marketing-content";
import type { PlanKey } from "@/lib/plans";

const PLAN_KEYS: PlanKey[] = ["starter", "growth", "pro"];

const FEATURE_ICONS: Record<string, IconName> = {
  headset_mic: "phone",
  call_merge: "arrow",
  campaign: "sparkles",
};

const PROCESS_STEPS = [
  { n: "01", icon: "sparkles" as const, title: "Create your agent", desc: "Set greeting, system prompt, and escalation number. Test in the sandbox first." },
  { n: "02", icon: "phone" as const, title: "Connect your number", desc: `Point Telnyx or Twilio to ${BRAND.name} webhooks. Map the line to your agent.` },
  { n: "03", icon: "database" as const, title: "Add knowledge & flows", desc: "Upload FAQs, hours, and services. Publish flows for booking and warm transfer." },
  { n: "04", icon: "check" as const, title: "Go live & measure", desc: "Review transcripts, analytics, and quality scores. Tune from real caller intents." },
];

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

      <main id="main-content" className="pt-16">
        {/* Hero */}
        <section className="hero-mesh py-20">
          <div className="marketing-container grid items-center gap-12 md:grid-cols-2">
            <div className="text-center md:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-electric-cyan">
                <Icon name="check" size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Voice AI for local businesses</span>
              </div>
              <h1 className="font-display mb-6 text-4xl leading-tight text-ghost-white md:text-5xl lg:text-[48px] lg:leading-[1.1]">
                AI phone agents that{" "}
                <span className="text-electric-cyan">never miss a call</span>
              </h1>
              <p className="mx-auto mb-8 max-w-xl text-lg text-on-surface-variant md:mx-0">
                Answer inbound calls, book appointments, update your CRM, and warm-transfer to humans — with audit
                logs and compliance tooling built in.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <Link href="/signup" className="btn-primary px-8 py-3.5">
                  Start free trial
                  <Icon name="arrow" size={16} className="ml-2" />
                </Link>
                <Link href="/help?intent=demo" className="btn-secondary px-8 py-3.5">
                  Book a demo
                </Link>
              </div>
              <p className="mt-5 text-xs text-slate-text">
                No credit card to explore ·{" "}
                <Link href="/signup" className="text-electric-cyan hover:underline">
                  Sandbox testing included
                </Link>{" "}
                ·{" "}
                <Link href="/security" className="text-electric-cyan hover:underline">
                  Security details
                </Link>
              </p>
            </div>
            <HeroCallPreview />
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/[0.06] py-20" id="product">
          <div className="marketing-container">
            <div className="mb-12 text-center">
              <p className="section-eyebrow mb-3">Capabilities</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">Everything you need on day one</h2>
              <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
                Inbound AI, warm transfer, outbound campaigns — wired from one dashboard.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {HOME_FEATURES.slice(0, 3).map((f) => (
                <div key={f.title} className="surface-card-hover p-6">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-electric-cyan">
                    <Icon name={FEATURE_ICONS[f.icon] ?? "sparkles"} size={18} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-ghost-white">{f.title}</h3>
                  <p className="mb-4 text-sm text-on-surface-variant">{f.desc}</p>
                  <ul className="space-y-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-on-surface-variant">
                        <Icon name="check" size={14} className="shrink-0 text-electric-cyan" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-white/[0.06] py-20" id="process">
          <div className="marketing-container">
            <div className="mb-12 text-center">
              <p className="section-eyebrow mb-3">Process</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">Go live in an afternoon</h2>
              <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
                Configure agents, knowledge, flows, and telephony from one dashboard.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step) => (
                <div key={step.n} className="surface-card p-5">
                  <span className="text-xs font-medium text-electric-cyan">{step.n}</span>
                  <div className="mb-3 mt-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-electric-cyan">
                    <Icon name={step.icon} size={16} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-ghost-white">{step.title}</h3>
                  <p className="text-sm text-on-surface-variant">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-white/[0.06] py-20" id="pricing">
          <div className="marketing-container">
            <div className="mb-12 text-center">
              <p className="section-eyebrow mb-3">Pricing</p>
              <h2 className="font-display text-3xl font-bold text-ghost-white">Transparent usage-based plans</h2>
              <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
                Sandbox testing is free — no credit card required to explore.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {PLAN_KEYS.map((key) => (
                <PricingCard key={key} planKey={key} highlighted={key === "growth"} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/[0.06] py-20" id="faq">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-display mb-10 text-center text-3xl font-bold text-ghost-white">
              Frequently asked questions
            </h2>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="marketing-container">
            <div className="glass-card rounded-2xl p-10 text-center md:p-14">
              <h2 className="font-display mb-4 text-3xl font-bold text-ghost-white md:text-4xl">
                Ready to stop missing calls?
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-on-surface-variant">
                Create your agent, test in the sandbox, and connect your line when you are ready.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="btn-primary px-8 py-3.5">
                  Start free trial
                </Link>
                <Link href="/help?intent=demo" className="btn-secondary px-8 py-3.5">
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
