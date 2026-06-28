import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

const siteUrl = `https://${BRAND.domain}`;

type MarketingMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale?: "en_CA" | "fr_CA";
  robots?: Metadata["robots"];
  ogType?: "website" | "article";
};

/** Page-level Open Graph + Twitter cards for marketing routes (overrides root layout defaults). */
export function marketingMetadata({
  title,
  description,
  path,
  locale = "en_CA",
  robots,
  ogType = "website",
}: MarketingMetadataInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${siteUrl}${canonicalPath}`;
  const socialTitle = title.includes(BRAND.name) ? title : `${title} · ${BRAND.name}`;

  const languages =
    locale === "fr_CA" || canonicalPath === "/fr"
      ? { "en-CA": siteUrl, "fr-CA": `${siteUrl}/fr` }
      : undefined;

  return {
    title,
    description,
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: ogType,
      locale,
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
