import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchBarWithSuggest } from "@/components/SearchBarWithSuggest";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { ProviderCard } from "@/components/ProviderCard";
import { HOW_IT_WORKS, TRADE_CITIES, SERVE_LOCAL } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { getApprovedProviders, getPlatformStats, getServiceCategories } from "@/lib/data";

export const metadata: Metadata = pageMetadata({
  title: "ServeLocal BC — Find Local Trades, Zero Middleman Fees",
  description:
    "Find trusted plumbers, electricians, and handymen in British Columbia. Compare verified pros, read BC cost guides, and call direct — no lead fees.",
  path: "/",
});

export default async function HomePage() {
  const [categories, featured, stats] = await Promise.all([
    getServiceCategories(),
    getApprovedProviders({ featuredOnly: true, sort: "recommended" }),
    getPlatformStats(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.servelocal.ca";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SERVE_LOCAL.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
        areaServed: "British Columbia, Canada",
        description: SERVE_LOCAL.tagline,
      },
      {
        "@type": "WebSite",
        name: SERVE_LOCAL.name,
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main className="mesh-bg min-h-screen">
      <EmergencyBanner />
      <SiteHeader compact />

      {/* Hero */}
      <section className="hero-light px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
        <div className="hero-glow -left-20 top-0 h-64 w-64 bg-teal-500/10" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-600">
            Fraser Valley & Metro Vancouver
          </p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-950 sm:text-5xl">
            Find trusted local trades
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500">
            Search verified pros, compare reviews, and call direct — no lead fees.
          </p>
          <div className="mx-auto mt-7 max-w-xl">
            <SearchBarWithSuggest />
          </div>
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
            <div className="stat-hero">
              <p className="font-display text-xl font-bold text-brand-950 sm:text-2xl">
                {TRADE_CITIES.length}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">BC cities</p>
            </div>
            <div className="stat-hero">
              <p className="font-display text-xl font-bold text-brand-950 sm:text-2xl">
                {stats.providers > 0 ? stats.providers : "Free"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {stats.providers > 0 ? "Listed pros" : "Job posts"}
              </p>
            </div>
            <div className="stat-hero">
              <p className="font-display text-xl font-bold text-brand-950 sm:text-2xl">
                {stats.reviews > 0 ? stats.reviews : "Direct"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {stats.reviews > 0 ? "Reviews" : "No middleman"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Browse services</p>
            <h2 className="font-display mt-1 text-2xl font-bold tracking-tight text-brand-950">
              Popular trades in BC
            </h2>
          </div>
          <Link href="/search" className="shrink-0 text-sm font-semibold text-teal-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?q=${encodeURIComponent(cat.name)}`}
              className="surface-card-hover flex items-center gap-3.5 p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700 ring-1 ring-teal-100">
                {cat.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-brand-950">{cat.name}</span>
                <p className="text-xs text-slate-500">Find pros near you</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured pros */}
      {featured.length > 0 && (
        <section className="border-t border-slate-200/50 bg-white/50 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="section-eyebrow">Top rated</p>
                <h2 className="font-display mt-1 text-2xl font-bold tracking-tight text-brand-950">
                  Featured pros
                </h2>
              </div>
              <Link href="/search" className="shrink-0 text-sm font-semibold text-teal-600 hover:underline">
                Browse all →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works — single strip */}
      <section className="border-t border-slate-200/50 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <p className="section-eyebrow text-center">How it works</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-semibold text-brand-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/50 bg-white px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
            Ready to hire a local pro?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
            Post your job free and get matched with verified trades in your area. Tradies: list your business at no
            cost.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/request" className="btn-teal px-8 py-3 text-base">
              Get free quotes
            </Link>
            <Link href="/join" className="btn-ghost px-8 py-3 text-base">
              List your business
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            <Link href="/guides" className="text-teal-600 hover:underline">
              Cost guides
            </Link>
            {" · "}
            <Link href="/faq" className="text-teal-600 hover:underline">
              FAQ
            </Link>
            {" · "}
            <Link href="/pricing" className="text-teal-600 hover:underline">
              Pro plans
            </Link>
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteFooter />
    </main>
  );
}
