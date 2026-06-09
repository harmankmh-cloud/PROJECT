import Link from "next/link";
import { SERVE_LOCAL } from "@/lib/constants";
import { BC_CITY_CHIPS } from "@/content/copy";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-700 bg-background px-4 py-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-black text-slate-50">
            {SERVE_LOCAL.name}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">{SERVE_LOCAL.tagline}</p>
          <p className="mt-1 text-xs text-slate-500">🍁 {SERVE_LOCAL.region}</p>
        </div>
        <div>
          <p className="font-label text-slate-500">Homeowners</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/request" className="text-slate-400 hover:text-primary">Post a job</Link></li>
            <li><Link href="/search" className="text-slate-400 hover:text-primary">Find a pro</Link></li>
            <li><Link href="/guides" className="text-slate-400 hover:text-primary">Cost guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-label text-slate-500">Contractors</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/join" className="text-slate-400 hover:text-primary">List your business</Link></li>
            <li><Link href="/pricing" className="text-slate-400 hover:text-primary">Pricing</Link></li>
            <li><Link href="/signup?role=pro" className="text-slate-400 hover:text-primary">Create account</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-label text-slate-500">Cities</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {BC_CITY_CHIPS.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-xs text-slate-500 hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {SERVE_LOCAL.name}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-slate-300">Terms</Link>
          <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
          <Link href="/contact" className="hover:text-slate-300">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
