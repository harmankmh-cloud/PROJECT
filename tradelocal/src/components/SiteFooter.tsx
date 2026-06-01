import Link from "next/link";
import { TRADE_CITIES, TRADE_LOCAL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/50 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg text-brand-950">{TRADE_LOCAL.name}</p>
          <p className="mt-2 text-sm text-slate-500">
            {TRADE_LOCAL.region}, Canada · Verified local trades directory
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customers</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/request" className="text-slate-600 hover:text-teal-600">Get free quotes</Link></li>
            <li><Link href="/guides" className="text-slate-600 hover:text-teal-600">Cost guides</Link></li>
            <li><Link href="/search" className="text-slate-600 hover:text-teal-600">Search pros</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pros</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/join" className="text-slate-600 hover:text-teal-600">Get listed</Link></li>
            <li><Link href="/pricing" className="text-slate-600 hover:text-teal-600">Plans & pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Cities</p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {TRADE_CITIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-slate-600 hover:text-teal-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {TRADE_LOCAL.name} · Hire direct · Verify licence & insurance before work begins
      </p>
    </footer>
  );
}
