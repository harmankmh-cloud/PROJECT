import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { BlogListing } from "@/components/blog/BlogListing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog — Home Improvement Tips & Cost Guides",
  description:
    "Hiring tips, Canadian cost guides, DIY advice, and seasonal maintenance checklists from ServeLocal.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        <BlogListing />
      </div>
    </MarketingPageShell>
  );
}
