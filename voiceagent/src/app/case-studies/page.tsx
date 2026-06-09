import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Case studies",
  description: "How local businesses use GreetQ for call answering, booking, and compliance.",
  alternates: { canonical: "/case-studies" },
};

const CASE_STUDIES = BLOG_POSTS.filter((p) =>
  [
    "ai-receptionist-bc-dental-clinics",
    "voice-ai-hvac-companies",
    "north-shore-hvac-case-study",
  ].includes(p.slug)
);

export default function CaseStudiesPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-3xl">
          <p className="section-eyebrow mb-3">Case studies</p>
          <h1 className="font-display text-4xl text-ghost-white">Customer stories</h1>
          <p className="mt-4 text-on-surface-variant">
            Real-world deployment patterns from dental, HVAC, and service businesses in Canada.
          </p>

          <ul className="mt-10 space-y-6">
            {CASE_STUDIES.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="glass-card block p-6 transition hover:border-primary/30"
                >
                  <p className="text-xs text-muted">
                    {post.date} · {post.readMinutes} min read
                  </p>
                  <h2 className="mt-2 font-display text-xl text-text">{post.title}</h2>
                  <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-muted">
            More on the{" "}
            <Link href="/blog" className="text-primary-glow hover:underline">
              blog
            </Link>
            .
          </p>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
