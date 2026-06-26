import Link from "next/link";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { SERVE_LOCAL } from "@/lib/constants";

const HOMEOWNER_LINKS = [
  { href: "/request", label: "Post a Job" },
  { href: "/search", label: "Find a Pro" },
  { href: "/guides", label: "Cost Guides" },
  { href: "/dashboard", label: "My Dashboard" },
] as const;

const COST_GUIDE_LINKS = [
  { href: "/guides/plumber", label: "Plumber costs" },
  { href: "/guides/electrician", label: "Electrician costs" },
  { href: "/guides/handyman", label: "Handyman costs" },
  { href: "/guides/cleaner", label: "Cleaning costs" },
  { href: "/guides/hvac", label: "HVAC costs" },
  { href: "/guides/roofer", label: "Roofing costs" },
  { href: "/guides/painter", label: "Painting costs" },
  { href: "/guides/landscaper", label: "Landscaping costs" },
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

const SOCIAL: { href: string; label: string }[] = [];

const i18nEnabled = process.env.NEXT_PUBLIC_I18N_ENABLED === "true";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-6">
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
          {SOCIAL.length > 0 && (
            <div className="mt-4 flex gap-3">
              {SOCIAL.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-border px-3 text-xs text-muted transition hover:border-amber-400/50 hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
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
          <p className="font-label text-muted">Local Trade Cost Guides</p>
          <ul className="mt-3 space-y-2 text-sm">
            {COST_GUIDE_LINKS.map((link) => (
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
          {i18nEnabled && <LanguageToggle />}
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
