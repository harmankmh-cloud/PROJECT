"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/search", label: "Find Pros" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/for-pros", label: "For Pros" },
  { href: "/blog", label: "Blog" },
] as const;

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition duration-300",
        scrolled
          ? "border-border bg-background/90 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-black tracking-tight text-foreground">
            ServeLocal
            <span className="text-primary">.</span>
          </span>
          <span className="hidden text-xs text-muted sm:inline">🍁 Canada</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <ShimmerButton href="/request" size="sm" className="hidden sm:inline-flex">
            Post a Job
          </ShimmerButton>
          <Link
            href="/login"
            className="hidden items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-amber-400/50 hover:bg-surface sm:inline-flex"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <ShimmerButton
                href="/request"
                size="sm"
                className="w-full flex-1"
                onClick={() => setMobileOpen(false)}
              >
                Post a Job
              </ShimmerButton>
            </div>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-foreground">
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
