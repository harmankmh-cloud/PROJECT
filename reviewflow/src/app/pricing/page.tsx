import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/brand";
import { PRICING } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Pricing — $99 setup + $39/mo",
  description:
    "Simple pricing for RateLocal — one-time setup, monthly subscription, 14-day money-back guarantee. QR review collection for BC local businesses.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <BrandLogo />
          <div className="flex gap-2">
            <Link href="/" className="btn-ghost px-4 py-2 text-sm">
              Home
            </Link>
            <Link href="/signup" className="btn-gold px-4 py-2 text-sm">
              Start free →
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
        <p className="page-eyebrow text-center">Pricing</p>
        <h1 className="font-display mt-3 text-center text-4xl text-brand-950 sm:text-5xl">
          One plan. Everything included.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
          No tiers to decode. {BRAND.name} gives your shop a review page, QR poster, AI drafts, and private
          feedback routing.
        </p>

        <div id="pricing" className="surface-dark relative mt-12 overflow-hidden p-10 text-center sm:p-14">
          <div className="hero-glow -right-10 top-0 h-48 w-48 bg-amber-500/20" />
          <div className="relative flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">${PRICING.setup}</p>
              <p className="mt-1 text-sm text-white/45">One-time setup</p>
            </div>
            <div className="hidden h-16 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-5xl text-white sm:text-6xl">
                ${PRICING.monthly}
                <span className="text-2xl text-white/40">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/45">Everything included</p>
            </div>
          </div>
          <p className="relative mt-6 inline-flex rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-200">
            {PRICING.guarantee}
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
