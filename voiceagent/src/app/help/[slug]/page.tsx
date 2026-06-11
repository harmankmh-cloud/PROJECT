import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { getHelpArticle, HELP_ARTICLES, HELP_CATEGORIES } from "@/lib/help-articles";

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getHelpArticle(slug);
  if (!article) return { title: "Help" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/help/${slug}` },
  };
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getHelpArticle(slug);
  if (!article) notFound();

  const categoryLabel = HELP_CATEGORIES.find((c) => c.id === article.category)?.label;

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          url: `https://${BRAND.domain}/help/${slug}`,
          author: { "@type": "Organization", name: BRAND.name },
          publisher: { "@type": "Organization", name: BRAND.name },
        }}
      />
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-2xl">
          <Link href="/help" className="text-sm text-primary-glow hover:underline">
            ← Help center
          </Link>
          <p className="section-eyebrow mt-6 mb-3">{categoryLabel}</p>
          <h1 className="font-display text-3xl text-ghost-white">{article.title}</h1>
          <p className="mt-3 text-on-surface-variant">{article.excerpt}</p>

          <div className="glass-card mt-10 space-y-4 p-8">
            {article.body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-10 text-sm text-muted">
            Still need help?{" "}
            <Link href="/help#contact" className="text-primary-glow hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
