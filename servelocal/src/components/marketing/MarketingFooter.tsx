import Link from "next/link";
import { Globe, Share2 } from "lucide-react";
import { SERVE_LOCAL } from "@/lib/constants";

const HOMEOWNER_LINKS = [
  { href: "/request", label: "Post a Job" },
  { href: "/search", label: "Find a Pro" },
  { href: "/guides", label: "Cost Guides" },
  { href: "/dashboard", label: "My Dashboard" },
] as const;

const CONTRACTOR_LINKS = [
  { href: "/join", label: "Join as a Pro" },
  { href: "/pricing", label: "Pricing" },
  { href: "/signup/pro", label: "Create Account" },
  { href: "/dashboard/pro", label: "Pro Dashboard" },
] as const;

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

const SOCIAL = [
  { href: "https://facebook.com", icon: Share2, label: "Facebook" },
  { href: "https://instagram.com", icon: Globe, label: "Instagram" },
  { href: "https://twitter.com", icon: Share2, label: "Twitter" },
  { href: "https://linkedin.com", icon: Globe, label: "LinkedIn" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-display text-xl font-black text-foreground">
            {SERVE_LOCAL.name}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Canada&apos;s trusted home services marketplace. Vetted pros, upfront pricing, zero stress.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
            🍁 Proudly Canadian
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-amber-400/50 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-label text-muted">Homeowners</p>
          <ul className="mt-3 space-y-2 text-sm">
            {HOMEOWNER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-label text-muted">Contractors</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CONTRACTOR_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-label text-muted">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {SERVE_LOCAL.name}. Serving Canada — starting in BC.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 rounded-full border border-border p-0.5 text-xs">
            <span className="rounded-full bg-primary px-2.5 py-1 font-semibold text-white">EN</span>
            <span className="rounded-full px-2.5 py-1 text-muted">FR</span>
          </div>
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs text-muted hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
