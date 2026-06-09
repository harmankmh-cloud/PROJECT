import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { PricingPageClient } from "@/components/landing/PricingPageClient";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "GreetQ pricing: Starter $79, Growth $199, Pro $399, and Enterprise AI phone agent plans. Flat monthly with minutes included.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pt-24">
        <PricingPageClient />
      </main>
      <LandingFooter />
    </div>
  );
}
