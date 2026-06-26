import type { Metadata } from "next";
import { LinearStripeLanding } from "@/components/marketing/LinearStripeLanding";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Turn Every Visit Into a 5-Star Google Review — RateLocal",
  description:
    "RateLocal helps BC businesses collect honest Google reviews with QR prompts, AI review drafts, and private complaint routing.",
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
        email: BRAND.contact.email,
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
    ],
  };

  return (
    <>
      <LinearStripeLanding />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
