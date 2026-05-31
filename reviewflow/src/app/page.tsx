import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PhonePreview } from "@/components/PhonePreview";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="mesh-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-8">
        <BrandLogo />
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="btn-ghost hidden px-4 py-2 sm:inline-flex">
            Sign in
          </Link>
          <Link href="/signup" className="btn-gold px-4 py-2 sm:px-5">
            Start free →
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-950 backdrop-blur">
            <span className="text-gold-500">★</span> Built for local businesses
          </div>
          <h1 className="font-display mt-6 text-4xl leading-[1.1] text-brand-950 sm:text-5xl lg:text-[3.25rem]">
            Stop losing reviews to{" "}
            <span className="text-gold-600">awkward moments</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-600">
            Customers tap 1–5 stars, get 3 AI review options in seconds, and post on Google. Every
            rating — good or bad — also lands on your dashboard so you always know what happened.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-gold px-8 py-3.5 text-base">
              Create your review page
            </Link>
            <Link href="/login" className="btn-ghost px-8 py-3.5 text-base">
              Sign in
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[#e8e2d9] pt-8">
            {[
              ["30 sec", "Average review time"],
              ["5 stars", "Simple rating flow"],
              ["Private", "Low ratings to you first"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-xl text-brand-950 sm:text-2xl">{value}</dt>
                <dd className="mt-1 text-xs text-stone-500 sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="grid-pattern absolute inset-0 rounded-3xl opacity-50" />
          <PhonePreview />
        </div>
      </section>

      <section className="border-y border-[#e8e2d9] bg-brand-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="font-display text-center text-3xl sm:text-4xl">
            Why generic review links fail
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                bad: "Blank Google form",
                good: "AI draft from their own words",
                icon: "✍️",
              },
              {
                bad: "Angry public 1-stars",
                good: "Private feedback channel first",
                icon: "🛡️",
              },
              {
                bad: "No idea what works",
                good: "Funnel: scan → copy → Google",
                icon: "📊",
              },
            ].map((item) => (
              <div key={item.bad} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-4 text-sm text-white/40 line-through">{item.bad}</p>
                <p className="mt-2 font-semibold text-gold-400">{item.good}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="font-display text-center text-3xl text-brand-950">How it works</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Print your poster",
              text: "Download a poster with your business name + QR. Share kit has text and email templates too.",
            },
            {
              n: "02",
              title: "Customer picks stars",
              text: "1 to 5 stars. The flow adapts — low ratings stay private with you first.",
            },
            {
              n: "03",
              title: "Review or private note",
              text: "Happy customers copy an AI draft to Google. Unhappy ones talk to you first.",
            },
          ].map((step) => (
            <div key={step.n} className="surface-card p-6">
              <span className="font-display text-3xl text-gold-500">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-brand-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="surface-dark mx-auto mt-16 max-w-2xl p-8 text-center sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Pricing</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            <div>
              <p className="font-display text-4xl text-white">$99</p>
              <p className="mt-1 text-sm text-white/50">One-time setup</p>
            </div>
            <div className="hidden h-12 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-4xl text-white">
                $39<span className="text-xl text-white/50">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/50">Everything included</p>
            </div>
          </div>
          <Link href="/signup" className="btn-gold mt-8 inline-flex px-10 py-3.5">
            Get started today
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e8e2d9] py-8 text-center text-sm text-stone-500">
        {BRAND.footer}
      </footer>
    </main>
  );
}
