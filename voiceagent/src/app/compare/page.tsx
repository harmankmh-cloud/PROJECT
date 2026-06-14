import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { COMPARISON_HUB, COMPARISON_PAGES } from "@/lib/comparison-pages";
import { COMPARISON_MATRIX } from "@/lib/comparison-matrix";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Compare GreetQ",
  description: `See how ${BRAND.name} compares to Retell, Bland.ai, JustCall, and hiring a receptionist.`,
  alternates: { canonical: "/compare" },
};

export default function CompareHubPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Compare GreetQ",
          description: `How ${BRAND.name} compares to Retell AI, Bland.ai, and JustCall`,
          url: `https://${BRAND.domain}/compare`,
        }}
      />
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-5xl">
          <p className="section-eyebrow mb-3">Compare</p>
          <h1 className="font-display text-4xl text-ghost-white">How GreetQ compares</h1>
          <p className="mt-4 text-lg text-on-surface-variant">
            Honest comparisons focused on pricing, compliance, and fit for Canadian local businesses.
            We do not fabricate competitor feature claims.
          </p>

          <section className="mt-12" aria-labelledby="compare-matrix-heading">
            <h2 id="compare-matrix-heading" className="font-display mb-6 text-2xl text-text">
              Feature matrix
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th scope="col" className="p-4 font-medium text-muted">
                      Feature
                    </th>
                    <th scope="col" className="p-4 font-medium text-violet-400">
                      GreetQ
                    </th>
                    <th scope="col" className="p-4 font-medium text-muted">
                      Retell AI
                    </th>
                    <th scope="col" className="p-4 font-medium text-muted">
                      Bland.ai
                    </th>
                    <th scope="col" className="p-4 font-medium text-muted">
                      JustCall
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_MATRIX.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50">
                      <th scope="row" className="p-4 font-medium text-text">
                        {row.feature}
                      </th>
                      <td className="p-4 text-text">{row.greetq}</td>
                      <td className="p-4 text-muted">{row.retell}</td>
                      <td className="p-4 text-muted">{row.bland}</td>
                      <td className="p-4 text-muted">{row.justcall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ul className="mt-12 space-y-4">
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
