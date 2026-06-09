import Link from "next/link";
import { BRAND } from "@/lib/brand";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#demo", label: "Demo" },
      { href: "/signup", label: "Start free trial" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/#industries", label: "Dental & medical" },
      { href: "/#industries", label: "Home services" },
      { href: "/#industries", label: "Professional services" },
      { href: "/#industries", label: "Salons & spas" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "/help", label: "Help center" },
      { href: `mailto:${BRAND.contact.email}`, label: BRAND.contact.email },
      { href: "/help?intent=demo", label: "Book a demo" },
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
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="hover:text-text">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text">
              Terms
            </Link>
            <span>Made in BC, Canada</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
