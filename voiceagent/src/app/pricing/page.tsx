import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { PricingCard } from "@/components/PricingCard";
import { SkipToContent } from "@/components/SkipToContent";
import type { PlanKey } from "@/lib/plans";

const PLAN_KEYS: PlanKey[] = ["starter", "growth", "pro", "enterprise"];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Intellivo pricing: Starter $79, Growth $199, Pro $399, and Enterprise AI phone agent plans. Flat monthly with minutes included — cheaper than a part-time receptionist.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />
      <main id="main-content" className="flex-1 pt-20">
        <section className="py-[120px]">
          <div className="marketing-container">
            <div className="mb-16 text-center">
              <h1 className="font-display text-3xl font-bold text-ghost-white md:text-4xl">Simple, predictable pricing</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-text">
                Flat monthly with voice minutes included — only pay more if you go over. Cheaper than a part-time
                receptionist, with no per-caller penalties. Sandbox testing is always free.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PLAN_KEYS.map((key) => (
                <PricingCard key={key} planKey={key} highlighted={key === "growth"} />
              ))}
            </div>
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
              <p className="text-sm font-semibold text-ghost-white">Bundle &amp; save: Reputation + Reception</p>
              <p className="mt-2 text-sm text-slate-text">
                Pair Intellivo Starter with{" "}
                <a href="https://ratelocal.ca" className="font-semibold text-electric-blue hover:underline">
                  RateLocal
                </a>{" "}
                (Google reviews) for <strong className="text-on-surface">$99/mo</strong> — save $19 vs buying
                separately. Never miss a call and win more 5-star reviews. Ask sales to apply the bundle.
              </p>
            </div>
            <p className="mt-10 text-center text-sm text-slate-text">
              Questions about Enterprise or HIPAA?{" "}
              <Link href="/help?intent=enterprise" className="font-semibold text-electric-blue hover:underline">
                Contact sales
              </Link>
              {" · "}
              <Link href="/#faq" className="font-semibold text-electric-blue hover:underline">
                Read FAQs
              </Link>
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
