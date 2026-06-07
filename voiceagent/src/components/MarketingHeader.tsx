"use client";

import Link from "next/link";
import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-glass-border bg-surface/80 shadow-sm backdrop-blur-xl">
      <div className="marketing-container flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-on-surface">
            <MaterialIcon name="call" filled className="text-electric-blue" />
            {BRAND.name}
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-text transition-colors hover:text-on-surface"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden px-4 py-2 text-sm font-semibold text-slate-text hover:text-on-surface sm:block"
          >
            Log in
          </Link>
          <Link
            href="/help?intent=demo"
            className="rounded-full bg-on-surface px-6 py-3 text-sm font-semibold text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Book a Demo
          </Link>
          <button
            type="button"
            className="rounded-lg border border-outline-variant/30 px-3 py-2 text-sm md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="border-t border-outline-variant/20 bg-white px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-slate-text" onClick={close}>
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-semibold text-slate-text" onClick={close}>
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-semibold text-electric-blue" onClick={close}>
              Start free trial
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
