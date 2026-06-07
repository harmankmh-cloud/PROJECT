import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JoinProviderForm } from "@/components/JoinProviderForm";
import { FoundingProBanner, TradieBenefits } from "@/components/TradieBenefits";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { HOW_OTHERS_START } from "@/lib/tradie-program";

export const metadata: Metadata = pageMetadata({
  title: "Get Listed — Free + Founding Pro $29/mo",
  description:
    "List your BC trade on ServeLocal. Free starter listing, job alerts when homeowners post, Founding Pro featured placement from $29/mo — no per-lead fees.",
  path: "/join",
});

export default async function JoinPage() {
  const categories = await getServiceCategories();

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <Link href="/pricing" className="text-sm font-semibold text-teal-600 hover:underline">
          Compare plans →
        </Link>
        <h1 className="font-display mt-2 text-3xl text-brand-950">Get clients — list your trade</h1>
        <p className="mt-2 text-slate-600">
          Homeowners post jobs in your city. Matching pros get email alerts with contact details. No $25–75
          shared leads — one flat fee if you upgrade.
        </p>
        <div className="mt-6">
          <FoundingProBanner />
        </div>
        <div className="mt-10">
          <TradieBenefits showComparison={false} />
        </div>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-slate-500">Loading form…</p>}>
            <JoinProviderForm categories={categories} />
          </Suspense>
        </div>
        <div className="surface-card mt-10 p-6">
          <h2 className="font-semibold text-brand-950">How successful directories start</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {HOW_OTHERS_START.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-teal-600">→</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
