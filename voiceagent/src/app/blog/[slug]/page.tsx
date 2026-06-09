import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BLOG_POSTS } from "@/lib/blog-posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <article className="marketing-container mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-primary-glow hover:underline">
            ← Back to blog
          </Link>
          <time className="mt-6 block text-xs text-muted">{post.date}</time>
          <h1 className="font-display mt-2 text-4xl text-ghost-white">{post.title}</h1>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-on-surface-variant">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <Link href="/signup" className="btn-primary mt-10 inline-block px-8 py-3">
            Get started free
          </Link>
        </article>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
