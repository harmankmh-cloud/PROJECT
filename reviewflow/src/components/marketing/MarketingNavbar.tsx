"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { BrandLogo } from "@/components/BrandLogo";

const NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/help", label: "Help" },
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
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-[rgba(10,10,26,0.72)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <BrandLogo light />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-white/10 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink/90 transition hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link href="/signup" className="rl-btn-gold ml-1 inline-flex items-center px-5 py-2.5 text-sm">
            Start free →
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-xl border border-white/15 bg-white/5 p-2 text-ink md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <ClientOnly>
        {open && (
          <div className="fixed inset-0 z-50 rl-dark md:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
              <BrandLogo light />
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="text-ink">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 sm:px-8" aria-label="Mobile">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-lg font-medium text-ink/80 transition hover:bg-white/10 hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-lg px-3 py-3 text-lg font-medium text-ink/90 transition hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rl-btn-gold mt-3 inline-flex justify-center px-5 py-3 text-center"
                onClick={() => setOpen(false)}
              >
                Start free →
              </Link>
            </nav>
          </div>
        )}
      </ClientOnly>
    </header>
  );
}
