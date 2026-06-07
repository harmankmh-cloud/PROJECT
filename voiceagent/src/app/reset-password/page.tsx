"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(Boolean(session));
      if (!session) {
        setError("Reset link expired. Request a new one from the forgot password page.");
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card w-full max-w-md p-8 text-center">
          <p className="text-teal-700 font-medium">Password updated. Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-ghost-white">Set new password</h1>

        {ready ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="New password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              minLength={8}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-field"
              minLength={8}
              required
            />
            {error && <p className="text-sm text-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Saving…" : "Update password"}
            </button>
          </form>
        ) : (
          <div className="mt-6">
            {error && <p className="text-sm text-error">{error}</p>}
            <p className="mt-4 text-center text-sm">
              <Link href="/forgot-password" className="text-teal-600 hover:underline">
                Request a new reset link
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
