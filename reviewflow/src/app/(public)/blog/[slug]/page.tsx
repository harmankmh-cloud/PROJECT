import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getBlogPost } from "@/data/blog-posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return { title: post?.title ?? "Blog" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <main>
      <LandingNavbar />
      <article className="marketing-container max-w-3xl py-16">
        <Link href="/blog" className="text-sm text-muted hover:text-primary">← Blog</Link>
        <span className="mt-6 block text-sm font-medium text-primary">{post.category}</span>
        <h1 className="font-display mt-2 text-3xl font-bold text-text md:text-4xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {new Date(post.date).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="prose prose-invert mt-10 max-w-none">
          <p className="text-lg text-muted">{post.excerpt}</p>
          <p className="mt-6 text-text">
            Full article content coming soon. RateLocal publishes guides to help Canadian businesses
            and consumers make the most of local reviews.
          </p>
        </div>
      </article>
      <LandingFooter />
    </main>
  );
}
