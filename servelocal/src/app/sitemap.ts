import type { MetadataRoute } from "next";
import { COST_GUIDES, TRADE_CITIES } from "@/lib/constants";
import { BLOG_POSTS } from "@/lib/site-content";

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
    "/request",
    "/join",
    "/pricing",
    "/guides",
    "/search",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/refer",
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

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...guidePages, ...blogPages];
}
