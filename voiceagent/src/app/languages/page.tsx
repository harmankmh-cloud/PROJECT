import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Languages",
  description: `Language support for ${BRAND.name} voice agents — English, Spanish beta, and French roadmap.`,
  path: "/languages",
});


const LANGUAGES = [
  {
    name: "English",
    status: "Available",
    note: "Fully supported for inbound and outbound on all plans.",
  },
  {
    name: "Spanish",
    status: "Beta",
    note: "Per-agent configuration. Quality varies by accent and domain — contact us for pilot feedback.",
  },
  {
    name: "French",
    status: "Roadmap",
    note: "Planned for Canadian operators. Enterprise customers can request early access requirements.",
  },
] as const;

export default function LanguagesPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-2xl">
          <p className="section-eyebrow mb-3">Languages</p>
          <h1 className="font-display text-4xl text-ghost-white">Multilingual support</h1>
          <p className="mt-4 text-on-surface-variant">
            {BRAND.name} is English-first with expanding language support. We do not claim full
            multilingual parity until each language passes our quality bar.
          </p>

          <ul className="mt-10 space-y-4">
            {LANGUAGES.map((lang) => (
              <li key={lang.name} className="glass-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-xl text-text">{lang.name}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      lang.status === "Available"
                        ? "bg-success/20 text-success"
                        : lang.status === "Beta"
                          ? "bg-primary/20 text-primary-glow"
                          : "bg-surface text-muted"
                    }`}
                  >
                    {lang.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">{lang.note}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-muted">
            Need a specific language for Enterprise?{" "}
            <Link href="/help?intent=enterprise" className="text-primary-glow hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
