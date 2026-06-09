import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { BLOG_POSTS } from "@/data/blog-posts";
import { FadeInSection } from "@/components/ui/FadeInSection";

export const metadata: Metadata = {
  title: "Blog",
  description: "Business tips, consumer guides, and platform updates from RateLocal.",
};

const CATEGORIES = ["Business Tips", "Consumer Guides", "Platform Updates"] as const;

type Props = { searchParams: Promise<{ category?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const featured = BLOG_POSTS.find((p) => p.featured);
  const posts = category
    ? BLOG_POSTS.filter((p) => p.category === category)
    : BLOG_POSTS.filter((p) => !p.featured);

  return (
    <main>
      <LandingNavbar />
      <div className="marketing-container py-16">
        <FadeInSection>
          <h1 className="font-display text-3xl font-bold text-text">Blog</h1>
          <p className="mt-2 text-muted">Tips for businesses and consumers</p>
        </FadeInSection>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-1.5 text-sm ${!category ? "bg-primary text-white" : "border border-border text-muted"}`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/blog?category=${encodeURIComponent(c)}`}
              className={`rounded-full px-4 py-1.5 text-sm ${category === c ? "bg-primary text-white" : "border border-border text-muted"}`}
            >
              {c}
            </Link>
          ))}
        </div>

        {featured && !category && (
          <Link href={`/blog/${featured.slug}`} className="card-glow mt-10 block p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">Featured</span>
            <h2 className="font-display mt-2 text-2xl font-bold text-text md:text-3xl">{featured.title}</h2>
            <p className="mt-3 max-w-2xl text-muted">{featured.excerpt}</p>
          </Link>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-glow block p-6">
              <span className="text-xs font-medium text-primary">{post.category}</span>
              <h3 className="mt-2 font-display text-lg font-bold text-text">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
              <p className="mt-4 text-xs text-muted">
                {new Date(post.date).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <LandingFooter />
    </main>
  );
}
