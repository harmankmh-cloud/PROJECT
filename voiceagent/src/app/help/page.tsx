import Link from "next/link";
import type { Metadata } from "next";
import { HelpHub } from "@/components/help/HelpHub";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { SupportForm } from "@/components/SupportForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { HELP_ARTICLES } from "@/lib/help-articles";

export const metadata: Metadata = {
  title: "Help center",
  description: `Knowledge base and contact for ${BRAND.name} — getting started, billing, telephony, compliance, and API.`,
  alternates: { canonical: "/help" },
};

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const params = await searchParams;
  const isEnterprise = params.intent === "enterprise";
  const isDemo = params.intent === "demo";
  const isReview = params.intent === "review";

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${BRAND.name} Help Center`,
          description: metadata.description,
          url: `https://${BRAND.domain}/help`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: HELP_ARTICLES.map((article, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://${BRAND.domain}/help/${article.slug}`,
              name: article.title,
            })),
          },
        }}
      />
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 space-y-12 px-4 pb-12 pt-24">
        <header>
          <h1 className="font-display text-3xl text-ghost-white">Help center</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Search articles or contact {BRAND.name} support.
          </p>
        </header>

        <HelpHub />

        <section id="contact" className="border-t border-border pt-12">
          <h2 className="font-display text-2xl text-ghost-white">Contact support</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {isEnterprise
              ? `Tell us about your Enterprise needs — the ${BRAND.name} team will follow up.`
              : isDemo
                ? `Book a product walkthrough — we'll reply with next steps and scheduling options.`
                : isReview
                  ? "Share your experience as an early adopter — we welcome honest reviews."
                  : `Questions about ${BRAND.name}? Send us a message.`}
          </p>
          <p className="mt-4 text-sm text-on-surface-variant">
            {BRAND.legalName} · {BRAND.location.label}
            <br />
            <a href={`mailto:${BRAND.contact.email}`} className="text-primary hover:underline">
              {BRAND.contact.email}
            </a>
            {" · "}
            <a href={`tel:${BRAND.contact.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
              {BRAND.contact.phone}
            </a>
          </p>
          <div className="mt-6">
            <SupportForm
              defaultCategory={isEnterprise || isDemo ? "billing" : "help"}
              defaultMessage={
                isEnterprise
                  ? "I'm interested in the Enterprise plan. Please contact me about pricing, HIPAA, and SLA options."
                  : isDemo
                    ? "I'd like to book a demo of GreetQ. Please share availability for a 30-minute walkthrough."
                    : isReview
                      ? "I'd like to share feedback / leave a review for GreetQ."
                      : ""
              }
            />
          </div>
          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Have an account?{" "}
            <Link href="/login" className="link-accent">
              Sign in
            </Link>
          </p>
        </section>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
