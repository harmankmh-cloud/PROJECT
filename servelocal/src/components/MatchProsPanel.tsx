import Link from "next/link";
import type { ServiceProvider } from "@/lib/types";
import { ProviderCard } from "@/components/ProviderCard";

export function MatchProsPanel({ providers, city, category }: { providers: ServiceProvider[]; city: string; category: string }) {
  if (providers.length === 0) {
    return (
      <div className="surface-card mt-8 p-6 text-center">
        <p className="font-semibold text-brand-950">No matching pros listed yet in this area</p>
        <p className="mt-2 text-sm text-slate-600">
          We saved your request. We&apos;re actively recruiting trades — list free or lock in Founding Pro at
          $29/mo.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${city}`} className="btn-ghost inline-flex px-6 py-3">
            Browse {city}
          </Link>
          <Link href="/join" className="btn-gold inline-flex px-6 py-3">
            Are you a pro? Get listed free →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl text-brand-950">Matching pros you can call now</h2>
      <p className="mt-1 text-sm text-slate-600">These verified listings match your job — contact them directly.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
      <Link href={`/${city}/${category}`} className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:underline">
        View all in this category →
      </Link>
    </div>
  );
}
