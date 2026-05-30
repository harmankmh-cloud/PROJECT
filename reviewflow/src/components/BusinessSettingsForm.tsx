"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Business } from "@/lib/types";

export function BusinessSettingsForm({ business }: { business: Business }) {
  const router = useRouter();
  const [name, setName] = useState(business.name);
  const [businessType, setBusinessType] = useState(business.business_type);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(business.google_review_url || "");
  const [tone, setTone] = useState(business.tone || "friendly");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, businessType, googleReviewUrl, tone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      setMessage("Settings saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Business settings</h1>
        <p className="mt-1 text-sm text-zinc-600">Update your review page details and Google review link.</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-zinc-800">Business name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
          required
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-zinc-800">Business type</span>
        <input
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
          required
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-zinc-800">Tone</span>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
        >
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
        </select>
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-zinc-800">Google review link</span>
        <input
          value={googleReviewUrl}
          onChange={(e) => setGoogleReviewUrl(e.target.value)}
          placeholder="https://g.page/r/..."
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
