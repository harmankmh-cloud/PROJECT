import type { Metadata } from "next";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { FeaturedBusinesses } from "@/components/landing/FeaturedBusinesses";
import { ForBusinessStrip } from "@/components/landing/ForBusinessStrip";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { PlatformStatsBar } from "@/components/landing/PlatformStatsBar";
import { WhyRateLocal } from "@/components/landing/WhyRateLocal";
import { BRAND } from "@/lib/brand";
import { getFeaturedBusinesses } from "@/lib/public-businesses";

export const metadata: Metadata = {
  title: "Find. Trust. Support Local.",
  description:
    "RateLocal is Canada's review platform built for real customers and real businesses — discover, rate, and support local.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const featured = await getFeaturedBusinesses(undefined, 6);
  const siteUrl = `https://${BRAND.domain}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
        email: "hello@ratelocal.ca",
        areaServed: "Canada",
      },
      {
        "@type": "WebSite",
        name: BRAND.name,
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
    <main>
      <LandingNavbar />
      <LandingHero />
      <PlatformStatsBar />
      <FeaturedBusinesses businesses={featured} />
      <CategoryGrid />
      <WhyRateLocal />
      <ForBusinessStrip />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingFooter />
    </main>
  );
}
