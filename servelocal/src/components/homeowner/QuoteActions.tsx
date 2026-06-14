"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function QuoteActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "accept" | "decline") {
    setLoading(action);
    setError(null);
    const res = await fetch(`/api/bookings/${bookingId}/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(null);
    if (!res.ok) {
      setError(data.error || "Could not update quote");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled={!!loading} onClick={() => act("accept")}>
        {loading === "accept" ? "Accepting…" : "Accept"}
      </Button>
      <Button variant="outline" disabled={!!loading} onClick={() => act("decline")}>
        {loading === "decline" ? "Declining…" : "Decline"}
      </Button>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  );
}
