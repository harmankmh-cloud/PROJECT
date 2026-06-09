import type { Metadata } from "next";
import { FinalCtaBanner } from "@/components/landing/FinalCtaBanner";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { StatsBar } from "@/components/landing/StatsBar";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Your AI Receptionist. Always On.",
  description:
    "GreetQ answers calls, books appointments, and greets every customer like a pro — so you don't have to.",
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-bg">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content">
        <LandingHero />
        <LogoMarquee />
        <FeaturesBento />
        <LandingHowItWorks />
        <StatsBar />
        <LandingTestimonials />
        <PricingTeaser />
        <FinalCtaBanner />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingFooter />
    </div>
  );
}
