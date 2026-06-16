import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

const siteUrl = `https://${BRAND.domain}`;

type MarketingMetadataInput = {
  title: string;
  description: string;
  path: string;
};

/** Page-level Open Graph + Twitter cards for marketing routes (overrides root layout defaults). */
export function marketingMetadata({
  title,
  description,
  path,
}: MarketingMetadataInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${siteUrl}${canonicalPath}`;
  const socialTitle = title.includes(BRAND.name) ? title : `${title} · ${BRAND.name}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      locale: "en_CA",
      url,
      siteName: BRAND.name,
      title: socialTitle,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: BRAND.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
