import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";
import { HOW_IT_WORKS, TRADE_CITIES, TRUST_BADGES } from "@/lib/constants";
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

      <section className="hero-light px-4 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="hero-glow -left-20 top-0 h-72 w-72 bg-teal-500/20" />
        <div className="hero-glow -right-10 top-20 h-64 w-64 bg-amber-500/15" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/90 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Fraser Valley & Metro Vancouver
          </div>
          <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
            Find local trades you can{" "}
            <span className="text-gradient">trust & call direct</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Compare verified pros, read real reviews, and get BC cost guides — then hire direct with zero
            middleman fees.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar />
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/request" className="btn-gold px-8 py-3.5 text-base">
              Get free quotes
            </Link>
            <Link href="/pricing" className="btn-ghost px-8 py-3.5 text-base">
              Pro plans from $49/mo
            </Link>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            <div className="stat-hero">
              <p className="font-display text-2xl font-bold text-brand-950">{stats.providers || "50+"}</p>
              <p className="text-xs text-slate-500">Local pros</p>
            </div>
            <div className="stat-hero">
              <p className="font-display text-2xl font-bold text-brand-950">{stats.verified || "—"}</p>
              <p className="text-xs text-slate-500">Verified</p>
            </div>
            <div className="stat-hero">
              <p className="font-display text-2xl font-bold text-brand-950">{stats.reviews || "—"}</p>
              <p className="text-xs text-slate-500">Reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white/70 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-lg">
                {b.icon}
              </span>
              <div>
                <p className="font-semibold text-brand-950">{b.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <p className="section-eyebrow">How it works</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-brand-950">
          Three steps to hire with confidence
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="surface-card">
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
          <h2 className="font-display text-2xl font-bold tracking-tight text-brand-950">Browse by city</h2>
          <Link href="/search" className="text-sm font-semibold text-teal-600 hover:underline">
            Search all →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRADE_CITIES.map((city) => (
            <Link key={city.slug} href={`/${city.slug}`} className="surface-card-hover">
              <p className="font-semibold text-brand-950">{city.name}</p>
              <p className="text-xs text-slate-500">{city.region}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200/70 bg-white/80 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-brand-950">
              Services & cost guides
            </h2>
            <Link href="/guides" className="text-sm font-semibold text-teal-600 hover:underline">
              All guides →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/guides/${cat.slug}`}
                className="surface-card flex items-center gap-3 p-4 transition hover:border-teal-400/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl">
                  {cat.icon}
                </span>
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
          <h2 className="font-display text-2xl font-bold tracking-tight text-brand-950">
            Featured & premium pros
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </section>
      )}

      <section className="hero-dark px-4 py-16 sm:px-8">
        <div className="hero-glow left-1/4 top-0 h-64 w-64 bg-teal-500/25" />
        <div className="relative mx-auto max-w-3xl text-center text-white">
          <h2 className="font-display text-3xl font-bold tracking-tight">Are you a tradie? Get more leads</h2>
          <p className="mt-3 text-lg text-white/55">
            Free listing or upgrade to Featured ($49/mo) and Premium ($99/mo) for top placement, verified
            badges, and portfolio photos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/join" className="btn-gold px-8 py-3">
              Free listing
            </Link>
            <Link href="/pricing" className="btn-outline-light px-8 py-3">
              See plans
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
