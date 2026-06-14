"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type SessionInfo = {
  user: User | null;
  dashboardPath: string;
};

export function SiteAuthNav({
  compact,
  accountHref,
  accountLabel,
}: {
  compact?: boolean;
  accountHref?: string | null;
  accountLabel?: string | null;
}) {
  const [session, setSession] = useState<SessionInfo>({ user: null, dashboardPath: "/dashboard" });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    async function applySession(user: User | null) {
      if (!user) {
        setSession({ user: null, dashboardPath: "/dashboard" });
        return;
      }

      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const payload = (await res.json()) as { dashboardPath?: string };
          setSession({ user, dashboardPath: payload.dashboardPath ?? "/dashboard" });
          return;
        }
      } catch {
        // Fall back to generic dashboard link
      }

      setSession({ user, dashboardPath: "/auth/after-login" });
    }

    void supabase.auth.getSession().then(({ data }) => {
      void applySession(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authSession) => {
      void applySession(authSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured()) return null;

  if (session.user) {
    const href = accountHref || session.dashboardPath;
    const label = accountLabel || (session.dashboardPath.includes("/pro") ? "Pro dashboard" : "My account");

    return (
      <Link
        href={href}
        className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100/80 hover:text-brand-950"
      >
        {label}
      </Link>
    );
  }

  return (
    <>
      {!compact && (
        <Link
          href="/login"
          className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100/80 hover:text-brand-950"
        >
          Log in
        </Link>
      )}
      <Link href="/signup" className="btn-ghost px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
        Sign up
      </Link>
    </>
  );
}
