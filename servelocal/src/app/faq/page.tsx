import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
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
    <MarketingPageShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <p className="font-label text-primary">FAQ</p>
        <h1 className="font-display mt-2 text-4xl font-black text-foreground">Common questions</h1>
        <p className="mt-3 text-muted">
          Homeowners and tradies — quick answers. Still stuck?{" "}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Contact us
          </Link>
          .
        </p>

        <dl className="mt-10 space-y-6">
          {SITE_FAQS.map((faq) => (
            <div key={faq.q} className="rounded-[14px] border border-border bg-surface p-6">
              <dt className="font-semibold text-foreground">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <ShimmerButton href="/request">Post a job</ShimmerButton>
          <Link
            href="/join"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-amber-400/50"
          >
            Get listed
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </MarketingPageShell>
  );
}
