"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { ServiceProvider } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";

export function SavedProsList() {
  const [saved, setSaved] = useState<{ id: string; service_providers: ServiceProvider }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/saved-providers")
      .then((r) => r.json())
      .then((d) => {
        setSaved(d.saved || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-24 animate-pulse rounded-[14px] bg-surface" />;

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[14px] border border-dashed border-border bg-surface p-10 text-center">
        <Bookmark className="h-10 w-10 text-muted" />
        <p className="mt-3 text-sm text-muted">Bookmark pros from their profile page.</p>
        <Link href="/search" className="mt-3 text-sm font-semibold text-primary hover:underline">
          Browse pros →
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {saved.map((item) => {
        const p = item.service_providers;
        if (!p) return null;
        return (
          <li key={item.id}>
            <Link
              href={`/pro/${p.slug}`}
              className="card-glow flex items-center gap-3 rounded-[14px] border border-border bg-surface p-4 transition hover:-translate-y-0.5"
            >
              <Avatar name={p.display_name} size="md" />
              <div>
                <p className="font-semibold text-foreground">{p.display_name}</p>
                <p className="text-xs text-muted">{p.category_slug}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
