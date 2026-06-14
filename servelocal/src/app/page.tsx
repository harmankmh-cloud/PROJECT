import type { Metadata } from "next";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { CategorySpotlight } from "@/components/landing/CategorySpotlight";
import { FeaturedProsCarousel } from "@/components/landing/FeaturedProsCarousel";
import { ForProsSection } from "@/components/landing/ForProsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsBarSection } from "@/components/landing/StatsBarSection";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { SERVE_LOCAL } from "@/lib/constants";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ServeLocal — Find Trusted Local Pros in Minutes",
  description:
    "ServeLocal connects Canadian homeowners with vetted, reviewed contractors — fast booking, upfront pricing, zero stress. Serving Canada, starting in BC.",
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

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.servelocal.ca";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SERVE_LOCAL.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
        areaServed: "Canada",
        description: "Canada's trusted home services marketplace",
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
      <CategoryGrid categories={categories} proCounts={proCounts} />
      <HowItWorks />
      <FeaturedProsCarousel providers={featured} categories={categories} />
      <StatsBarSection />
      <CategorySpotlight />
      <TestimonialsCarousel />
      <ForProsSection />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingPageShell>
  );
}
