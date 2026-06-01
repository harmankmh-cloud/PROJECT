import Link from "next/link";
import { TRADE_CITIES, SERVE_LOCAL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-xs font-bold text-white">
              S
            </span>
            <p className="font-display text-lg font-bold text-zinc-900">{SERVE_LOCAL.name}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            {SERVE_LOCAL.region}, Canada · Find local trades and contact them directly.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Customers</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/request" className="text-zinc-600 transition hover:text-accent-600">
                Get free quotes
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-zinc-600 transition hover:text-accent-600">
                Cost guides
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-zinc-600 transition hover:text-accent-600">
                Search pros
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Pros</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/join" className="text-zinc-600 transition hover:text-accent-600">
                Get listed
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-zinc-600 transition hover:text-accent-600">
                Plans & pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Cities</p>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm">
            {TRADE_CITIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-zinc-600 transition hover:text-accent-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-12 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} {SERVE_LOCAL.name} · Hire direct · Verify licence & insurance before work
        begins
      </p>
    </footer>
  );
}
