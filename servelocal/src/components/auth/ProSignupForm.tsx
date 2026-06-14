"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { redirectAfterAuth } from "@/lib/auth/client-redirect";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { homeownerSignupSchema } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const proSignupSchema = homeownerSignupSchema;

type ProSignupData = z.infer<typeof proSignupSchema>;

export function ProSignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProSignupData>({
    resolver: zodResolver(proSignupSchema),
  });

  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-red-400">Add Supabase keys to .env.local and restart.</p>;
  }

  async function onSubmit(data: ProSignupData) {
    setError(null);
    setInfo(null);
    const supabase = createClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { role: "pro", display_name: data.name, city: data.city },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (authData.user && !authData.session) {
      setInfo("Check your email to confirm, then continue onboarding.");
      return;
    }

    await fetch("/api/user-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "pro", display_name: data.name }),
    });

    await redirectAfterAuth("/auth/after-login");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Your name</label>
        <Input {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
      </div>
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Email</label>
        <Input type="email" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Password</label>
        <Input type="password" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
      </div>
      <input type="hidden" {...register("city")} value="surrey" />
      {error && <p className="text-sm text-red-400">{error}</p>}
      {info && <p className="text-sm text-green-400">{info}</p>}
      <Button type="submit" className="w-full" loading={isSubmitting} pill>
        Continue to pro setup
      </Button>
      <p className="text-center text-xs text-slate-500">
        <Link href="/signup" className="text-primary hover:underline">
          ← Choose a different account type
        </Link>
      </p>
    </form>
  );
}
