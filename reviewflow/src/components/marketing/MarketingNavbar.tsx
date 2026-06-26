"use client";

import Link from "next/link";
import { Menu, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { MARKETING } from "@/content/copy";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/#how-it-works", label: MARKETING.nav.howItWorks },
  { href: "/#pricing", label: MARKETING.nav.pricing },
  { href: "/#industries", label: MARKETING.nav.industries },
] as const;

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
      <div className="marketing-container flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 font-display text-lg text-text">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5">
            <Star className="h-5 w-5 fill-primary text-primary" />
          </span>
          <span>
            <span className="block">{BRAND.name}</span>
            <span className="block text-xs font-medium text-muted">More Google reviews for BC businesses</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="nav-link">
            {MARKETING.nav.login}
          </Link>
        </nav>

        <ShimmerButton href="/signup" className="hidden text-sm md:inline-flex">
          {MARKETING.nav.cta}
        </ShimmerButton>

        <button
          type="button"
          className="rounded-2xl border border-border bg-white/80 p-2 md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <ClientOnly>
        {open && (
          <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur md:hidden">
            <div className="marketing-container flex items-center justify-between py-5">
              <span className="font-display text-lg">{BRAND.name}</span>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="marketing-container flex flex-col gap-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-3 text-lg"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className="py-3 text-lg" onClick={() => setOpen(false)}>
                {MARKETING.nav.login}
              </Link>
              <ShimmerButton href="/signup" className="mt-4 justify-center py-3 text-center" onClick={() => setOpen(false)}>
                {MARKETING.nav.cta}
              </ShimmerButton>
            </nav>
          </div>
        )}
      </ClientOnly>
    </header>
  );
}
