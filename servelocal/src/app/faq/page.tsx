import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { SITE_FAQS } from "@/lib/site-content";

export const metadata: Metadata = pageMetadata({
  title: "FAQ — Homeowners & Trades",
  description:
    "Frequently asked questions about ServeLocal — free job posts, pro listings, verified badges, and BC service areas.",
  path: "/faq",
});

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SITE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <p className="section-eyebrow">FAQ</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">Common questions</h1>
        <p className="mt-3 text-slate-600">
          Homeowners and tradies — quick answers. Still stuck?{" "}
          <Link href="/contact" className="font-semibold text-teal-600 hover:underline">
            Contact us
          </Link>
          .
        </p>

        <dl className="mt-10 space-y-6">
          {SITE_FAQS.map((faq) => (
            <div key={faq.q} className="surface-card p-6">
              <dt className="font-semibold text-brand-950">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/request" className="btn-gold px-6 py-3">
            Post a job
          </Link>
          <Link href="/join" className="btn-ghost px-6 py-3">
            Get listed
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SiteFooter />
    </main>
  );
}
