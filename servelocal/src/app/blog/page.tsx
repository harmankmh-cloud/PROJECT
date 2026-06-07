import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/site-content";

export const metadata: Metadata = pageMetadata({
  title: "Blog — BC Trades Tips & Cost Guides",
  description:
    "ServeLocal blog: hiring tips, Fraser Valley pricing insights, and home maintenance checklists for BC homeowners.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        <p className="section-eyebrow">Blog</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">Tips for BC homeowners</h1>
        <p className="mt-3 text-slate-600">
          Hiring advice, local pricing, and seasonal maintenance — from the ServeLocal team.
        </p>

        <ul className="mt-10 space-y-4">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="surface-card-hover block p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{post.category}</p>
                <h2 className="font-display mt-1 text-xl font-bold text-brand-950">{post.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {post.date} · {post.readMinutes} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-slate-500">
          Need a pro now?{" "}
          <Link href="/request" className="font-semibold text-teal-600 hover:underline">
            Post a free job
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
