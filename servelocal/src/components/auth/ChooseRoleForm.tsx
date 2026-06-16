"use client";

import { useState } from "react";
import { Hammer, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { redirectAfterAuth } from "@/lib/auth/client-redirect";

export function ChooseRoleForm() {
  const [loading, setLoading] = useState<"homeowner" | "pro" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function choose(role: "homeowner" | "pro") {
    if (loading) return;
    setLoading(role);
    setError(null);

    const res = await fetch("/api/user-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error || "Could not save your account type. Try again.");
      setLoading(null);
      return;
    }

    await redirectAfterAuth(`/auth/after-login?as=${role}`);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => choose("homeowner")}
        disabled={loading !== null}
        className="card-dark-hover flex w-full items-start gap-4 p-5 text-left disabled:opacity-60"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
          <Home className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-slate-50">I need a pro</p>
          <p className="mt-1 text-sm text-slate-400">Post jobs, get quotes, and track requests.</p>
        </div>
        <Button type="button" loading={loading === "homeowner"} disabled={loading !== null && loading !== "homeowner"}>
          Continue
        </Button>
      </button>

      <button
        type="button"
        onClick={() => choose("pro")}
        disabled={loading !== null}
        className="card-dark-hover flex w-full items-start gap-4 p-5 text-left ring-1 ring-primary/30 disabled:opacity-60"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Hammer className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-slate-50">I am a pro</p>
          <p className="mt-1 text-sm text-slate-400">Set up your listing, browse leads, and reply to jobs.</p>
        </div>
        <Button type="button" loading={loading === "pro"} disabled={loading !== null && loading !== "pro"}>
          Continue
        </Button>
      </button>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
