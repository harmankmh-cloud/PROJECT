import type { ServiceProvider } from "@/lib/types";

export function ProviderBadges({ provider, size = "sm" }: { provider: ServiceProvider; size?: "sm" | "md" }) {
  const cls = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <div className="flex flex-wrap gap-1.5">
      {provider.listing_tier === "premium" && (
        <span className={`rounded-full bg-zinc-900 font-bold uppercase tracking-wide text-white ${cls}`}>
          Premium
        </span>
      )}
      {(provider.listing_tier === "featured" || provider.featured) && provider.listing_tier !== "premium" && (
        <span className={`rounded-full bg-accent-500/10 font-bold uppercase text-accent-700 ${cls}`}>
          Featured
        </span>
      )}
      {provider.verified && (
        <span className={`rounded-full bg-success-500/10 font-semibold text-success-600 ${cls}`}>✓ Verified</span>
      )}
      {provider.insurance_verified && (
        <span className={`rounded-full bg-emerald-50 font-semibold text-emerald-700 ${cls}`}>Insured</span>
      )}
      {provider.licensed && (
        <span className={`rounded-full bg-zinc-100 font-medium text-zinc-700 ${cls}`}>Licensed</span>
      )}
      {provider.emergency_available && (
        <span className={`rounded-full bg-rose-50 font-semibold text-rose-700 ${cls}`}>24/7</span>
      )}
    </div>
  );
}
