import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import dynamic from "next/dynamic";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

const FeaturesBento = dynamic(
  () => import("@/components/landing/FeaturesBento").then((m) => ({ default: m.FeaturesBento }))
);
const FeatureSpotlight = dynamic(
  () => import("@/components/landing/FeatureSpotlight").then((m) => ({ default: m.FeatureSpotlight }))
);
const DashboardShowcase = dynamic(
  () => import("@/components/landing/DashboardShowcase").then((m) => ({ default: m.DashboardShowcase }))
);
const ComparisonStrip = dynamic(
  () => import("@/components/landing/ComparisonStrip").then((m) => ({ default: m.ComparisonStrip }))
);
const SampleCallPlayer = dynamic(
  () => import("@/components/landing/SampleCallPlayer").then((m) => ({ default: m.SampleCallPlayer }))
);
const MissedRevenueEstimator = dynamic(
  () => import("@/components/landing/MissedRevenueEstimator").then((m) => ({ default: m.MissedRevenueEstimator }))
);
const LandingHowItWorks = dynamic(
  () => import("@/components/landing/LandingHowItWorks").then((m) => ({ default: m.LandingHowItWorks }))
);
const StatsBar = dynamic(() => import("@/components/landing/StatsBar").then((m) => ({ default: m.StatsBar })));
const LandingTestimonials = dynamic(
  () => import("@/components/landing/LandingTestimonials").then((m) => ({ default: m.LandingTestimonials }))
);
const PricingTeaser = dynamic(
  () => import("@/components/landing/PricingTeaser").then((m) => ({ default: m.PricingTeaser }))
);
const FinalCtaBanner = dynamic(
  () => import("@/components/landing/FinalCtaBanner").then((m) => ({ default: m.FinalCtaBanner }))
);

export const metadata = marketingMetadata({
  title: "Your AI Receptionist. Always On.",
  description: "GreetQ answers calls, books appointments, and greets every customer like a pro — so you don't have to.",
  path: "/",
});

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
        "@type": "WebSite",
        name: BRAND.name,
        url: siteUrl,
        description: BRAND.tagline,
        publisher: { "@type": "Organization", name: BRAND.legalName },
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
        <div className="perf-below-fold">
          <SampleCallPlayer />
        </div>
        <div className="perf-below-fold">
          <FeaturesBento />
        </div>
        <div className="perf-below-fold">
          <FeatureSpotlight />
        </div>
        <div className="perf-below-fold">
          <LandingHowItWorks />
        </div>
        <div className="perf-below-fold">
          <DashboardShowcase />
        </div>
        <div className="perf-below-fold">
          <StatsBar />
        </div>
        <div className="perf-below-fold">
          <LandingTestimonials />
        </div>
        <div className="perf-below-fold">
          <ComparisonStrip />
        </div>
        <div className="perf-below-fold">
          <MissedRevenueEstimator />
        </div>
        <div className="perf-below-fold">
          <PricingTeaser />
        </div>
        <div className="perf-below-fold">
          <FinalCtaBanner />
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingFooter />
    </div>
  );
}
