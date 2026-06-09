import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import type { IndustrySlug } from "@/lib/industry-pages";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

export function IndustryPageTemplate({ slug }: { slug: IndustrySlug }) {
  const page = INDUSTRY_PAGES[slug];

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-3xl">
          <p className="section-eyebrow mb-3">Industry</p>
          <h1 className="font-display text-4xl text-ghost-white">{page.title}</h1>
          <p className="mt-4 text-lg text-on-surface-variant">{page.description}</p>

          <div className="glass-card mt-10 p-8">
            <h2 className="font-display text-2xl text-text">{page.headline}</h2>
            <ul className="mt-6 space-y-3">
              {page.points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary px-8 py-3.5 text-center">
              {page.cta}
            </Link>
            <Link href="/demo" className="btn-secondary px-8 py-3.5 text-center">
              Explore demo dashboard
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
