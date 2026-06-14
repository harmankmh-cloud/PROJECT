"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LANDING } from "@/content/copy";
import { BRAND } from "@/lib/brand";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="marketing-container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-text">
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LANDING.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-muted hover:text-text">
            {LANDING.nav.login}
          </Link>
          <Link href="/signup" className="btn-primary-pill px-5 py-2 text-sm">
            {LANDING.nav.cta}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-text"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {LANDING.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-text"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-medium text-muted">
              {LANDING.nav.login}
            </Link>
            <Link href="/signup" className="btn-primary-pill text-center text-sm">
              {LANDING.nav.cta}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
