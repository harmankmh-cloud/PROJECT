"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TRIAL_MARKETING } from "@/lib/trial";

export function HeroLeadCapture() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/leads/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, business_name: businessName || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError((data as { error?: string }).error || "Could not submit");
      return;
    }
    const params = new URLSearchParams({ email });
    if (businessName.trim()) params.set("business", businessName.trim());
    router.push(`/signup?${params.toString()}`);
  }

  return (
    <div className="glass-card mx-auto mt-6 max-w-md p-6">
      <h3 className="font-display text-lg text-text">{TRIAL_MARKETING.cta}</h3>
      <p className="mt-2 text-sm text-muted">{TRIAL_MARKETING.exploreLong}</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          required
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field w-full"
          autoComplete="email"
        />
        <input
          type="text"
          placeholder="Business name (optional)"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="input-field w-full"
          autoComplete="organization"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>
          Get 30 free minutes
        </Button>
      </form>
    </div>
  );
}
