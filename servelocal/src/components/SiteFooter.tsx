import Link from "next/link";
import { TRADE_CITIES, SERVE_LOCAL } from "@/lib/constants";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-teal-500 text-xs font-bold text-white">
              S
            </span>
            <p className="font-display text-lg font-bold text-brand-950">{SERVE_LOCAL.name}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            {SERVE_LOCAL.region}, Canada · Find local trades and contact them directly.
          </p>
          <div className="mt-6 max-w-sm">
            <NewsletterSignup compact />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Customers</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/request" className="text-zinc-600 transition hover:text-teal-600">
                Get free quotes
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-zinc-600 transition hover:text-teal-600">
                Cost guides
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-zinc-600 transition hover:text-teal-600">
                Search pros
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-zinc-600 transition hover:text-teal-600">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Pros</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/join" className="text-zinc-600 transition hover:text-teal-600">
                Get listed
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-zinc-600 transition hover:text-teal-600">
                Plans & pricing
              </Link>
            </li>
            <li>
              <Link href="/dashboard/pro" className="text-zinc-600 transition hover:text-teal-600">
                Pro dashboard
              </Link>
            </li>
            <li>
              <Link href="/refer" className="text-zinc-600 transition hover:text-teal-600">
                Refer a friend
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="text-zinc-600 transition hover:text-teal-600">
                About us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-zinc-600 transition hover:text-teal-600">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-zinc-600 transition hover:text-teal-600">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-zinc-600 transition hover:text-teal-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-zinc-600 transition hover:text-teal-600">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Cities</p>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm">
            {TRADE_CITIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-zinc-600 transition hover:text-teal-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-12 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} {SERVE_LOCAL.name} · Hire direct · Admin reviews licence claims · Confirm
        insurance before work begins
      </p>
    </footer>
  );
}
