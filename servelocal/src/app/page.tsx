import type { Metadata } from "next";
import { BcCitiesSection } from "@/components/marketing/BcCitiesSection";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { CostGuideSection } from "@/components/marketing/CostGuideSection";
import { FeaturedProsCarousel } from "@/components/marketing/FeaturedProsCarousel";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorksDual } from "@/components/marketing/HowItWorksDual";
import { LandingCta } from "@/components/marketing/LandingCta";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SocialProofMarquee } from "@/components/marketing/SocialProofMarquee";
import { TrustBar } from "@/components/marketing/TrustBar";
import { SERVE_LOCAL } from "@/lib/constants";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ServeLocal BC — Find Trusted Local Pros, Zero Middleman Fees",
  description:
    "Post your job free. Get contacted by verified BC tradespeople in Abbotsford, Chilliwack, Surrey, and the Fraser Valley. No commission. Direct contact.",
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
        areaServed: "British Columbia, Canada",
        description: SERVE_LOCAL.tagline,
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
    <main className="min-h-screen bg-background text-text">
      <MarketingNavbar />
      <HeroSection />
      <TrustBar />
      <CategoryGrid categories={categories} proCounts={proCounts} />
      <HowItWorksDual />
      <FeaturedProsCarousel providers={featured} categories={categories} />
      <BcCitiesSection />
      <CostGuideSection />
      <SocialProofMarquee />
      <LandingCta />
      <MarketingFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
