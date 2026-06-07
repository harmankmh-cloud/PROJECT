import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#product", label: "How it works" },
      { href: "/#use-cases", label: "Use cases" },
      { href: "/#integrations", label: "Integrations" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/help", label: "Contact" },
      { href: "/help?intent=demo", label: "Book a demo" },
      { href: "/help?intent=enterprise", label: "Enterprise sales" },
    ],
  },
  {
    title: "Legal & security",
    links: [
      { href: "/security", label: "Security & compliance" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signup", label: "Start free trial" },
      { href: "/login", label: "Sign in" },
      { href: "/help", label: "Support" },
    ],
  },
] as const;

export function MarketingFooter() {
  return (
    <footer className="bg-brand-950 py-14 text-white">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <BrandLogo href="/" light size="sm" />
            <p className="mt-4 text-sm text-white/50">{BRAND.tagline}</p>
            <p className="mt-2 text-xs text-white/35">
              {BRAND.name} · {BRAND.domain}
            </p>
            <a
              href="https://www.linkedin.com/company/intellivohealth"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-white/50 hover:text-teal-300"
            >
              LinkedIn →
            </a>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">{col.title}</h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-teal-300 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-xs text-white/35">
          <p>TCPA tools included · HIPAA available on Enterprise with BAA · Audit logs on all plans</p>
          <p className="mt-2">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
