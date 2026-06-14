import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, DollarSign, TrendingUp, Zap } from "lucide-react";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ForProsSection } from "@/components/landing/ForProsSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { FadeUp } from "@/components/motion/FadeUp";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { PricingCards } from "@/components/PricingCards";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Grow Your Business — Get Local Leads",
  description:
    "Join 12,000+ Canadian contractors on ServeLocal. More leads, no subscription lock-in, flexible schedule, get paid fast.",
  path: "/for-pros",
});

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "More Leads",
    body: "Get matched with homeowners actively looking for your trade in your service area.",
  },
  {
    icon: DollarSign,
    title: "No Subscription",
    body: "Start free. Pay only when you want featured placement — no per-lead fees up to $75.",
  },
  {
    icon: Calendar,
    title: "Flexible Schedule",
    body: "Set your own rates, accept jobs on your terms, and manage availability your way.",
  },
  {
    icon: Zap,
    title: "Get Paid Fast",
    body: "Stripe Connect payouts directly to your bank. T4A tax summary included for Canadian pros.",
  },
] as const;

const SUCCESS_STORIES = [
  { name: "Mike T.", trade: "Plumber", city: "Surrey", earned: "$4,200/mo", quote: "Went from 2 jobs a week to 8. ServeLocal pays for itself in one lead." },
  { name: "Lisa K.", trade: "Cleaner", city: "Vancouver", earned: "$2,800/mo", quote: "Finally a platform that doesn't nickel-and-dime me on every click." },
  { name: "Raj P.", trade: "Electrician", city: "Burnaby", earned: "$6,100/mo", quote: "The Top Pro badge alone doubled my inbound calls." },
] as const;

const FAQ = [
  { q: "How much does it cost?", a: "Free to list. Featured is $29/mo CAD, Premium is $99/mo. No per-lead fees on the Starter plan." },
  { q: "How do credits work?", a: "Premium pros get lead credits for high-intent job matches. Each accepted lead costs 1 credit. Credits refresh monthly." },
  { q: "When do I get paid?", a: "Homeowner payments are held in escrow until job completion, then released to your Stripe Connect account within 2 business days." },
] as const;

export default function ForProsPage() {
  return (
    <MarketingPageShell>
      <section className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <FadeUp>
            <p className="font-label text-primary">For contractors</p>
            <h1 className="font-display mt-4 text-4xl font-black text-foreground sm:text-5xl lg:text-6xl">
              Grow Your Business.
              <br />
              <span className="text-primary">Get Local Leads.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              Join 12,000+ pros already earning on ServeLocal. Set your rates, get matched with
              homeowners, and get paid fast — built for Canada.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ShimmerButton href="/signup/pro" size="lg">
                Join Free
                <ArrowRight className="h-4 w-4" />
              </ShimmerButton>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-border px-8 py-4 text-sm font-semibold text-foreground transition hover:border-amber-400/50"
              >
                View pricing
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <StatsBar />

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="text-center">
            <h2 className="font-display text-3xl font-black text-foreground">Why pros choose us</h2>
          </FadeUp>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <FadeUp key={title}>
                <div className="card-glow rounded-[14px] border border-border bg-surface p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display mt-4 font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="text-center">
            <h2 className="font-display text-3xl font-black text-foreground">How earnings work</h2>
            <p className="mt-2 text-muted">Transparent pricing — no hidden fees</p>
          </FadeUp>
          <div className="mt-10">
            <PricingCards />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="text-center">
            <h2 className="font-display text-3xl font-black text-foreground">Pro success stories</h2>
          </FadeUp>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {SUCCESS_STORIES.map((story) => (
              <FadeUp key={story.name}>
                <div className="card-glow rounded-[14px] border border-border bg-surface p-6">
                  <p className="text-2xl font-black text-primary">{story.earned}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {story.name} · {story.trade} · {story.city}
                  </p>
                  <p className="mt-3 text-sm italic text-muted">&ldquo;{story.quote}&rdquo;</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeUp className="text-center">
            <h2 className="font-display text-3xl font-black text-foreground">FAQ for pros</h2>
          </FadeUp>
          <ul className="mt-8 space-y-4">
            {FAQ.map((item) => (
              <li key={item.q} className="rounded-[14px] border border-border bg-surface p-5">
                <p className="font-semibold text-foreground">{item.q}</p>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <ShimmerButton href="/signup/pro" size="lg">
              Join Free — Start Getting Leads
            </ShimmerButton>
          </div>
        </div>
      </section>

      <ForProsSection />
      <TestimonialsCarousel />
    </MarketingPageShell>
  );
}
