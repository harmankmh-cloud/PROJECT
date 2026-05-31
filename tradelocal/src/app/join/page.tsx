import Link from "next/link";
import { JoinProviderForm } from "@/components/JoinProviderForm";
import { TRADE_LOCAL } from "@/lib/constants";
import { getServiceCategories } from "@/lib/data";

export default async function JoinPage() {
  const categories = await getServiceCategories();

  return (
    <main className="mesh-bg min-h-screen">
      <header className="site-header px-4 py-4 sm:px-8">
        <Link href="/" className="text-sm font-semibold text-teal-600 hover:underline">
          ← {TRADE_LOCAL.name}
        </Link>
      </header>
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl text-brand-950">Get listed free</h1>
        <p className="mt-2 text-slate-600">
          Plumbers, electricians, cleaners — customers in BC find you and call direct. We review every listing.
        </p>
        <div className="mt-8">
          <JoinProviderForm categories={categories} />
        </div>
      </div>
    </main>
  );
}
