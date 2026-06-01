import Link from "next/link";
import { TRADE_LOCAL } from "@/lib/constants";
import { SearchBar } from "@/components/SearchBar";

export function SiteHeader({ compact }: { compact?: boolean }) {
  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl text-brand-950">
            {TRADE_LOCAL.name}
          </Link>
          {!compact && (
            <nav className="flex gap-2 sm:hidden">
              <Link href="/request" className="btn-gold px-3 py-1.5 text-xs">
                Get quotes
              </Link>
            </nav>
          )}
        </div>
        {!compact && (
          <div className="flex flex-1 flex-col gap-3 sm:max-w-md sm:px-4">
            <SearchBar />
          </div>
        )}
        <nav className="hidden items-center gap-2 sm:flex sm:gap-3">
          <Link href="/guides" className="text-sm font-medium text-slate-600 hover:text-brand-950">
            Cost guides
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-brand-950">
            Pricing
          </Link>
          <Link href="/join" className="btn-ghost px-4 py-2 text-sm">
            List your business
          </Link>
          <Link href="/request" className="btn-gold px-4 py-2 text-sm">
            Get quotes
          </Link>
        </nav>
      </div>
    </header>
  );
}
