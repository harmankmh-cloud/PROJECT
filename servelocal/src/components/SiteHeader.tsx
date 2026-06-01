import Link from "next/link";
import { SERVE_LOCAL } from "@/lib/constants";
import { SearchBar } from "@/components/SearchBar";

export function SiteHeader({ compact }: { compact?: boolean }) {
  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-sm font-bold text-white shadow-sm">
              S
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-zinc-900 group-hover:text-accent-600">
              {SERVE_LOCAL.name}
            </span>
          </Link>
          {!compact && (
            <nav className="flex gap-2 sm:hidden">
              <Link href="/request" className="btn-primary px-3 py-1.5 text-xs">
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
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/guides"
            className="rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Guides
          </Link>
          <Link
            href="/pricing"
            className="rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Pricing
          </Link>
          <Link href="/join" className="btn-ghost ml-1 px-4 py-2 text-sm">
            List business
          </Link>
          <Link href="/request" className="btn-primary ml-1 px-4 py-2 text-sm">
            Get quotes
          </Link>
        </nav>
      </div>
    </header>
  );
}
