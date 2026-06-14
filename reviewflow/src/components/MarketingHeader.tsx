"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/help", label: "Help" },
] as const;

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-float relative z-20">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandLogo light />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link href="/signup" className="btn-gold ml-1 px-5 py-2.5 text-sm">
            Start free →
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/signup" className="btn-gold px-4 py-2 text-sm">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
