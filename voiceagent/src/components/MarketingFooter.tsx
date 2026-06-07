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
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/help", label: "Contact" },
      { href: "/help?intent=demo", label: "Book a demo" },
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
    <footer className="w-full border-t border-glass-border-subtle bg-surface-container/40 py-20 backdrop-blur-xl">
      <div className="marketing-container">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-xl font-bold text-ghost-white">{BRAND.name}</h4>
            <p className="mt-4 text-sm text-on-surface-variant">
              AI phone agents for local businesses. Built for excellence.
            </p>
            <a
              href="https://www.linkedin.com/company/intellivohealth"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-glass-border-subtle bg-surface-container text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="LinkedIn"
            >
              <MaterialIcon name="share" />
            </a>
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
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <MaterialIcon name="lock" className="text-[16px] text-primary" />
              HIPAA Ready
            </span>
            <span className="flex items-center gap-1">
              <MaterialIcon name="verified_user" className="text-[16px] text-primary" />
              TCPA Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
