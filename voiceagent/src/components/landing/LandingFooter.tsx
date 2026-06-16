import Link from "next/link";
import dynamic from "next/dynamic";
import { BRAND } from "@/lib/brand";
import { LANDING_COPY } from "@/lib/copy/landing";
import { TrustBar } from "./TrustBar";

const ConversionWidgets = dynamic(() =>
  import("./ConversionWidgets").then((m) => ({ default: m.ConversionWidgets }))
);

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/integrations", label: "Integrations" },
      { href: "/docs", label: "Developers & API" },
      { href: "/compare", label: "Compare" },
      { href: "/demo", label: "Demo" },
      { href: "/changelog", label: "Changelog" },
      { href: "/resources/buyers-guide", label: "Buyer's guide" },
      { href: "/status", label: "System status" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/dental", label: "Dental & medical" },
      { href: "/hvac", label: "HVAC" },
      { href: "/legal", label: "Legal" },
      { href: "/contractors", label: "Contractors" },
      { href: "/real-estate", label: "Real estate" },
      { href: "/salons", label: "Salons & spas" },
      { href: "/restaurants", label: "Restaurants" },
      { href: "/property-managers", label: "Property managers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/case-studies", label: "Case studies" },
      { href: "/press", label: "Press" },
      { href: "/careers", label: "Careers" },
      { href: "/partners", label: "Partners" },
      { href: "/community", label: "Community" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Trust & legal",
    links: [
      { href: "/security", label: "Security & compliance" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/languages", label: "Languages" },
      { href: "/fr", label: "Français" },
      { href: "/help", label: "Help center" },
      { href: `mailto:${BRAND.contact.email}`, label: BRAND.contact.email },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface/50 py-14">
      <div className="marketing-container">
        <TrustBar />

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-display text-lg text-text">{BRAND.name}</p>
            <p className="mt-2 text-sm text-muted">{BRAND.tagline}</p>
            <p className="mt-3 text-sm text-muted">{LANDING_COPY.footer.tagline} 🍁</p>
            <p className="mt-3 text-xs text-muted">{BRAND.location.label}</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 text-sm font-semibold text-text">{col.title}</h5>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="link-subtle">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted">
          © {new Date().getFullYear()} {BRAND.legalName} All rights reserved.
        </p>
      </div>
      <ConversionWidgets />
    </footer>
  );
}
