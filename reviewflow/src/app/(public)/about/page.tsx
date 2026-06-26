import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { BRAND } from "@/lib/brand";

const title = `About ${BRAND.name}`;
const description = `${BRAND.name} is a ${BRAND.location.region}-built tool that helps local businesses earn honest Google reviews — AI prompts, QR posters, and private feedback routing, with no fake reviews.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} — ${BRAND.tagline}`,
    description,
    url: `https://${BRAND.domain}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${BRAND.tagline}`,
    description,
  },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Honest by design",
    description:
      "No fake reviews, no incentives, no gating real opinions. We help happy customers share their story and route unhappy feedback to you privately so you can make it right.",
  },
  {
    icon: Sparkles,
    title: "Effortless for customers",
    description:
      "One QR scan, a star tap, and an AI-drafted review ready to post on Google in seconds. Less friction means more reviews — without nagging your customers.",
  },
  {
    icon: MapPin,
    title: "Built for local BC businesses",
    description:
      `From the ${BRAND.location.label}, we build for the salons, restaurants, contractors, and shops that grow on word of mouth and a strong reputation.`,
  },
];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <section className="mesh-bg relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-28">
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="marketing-container relative text-center">
          <p className="section-eyebrow mx-auto mb-5 w-fit">About us</p>
          <h1 className="font-display text-4xl text-text md:text-5xl lg:text-[3.35rem]">
            Helping BC businesses earn{" "}
            <span className="coral-underline text-primary">honest reviews</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {BRAND.name} turns everyday customer visits into trustworthy Google reviews — using AI prompts, QR
            posters, and private feedback routing. No fake reviews, no risk, just an honest reputation that grows.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="marketing-container">
          <div className="card-glow card-surface mx-auto max-w-3xl">
            <h2 className="font-display text-2xl text-text md:text-3xl">Why we built {BRAND.name}</h2>
            <div className="mt-5 space-y-4 text-muted">
              <p>
                Great local businesses lose work every day to competitors with more reviews — not better service.
                Meanwhile, the tools meant to help were expensive, complicated, or pushed shady tactics that put a
                business&apos;s Google listing at risk.
              </p>
              <p>
                We wanted something different: a simple, affordable way for {BRAND.location.region} shops to collect
                real reviews from real customers. Place a QR poster at checkout, let AI draft a polished review for
                happy customers, and quietly route unhappy feedback to the owner first — so problems get solved
                instead of posted.
              </p>
              <p>
                {BRAND.name} is built and supported from the {BRAND.location.label}, for the local teams who care
                about doing right by their customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/80 bg-surface/30 py-16 md:py-20">
        <div className="marketing-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="section-eyebrow mx-auto mb-4 w-fit">What we stand for</p>
            <h2 className="font-display text-3xl text-text md:text-4xl">Reputation you can be proud of</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="card-surface h-full">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <value.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl text-text">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="marketing-container">
          <div className="card-glow card-surface mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Star className="h-6 w-6 fill-current" />
            </span>
            <h2 className="mt-5 font-display text-3xl text-text md:text-4xl">Ready to grow your reviews?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Start with 50 free review requests — no credit card needed. Have a question? Email us at{" "}
              <a href={`mailto:${BRAND.contact.email}`} className="font-semibold text-primary hover:underline">
                {BRAND.contact.email}
              </a>
              .
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ShimmerButton href="/signup" className="px-8 py-3.5 text-base">
                Start free
              </ShimmerButton>
              <Link href="/pricing" className="btn-ghost px-8 py-3.5 text-base">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
