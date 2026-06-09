import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { TRIAL_MARKETING } from "@/lib/trial";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/docs", label: "Developer docs" },
      { href: "/compare", label: "Compare" },
      { href: "/#demo", label: "Demo" },
      { href: "/signup", label: TRIAL_MARKETING.cta },
      { href: "/integrations", label: "Integrations" },
      { href: "/blog", label: "Blog" },
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
      { href: "/restaurants", label: "Restaurants" },
      { href: "/salons", label: "Salons" },
      { href: "/property-managers", label: "Property managers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/case-studies", label: "Case studies" },
      { href: "/community", label: "Community" },
      { href: "/press", label: "Press" },
      { href: "/careers", label: "Careers" },
      { href: "/languages", label: "Languages" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/security", label: "Security" },
      { href: "/help", label: "Help center" },
      { href: `mailto:${BRAND.contact.email}`, label: BRAND.contact.email },
    ],
  },
] as const;

export function MarketingFooterNew() {
  return (
    <footer className="border-t border-border bg-surface py-16">
      <div className="marketing-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <h4 className="font-display text-xl text-text">{BRAND.name}</h4>
            <p className="mt-3 text-sm text-muted">{BRAND.tagline}</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 text-sm font-semibold text-text">{col.title}</h5>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted transition hover:text-text">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted md:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.legalName}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/company/greetq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/greetq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text"
            >
              X
            </a>
            <Link href="/privacy" className="hover:text-text">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text">
              Terms
            </Link>
            <Link href="/about" className="hover:text-text">
              About
            </Link>
            <span>Made in BC, Canada</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
