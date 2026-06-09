"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { TRIAL_MARKETING } from "@/lib/trial";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/compare", label: "Compare" },
  { href: "/#demo", label: "Demo" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/help", label: "Help" },
] as const;

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition ${
        scrolled
          ? "border-border bg-bg/90 backdrop-blur-xl"
          : "border-border/50 bg-bg/80 backdrop-blur-xl"
      }`}
    >
      <div className="marketing-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg text-text">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary-glow" />
          </span>
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="btn-ghost px-4 py-2 text-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary px-5 py-2.5 text-sm">
            {TRIAL_MARKETING.cta}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-border p-2 text-muted lg:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between p-5">
            <span className="font-display text-lg text-text">{BRAND.name}</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-text" />
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-5 pt-8" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-lg text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login" className="btn-ghost py-3 text-center" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary py-3 text-center" onClick={() => setOpen(false)}>
                {TRIAL_MARKETING.cta}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
