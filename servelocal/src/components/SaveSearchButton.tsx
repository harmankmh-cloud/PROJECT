"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SaveSearchButton() {
  const searchParams = useSearchParams();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/saved-searches")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.searches) setUserEmail("signed-in");
      })
      .catch(() => {});
  }, []);

  async function saveSearch() {
    setLoading(true);
    setError("");

    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const label =
      q ||
      [category, city].filter(Boolean).join(" in ") ||
      "My search";

    try {
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          query: q || undefined,
          citySlug: city || undefined,
          categorySlug: category || undefined,
          licensedOnly: searchParams.get("licensed") === "1",
          verifiedOnly: searchParams.get("verified") === "1",
          emergencyOnly: searchParams.get("emergency") === "1",
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setError("sign-in");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Could not save");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm text-teal-600">
        Search saved — we&apos;ll email you when new pros match.{" "}
        <Link href="/dashboard" className="font-semibold underline">
          View saved searches
        </Link>
      </p>
    );
  }

  if (error === "sign-in") {
    return (
      <p className="text-sm text-slate-600">
        <Link href="/signup" className="font-semibold text-teal-600 hover:underline">
          Sign in
        </Link>{" "}
        to save this search and get email alerts.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={saveSearch}
        disabled={loading}
        className="btn-ghost px-4 py-2 text-sm disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save search & get alerts"}
      </button>
      {error && error !== "sign-in" && <p className="text-sm text-rose-600">{error}</p>}
      {userEmail && !error && (
        <span className="text-xs text-slate-400">Alerts sent to your account email</span>
      )}
    </div>
  );
}
