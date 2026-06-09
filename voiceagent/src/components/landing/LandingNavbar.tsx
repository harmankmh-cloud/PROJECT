"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { TRIAL_MARKETING } from "@/lib/trial";
import { GlowButton } from "@/components/ui/GlowButton";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
      className={`fixed top-0 z-50 w-full border-b transition-colors ${
        scrolled ? "border-border/80 bg-bg/95 md:backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="marketing-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-text">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 ring-1 ring-violet-500/30">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </span>
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-sm text-muted transition hover:text-text">
            Sign in
          </Link>
          <GlowButton href="/signup" variant="primary">
            {TRIAL_MARKETING.cta}
          </GlowButton>
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
        <div className="fixed inset-0 z-50 bg-bg/98 lg:hidden">
          <div className="flex items-center justify-between p-5">
            <span className="font-display text-lg">{BRAND.name}</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-5 pt-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-lg text-text hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
              <Link href="/login" className="btn-ghost py-3 text-center" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <GlowButton href="/signup" className="w-full justify-center py-3">
                {TRIAL_MARKETING.cta}
              </GlowButton>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
