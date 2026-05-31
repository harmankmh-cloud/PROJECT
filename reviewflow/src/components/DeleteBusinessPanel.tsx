"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Business } from "@/lib/types";

export function DeleteBusinessPanel({ business }: { business: Business }) {
  const router = useRouter();
  const [confirmName, setConfirmName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const nameMatches = confirmName.trim() === business.name.trim();

  async function handleDelete() {
    if (!nameMatches) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/business/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmName: confirmName.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[1.35rem] border border-rose-200/80 bg-rose-50/40 p-6">
      <h2 className="font-display text-lg text-rose-950">Remove this business</h2>
      <p className="mt-2 text-sm leading-relaxed text-rose-900/80">
        Permanently deletes your review page (<span className="font-medium">/r/{business.slug}</span>
        ), all customer feedback, analytics, and QR setup. Your login account stays — you can create a
        new business later.
      </p>
      {business.stripe_subscription_id && (
        <p className="alert-warning mt-4 text-xs">
          You have an active plan on Stripe. After removing the business, also cancel billing under{" "}
          <Link href="/dashboard/billing" className="font-semibold underline">
            My plan
          </Link>{" "}
          so you are not charged.
        </p>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-50"
        >
          I want to remove this business…
        </button>
      ) : (
        <div className="mt-5 space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-rose-950">
              Type <span className="font-mono">{business.name}</span> to confirm
            </span>
            <input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="input-field border-rose-200 focus:border-rose-400 focus:ring-rose-400/15"
              placeholder={business.name}
              autoComplete="off"
            />
          </label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || !nameMatches}
              className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Removing…" : "Permanently remove business"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmName("");
                setError("");
              }}
              className="btn-ghost py-2.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
