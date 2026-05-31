import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PhonePreview } from "@/components/PhonePreview";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="mesh-bg relative min-h-screen overflow-hidden">
      <div className="hero-glow -left-32 top-0 h-96 w-96 bg-mint-400/20" />
      <div className="hero-glow right-0 top-20 h-80 w-80 bg-gold-500/15" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-8">
        <BrandLogo />
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="btn-ghost hidden px-4 py-2 sm:inline-flex">
            Sign in
          </Link>
          <Link href="/signup" className="btn-gold px-5 py-2.5 sm:px-6">
            Start free →
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-10">
        <div>
          <div className="badge-pill">
            <span className="inline-flex h-2 w-2 rounded-full bg-mint-400 shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
            Built for local businesses
          </div>
          <h1 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight text-brand-950 sm:text-5xl lg:text-[3.35rem]">
            Turn every visit into a{" "}
            <span className="text-gradient">Google review</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            A sleek QR flow — stars, AI drafts, one tap to Google. Unhappy customers talk to you
            first, not the internet.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-gold px-8 py-3.5 text-base">
              Create your review page
            </Link>
            <Link href="/login" className="btn-ghost px-8 py-3.5 text-base">
              Sign in
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-3">
            {[
              ["30 sec", "Review time"],
              ["5 stars", "Simple flow"],
              ["Private", "Low ratings first"],
            ].map(([value, label]) => (
              <div key={label} className="stat-chip">
                <dt className="font-display text-xl text-brand-950 sm:text-2xl">{value}</dt>
                <dd className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="grid-pattern absolute inset-0 rounded-[2rem] opacity-40" />
          <PhonePreview />
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-gradient-to-br from-brand-950 via-brand-900 to-[#060a12] py-20 text-white">
        <div className="hero-glow left-1/2 top-0 h-64 w-64 -translate-x-1/2 bg-mint-500/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="font-display text-center text-3xl tracking-tight sm:text-4xl">
            Why generic review links fail
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/50">
            RateLocal gives you a polished customer experience — not a cold Google form.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              {
                bad: "Blank Google form",
                good: "AI draft from their words",
                icon: "✍️",
              },
              {
                bad: "Angry public 1-stars",
                good: "Private feedback first",
                icon: "🛡️",
              },
              {
                bad: "No idea what works",
                good: "Scan → copy → Google funnel",
                icon: "📊",
              },
            ].map((item) => (
              <div
                key={item.bad}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:border-mint-400/30 hover:bg-white/8"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-4 text-sm text-white/35 line-through">{item.bad}</p>
                <p className="mt-2 font-semibold text-mint-400">{item.good}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <h2 className="font-display text-center text-3xl tracking-tight text-brand-950">
          How it works
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Print your poster",
              text: "Download a branded QR poster. Share kit includes SMS and email templates.",
            },
            {
              n: "02",
              title: "Customer picks stars",
              text: "1–5 stars on any phone. Low ratings stay private with you first.",
            },
            {
              n: "03",
              title: "Review or private note",
              text: "Happy customers copy an AI draft to Google. Unhappy ones reach you directly.",
            },
          ].map((step) => (
            <div key={step.n} className="surface-card-hover p-7">
              <span className="inline-flex rounded-2xl bg-gradient-to-br from-gold-500/15 to-mint-500/15 px-3 py-1 font-display text-2xl text-gold-600">
                {step.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-brand-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="surface-dark relative mx-auto mt-16 max-w-2xl overflow-hidden p-8 text-center sm:p-12">
          <div className="hero-glow -right-10 top-0 h-40 w-40 bg-gold-500/20" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint-400">Pricing</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            <div>
              <p className="font-display text-5xl text-white">$99</p>
              <p className="mt-1 text-sm text-white/50">One-time setup</p>
            </div>
            <div className="hidden h-14 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-5xl text-white">
                $39<span className="text-2xl text-white/50">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/50">Everything included</p>
            </div>
          </div>
          <Link href="/signup" className="btn-gold relative mt-10 inline-flex px-10 py-3.5 text-base">
            Get started today
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 py-10 text-center text-sm text-slate-500">
        {BRAND.footer}
      </footer>
    </main>
  );
}
