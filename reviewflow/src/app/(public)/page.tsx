import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BentoFeatures } from "@/components/marketing/BentoFeatures";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { IndustriesSection } from "@/components/marketing/IndustriesSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { PricingSection } from "@/components/marketing/PricingSection";
import { StatsBar } from "@/components/marketing/StatsBar";
import { WhyItsSafeSection } from "@/components/marketing/WhyItsSafeSection";
import { BRAND } from "@/lib/brand";
import { FAQ_ITEMS } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Turn Happy Customers Into Google Reviews — Automatically",
  description:
    "RateLocal helps BC businesses collect more 5-star Google reviews using AI-powered prompts. No fake reviews. No risk. Just results.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
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
        areaServed: "British Columbia, Canada",
      },
      {
        "@type": "SoftwareApplication",
        name: BRAND.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main className="marketing-page min-h-screen bg-white">
      <MarketingNavbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <WhyItsSafeSection />
      <BentoFeatures />
      <IndustriesSection />
      <PricingSection />

      <section className="border-t border-border/80 py-20 md:py-28" id="faq">
        <div className="marketing-container max-w-3xl">
          <p className="section-eyebrow mx-auto mb-4 w-fit">FAQ</p>
          <h2 className="font-display mb-12 text-center text-3xl text-text md:text-4xl">
            Frequently asked questions
          </h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketingFooter />
    </main>
  );
}
