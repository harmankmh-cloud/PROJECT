import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JoinProviderForm } from "@/components/JoinProviderForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get Listed — Free BC Trades Directory",
  description:
    "List your plumbing, electrical, HVAC, or other trade business on ServeLocal. Free starter listing or upgrade to Featured and Premium plans.",
  path: "/join",
});

export default async function JoinPage() {
  const categories = await getServiceCategories();

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
        <Link href="/pricing" className="text-sm font-semibold text-teal-600 hover:underline">
          Compare plans →
        </Link>
        <h1 className="font-display mt-2 text-3xl text-brand-950">Get listed on ServeLocal</h1>
        <p className="mt-2 text-slate-600">
          Free listing or upgrade to Featured ($49/mo) / Premium ($99/mo) for top placement, verified badges & more leads.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-slate-500">Loading form…</p>}>
            <JoinProviderForm categories={categories} />
          </Suspense>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
