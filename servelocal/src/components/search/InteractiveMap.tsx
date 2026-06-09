"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ServiceProvider } from "@/lib/types";
import { getCityCoords, jitterCoords, mapEmbedUrl } from "@/lib/city-coords";
import { cityName } from "@/lib/constants";

type Props = {
  providers: ServiceProvider[];
  citySlug?: string;
};

export function InteractiveMap({ providers, citySlug }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const mapUrl = mapEmbedUrl(citySlug);

  const pins = useMemo(
    () =>
      providers.slice(0, 12).map((p) => {
        const base = getCityCoords(p.city_slug);
        const coords = jitterCoords(base.lat, base.lng, p.id);
        return { ...p, ...coords };
      }),
    [providers]
  );

  const active = pins.find((p) => p.id === activeId);

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-border">
      <iframe
        title="Map of local pros"
        src={mapUrl}
        className="h-[420px] w-full border-0 lg:h-[520px]"
        loading="lazy"
      />
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
        {pins.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 400 }}
            onClick={() => setActiveId(p.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm transition ${
              activeId === p.id
                ? "border-primary bg-primary text-white"
                : "border-border bg-background/90 text-foreground hover:border-amber-400/50"
            }`}
          >
            ★ {p.avg_rating ?? "—"} · {p.min_callout_fee ?? "Quote"}
          </motion.button>
        ))}
      </div>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-3 top-3 max-w-xs rounded-[14px] border border-border bg-background/95 p-3 shadow-xl backdrop-blur-sm"
        >
          <p className="font-semibold text-foreground">{active.display_name}</p>
          <p className="text-xs text-muted">
            {cityName(active.city_slug)} · {active.min_callout_fee ?? "Contact for quote"}
          </p>
          <Link href={`/pro/${active.slug}`} className="mt-2 inline-block text-xs font-semibold text-primary">
            View profile →
          </Link>
        </motion.div>
      )}
    </div>
  );
}
