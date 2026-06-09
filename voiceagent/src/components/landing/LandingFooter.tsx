"use client";

import Link from "next/link";
import { Link2, Share2, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { LANDING_COPY } from "@/lib/copy/landing";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

const SOCIAL = [
  { href: "https://twitter.com", icon: X, label: "X" },
  { href: "https://linkedin.com", icon: Link2, label: "LinkedIn" },
  { href: "https://github.com", icon: Share2, label: "GitHub" },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface/50 py-12">
      <div className="marketing-container">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <p className="font-display text-lg text-text">{BRAND.name}</p>
            <p className="mt-1 text-sm text-muted">{LANDING_COPY.footer.tagline} 🍁</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="link-subtle text-sm">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition hover:-translate-y-0.5 hover:border-violet-500/40 hover:text-text"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
