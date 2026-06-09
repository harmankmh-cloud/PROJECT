"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/search", label: "Find a Pro" },
  { href: "/join", label: "List Your Business" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition duration-300",
        scrolled
          ? "border-slate-700/80 bg-background/90 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-black tracking-tight text-slate-50">
            ServeLocal
            <span className="text-primary">.</span>
          </span>
          <span className="hidden text-xs text-slate-400 sm:inline">🍁 BC</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition hover:text-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/request" className="btn-orange hidden px-4 py-2 text-sm sm:inline-flex">
            Post a Job
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-50 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
