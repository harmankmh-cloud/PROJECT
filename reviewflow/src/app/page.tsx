import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PhonePreview } from "@/components/PhonePreview";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="mesh-bg relative min-h-screen overflow-x-hidden">
      <div className="hero-glow -left-40 top-0 h-[28rem] w-[28rem] bg-teal-400/15" />
      <div className="hero-glow right-0 top-10 h-96 w-96 bg-amber-500/12" />

      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <BrandLogo />
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/help" className="hidden px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-950 sm:inline">
              Help
            </Link>
            <Link href="/login" className="btn-ghost hidden px-4 py-2 sm:inline-flex">
              Sign in
            </Link>
            <Link href="/signup" className="btn-gold px-5 py-2.5 sm:px-6">
              Start free →
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-10 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:pb-28 lg:pt-14">
        <div>
          <div className="badge-pill">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            Built for barbers, cafés, shops & salons
          </div>
          <h1 className="font-display mt-8 text-[2.65rem] leading-[1.02] tracking-tight text-brand-950 sm:text-5xl lg:text-[3.5rem]">
            Turn every visit into a{" "}
            <span className="text-gradient">Google review</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            Customers scan your QR, tap stars, get an AI-written draft — then post on Google in one
            flow. Unhappy visits stay private with you first.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/signup" className="btn-gold px-8 py-4 text-base">
              Create your review page
            </Link>
            <Link href="/login" className="btn-ghost px-8 py-4 text-base">
              Sign in
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-3">
            {[
              ["30 sec", "To leave a review"],
              ["5★ flow", "Simple for anyone"],
              ["Private", "Low stars first"],
            ].map(([value, label]) => (
              <div key={label} className="stat-chip">
                <dt className="font-display text-xl text-brand-950 sm:text-2xl">{value}</dt>
                <dd className="mt-1 text-[11px] leading-snug text-slate-500 sm:text-xs">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="grid-pattern absolute -inset-4 rounded-[2.5rem] opacity-50" />
          <PhonePreview />
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#070b14] py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 text-center text-sm text-white/45 sm:px-8">
          <span>QR poster included</span>
          <span className="hidden text-white/20 sm:inline">·</span>
          <span>AI review drafts</span>
          <span className="hidden text-white/20 sm:inline">·</span>
          <span>Private 1–2 star feedback</span>
          <span className="hidden text-white/20 sm:inline">·</span>
          <span>Works on any phone</span>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#070b14] via-brand-950 to-[#050810] py-24 text-white">
        <div className="hero-glow left-1/2 top-0 h-72 w-72 -translate-x-1/2 bg-teal-500/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <p className="section-eyebrow text-center text-teal-400">Why {BRAND.name}</p>
          <h2 className="font-display mt-3 text-center text-3xl tracking-tight sm:text-4xl">
            Generic links lose customers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/50">
            A blank Google form feels like homework. {BRAND.name} feels like a modern app — fast,
            friendly, and built for local trust.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { bad: "Blank Google form", good: "AI draft from their words", icon: "✍️" },
              { bad: "Angry public 1-stars", good: "Private feedback first", icon: "🛡️" },
              { bad: "No funnel visibility", good: "Scan → copy → Google", icon: "📊" },
            ].map((item) => (
              <div
                key={item.bad}
                className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm transition duration-300 hover:border-teal-400/25 hover:bg-white/[0.07]"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-4 text-sm text-white/30 line-through">{item.bad}</p>
                <p className="mt-2 font-semibold text-teal-300">{item.good}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <p className="section-eyebrow text-center">How it works</p>
        <h2 className="font-display mt-3 text-center text-3xl tracking-tight text-brand-950 sm:text-4xl">
          Live in three steps
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Print your poster",
              text: "Branded QR poster + SMS and email templates in your share kit.",
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
            <div key={step.n} className="surface-card-hover p-8">
              <span className="inline-flex rounded-xl bg-gradient-to-br from-amber-500/15 to-teal-500/15 px-3.5 py-1.5 font-display text-2xl text-amber-600">
                {step.n}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-brand-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="surface-dark relative mx-auto mt-20 max-w-2xl overflow-hidden p-10 text-center sm:p-14">
          <div className="hero-glow -right-10 top-0 h-48 w-48 bg-amber-500/20" />
          <p className="section-eyebrow text-teal-400">Simple pricing</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">$99</p>
              <p className="mt-1 text-sm text-white/45">One-time setup</p>
            </div>
            <div className="hidden h-16 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">
                $39<span className="text-2xl text-white/40">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/45">Everything included</p>
            </div>
          </div>
          <Link href="/signup" className="btn-gold relative mt-10 inline-flex px-10 py-4 text-base">
            Get started today
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-white/50 py-12 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-8">
          <BrandLogo size="sm" />
          <p className="text-center text-sm text-slate-500 sm:text-left">{BRAND.footer}</p>
          <div className="flex flex-wrap justify-center gap-5 text-sm font-medium">
            <Link href="/help" className="text-teal-600 hover:underline">
              Help & contact
            </Link>
            <Link href="/login" className="text-slate-500 hover:text-brand-950">
              Sign in
            </Link>
            <Link href="/signup" className="text-slate-500 hover:text-brand-950">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
