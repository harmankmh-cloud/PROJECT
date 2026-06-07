import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BRAND } from "@/lib/brand";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#product", label: "How it works" },
      { href: "/#solutions", label: "Use cases" },
      { href: "/#integrations", label: "Integrations" },
      { href: "/pricing", label: "Pricing" },
      { href: "/signup", label: "Start free trial" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/help", label: "Contact" },
      { href: "/help?intent=demo", label: "Book a demo" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/security", label: "Compliance" },
    ],
  },
] as const;

export function MarketingFooter() {
  return (
    <footer id="footer" className="w-full border-t border-glass-border-subtle bg-surface-container/40 py-20 backdrop-blur-xl">
      <div className="marketing-container">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-xl font-bold text-ghost-white">{BRAND.name}</h4>
            <p className="mt-4 text-sm text-on-surface-variant">
              {BRAND.productCategory}. Based in {BRAND.location.label}.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-on-surface-variant">
              <li>
                <a href={`mailto:${BRAND.contact.email}`} className="hover:text-primary">
                  {BRAND.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${BRAND.contact.phone.replace(/\D/g, "")}`} className="hover:text-primary">
                  {BRAND.contact.phone}
                </a>
                <span className="block text-xs text-slate-text">{BRAND.contact.phoneNote}</span>
              </li>
              <li>{BRAND.location.label}</li>
            </ul>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h5 className="mb-6 font-bold text-ghost-white">{col.title}</h5>
              <ul className="space-y-4 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-on-surface-variant transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-glass-border-subtle pt-8 text-sm text-slate-text md:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-1">
              <MaterialIcon name="lock" className="text-[16px] text-primary" />
              PIPEDA-aligned
            </span>
            <span className="flex items-center gap-1">
              <MaterialIcon name="verified_user" className="text-[16px] text-primary" />
              CASL tooling
            </span>
            <span className="flex items-center gap-1">
              <MaterialIcon name="location_on" className="text-[16px] text-primary" />
              {BRAND.location.city}, {BRAND.location.region}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
