import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { COMPARISON_HUB, COMPARISON_PAGES, type ComparisonSlug } from "@/lib/comparison-pages";

export function ComparisonPageTemplate({ slug }: { slug: ComparisonSlug }) {
  const page = COMPARISON_PAGES[slug];

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-3xl">
          <p className="section-eyebrow mb-3">Compare</p>
          <h1 className="font-display text-4xl text-ghost-white">{page.title}</h1>
          <p className="mt-4 text-lg text-on-surface-variant">{page.summary}</p>

          <div className="glass-card mt-10 p-8">
            <h2 className="font-display text-2xl text-text">{page.headline}</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-primary-glow">GreetQ</h3>
                <ul className="mt-3 space-y-2">
                  {page.greetqPoints.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted">
                      <span className="text-accent">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted">{page.competitor}</h3>
                <ul className="mt-3 space-y-2">
                  {page.competitorPoints.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted">
                      <span className="text-muted">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary px-8 py-3.5 text-center">
              {page.cta}
            </Link>
            {slug === "vs-receptionist" && (
              <Link href="/#roi" className="btn-secondary px-8 py-3.5 text-center">
                ROI calculator
              </Link>
            )}
            <Link href="/compare" className="btn-ghost px-8 py-3.5 text-center">
              All comparisons
            </Link>
          </div>

          <nav className="mt-12 border-t border-border pt-8">
            <p className="text-sm font-medium text-text">Related comparisons</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {COMPARISON_HUB.filter((c) => c.slug !== slug).map((c) => (
                <li key={c.slug}>
                  <Link href={`/compare/${c.slug}`} className="text-sm text-primary-glow hover:underline">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
