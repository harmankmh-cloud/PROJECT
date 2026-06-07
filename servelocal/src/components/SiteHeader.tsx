import Link from "next/link";
import { SERVE_LOCAL } from "@/lib/constants";
import { SiteAuthNav } from "@/components/SiteAuthNav";

export function SiteHeader({ compact }: { compact?: boolean }) {
  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-teal-500 text-sm font-bold text-white shadow-[0_4px_14px_-4px_rgba(245,158,11,0.5)]">
            S
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-brand-950 group-hover:text-teal-600">
            {SERVE_LOCAL.name}
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <SiteAuthNav compact={compact} />
          <Link href="/join" className="btn-ghost hidden px-4 py-2 text-sm sm:inline-flex">
            List business
          </Link>
          <Link href="/request" className="btn-gold ml-1 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            Get quotes
          </Link>
        </nav>
      </div>
    </header>
  );
}
