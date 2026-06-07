import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <Link href="/guides" className="text-sm font-semibold text-teal-600 hover:underline">
          ← All guides
        </Link>
        <h1 className="font-display mt-4 text-4xl text-brand-950">
          {cat.icon} {cat.name} costs in BC
        </h1>
        {extended && <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">{extended.intro}</p>}

        {guide ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-950">Typical pricing</h2>
              {guide.low > 0 ? (
                <p className="font-display mt-2 text-3xl text-teal-600">
                  ${guide.low}–${guide.high} <span className="text-base text-slate-500">{guide.unit}</span>
                </p>
              ) : (
                <p className="mt-2 text-slate-600">Project-based — get multiple quotes</p>
              )}
              <h3 className="mt-6 font-semibold text-brand-950">Common jobs</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {guide.commonJobs.map((job) => (
                  <li key={job.name} className="flex justify-between border-b border-slate-100 pb-2">
                    <span>{job.name}</span>
                    <span className="font-medium text-brand-950">{job.range}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-950">Tips before you hire</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {guide.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-teal-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <Link href={`/request?category=${category}`} className="btn-gold mt-6 inline-flex px-6 py-3">
                Get quotes for {cat.name}
              </Link>
            </div>
          </div>
        ) : (
          <div className="surface-card mt-8 p-8 text-center">
            <p className="text-slate-600">Pricing guide coming soon for this service.</p>
            <Link href={`/request?category=${category}`} className="btn-gold mt-6 inline-flex px-6 py-3">
              Get quotes for {cat.name}
            </Link>
          </div>
        )}

        {extended && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-950">What affects price</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {extended.factors.map((factor) => (
                  <li key={factor} className="flex gap-2">
                    <span className="text-teal-500">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-slate-600">
                <strong>Typical timeline:</strong> {extended.timeline}
              </p>
            </div>
            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-950">Before you hire</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {extended.hiring.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-teal-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-6 lg:col-span-2">
              <h2 className="font-semibold text-brand-950">FAQ</h2>
              <dl className="mt-4 space-y-4">
                {extended.faqs.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-medium text-brand-950">{faq.q}</dt>
                    <dd className="mt-1 text-sm text-slate-600">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {pros.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-brand-950">Top-rated {cat.name.toLowerCase()} pros</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pros.slice(0, 6).map((p) => (
                <ProviderCard key={p.id} provider={p} categoryName={cat.name} />
              ))}
            </div>
          </div>
        )}

        <section className="hero-dark mt-12 rounded-3xl px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="font-display text-2xl font-bold">Get 3 free quotes</h2>
            <p className="mt-2 text-white/60">
              Post your {cat.name.toLowerCase()} job — compare local pros and call direct. No lead fees.
            </p>
            <Link href={`/request?category=${category}`} className="btn-gold mt-6 inline-flex px-8 py-3">
              Post your job
            </Link>
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <SiteFooter />
    </main>
  );
}
