import Link from "next/link";
import { SERVE_LOCAL } from "@/lib/constants";
import { SearchBar } from "@/components/SearchBar";

export function SiteHeader({ compact }: { compact?: boolean }) {
  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-teal-500 text-sm font-bold text-white shadow-[0_4px_14px_-4px_rgba(245,158,11,0.5)]">
              S
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-brand-950 group-hover:text-teal-600">
              {SERVE_LOCAL.name}
            </span>
          </Link>
          <nav className="flex gap-2 sm:hidden">
            <Link href="/request" className="btn-gold px-3 py-1.5 text-xs">
              Get quotes
            </Link>
            {!compact && (
              <Link href="/join" className="btn-ghost px-3 py-1.5 text-xs">
                List business
              </Link>
            )}
          </nav>
        </div>
        {!compact && (
          <div className="flex flex-1 flex-col gap-3 sm:max-w-md sm:px-4">
            <SearchBar />
          </div>
        )}
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/guides"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100/80 hover:text-brand-950"
          >
            Guides
          </Link>
          <Link
            href="/pricing"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100/80 hover:text-brand-950"
          >
            Pricing
          </Link>
          <Link href="/join" className="btn-ghost ml-1 px-4 py-2 text-sm">
            List business
          </Link>
          <Link href="/request" className="btn-gold ml-1 px-4 py-2 text-sm">
            Get quotes
          </Link>
        </nav>
      </div>
    </header>
  );
}
