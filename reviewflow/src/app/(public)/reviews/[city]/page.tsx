import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin, Star } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PricingSection } from "@/components/marketing/PricingSection";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { BRAND } from "@/lib/brand";
import { CITIES, getCityBySlug } from "@/data/cities";
import { FAQ_ITEMS } from "@/lib/marketing-content";
import { FaqAccordion } from "@/components/FaqAccordion";

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  return {
    title: `Get More Google Reviews in ${city.name}, BC`,
    description: `${BRAND.name} helps ${city.name} businesses collect more 5-star Google reviews using AI prompts. Start free — 50 reviews included, no credit card.`,
    alternates: { canonical: `https://${BRAND.domain}/reviews/${city.slug}` },
    openGraph: {
      title: `More Google Reviews for ${city.name} Businesses`,
      description: `Turn happy ${city.name} customers into 5-star Google reviews automatically.`,
      url: `https://${BRAND.domain}/reviews/${city.slug}`,
      siteName: BRAND.name,
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `More Google Reviews for ${city.name} Businesses`,
      description: `Turn happy ${city.name} customers into 5-star Google reviews automatically.`,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();
  const cityData = city as NonNullable<typeof city>;


  const siteUrl = `https://${BRAND.domain}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND.name,
    description: `Review collection software for ${cityData.name} local businesses`,
    url: `${siteUrl}/reviews/${cityData.slug}`,
    areaServed: {
      "@type": "City",
      name: cityData.name,
      containedInPlace: { "@type": "AdministrativeArea", name: cityData.region },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
      description: "50 review requests free, then $39/mo",
    },
  };

  return (
    <MarketingPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="mesh-bg relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-28">
        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="marketing-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow mx-auto mb-5 w-fit">
              <MapPin className="inline h-3.5 w-3.5" /> {cityData.name}, {cityData.region}
            </p>
            <h1 className="font-display text-4xl leading-[1.1] text-text md:text-5xl lg:text-[3.35rem]">
              More Google Reviews for{" "}
              <span className="coral-underline text-primary">{cityData.name}</span> Businesses — Automatically
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {cityData.localFlavour} {BRAND.name} turns your happy customers into 5-star Google reviews using AI prompts and a simple QR code flow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ShimmerButton href="/signup" className="px-8 py-3.5 text-base">
                Start Free — 50 Reviews Included
              </ShimmerButton>
              <Link href="/pricing" className="btn-ghost px-8 py-3.5 text-base">
                See Pricing →
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">No credit card · No setup fee · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* City stats */}
      <section className="border-y border-border/80 bg-surface/50 py-12">
        <div className="marketing-container">
          <div className="grid gap-6 text-center md:grid-cols-3">
            {cityData.stats.map((stat) => (
              <div key={stat.label} className="stat-chip">
                <p className="font-display text-3xl text-primary">{stat.value}</p>
                <p className="mt-1.5 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 md:py-24">
        <div className="marketing-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow mx-auto mb-4 w-fit">Who we help in {cityData.name}</p>
            <h2 className="font-display text-3xl text-text md:text-4xl">
              Built for every {cityData.name} business type
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              From auto shops on Fraser Highway to downtown salons — {BRAND.name} works for any local business that wants more Google reviews.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {cityData.topIndustries.map((industry) => (
              <span
                key={industry}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white px-5 py-2.5 text-sm font-medium text-text shadow-sm"
              >
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface/30 py-16 md:py-24" id="how-it-works">
        <div className="marketing-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow mx-auto mb-4 w-fit">How it works</p>
            <h2 className="font-display text-3xl text-text md:text-4xl">
              From scan to Google review in under 60 seconds
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                title: "Set up in 5 minutes",
                text: `Paste your ${cityData.name} Google Maps link and your review page is live. Print the QR or share by SMS.`,
              },
              {
                n: "2",
                title: "Customer scans & rates",
                text: "They tap stars on their phone. 4–5 stars go to Google. 1–3 stars go privately to you first.",
              },
              {
                n: "3",
                title: "AI writes the review draft",
                text: "Happy customers get a polished draft to copy and post. More reviews, less effort for everyone.",
              },
            ].map((step) => (
              <div key={step.n} className="card-glow card-surface text-center">
                <div className="step-badge mx-auto mb-4 text-xl font-bold">{step.n}</div>
                <h3 className="font-display text-lg text-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & compliance */}
      <section className="py-16 md:py-24">
        <div className="marketing-container">
          <div className="mx-auto max-w-3xl">
            <p className="section-eyebrow mb-4 w-fit">100% Google-compliant</p>
            <h2 className="font-display text-3xl text-text md:text-4xl">
              Safe for your {cityData.name} business reputation
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              We never fake reviews or incentivize ratings. {BRAND.name} only helps real customers share their real experience — the way Google intends.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Customers write their own review — AI only suggests drafts",
                "No discounts or rewards tied to reviews",
                "Low ratings stay private so you can resolve issues first",
                "Real customers, real ratings — every time",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PricingSection />

      {/* FAQ */}
      <section className="border-t border-border/80 py-20 md:py-28" id="faq">
        <div className="marketing-container max-w-3xl">
          <p className="section-eyebrow mx-auto mb-4 w-fit">FAQ</p>
          <h2 className="font-display mb-12 text-center text-3xl text-text md:text-4xl">
            Common questions from {cityData.name} businesses
          </h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* CTA strip */}
      <section className="footer-cta-strip py-16">
        <div className="marketing-container text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl">
            Start collecting {cityData.name} reviews today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            50 free reviews — no credit card, no setup fee. Just more Google stars for your {cityData.name} business.
          </p>
          <ShimmerButton href="/signup" className="mt-8 px-10 py-4 text-base btn-shimmer-light">
            Get Started Free
          </ShimmerButton>
        </div>
      </section>
    </MarketingPageShell>
  );
}
