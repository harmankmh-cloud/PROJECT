import type { Metadata } from "next";
import { LinearStripeLanding } from "@/components/marketing/LinearStripeLanding";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Turn Every Visit Into a Google Review",
  description:
    "RateLocal helps BC businesses collect honest Google reviews with QR prompts, AI review drafts, and private complaint routing.",
  alternates: { canonical: `https://${BRAND.domain}` },
  openGraph: {
    title: "Turn Every Visit Into a Google Review",
    description:
      "RateLocal helps BC businesses collect honest Google reviews with QR prompts, AI review drafts, and private complaint routing.",
    url: `https://${BRAND.domain}`,
    siteName: BRAND.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turn Every Visit Into a Google Review",
    description:
      "RateLocal helps BC businesses collect honest Google reviews with QR prompts, AI review drafts, and private complaint routing.",
  },
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
        "@type": "WebSite",
        name: BRAND.name,
        url: siteUrl,
        inLanguage: "en-CA",
      },
      {
        "@type": "LocalBusiness",
        name: BRAND.name,
        url: siteUrl,
        email: BRAND.contact.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: BRAND.location.city,
          addressRegion: BRAND.location.region,
          addressCountry: BRAND.location.country,
        },
        areaServed: [
          { "@type": "Place", name: "Fraser Valley, BC" },
          { "@type": "AdministrativeArea", name: "British Columbia" },
        ],
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
