import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { TrustBadgeStrip } from "@/components/marketing/TrustBadgeStrip";
import { TrustMarquee } from "@/components/marketing/TrustMarquee";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";
import { FAQ_ITEMS } from "@/lib/marketing-content";

const BentoFeatures = dynamic(() =>
  import("@/components/marketing/BentoFeatures").then((m) => ({ default: m.BentoFeatures }))
);

const IndustriesSection = dynamic(() =>
  import("@/components/marketing/IndustriesSection").then((m) => ({ default: m.IndustriesSection }))
);

const PricingSection = dynamic(() =>
  import("@/components/marketing/PricingSection").then((m) => ({ default: m.PricingSection }))
);

const RoiCalculator = dynamic(() =>
  import("@/components/marketing/RoiCalculator").then((m) => ({ default: m.RoiCalculator }))
);

const DemoCtaSection = dynamic(() =>
  import("@/components/marketing/DemoCtaSection").then((m) => ({ default: m.DemoCtaSection }))
);

const TestimonialsSection = dynamic(() =>
  import("@/components/marketing/TestimonialsSection").then((m) => ({
    default: m.TestimonialsSection,
  }))
);

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
    <div className="aurora-bg flex min-h-screen flex-col overflow-x-hidden">
      <SkipToContent />
      <MarketingNavbar />

      <main id="main-content">
        <HeroSection />
        <TrustMarquee />
        <TrustBadgeStrip />
        <HowItWorks />
        <BentoFeatures />
        <IndustriesSection />
        <PricingSection />
        <RoiCalculator />
        <DemoCtaSection />
        <TestimonialsSection />

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
  );
}
