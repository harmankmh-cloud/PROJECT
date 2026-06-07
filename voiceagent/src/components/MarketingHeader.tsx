"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#use-cases", label: "Solutions" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#integrations", label: "Integrations" },
  { href: "/security", label: "Security" },
  { href: "/help", label: "Contact" },
] as const;

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);

  const navLinks = (
    <>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-900"
          onClick={close}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/help?intent=demo"
        className="rounded-lg px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
        onClick={close}
      >
        Book a demo
      </Link>
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-900"
        onClick={close}
      >
        Log in
      </Link>
      <Link href="/signup" className="btn-primary" onClick={close}>
        Start free trial
      </Link>
    </>
  );

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <BrandLogo href="/" />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks}
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/signup" className="btn-primary px-3 py-2 text-xs">
            Start free
          </Link>
          <button
            type="button"
            className="btn-ghost px-3 py-2 text-sm"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          className="border-t border-slate-200/80 bg-white/95 px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-2">{navLinks}</div>
        </nav>
      )}
    </header>
  );
}
