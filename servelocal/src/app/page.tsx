import type { Metadata } from "next";
import { BrandPromiseSection } from "@/components/landing/BrandPromiseSection";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { CategorySpotlight } from "@/components/landing/CategorySpotlight";
import { FeaturedProsCarousel } from "@/components/landing/FeaturedProsCarousel";
import { ForProsSection } from "@/components/landing/ForProsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsBarSection } from "@/components/landing/StatsBarSection";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { EmptyDirectoryState } from "@/components/search/EmptyDirectoryState";
import { SERVE_LOCAL } from "@/lib/constants";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";
import { canonicalBaseUrl, jsonLdScript, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hire trusted local pros in BC | ServeLocal",
  description:
    "ServeLocal helps BC homeowners quickly find trusted local contractors with clear profiles, real reviews, and a simpler way to get jobs done.",
  path: "/",
});

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getServiceCategories(),
    getApprovedProviders({ featuredOnly: true, sort: "recommended" }),
  ]);

  const proCounts: Record<string, number> = {};
  for (const p of featured) {
    proCounts[p.category_slug] = (proCounts[p.category_slug] ?? 0) + 1;
  }
  const platformStats = {
    providers: featured.length,
    verified: featured.filter((p) => p.verified).length,
    reviews: featured.reduce((sum, p) => sum + (p.review_count ?? 0), 0),
    cities: new Set(featured.map((p) => p.city_slug)).size,
  };

  const siteUrl = canonicalBaseUrl;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SERVE_LOCAL.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
        areaServed: "Canada",
        description: "Homeowner-first local services marketplace built in BC.",
      },
      {
        "@type": "WebSite",
        name: SERVE_LOCAL.name,
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <MarketingPageShell>
      <HeroSection />
      <BrandPromiseSection />
      <CategoryGrid categories={categories} proCounts={proCounts} />
      <HowItWorks />
      {featured.length > 0 ? (
        <FeaturedProsCarousel providers={featured} categories={categories} />
      ) : (
        <section className="border-t border-border px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <EmptyDirectoryState citySlug="abbotsford" />
          </div>
        </section>
      )}
      <StatsBarSection platformStats={platformStats} />
      <CategorySpotlight />
      <TestimonialsCarousel />
      <ForProsSection />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    </MarketingPageShell>
  );
}
