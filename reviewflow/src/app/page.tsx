import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FlowDemoStrip } from "@/components/FlowDemoStrip";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/brand";
import { COMPARISON_ROWS, FAQ_ITEMS, PRICING } from "@/lib/marketing-content";

const PhonePreview = dynamic(
  () => import("@/components/PhonePreview").then((m) => m.PhonePreview),
  { ssr: true }
);

export const metadata: Metadata = {
  title: "Get 5-Star Google Reviews with AI + QR Codes | RateLocal BC",
  description:
    "Add Google reviews automatically — QR poster, AI drafts, private feedback routing. Built for BC salons, shops, and local services.",
  alternates: { canonical: "/" },
};

const TRUST_STATS = [
  { value: "30s", label: "Average review time" },
  { value: "3", label: "AI options per visit" },
  { value: "1–2★", label: "Routed privately first" },
  { value: "$0", label: "Setup fee" },
] as const;

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Print your QR poster",
    text: "Download from your dashboard — put it at checkout or on the door.",
  },
  {
    n: "2",
    title: "Customer taps stars",
    text: "Works on any phone. Low ratings go to you privately first.",
  },
  {
    n: "3",
    title: "Copy & post on Google",
    text: "They pick an AI-written option, edit if they want, then post.",
  },
] as const;

export default function HomePage() {
  const siteUrl = `https://${BRAND.domain}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
        email: "hello@ratelocal.ca",
        areaServed: "British Columbia, Canada",
      },
      {
        "@type": "SoftwareApplication",
        name: BRAND.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description:
          "QR-powered Google review collection with AI-written drafts and private feedback routing for local businesses.",
        offers: {
          "@type": "Offer",
          price: String(PRICING.monthly),
          priceCurrency: "CAD",
          description: `$${PRICING.monthly}/month, no setup fee`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f9fc]">
      {/* Hero */}
      <section className="hero-dark relative overflow-hidden pb-16 pt-6 sm:pb-24 sm:pt-8">
        <div className="hero-glow left-0 top-0 h-[28rem] w-[28rem] bg-gold-600/10" />
        <div className="hero-glow bottom-0 right-0 h-80 w-80 bg-white/5" />
        <div className="grid-pattern absolute inset-0 opacity-[0.04]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <MarketingHeader />

          <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-600" />
                Built in BC · For local shops
              </p>
              <h1 className="font-display mt-8 text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]">
                Add{" "}
                <span className="text-gold-600">20+ five-star Google reviews</span> this month —
                automatically
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/55">
                Stop losing revenue to competitors with better ratings. QR on your counter → customer
                taps stars → AI writes the review → one tap to Google. Unhappy feedback stays private
                with you first.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="btn-gold px-10 py-4 text-base">
                  Get your free review page
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  See pricing
                </Link>
              </div>
              <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/45">
                <li className="flex items-center gap-2">
                  <span className="text-gold-600">✓</span> No app download
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-600">✓</span> No setup fee
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-600">✓</span> Print-ready QR poster
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-600">✓</span> {PRICING.guarantee}
                </li>
              </ul>
            </div>

            <div className="relative flex flex-col items-center lg:items-end">
              <div className="relative flex justify-center">
                <div className="phone-glow-ring absolute inset-0 m-auto h-[340px] w-[340px] rounded-full" />
                <PhonePreview />
              </div>
              <FlowDemoStrip />
            </div>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="border-b border-slate-200/80 bg-white py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-8">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-3xl text-brand-900 sm:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <p className="section-eyebrow text-center">How it works</p>
        <h2 className="font-display mt-3 text-center text-3xl tracking-tight text-brand-900 sm:text-4xl">
          Three steps to more reviews
        </h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.n} className="surface-card-hover p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white font-display text-lg text-brand-900 shadow-sm">
                {step.n}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-brand-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-slate-200/80 bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <p className="section-eyebrow text-center">Why {BRAND.name}</p>
          <h2 className="font-display mt-3 text-center text-3xl tracking-tight text-brand-900 sm:text-4xl">
            {BRAND.name} vs. a generic QR link
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
            Competitors like Podium and Birdeye charge hundreds per month. {BRAND.name} is built for BC
            shops that want results without enterprise pricing.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {COMPARISON_ROWS.map((item) => (
              <div key={item.them} className="surface-card p-6">
                <p className="text-sm text-slate-400 line-through">{item.them}</p>
                <p className="mt-2 text-lg font-semibold text-brand-900">{item.us}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <p className="section-eyebrow text-center">Simple pricing</p>
        <div className="surface-dark relative mx-auto mt-8 max-w-2xl overflow-hidden p-10 text-center sm:p-14">
          <div className="hero-glow -right-10 top-0 h-48 w-48 bg-gold-600/15" />
          <div className="relative flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">
                ${PRICING.monthly}
                <span className="text-2xl text-white/40">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/45">Everything included</p>
            </div>
            <div className="hidden h-16 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">$0</p>
              <p className="mt-1 text-sm text-white/45">Setup fee — waived</p>
            </div>
          </div>
          <p className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/70">
            {PRICING.guarantee}
          </p>
          <Link href="/signup" className="btn-gold relative mt-10 inline-flex px-10 py-4 text-base">
            Get started today
          </Link>
          <p className="relative mt-4 text-sm text-white/40">
            <Link href="/pricing" className="text-gold-400 hover:underline">
              Full pricing details →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 pb-24 sm:px-8">
        <h2 className="font-display text-center text-3xl text-brand-900">Frequently asked questions</h2>
        <div className="mt-10">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteFooter dark />
    </main>
  );
}
