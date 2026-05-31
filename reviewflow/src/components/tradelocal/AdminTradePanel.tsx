"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cityName } from "@/lib/tradelocal/constants";
import type { ServiceProvider, ServiceRequest } from "@/lib/tradelocal/types";

export function AdminTradePanel({
  providers,
  requests,
}: {
  providers: ServiceProvider[];
  requests: ServiceRequest[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateProvider(id: string, patch: Record<string, unknown>) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/trade/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  const pending = providers.filter((p) => p.status === "pending");

  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <div className="surface-card overflow-hidden">
          <div className="review-header">
            <h2 className="font-display text-lg">Pending listings ({pending.length})</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {pending.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-semibold text-brand-950">{p.display_name}</p>
                  <p className="text-sm text-slate-500">
                    {p.category_slug} · {cityName(p.city_slug)} · {p.phone}
                  </p>
                  {p.bio && <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.bio}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={loadingId === p.id}
                    onClick={() => updateProvider(p.id, { status: "approved" })}
                    className="btn-gold px-4 py-2 text-sm disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={loadingId === p.id}
                    onClick={() => updateProvider(p.id, { status: "rejected" })}
                    className="btn-ghost px-4 py-2 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="surface-card overflow-hidden">
        <div className="border-b border-slate-200/80 px-6 py-4">
          <h2 className="font-display text-lg">Approved pros</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {providers
            .filter((p) => p.status === "approved")
            .map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 text-sm">
                <div>
                  <LinkName slug={p.slug} name={p.display_name} />
                  <span className="text-slate-500">
                    {" "}
                    · {cityName(p.city_slug)} · {p.contact_clicks} clicks
                  </span>
                </div>
                <button
                  type="button"
                  disabled={loadingId === p.id}
                  onClick={() => updateProvider(p.id, { featured: !p.featured })}
                  className="text-xs font-semibold text-gold-600 hover:underline"
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-slate-200/80 px-6 py-4">
          <h2 className="font-display text-lg">Customer requests</h2>
        </div>
        {requests.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No requests yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {requests.map((r) => (
              <li key={r.id} className="px-6 py-4 text-sm">
                <p className="font-semibold text-brand-950">
                  {r.customer_name} · {r.customer_phone}
                </p>
                <p className="text-slate-500">
                  {r.category_slug} · {cityName(r.city_slug)} · {new Date(r.created_at).toLocaleString()}
                </p>
                <p className="mt-2 text-slate-700">{r.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function LinkName({ slug, name }: { slug: string; name: string }) {
  return (
    <a href={`/trade/pro/${slug}`} className="font-semibold text-teal-600 hover:underline" target="_blank" rel="noreferrer">
      {name}
    </a>
  );
}
