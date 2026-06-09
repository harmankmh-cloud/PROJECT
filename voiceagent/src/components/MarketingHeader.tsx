"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/help", label: "Contact" },
] as const;

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <header className="site-header fixed top-0 z-50 w-full">
      <div className="marketing-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ghost-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <Icon name="sparkles" size={16} className="text-electric-cyan" />
            </div>
            {BRAND.name}
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-on-surface-variant transition-colors hover:text-ghost-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden px-3 py-2 text-sm text-on-surface-variant transition hover:text-ghost-white sm:block"
          >
            Log in
          </Link>
          <Link href="/signup" className="btn-primary hidden rounded-lg px-5 py-2.5 text-sm sm:inline-flex">
            Start free trial
          </Link>
          <button
            type="button"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-on-surface-variant lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          className="border-t border-white/[0.08] bg-obsidian/95 px-5 py-4 backdrop-blur-xl lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-on-surface-variant"
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm text-on-surface-variant" onClick={close}>
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium text-electric-cyan" onClick={close}>
              Start free trial
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
