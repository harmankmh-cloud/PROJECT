import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { ProviderCard } from "@/components/ProviderCard";
import { COST_GUIDES, SERVE_LOCAL } from "@/lib/constants";
import { getGuideExtended } from "@/lib/marketing-content";
import { pageMetadata } from "@/lib/seo";
import { getApprovedProviders, getCategoryBySlug } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Guide not found" };

  return pageMetadata({
    title: `${cat.name} Cost Guide BC 2026`,
    description: `Typical ${cat.name.toLowerCase()} prices in British Columbia — Fraser Valley & Metro Vancouver ranges, hiring tips, and FAQs.`,
    path: `/guides/${category}`,
  });
}

export default async function GuideCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const guide = COST_GUIDES[category];
  const extended = getGuideExtended(category);
  const pros = await getApprovedProviders({ categorySlug: category, sort: "rating" });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.servelocal.ca" },
      { "@type": "ListItem", position: 2, name: "Cost guides", item: "https://www.servelocal.ca/guides" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${cat.name} costs`,
        item: `https://www.servelocal.ca/guides/${category}`,
      },
    ],
  };

  const faqJsonLd =
    extended && extended.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: extended.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <Link href="/guides" className="text-sm font-semibold text-primary hover:underline">
          ← All guides
        </Link>
        <h1 className="font-display mt-4 text-4xl font-black text-foreground">
          {cat.icon} {cat.name} costs in BC
        </h1>
        {extended && <p className="mt-4 max-w-3xl leading-relaxed text-muted">{extended.intro}</p>}

        {guide ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">Typical pricing</h2>
              {guide.low > 0 ? (
                <p className="font-display mt-2 text-3xl text-primary">
                  ${guide.low}–${guide.high} <span className="text-base text-muted">{guide.unit}</span>
                </p>
              ) : (
                <p className="mt-2 text-muted">Project-based — get multiple quotes</p>
              )}
              <h3 className="mt-6 font-semibold text-foreground">Common jobs</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {guide.commonJobs.map((job) => (
                  <li key={job.name} className="flex justify-between border-b border-border pb-2">
                    <span>{job.name}</span>
                    <span className="font-medium text-foreground">{job.range}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">Tips before you hire</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {guide.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <ShimmerButton href={`/request?category=${category}`} className="mt-6">
                Get quotes for {cat.name}
              </ShimmerButton>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[14px] border border-border bg-surface p-8 text-center">
            <p className="text-muted">Pricing guide coming soon for this service.</p>
            <ShimmerButton href={`/request?category=${category}`} className="mt-6">
              Get quotes for {cat.name}
            </ShimmerButton>
          </div>
        )}

        {extended && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">What affects price</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {extended.factors.map((factor) => (
                  <li key={factor} className="flex gap-2">
                    <span className="text-primary">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted">
                <strong className="text-foreground">Typical timeline:</strong> {extended.timeline}
              </p>
            </div>
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">Before you hire</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {extended.hiring.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[14px] border border-border bg-surface p-6 lg:col-span-2">
              <h2 className="font-semibold text-foreground">FAQ</h2>
              <dl className="mt-4 space-y-4">
                {extended.faqs.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-medium text-foreground">{faq.q}</dt>
                    <dd className="mt-1 text-sm text-muted">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {pros.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-foreground">Top-rated {cat.name.toLowerCase()} pros</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pros.slice(0, 6).map((p) => (
                <ProviderCard key={p.id} provider={p} categoryName={cat.name} />
              ))}
            </div>
          </div>
        )}

        <section className="mt-12 rounded-[14px] bg-foreground px-6 py-10 text-background sm:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold">Get 3 free quotes</h2>
            <p className="mt-2 text-background/60">
              Post your {cat.name.toLowerCase()} job — compare local pros and call direct. No lead fees.
            </p>
            <ShimmerButton href={`/request?category=${category}`} className="mt-6">
              Post your job
            </ShimmerButton>
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
    </MarketingPageShell>
  );
}
