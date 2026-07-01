"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/search", label: "Find Pros" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-pros", label: "For Pros" },
  { href: "/blog", label: "Blog" },
] as const;

export function MarketingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroMode = pathname === "/" && !scrolled;

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
        scrolled || pathname !== "/"
          ? "border-border bg-background/92 backdrop-blur-xl shadow-sm"
          : "border-white/15 bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className={cn("font-display text-xl font-black tracking-tight", heroMode ? "text-white" : "text-foreground")}>
            ServeLocal
            <span className="text-primary">.</span>
          </span>
          <span
            className={cn(
              "hidden rounded-full px-2 py-0.5 text-xs sm:inline",
              heroMode
                ? "border border-white/20 bg-white/10 text-slate-100"
                : "border border-border bg-surface text-muted"
            )}
          >
            🍁 BC first
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition",
                heroMode ? "text-slate-100 hover:text-white" : "text-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            href="/join"
            className={cn(
              "hidden items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition lg:inline-flex",
              heroMode
                ? "border border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
                : "border border-border text-foreground hover:border-amber-400/50 hover:bg-surface"
            )}
          >
            Join as a Pro
          </Link>
          <ShimmerButton href="/request" size="sm" className="hidden sm:inline-flex">
            Post a Job
          </ShimmerButton>
          <Link
            href="/login"
            className={cn(
              "hidden items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition sm:inline-flex",
              heroMode
                ? "border border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
                : "border border-border text-foreground hover:border-amber-400/50 hover:bg-surface"
            )}
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border md:hidden",
              heroMode ? "border-white/30 text-white" : "border-border text-foreground"
            )}
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
            <Link href="/join" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted">
              Join as a Pro
            </Link>
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
