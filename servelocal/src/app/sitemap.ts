import type { MetadataRoute } from "next";
import { COST_GUIDES, TRADE_CITIES } from "@/lib/constants";

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://www.servelocal.ca";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    "/",
    "/signup",
    "/login",
    "/request",
    "/join",
    "/pricing",
    "/guides",
    "/search",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/request" || path === "/join" ? 0.9 : 0.6,
  }));

  const cityPages: MetadataRoute.Sitemap = TRADE_CITIES.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = Object.keys(COST_GUIDES).map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...cityPages, ...guidePages];
}
