import Link from "next/link";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
      <SiteHeader compact />
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl text-brand-950">Get free quotes</h1>
        <p className="mt-2 text-slate-600">
          Like Thumbtack — describe your job, see matching local pros, call them direct. No lead fees.
        </p>
        <div className="mt-8">
          <ServiceRequestForm
            categories={categories}
            defaultCity={params.city}
            defaultCategory={params.category}
          />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
