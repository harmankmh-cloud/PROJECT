import Link from "next/link";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { TRADE_LOCAL } from "@/lib/constants";
import { getServiceCategories } from "@/lib/data";

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const categories = await getServiceCategories();

  return (
    <main className="mesh-bg min-h-screen">
      <header className="site-header px-4 py-4 sm:px-8">
        <Link href="/" className="text-sm font-semibold text-teal-600 hover:underline">
          ← {TRADE_LOCAL.name}
        </Link>
      </header>
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl text-brand-950">Post what you need</h1>
        <p className="mt-2 text-slate-600">
          Describe the job — then browse local pros and call them. No account required.
        </p>
        <div className="mt-8">
          <ServiceRequestForm
            categories={categories}
            defaultCity={params.city}
            defaultCategory={params.category}
          />
        </div>
      </div>
    </main>
  );
}
