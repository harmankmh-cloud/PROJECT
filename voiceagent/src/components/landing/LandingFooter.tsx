import Link from "next/link";
import dynamic from "next/dynamic";
import { BRAND } from "@/lib/brand";
import { LANDING_COPY } from "@/lib/copy/landing";
import { getFooterColumns, type MarketingLocale } from "@/lib/marketing-chrome";
import { TrustBar } from "./TrustBar";
import { StatusBadge } from "./StatusBadge";

const ConversionWidgets = dynamic(() =>
  import("./ConversionWidgets").then((m) => ({ default: m.ConversionWidgets }))
);

export function LandingFooter({ locale = "en" }: { locale?: MarketingLocale }) {
  const columns = getFooterColumns(locale, BRAND.contact.email);
  const isFr = locale === "fr";

  return (
    <footer className="border-t border-border bg-surface/50 py-14">
      <div className="marketing-container">
        <div className="flex flex-col items-center gap-4">
          <TrustBar locale={locale} />
          <StatusBadge locale={locale} />
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-display text-lg text-text">{BRAND.name}</p>
            <p className="mt-2 text-sm text-muted">
              {isFr ? "Agents téléphoniques IA qui accueillent chaque appel" : BRAND.tagline}
            </p>
            <p className="mt-3 text-sm text-muted">
              {isFr ? "Créé au Canada" : LANDING_COPY.footer.tagline} 🍁
            </p>
            <p className="mt-3 text-xs text-muted">
              {isFr ? "Vancouver, Colombie-Britannique, Canada" : BRAND.location.label}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 text-sm font-semibold text-text">{col.title}</h5>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.href}`}>
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
          © {new Date().getFullYear()} {BRAND.legalName}{" "}
          {isFr ? "Tous droits réservés." : "All rights reserved."}
        </p>
      </div>
      <ConversionWidgets />
    </footer>
  );
}
