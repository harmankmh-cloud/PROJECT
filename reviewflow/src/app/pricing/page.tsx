import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/brand";
import { PRICING } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Pricing — $39/mo, no setup fee",
  description:
    "Simple pricing for RateLocal — $39/mo, no setup fee, 14-day money-back guarantee. Cheaper than NiceJob and Podium. QR review collection for BC local businesses.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fc]">
      <section className="hero-dark relative overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="hero-glow left-0 top-0 h-64 w-64 bg-gold-600/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <MarketingHeader />
          <div className="mt-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Pricing</p>
            <h1 className="font-display mt-3 text-4xl text-white sm:text-5xl">
              One plan. Everything included.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/55">
              No tiers to decode. {BRAND.name} gives your shop a review page, QR poster, AI drafts, and private
              feedback routing.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8">

        <div id="pricing" className="surface-dark relative mt-12 overflow-hidden p-10 text-center sm:p-14">
          <div className="hero-glow -right-10 top-0 h-48 w-48 bg-amber-500/20" />
          <div className="relative flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">
                ${PRICING.monthly}
                <span className="text-2xl text-white/40">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/45">Everything included</p>
            </div>
            <div className="hidden h-16 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">$0</p>
              <p className="mt-1 text-sm text-white/45">Setup fee — waived</p>
            </div>
          </div>
          <p className="relative mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-200">
            {PRICING.guarantee}
          </p>
          <p className="relative mt-3 text-sm text-white/55">
            Pay yearly: <strong className="text-white">${PRICING.annual}/yr</strong> — 2 months free.
          </p>
          <p className="relative mx-auto mt-4 max-w-md text-xs text-white/45">
            NiceJob starts at $75/mo. Podium runs $399+/mo. {BRAND.name} does the core job — more Google
            reviews — for less, with no contract.
          </p>
          <ul className="relative mx-auto mt-8 max-w-md space-y-2 text-left text-sm text-white/70">
            {[
              "Custom review page + QR poster PDF",
              "AI-written review options (3 per visit)",
              "Private routing for 1–2 star feedback",
              "Dashboard stats & Google link management",
              "Email support from BC-based team",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-teal-400">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/signup" className="btn-gold relative mt-10 inline-flex px-10 py-4 text-base">
            Get started today
          </Link>
        </div>

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gold-500/30 bg-gold-50/60 p-6 text-center">
          <p className="text-sm font-semibold text-brand-950">Bundle &amp; save: Reputation + Reception</p>
          <p className="mt-2 text-sm text-slate-600">
            Add GreetQ (an AI phone agent that answers every call 24/7) and get both for{" "}
            <strong className="text-brand-950">$99/mo</strong> — save $19 vs buying separately. More reviews and
            never a missed call.
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Questions?{" "}
          <Link href="/help" className="font-semibold text-gold-600 hover:underline">
            Help & contact
          </Link>
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
