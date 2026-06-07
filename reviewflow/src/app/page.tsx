import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FlowDemoStrip } from "@/components/FlowDemoStrip";
import { PhonePreview } from "@/components/PhonePreview";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/brand";
import {
  COMPARISON_ROWS,
  FAQ_ITEMS,
  PRICING,
  TESTIMONIALS,
  TRUST_BADGES,
} from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Get 5-Star Google Reviews with AI + QR Codes | RateLocal BC",
  description:
    "Add Google reviews automatically — QR poster, AI drafts, private feedback routing. Built for BC salons, shops, and local services.",
  alternates: { canonical: "/" },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
          description: `$${PRICING.setup} setup + $${PRICING.monthly}/month`,
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
    <main className="min-h-screen bg-[#eef1f8]">
      <section className="hero-dark relative overflow-hidden pb-16 pt-6 sm:pb-24 sm:pt-8">
        <div className="hero-glow left-0 top-0 h-[32rem] w-[32rem] bg-teal-500/25" />
        <div className="hero-glow bottom-0 right-0 h-96 w-96 bg-amber-500/20" />
        <div className="grid-pattern absolute inset-0 opacity-[0.07]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <header className="nav-float flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <BrandLogo light />
            <nav className="flex items-center gap-2">
              <Link
                href="/pricing"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white sm:inline"
              >
                Pricing
              </Link>
              <Link
                href="/help"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white sm:inline"
              >
                Help
              </Link>
              <Link
                href="/login"
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 sm:inline"
              >
                Sign in
              </Link>
              <Link href="/signup" className="btn-gold px-5 py-2.5 text-sm">
                Start free →
              </Link>
            </nav>
          </header>

          <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-300">
                <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_12px_#2dd4bf]" />
                Built in BC · For local shops
              </p>
              <h1 className="font-display mt-8 text-4xl leading-[1.05] text-white sm:text-5xl lg:text-[3.75rem]">
                Add{" "}
                <span className="bg-gradient-to-r from-amber-200 via-gold-400 to-teal-300 bg-clip-text text-transparent">
                  20+ five-star Google reviews
                </span>{" "}
                this month — automatically
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/55">
                Stop losing revenue to competitors with better ratings. QR on your counter → customer taps
                stars → AI writes the review → one tap to Google. Unhappy feedback stays private with you first.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="btn-gold px-10 py-4 text-base shadow-[0_8px_32px_rgba(245,158,11,0.5)]">
                  Get your free review page
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  See pricing
                </Link>
              </div>
              <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/45">
                <li className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span> No app download
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span> Print-ready QR poster
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span> {PRICING.guarantee}
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

      <section className="border-y border-slate-200/80 bg-white py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-8">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex gap-3 sm:block sm:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-sm font-bold text-teal-700">
                {badge.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-950">{badge.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-8">
          {[
            ["30s", "Average review time"],
            ["3", "AI options per visit"],
            ["1–2★", "Routed privately"],
            [`$${PRICING.setup}`, "One-time setup"],
          ].map(([val, label]) => (
            <div key={label} className="text-center sm:text-left">
              <p className="font-display text-3xl text-brand-950 sm:text-4xl">{val}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#070b14] via-brand-950 to-[#050810] py-24 text-white">
        <div className="hero-glow left-1/2 top-0 h-72 w-72 -translate-x-1/2 bg-teal-500/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <p className="section-eyebrow text-center text-teal-400">Why {BRAND.name}</p>
          <h2 className="font-display mt-3 text-center text-3xl tracking-tight sm:text-4xl">
            {BRAND.name} vs. a generic QR link
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/50">
            Competitors like Podium and Birdeye charge hundreds per month. {BRAND.name} is built for BC shops
            that want results without enterprise pricing.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {COMPARISON_ROWS.map((item) => (
              <div key={item.them} className="feature-dark-card p-6">
                <p className="text-sm text-white/30 line-through">{item.them}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.us}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <p className="section-eyebrow text-center">How it works</p>
        <h2 className="font-display mt-3 text-center text-3xl tracking-tight text-brand-950 sm:text-4xl">
          Three steps to more reviews
        </h2>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {[
            {
              n: "1",
              icon: "🖨️",
              title: "Print your QR poster",
              text: "Download from your dashboard — put it at checkout or on the door.",
              color: "from-amber-500 to-orange-500",
            },
            {
              n: "2",
              icon: "★",
              title: "Customer taps stars",
              text: "Works on any phone. Low ratings go to you privately first.",
              color: "from-teal-500 to-emerald-500",
            },
            {
              n: "3",
              icon: "✍️",
              title: "Copy & post on Google",
              text: "They pick an AI-written option, edit if they want, then post.",
              color: "from-violet-500 to-indigo-500",
            },
          ].map((step) => (
            <div key={step.n} className="surface-card-hover overflow-hidden p-0">
              <div className={`bg-gradient-to-r ${step.color} px-6 py-4`}>
                <span className="text-2xl" aria-hidden>
                  {step.icon}
                </span>
                <span className="ml-3 font-display text-4xl text-white/90">{step.n}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-brand-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <p className="section-eyebrow text-center">Social proof</p>
          <h2 className="font-display mt-3 text-center text-3xl tracking-tight text-brand-950">
            Shops seeing real results
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-xs text-slate-400">
            Representative customer stories — update with your real clients when available.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.company} className="surface-card p-6">
                <div className="flex gap-0.5 text-gold-500" aria-label="5 out of 5 stars">
                  {"★★★★★"}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-amber-500 text-xs font-bold text-white"
                    aria-hidden
                  >
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-950">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {t.role}, {t.company}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-teal-600">{t.industry}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <p className="section-eyebrow text-center">Simple pricing</p>
        <div className="surface-dark relative mx-auto mt-8 max-w-2xl overflow-hidden p-10 text-center sm:p-14">
          <div className="hero-glow -right-10 top-0 h-48 w-48 bg-amber-500/20" />
          <div className="relative flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">${PRICING.setup}</p>
              <p className="mt-1 text-sm text-white/45">One-time setup</p>
            </div>
            <div className="hidden h-16 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">
                ${PRICING.monthly}
                <span className="text-2xl text-white/40">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/45">Everything included</p>
            </div>
          </div>
          <p className="relative mt-6 inline-flex rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-200">
            {PRICING.guarantee}
          </p>
          <Link href="/signup" className="btn-gold relative mt-10 inline-flex px-10 py-4 text-base">
            Get started today
          </Link>
          <p className="relative mt-4 text-sm text-white/40">
            <Link href="/pricing" className="text-teal-400 hover:underline">
              Full pricing details →
            </Link>
          </p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 pb-24 sm:px-8">
        <h2 className="font-display text-center text-3xl text-brand-950">Frequently asked questions</h2>
        <div className="mt-10">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteFooter dark />
    </main>
  );
}
