import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { PricingTableStatic } from "@/components/landing/PricingTableStatic";
import { SkipToContent } from "@/components/SkipToContent";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ_ITEMS } from "@/lib/marketing-content";
import { PLANS } from "@/lib/plans";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "GreetQ pricing: Starter $79, Growth $199, Pro $399, and Enterprise AI phone agent plans. Flat monthly with minutes included.",
  alternates: { canonical: "/pricing" },
};

function pricingJsonLd() {
  const siteUrl = `https://${BRAND.domain}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${BRAND.name} AI Receptionist`,
    description: "Canadian AI phone agent for local businesses",
    brand: { "@type": "Brand", name: BRAND.name },
    offers: (["starter", "growth", "pro"] as const).map((key) => ({
      "@type": "Offer",
      name: PLANS[key].name,
      price: PLANS[key].monthlyPrice,
      priceCurrency: "CAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: PLANS[key].monthlyPrice,
        priceCurrency: "CAD",
        unitText: "MONTH",
      },
      url: `${siteUrl}/signup?plan=${key}`,
      availability: "https://schema.org/InStock",
    })),
  };
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <JsonLd data={pricingJsonLd()} />
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pt-24">
        <PricingTableStatic />
        <section className="border-t border-border py-20">
          <div className="marketing-container mx-auto max-w-3xl">
            <h2 className="font-display mb-8 text-center text-2xl text-text">Pricing FAQ</h2>
            <FaqAccordion items={FAQ_ITEMS.slice(0, 8)} />
            <div className="mt-12 text-center">
              <p className="text-muted">Still not sure?</p>
              <Link
                href="/help?intent=demo"
                className="mt-4 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
              >
                Book a live demo →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
