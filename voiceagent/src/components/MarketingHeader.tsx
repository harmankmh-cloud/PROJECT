"use client";

import Link from "next/link";
import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Contact" },
] as const;

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <header className="site-header fixed top-0 z-50 w-full">
      <div className="marketing-container flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-ghost-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-electric-cyan/30">
              <MaterialIcon name="smart_toy" filled className="text-primary text-[20px]" />
            </div>
            {BRAND.name}
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:text-on-surface sm:block"
          >
            Log in
          </Link>
          <Link href="/signup" className="btn-primary hidden rounded-full px-6 py-3 sm:inline-flex">
            Start free trial
          </Link>
          <Link
            href="/help?intent=demo"
            className="btn-secondary hidden rounded-full px-6 py-3 md:inline-flex"
          >
            Book a demo
          </Link>
          <button
            type="button"
            className="rounded-lg border border-glass-border-subtle bg-surface-container px-3 py-2 text-sm lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MaterialIcon name="menu" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          className="border-t border-glass-border-subtle bg-surface-container px-5 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-on-surface-variant"
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-semibold text-on-surface-variant" onClick={close}>
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-semibold text-primary" onClick={close}>
              Start free trial
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
