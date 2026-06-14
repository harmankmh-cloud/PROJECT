"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function SiteAuthNav({
  compact,
  accountHref,
  accountLabel,
}: {
  compact?: boolean;
  accountHref?: string | null;
  accountLabel?: string | null;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured()) return null;

  if (user) {
    const href = accountHref || "/dashboard";
    const label = accountLabel || "My account";

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
