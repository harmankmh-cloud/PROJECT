"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TermsConsent } from "@/components/TermsConsent";
import { AUTH } from "@/content/copy";
import { friendlyAuthError } from "@/lib/auth-errors";
import { signupSchema, type SignupData } from "@/lib/schemas/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export function SignupFormNew() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", businessName: "", phone: "", termsAccepted: undefined },
  });

  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-danger">Add Supabase keys to .env.local and restart.</p>;
  }

  async function onSubmit(data: SignupData) {
    setError("");
    setInfo("");
    try {
      const supabase = createClient();
      const result = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
          data: {
            pending_business_name: data.businessName.trim(),
            pending_phone: data.phone?.trim() || "",
          },
        },
      });
      if (result.error) throw result.error;
      if (!result.data.session) {
        setInfo("Check your email to confirm, then continue onboarding.");
        return;
      }
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Signup failed"));
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
      <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register("password")} />
      <Input label="Business name" error={form.formState.errors.businessName?.message} {...form.register("businessName")} />
      <Input label="Phone (optional)" type="tel" {...form.register("phone")} />
      <TermsConsent
        checked={termsAccepted}
        onChange={(v) => {
          setTermsAccepted(v);
          form.setValue("termsAccepted", v ? true : (undefined as unknown as true), { shouldValidate: true });
        }}
      />
      {form.formState.errors.termsAccepted && (
        <p className="text-xs text-danger">{form.formState.errors.termsAccepted.message}</p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      {info && <p className="alert-success">{info}</p>}
      <Button type="submit" className="w-full" pill loading={form.formState.isSubmitting}>
        Create account
      </Button>
      {GOOGLE_ENABLED && (
        <Button type="button" variant="outline" className="w-full" onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
          });
        }}>
          {AUTH.google}
        </Button>
      )}
      <p className="text-center text-sm text-muted">
        {AUTH.hasAccount}{" "}
        <Link href="/login" className="link-accent">
          Sign in
        </Link>
      </p>
    </form>
  );
}
