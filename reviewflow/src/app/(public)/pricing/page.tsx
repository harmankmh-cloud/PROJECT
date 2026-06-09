import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingPageContent } from "@/components/landing/PricingPageContent";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free, Pro, and Enterprise plans for Canadian local businesses.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main>
      <LandingNavbar />
      <PricingPageContent />
      <LandingFooter />
    </main>
  );
}
