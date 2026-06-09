import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { COMPARISON_HUB, COMPARISON_PAGES } from "@/lib/comparison-pages";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Compare GreetQ",
  description: `See how ${BRAND.name} compares to Retell, Bland.ai, JustCall, and hiring a receptionist.`,
  alternates: { canonical: "/compare" },
};

export default function CompareHubPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-3xl">
          <p className="section-eyebrow mb-3">Compare</p>
          <h1 className="font-display text-4xl text-ghost-white">How GreetQ compares</h1>
          <p className="mt-4 text-lg text-on-surface-variant">
            Honest comparisons focused on pricing, compliance, and fit for Canadian local businesses.
            We do not fabricate competitor feature claims.
          </p>

          <ul className="mt-10 space-y-4">
            {COMPARISON_HUB.map((item) => {
              const page = COMPARISON_PAGES[item.slug];
              return (
                <li key={item.slug}>
                  <Link
                    href={`/compare/${item.slug}`}
                    className="glass-card block p-6 transition hover:border-primary/30"
                  >
                    <h2 className="font-display text-xl text-text">{page.title}</h2>
                    <p className="mt-2 text-sm text-muted">{page.summary}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
