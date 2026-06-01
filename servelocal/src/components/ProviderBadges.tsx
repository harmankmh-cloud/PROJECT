import type { ServiceProvider } from "@/lib/types";

export function ProviderBadges({ provider, size = "sm" }: { provider: ServiceProvider; size?: "sm" | "md" }) {
  const cls = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <div className="flex flex-wrap gap-1.5">
      {provider.listing_tier === "premium" && (
        <span className={`rounded-full bg-brand-950 font-bold uppercase tracking-wide text-gold-400 ${cls}`}>
          Premium
        </span>
      )}
      {(provider.listing_tier === "featured" || provider.featured) && provider.listing_tier !== "premium" && (
        <span className={`rounded-full bg-amber-100 font-bold uppercase text-amber-800 ${cls}`}>
          Featured
        </span>
      )}
      {provider.verified && (
        <span className={`rounded-full bg-teal-50 font-semibold text-teal-700 ${cls}`}>✓ Verified</span>
      )}
      {provider.insurance_verified && (
        <span className={`rounded-full bg-emerald-50 font-semibold text-emerald-700 ${cls}`}>Insured</span>
      )}
      {provider.licensed && (
        <span className={`rounded-full bg-slate-100 font-medium text-slate-700 ${cls}`}>Licensed</span>
      )}
      {provider.emergency_available && (
        <span className={`rounded-full bg-rose-50 font-semibold text-rose-700 ${cls}`}>24/7</span>
      )}
    </div>
  );
}
