import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { COMPARISON_HUB } from "@/lib/comparison-pages";
import { HELP_ARTICLES } from "@/lib/help-articles";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";
import { BRAND } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${BRAND.domain}`;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/signup`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/features`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/demo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/integrations`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/help`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/docs`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/docs/quickstart`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/docs/api/calls`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/docs/webhooks`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/testimonials`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/case-studies`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/status`, changeFrequency: "daily", priority: 0.4 },
    { url: `${base}/community`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/press`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/careers`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/languages`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/security`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/changelog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/resources/buyers-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/fr`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const industryRoutes = Object.keys(INDUSTRY_PAGES).map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const compareRoutes = COMPARISON_HUB.map((c) => ({
    url: `${base}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const helpRoutes = HELP_ARTICLES.map((a) => ({
    url: `${base}/help/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...industryRoutes, ...blogRoutes, ...compareRoutes, ...helpRoutes];
}
