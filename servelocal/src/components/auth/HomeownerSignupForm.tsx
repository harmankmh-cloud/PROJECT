"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { redirectAfterAuth } from "@/lib/auth/client-redirect";
import {
  SIGNUP_ALREADY_REGISTERED_MESSAGE,
  SIGNUP_CONFIRM_EMAIL_MESSAGE,
  signUpAccount,
} from "@/lib/auth/signup-client";
import { useSubmitGuard } from "@/lib/auth/submit-guard";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TRADE_CITIES } from "@/lib/constants";
import { homeownerSignupSchema, type HomeownerSignupData } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function HomeownerSignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const guardSubmit = useSubmitGuard();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HomeownerSignupData>({
    resolver: zodResolver(homeownerSignupSchema),
    defaultValues: { city: TRADE_CITIES[0]?.slug },
  });

  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-red-400">Add Supabase keys to .env.local and restart.</p>;
  }

  async function onSubmit(data: HomeownerSignupData) {
    if (completed) return;

    const ran = await guardSubmit(async () => {
      setError(null);
      setInfo(null);
      const supabase = createClient();

      const result = await signUpAccount(supabase, {
        email: data.email,
        password: data.password,
        metadata: { role: "homeowner", display_name: data.name, city: data.city },
        fallbackOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
      });

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      if (result.status === "already_registered") {
        setCompleted(true);
        setInfo(SIGNUP_ALREADY_REGISTERED_MESSAGE);
        return;
      }

      if (result.status === "confirm_email") {
        setCompleted(true);
        setInfo(SIGNUP_CONFIRM_EMAIL_MESSAGE);
        return;
      }

      await fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "homeowner", display_name: data.name, phone: null }),
      });

      await redirectAfterAuth("/auth/after-login");
    });

    if (ran === "skipped") return;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Full name</label>
        <Input {...register("name")} autoComplete="name" />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
      </div>
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Email</label>
        <Input type="email" {...register("email")} autoComplete="email" />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>
      <div>
        <label className="font-label mb-1.5 block text-slate-400">City in BC</label>
        <select
          {...register("city")}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-50 outline-none focus:border-primary/60"
        >
          {TRADE_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>}
      </div>
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Password</label>
        <Input type="password" {...register("password")} autoComplete="new-password" />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {info && <p className="text-sm text-green-400">{info}</p>}
      <Button type="submit" className="w-full" loading={isSubmitting} disabled={completed} pill>
        Create homeowner account
      </Button>
      <p className="text-center text-xs text-slate-500">
        <Link href="/signup" className="text-primary hover:underline">
          ← Choose a different account type
        </Link>
      </p>
    </form>
  );
}
