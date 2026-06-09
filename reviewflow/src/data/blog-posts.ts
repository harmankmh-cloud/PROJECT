export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Business Tips" | "Consumer Guides" | "Platform Updates";
  date: string;
  featured?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-get-more-reviews",
    title: "How to Get More Reviews for Your Local Business",
    excerpt: "Practical strategies Canadian businesses use to grow authentic reviews without violating platform policies.",
    category: "Business Tips",
    date: "2026-05-01",
    featured: true,
  },
  {
    slug: "responding-to-negative-reviews",
    title: "Responding to Negative Reviews: A Canadian Business Guide",
    excerpt: "Turn criticism into trust with professional, empathetic owner responses.",
    category: "Business Tips",
    date: "2026-04-15",
  },
  {
    slug: "local-seo-canadian-businesses",
    title: "Local SEO for Canadian Businesses in 2026",
    excerpt: "Rank higher in local search with consistent citations, reviews, and Google Business Profile optimization.",
    category: "Business Tips",
    date: "2026-03-28",
  },
  {
    slug: "how-to-spot-fake-reviews",
    title: "How to Spot Fake Reviews",
    excerpt: "What consumers should look for when evaluating business reviews online.",
    category: "Consumer Guides",
    date: "2026-04-02",
  },
  {
    slug: "ratelocal-ai-summaries",
    title: "Introducing AI Review Summaries",
    excerpt: "RateLocal now generates helpful summaries from real customer feedback on every business page.",
    category: "Platform Updates",
    date: "2026-05-20",
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}
