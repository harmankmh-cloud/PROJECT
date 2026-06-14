"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LiveVoiceDemo() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleCall(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/demo/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError((data as { error?: string }).error || "Could not start demo call");
      return;
    }
    setMessage((data as { message?: string }).message || "Calling you now!");
  }

  return (
    <div className="glass-card mx-auto mt-8 max-w-md p-6">
      <h3 className="font-display text-lg text-text">Talk to GreetQ now</h3>
      <p className="mt-2 text-sm text-muted">
        Public demo — one free 1-minute call, no signup. Create an account for 30 trial minutes in your dashboard.
      </p>
      <form onSubmit={handleCall} className="mt-4 space-y-3">
        <Input
          label="Your phone number"
          type="tel"
          placeholder="(604) 555-0100"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {message && <p className="text-sm text-success">{message}</p>}
        <Button type="submit" className="w-full gap-2" loading={loading}>
          <Phone className="h-4 w-4" />
          Call me now
        </Button>
      </form>
      <p className="mt-3 text-center text-xs text-muted">
        Or{" "}
        <Link href="/help?intent=demo" className="text-primary-glow hover:underline">
          book a live demo
        </Link>
      </p>
    </div>
  );
}
