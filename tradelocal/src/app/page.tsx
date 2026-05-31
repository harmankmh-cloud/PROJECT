import Link from "next/link";
import { TRADE_CITIES, TRADE_LOCAL } from "@/lib/constants";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getServiceCategories(),
    getApprovedProviders({ featuredOnly: true }),
  ]);

  return (
    <main className="mesh-bg min-h-screen">
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" className="font-display text-xl text-brand-950">
            {TRADE_LOCAL.name}
          </Link>
          <nav className="flex gap-2 sm:gap-3">
            <Link href="/join" className="btn-ghost px-4 py-2 text-sm">
              List your business
            </Link>
            <Link href="/request" className="btn-gold px-4 py-2 text-sm">
              Post a job
            </Link>
          </nav>
        </div>
      </header>

      <section className="hero-dark relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
        <div className="hero-glow left-0 top-0 h-96 w-96 bg-teal-500/20" />
        <div className="relative mx-auto max-w-3xl text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-300">Fraser Valley & Metro Vancouver</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            Find the right <span className="text-gradient">local pro</span> — call direct
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
            {TRADE_LOCAL.tagline}. We list contacts only — you hire directly, no middleman markup.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/request" className="btn-gold px-8 py-4 text-base">
              I need someone
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-8 py-4 text-base font-semibold text-white hover:bg-white/10"
            >
              I&apos;m a tradie — get listed
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="font-display text-2xl text-brand-950">Browse by city</h2>
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
          <h2 className="font-display text-2xl text-brand-950">Services</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/surrey/${cat.slug}`}
                className="surface-card flex items-center gap-3 p-4 transition hover:border-teal-400/40"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium text-brand-950">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <h2 className="font-display text-2xl text-brand-950">Featured pros</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <Link key={p.id} href={`/pro/${p.slug}`} className="surface-card-hover p-5">
                <p className="font-semibold text-brand-950">{p.display_name}</p>
                <p className="text-sm text-slate-500">{p.category_slug}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-slate-200/70 py-10 text-center text-sm text-slate-500">
        <p className="font-display text-lg text-brand-950">{TRADE_LOCAL.name}</p>
        <p className="mt-2">{TRADE_LOCAL.region}, Canada · Directory only — hire pros directly</p>
      </footer>
    </main>
  );
}
