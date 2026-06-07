"use client";

import { useEffect, useRef, useState } from "react";
import type { PlanKey } from "@/lib/plans";

export function BillingAutoSubscribe({
  plan,
  stripeReady,
  currentPlan,
}: {
  plan: PlanKey | null;
  stripeReady: boolean;
  currentPlan: string;
}) {
  const active = Boolean(plan && stripeReady && currentPlan !== plan);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(active ? "loading" : "idle");
  const [error, setError] = useState("");
  const triggered = useRef(false);

  useEffect(() => {
    if (!active || triggered.current || !plan) return;

    triggered.current = true;

    fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Checkout failed");
          setStatus("error");
          return;
        }
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        setError("No checkout URL returned");
        setStatus("error");
      })
      .catch(() => {
        setError("Network error — try again");
        setStatus("error");
      });
  }, [active, plan]);

  if (!plan || currentPlan === plan) return null;

  if (status === "loading") {
    return (
      <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">
        Redirecting to Stripe checkout for {plan}…
      </p>
    );
  }

  if (status === "error" && error) {
    return (
      <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
    );
  }

  return null;
}
