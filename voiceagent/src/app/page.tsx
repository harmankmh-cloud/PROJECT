import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BentoFeatures } from "@/components/marketing/BentoFeatures";
import { DemoCtaSection } from "@/components/marketing/DemoCtaSection";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { IndustriesSection } from "@/components/marketing/IndustriesSection";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { PricingSection } from "@/components/marketing/PricingSection";
import { TrustMarquee } from "@/components/marketing/TrustMarquee";
import { SkipToContent } from "@/components/SkipToContent";
import { PageTransition } from "@/components/ui/PageTransition";
import { BRAND } from "@/lib/brand";
import { FAQ_ITEMS } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Your Business Never Misses a Call. Ever.",
  description:
    "GreetQ answers calls 24/7, books appointments, and handles FAQs for Canadian small businesses.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const siteUrl = `https://${BRAND.domain}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.legalName,
        alternateName: BRAND.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
      },
      {
        "@type": "SoftwareApplication",
        name: BRAND.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        offers: { "@type": "Offer", price: "79", priceCurrency: "CAD" },
      },
    ],
  };

  return (
    <PageTransition>
      <div className="aurora-bg flex min-h-screen flex-col overflow-x-hidden">
        <SkipToContent />
        <MarketingNavbar />

        <main id="main-content">
          <HeroSection />
          <TrustMarquee />
          <HowItWorks />
          <BentoFeatures />
          <IndustriesSection />
          <PricingSection />
          <DemoCtaSection />

          <section className="border-t border-border py-20" id="faq">
            <div className="mx-auto max-w-3xl px-5">
              <h2 className="font-display mb-10 text-center text-3xl text-text">
                Frequently asked questions
              </h2>
              <FaqAccordion items={FAQ_ITEMS} />
            </div>
          </section>
        </main>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MarketingFooterNew />
      </div>
    </PageTransition>
  );
}
