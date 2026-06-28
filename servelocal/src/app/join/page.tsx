import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JoinProviderForm } from "@/components/JoinProviderForm";
import { FoundingProBanner, TradieBenefits } from "@/components/TradieBenefits";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { FadeUp } from "@/components/motion/FadeUp";
import { getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { HOW_OTHERS_START } from "@/lib/tradie-program";

export const metadata: Metadata = pageMetadata({
  title: "Get Listed — Free + Featured Pro $29/mo",
  description:
    "List your trade on ServeLocal. Free starter listing, job alerts, Featured Pro from $29/mo CAD.",
  path: "/join",
});

export default async function JoinPage() {
  const categories = await getServiceCategories();

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <FadeUp>
          <Link href="/for-pros" className="text-sm font-semibold text-primary hover:underline">
            ← For Pros overview
          </Link>
          <h1 className="font-display mt-2 text-3xl font-black text-foreground">Get clients — list your trade</h1>
          <p className="mt-2 text-muted">
            Homeowners post jobs in your city. Matching pros get alerts with contact details.
          </p>
        </FadeUp>
        <div className="mt-6">
          <FoundingProBanner />
        </div>
        <div className="mt-10">
          <TradieBenefits showComparison={false} />
        </div>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-muted">Loading form…</p>}>
            <JoinProviderForm categories={categories} />
          </Suspense>
        </div>
        <div className="mt-10 rounded-[14px] border border-border bg-surface p-6">
          <h2 className="font-semibold text-foreground">How successful directories start</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {HOW_OTHERS_START.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-primary">→</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MarketingPageShell>
  );
}
