import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PhonePreview } from "@/components/PhonePreview";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#eef1f8]">
      {/* ——— Dark hero (big visual change) ——— */}
      <section className="hero-dark relative overflow-hidden pb-16 pt-6 sm:pb-24 sm:pt-8">
        <div className="hero-glow left-0 top-0 h-[32rem] w-[32rem] bg-teal-500/25" />
        <div className="hero-glow bottom-0 right-0 h-96 w-96 bg-amber-500/20" />
        <div className="grid-pattern absolute inset-0 opacity-[0.07]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <header className="nav-float flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <BrandLogo light />
            <nav className="flex items-center gap-2">
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
                For local shops & salons
              </p>
              <h1 className="font-display mt-8 text-4xl leading-[1.05] text-white sm:text-5xl lg:text-[3.75rem]">
                Your customers leave{" "}
                <span className="bg-gradient-to-r from-amber-200 via-gold-400 to-teal-300 bg-clip-text text-transparent">
                  5-star Google reviews
                </span>{" "}
                in under a minute
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/55">
                QR on your counter → they tap stars → AI writes the review → one tap to Google.
                Bad experiences stay private with you first.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="btn-gold px-10 py-4 text-base shadow-[0_8px_32px_rgba(245,158,11,0.5)]">
                  Get your free review page
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  Sign in
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
                  <span className="text-teal-400">✓</span> AI-written drafts
                </li>
              </ul>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="phone-glow-ring absolute inset-0 m-auto h-[340px] w-[340px] rounded-full" />
              <PhonePreview />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Social proof strip ——— */}
      <section className="border-y border-slate-200/80 bg-white py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-8">
          {[
            ["30s", "Average review time"],
            ["3", "AI options per visit"],
            ["1–2★", "Routed privately"],
            ["$99", "One-time setup"],
          ].map(([val, label]) => (
            <div key={label} className="text-center sm:text-left">
              <p className="font-display text-3xl text-brand-950 sm:text-4xl">{val}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Comparison ——— */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#070b14] via-brand-950 to-[#050810] py-24 text-white">
        <div className="hero-glow left-1/2 top-0 h-72 w-72 -translate-x-1/2 bg-teal-500/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <p className="section-eyebrow text-center text-teal-400">Why {BRAND.name}</p>
          <h2 className="font-display mt-3 text-center text-3xl tracking-tight sm:text-4xl">
            Stop sending people to a boring Google form
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/50">
            {BRAND.name} looks and feels like a modern app — so more customers actually finish.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { bad: "Blank Google form", good: "AI draft from their words", icon: "✍️" },
              { bad: "Angry public 1-stars", good: "Private feedback first", icon: "🛡️" },
              { bad: "No idea who scanned", good: "Scan → copy → Google stats", icon: "📊" },
            ].map((item) => (
              <div key={item.bad} className="feature-dark-card p-6">
                <span className="feature-icon-circle">{item.icon}</span>
                <p className="mt-5 text-sm text-white/30 line-through">{item.bad}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.good}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Steps ——— */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
        <p className="section-eyebrow text-center">How it works</p>
        <h2 className="font-display mt-3 text-center text-3xl tracking-tight text-brand-950 sm:text-4xl">
          Three steps to more reviews
        </h2>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {[
            {
              n: "1",
              title: "Print your QR poster",
              text: "Download from your dashboard — put it at checkout or on the door.",
              color: "from-amber-500 to-orange-500",
            },
            {
              n: "2",
              title: "Customer taps stars",
              text: "Works on any phone. Low ratings go to you privately first.",
              color: "from-teal-500 to-emerald-500",
            },
            {
              n: "3",
              title: "Copy & post on Google",
              text: "They pick an AI-written option, edit if they want, then post.",
              color: "from-violet-500 to-indigo-500",
            },
          ].map((step) => (
            <div key={step.n} className="surface-card-hover overflow-hidden p-0">
              <div className={`bg-gradient-to-r ${step.color} px-6 py-4`}>
                <span className="font-display text-4xl text-white/90">{step.n}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-brand-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
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

      <footer className="bg-brand-950 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-8">
          <BrandLogo light size="sm" />
          <p className="text-center text-sm text-white/40 sm:text-left">{BRAND.footer}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/help" className="text-teal-400 hover:underline">
              Help & contact
            </Link>
            <Link href="/trade" className="text-teal-400 hover:underline">
              Find local trades
            </Link>
            <Link href="/login" className="text-white/50 hover:text-white">
              Sign in
            </Link>
            <Link href="/signup" className="text-gold-400 hover:underline">
              Sign up free
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
