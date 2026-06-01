import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";
import { HOW_IT_WORKS, TRADE_CITIES, TRADE_LOCAL, TRUST_BADGES } from "@/lib/constants";
import { getApprovedProviders, getPlatformStats, getServiceCategories } from "@/lib/data";

export default async function HomePage() {
  const [categories, featured, stats] = await Promise.all([
    getServiceCategories(),
    getApprovedProviders({ featuredOnly: true, sort: "recommended" }),
    getPlatformStats(),
  ]);

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader />

      <section className="hero-dark relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
        <div className="hero-glow left-0 top-0 h-96 w-96 bg-teal-500/20" />
        <div className="hero-glow bottom-0 right-0 h-80 w-80 bg-amber-500/15" />
        <div className="relative mx-auto max-w-4xl text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-300">Fraser Valley & Metro Vancouver</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Hire trusted local trades — <span className="text-gradient">verified & reviewed</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/55">
            Like Thumbtack meets HomeStars for BC. Compare pros, read reviews, get cost guides — then call direct with zero middleman fees.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar />
          </div>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/request" className="btn-gold px-8 py-4 text-base">
              Get free quotes
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-8 py-4 text-base font-semibold text-white hover:bg-white/10"
            >
              Pro plans from $49/mo
            </Link>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            <div className="stat-hero">
              <p className="font-display text-2xl text-white">{stats.providers || "50+"}</p>
              <p className="text-xs text-white/50">Local pros</p>
            </div>
            <div className="stat-hero">
              <p className="font-display text-2xl text-white">{stats.verified || "—"}</p>
              <p className="text-xs text-white/50">Verified</p>
            </div>
            <div className="stat-hero">
              <p className="font-display text-2xl text-white">{stats.reviews || "—"}</p>
              <p className="text-xs text-white/50">Reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white/70 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-lg">{b.icon}</span>
              <div>
                <p className="font-semibold text-brand-950">{b.label}</p>
                <p className="text-sm text-slate-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <p className="section-eyebrow">How it works</p>
        <h2 className="font-display mt-2 text-3xl text-brand-950">Three steps — like the big apps, built for BC</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="surface-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-950 text-sm font-bold text-gold-400">
                {step.step}
              </span>
              <h3 className="mt-4 font-semibold text-brand-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl text-brand-950">Browse by city</h2>
          <Link href="/search" className="text-sm font-semibold text-teal-600 hover:underline">Search all →</Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRADE_CITIES.map((city) => (
            <Link key={city.slug} href={`/${city.slug}`} className="surface-card-hover p-5">
              <p className="font-semibold text-brand-950">{city.name}</p>
              <p className="text-xs text-slate-500">{city.region}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl text-brand-950">Services & cost guides</h2>
            <Link href="/guides" className="text-sm font-semibold text-teal-600 hover:underline">All guides →</Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/guides/${cat.slug}`}
                className="surface-card flex items-center gap-3 p-4 transition hover:border-teal-400/40"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <span className="font-medium text-brand-950">{cat.name}</span>
                  <p className="text-xs text-slate-500">BC price guide</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <h2 className="font-display text-2xl text-brand-950">Featured & premium pros</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </section>
      )}

      <section className="hero-dark px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="font-display text-3xl">Are you a tradie? Get more leads</h2>
          <p className="mt-3 text-white/55">Free listing or upgrade to Featured ($49/mo) and Premium ($99/mo) for top placement, verified badges, and portfolio photos.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/join" className="btn-gold px-8 py-3">Free listing</Link>
            <Link href="/pricing" className="btn-ghost border-white/20 bg-white/10 text-white hover:bg-white/20 px-8 py-3">See plans</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
