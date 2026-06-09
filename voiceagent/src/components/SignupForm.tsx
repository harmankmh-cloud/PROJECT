"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupFormData } from "@/lib/schemas/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BRAND } from "@/lib/brand";
import type { PlanKey } from "@/lib/plans";

export function SignupForm({ initialPlan = null }: { initialPlan?: PlanKey | null }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { businessName: "", email: "", password: "", acceptedTerms: undefined },
  });

  async function onSubmit(data: SignupFormData) {
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: data.businessName?.trim() ? { business_name: data.businessName.trim() } : undefined,
      },
    });
    if (signUpError) {
      setFormError("root", { message: signUpError.message });
      return;
    }
    const setupRes = await fetch("/api/org/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName: data.businessName?.trim() || undefined }),
    });
    if (!setupRes.ok) {
      const body = await setupRes.json().catch(() => ({}));
      setFormError("root", {
        message:
          (body as { error?: string }).error ||
          "Account created but organization setup failed. Try signing in again.",
      });
      return;
    }

    if (initialPlan && initialPlan !== "enterprise") {
      window.location.href = `/dashboard/billing?subscribe=${initialPlan}`;
      return;
    }
    window.location.href = "/onboarding";
  }

  return (
    <AuthLayout panelFooter={`Start with ${BRAND.name}`}>
      <div className="auth-card">
        <h1 className="font-display text-3xl text-text">Create your account</h1>
        <p className="mt-2 text-sm text-muted">
          {initialPlan
            ? `Set up your org, then continue to ${initialPlan} checkout.`
            : "Get your AI receptionist running in minutes."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <Input
            label="Business name"
            autoComplete="organization"
            error={errors.businessName?.message}
            {...register("businessName")}
          />
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
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Controller
            name="acceptedTerms"
            control={control}
            render={({ field }) => (
              <label className="flex items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={field.value === true}
                  onChange={(e) => field.onChange(e.target.checked ? true : undefined)}
                  className="mt-1 h-4 w-4 rounded border-border accent-primary"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary-glow hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary-glow hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            )}
          />
          {errors.acceptedTerms && (
            <p className="text-sm text-danger">{errors.acceptedTerms.message}</p>
          )}
          {errors.root?.message && (
            <p className="text-sm text-danger" role="alert">
              {errors.root.message}
            </p>
          )}
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Start Free Trial
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-muted">or continue with</span>
          </div>
        </div>

        <GoogleAuthButton mode="signup" />

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-glow hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
