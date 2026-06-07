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
    "Intellivo pricing: Starter, Growth, Pro, and Enterprise AI phone agent plans. Transparent monthly subscription plus metered voice minutes.",
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
                Monthly subscription plus metered voice minutes. Sandbox testing is always free — no credit card
                required to explore.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PLAN_KEYS.map((key) => (
                <PricingCard key={key} planKey={key} highlighted={key === "growth"} />
              ))}
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
