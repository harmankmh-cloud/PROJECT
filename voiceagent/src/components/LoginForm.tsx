"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleAuthButton, isGoogleAuthEnabled } from "@/components/auth/GoogleAuthButton";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { TRIAL_MARKETING } from "@/lib/trial";

export function LoginForm({ initialError = "" }: { initialError?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword(data);
    if (signInError) {
      setFormError("root", { message: signInError.message });
      return;
    }
    const setupRes = await fetch("/api/org/setup", { method: "POST" });
    if (!setupRes.ok) {
      const body = await setupRes.json().catch(() => ({}));
      setFormError("root", {
        message:
          (body as { error?: string }).error ||
          "Account signed in but organization setup failed. Contact support.",
      });
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout panelFooter={TRIAL_MARKETING.authPanel}>
      <div className="auth-card">
        <h1 className="font-display text-3xl text-text">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to your {TRIAL_MARKETING.exploreShort.toLowerCase()} workspace.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          {(errors.root?.message || initialError) && (
            <p className="text-sm text-danger" role="alert">
              {errors.root?.message || initialError}
            </p>
          )}
          <GlowButton type="submit" className="w-full justify-center" loading={isSubmitting}>
            Sign In
          </GlowButton>
        </form>

        {isGoogleAuthEnabled && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-2 text-muted">or continue with</span>
              </div>
            </div>
            <GoogleAuthButton mode="login" />
          </>
        )}

        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="font-medium text-accent hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-muted">
          New to GreetQ?{" "}
          <Link href="/signup" className="text-primary-glow hover:underline">
            {TRIAL_MARKETING.cta} →
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
