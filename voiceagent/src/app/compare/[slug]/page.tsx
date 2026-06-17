import { notFound } from "next/navigation";
import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { ComparisonPageTemplate } from "@/components/marketing/ComparisonPageTemplate";
import { COMPARISON_PAGES, type ComparisonSlug } from "@/lib/comparison-pages";

const SLUGS = Object.keys(COMPARISON_PAGES) as ComparisonSlug[];

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = COMPARISON_PAGES[slug as ComparisonSlug];
  if (!page) return marketingMetadata({ title: "Compare", description: "Compare GreetQ", path: `/compare/${slug}` });
  return marketingMetadata({
    title: page.title,
    description: page.summary,
    path: `/compare/${slug}`,
  });
}

export default async function CompareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SLUGS.includes(slug as ComparisonSlug)) notFound();
  return <ComparisonPageTemplate slug={slug as ComparisonSlug} />;
}
