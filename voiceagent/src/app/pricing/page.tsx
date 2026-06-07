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
    <div className="mesh-bg flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />
      <main id="main-content" className="mx-auto max-w-6xl flex-1 px-6 py-16">
        <h1 className="font-display text-center text-4xl text-brand-900">Pricing</h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
          Monthly subscription plus metered voice minutes. All plans include call logs, audit trails, and
          sandbox testing — no credit card required to explore.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_KEYS.map((key) => (
            <PricingCard key={key} planKey={key} highlighted={key === "growth"} />
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          Questions about Enterprise or HIPAA?{" "}
          <Link href="/help?intent=enterprise" className="text-teal-600 hover:underline">
            Contact sales
          </Link>
          {" · "}
          <Link href="/#faq" className="text-teal-600 hover:underline">
            Read FAQs
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
