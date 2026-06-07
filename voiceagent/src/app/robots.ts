import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/login", "/signup", "/admin/"],
    },
    sitemap: `https://${BRAND.domain}/sitemap.xml`,
  };
}
