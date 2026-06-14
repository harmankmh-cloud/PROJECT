import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { pageMetadata } from "@/lib/seo";
import { BLOG_ARTICLES, BLOG_POSTS, type BlogSlug } from "@/lib/site-content";

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const article = BLOG_ARTICLES[slug as BlogSlug];

  return (
    <MarketingPageShell>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
          ← Blog
        </Link>
        <p className="font-label mt-4 text-primary">{post.category}</p>
        <h1 className="font-display mt-2 text-4xl font-black text-foreground">{post.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {post.date} · {post.readMinutes} min read
        </p>

        <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
          {article.sections.map((section, i) => (
            <section key={i} className="mb-8">
              {section.heading && (
                <h2 className="font-display text-xl font-bold text-foreground">{section.heading}</h2>
              )}
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[14px] bg-foreground px-6 py-8 text-center text-background">
          <h2 className="font-display text-xl font-bold">Ready to hire?</h2>
          <p className="mt-2 text-sm text-background/60">Post your job and call local pros direct.</p>
          <ShimmerButton href="/request" className="mt-4">
            Get free quotes
          </ShimmerButton>
        </div>
      </article>
    </MarketingPageShell>
  );
}
