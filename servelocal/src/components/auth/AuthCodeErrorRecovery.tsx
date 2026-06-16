"use client";

import Link from "next/link";
import { useState } from "react";
import { authConfirmUrl } from "@/lib/auth/redirect-origin";
import { AUTH_CODE_ERROR_COPY, type AuthCodeErrorReason } from "@/lib/auth/confirm-errors";
import { friendlyAuthError } from "@/lib/auth-errors";
import { authLog } from "@/lib/auth/observability";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export function AuthCodeErrorRecovery({
  reason,
  initialEmail,
  asRole,
}: {
  reason: AuthCodeErrorReason;
  initialEmail?: string;
  asRole?: "homeowner" | "pro" | null;
}) {
  const copy = AUTH_CODE_ERROR_COPY[reason] ?? AUTH_CODE_ERROR_COPY.verification_failed;
  const [email, setEmail] = useState(initialEmail ?? "");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function resendConfirmation() {
    const trimmed = email.trim();
    if (!trimmed || state !== "idle") return;

    setError(null);
    setState("sending");
    authLog("confirm.resend.start", { email: trimmed });

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: trimmed,
        options: { emailRedirectTo: authConfirmUrl(window.location.origin, { as: asRole ?? undefined }) },
      });

      if (resendError) {
        authLog("confirm.resend.fail", { message: resendError.message });
        setError(friendlyAuthError(resendError.message));
        setState("idle");
        return;
      }

      authLog("confirm.resend.ok", { email: trimmed });
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send email.");
      setState("idle");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">{copy.body}</p>
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@email.com"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {state === "sent" ? (
        <p className="text-sm text-green-400">
          New confirmation email sent — use the latest link once.
        </p>
      ) : (
        <Button
          type="button"
          className="w-full"
          loading={state === "sending"}
          disabled={state !== "idle" || !email.trim()}
          onClick={resendConfirmation}
          pill
        >
          Send new confirmation email
        </Button>
      )}
      <p className="text-center text-sm text-slate-500">
        Already confirmed?{" "}
        <Link href={asRole ? `/login?as=${asRole}` : "/login"} className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
