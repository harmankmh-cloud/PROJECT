"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        href="/help"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-900"
        onClick={() => setMobileOpen(false)}
      >
        Help
      </Link>
      <Link
        href="/#pricing"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-900"
        onClick={() => setMobileOpen(false)}
      >
        Pricing
      </Link>
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-900"
        onClick={() => setMobileOpen(false)}
      >
        Log in
      </Link>
      <Link href="/signup" className="btn-primary" onClick={() => setMobileOpen(false)}>
        Start free trial
      </Link>
    </>
  );

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <BrandLogo href="/" />
        <nav className="hidden items-center gap-2 sm:flex">{navLinks}</nav>
        <div className="flex items-center gap-2 sm:hidden">
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
        <nav className="border-t border-slate-200/80 bg-white/95 px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-2">{navLinks}</div>
        </nav>
      )}
    </header>
  );
}
