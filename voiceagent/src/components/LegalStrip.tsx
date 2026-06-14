import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function LegalStrip() {
  return (
    <section
      className="border-t border-glass-border-subtle bg-surface-container/60 py-10"
      aria-label="Legal and contact"
    >
      <div className="marketing-container">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-lg font-bold text-ghost-white">Legal & privacy</h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-primary hover:underline">
                  Security & compliance
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-text">
              {BRAND.legalName} operates from {BRAND.location.label}. We process personal information in line with
              PIPEDA and applicable provincial privacy laws. Call recording requires caller consent under Canadian law.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ghost-white">Contact</h2>
            <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <li>
                <a href={`mailto:${BRAND.contact.email}`} className="text-primary hover:underline">
                  {BRAND.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${BRAND.contact.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
                  {BRAND.contact.phone}
                </a>
                <span className="text-slate-text"> · {BRAND.contact.phoneNote}</span>
              </li>
              <li>{BRAND.location.label}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
