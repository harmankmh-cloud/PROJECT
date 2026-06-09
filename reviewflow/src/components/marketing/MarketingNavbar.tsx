"use client";

import Link from "next/link";
import { Menu, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
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
      <div className="marketing-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-text">
          <Star className="h-5 w-5 fill-primary text-primary" />
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted hover:text-text">
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="text-sm text-muted hover:text-text">
            {MARKETING.nav.login}
          </Link>
        </nav>

        <Link href="/signup" className="btn-primary-pill hidden text-sm md:inline-flex">
          {MARKETING.nav.cta}
        </Link>

        <button
          type="button"
          className="rounded-lg border border-border p-2 md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <ClientOnly>
        {open && (
          <div className="fixed inset-0 z-50 bg-white md:hidden">
            <div className="flex items-center justify-between p-5">
              <span className="font-display text-lg">{BRAND.name}</span>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-5">
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
              <Link href="/signup" className="btn-primary-pill mt-4 py-3 text-center" onClick={() => setOpen(false)}>
                {MARKETING.nav.cta}
              </Link>
            </nav>
          </div>
        )}
      </ClientOnly>
    </header>
  );
}
