import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata = marketingMetadata({
  title: "Blog",
  description: "Guides on AI receptionists, voice AI for local businesses, and PIPEDA compliance.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-3xl">
          <h1 className="font-display text-4xl text-ghost-white">Blog</h1>
          <p className="mt-3 text-on-surface-variant">
            Practical guides for Canadian businesses adopting voice AI.
          </p>
          <div className="mt-10 space-y-6">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="glass-card p-6">
                <time className="text-xs text-muted">{post.date}</time>
                <h2 className="font-display mt-2 text-xl text-text">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary-glow">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                <p className="mt-3 text-xs text-muted">{post.readMinutes} min read</p>
              </article>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
