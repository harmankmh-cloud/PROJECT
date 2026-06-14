"use client";

import confetti from "canvas-confetti";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { IndustryPicker } from "@/components/IndustryPicker";
import { Button } from "@/components/ui/Button";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { Input } from "@/components/ui/Input";
import { validateGoogleReviewUrl } from "@/lib/google-review-url";
import { onboardingStep1Schema, type OnboardingStep1Data } from "@/lib/schemas/auth";

const STEPS = ["Business info", "Google link", "Greeting", "Share"] as const;

const DEFAULT_GREETING =
  "Hi! Thanks for visiting us. We'd love to hear about your experience — it only takes a minute.";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [googleUrl, setGoogleUrl] = useState("");
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const form1 = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: { businessName: "", businessType: "", city: "", phone: "" },
  });

  async function saveStep1(data: OnboardingStep1Data) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/business/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.businessName,
          businessType: data.businessType,
          googleReviewUrl: "",
          tone: "friendly",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Setup failed");
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveStep2() {
    const validated = validateGoogleReviewUrl(googleUrl);
    if (!validated.ok) {
      setError(validated.error);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleReviewUrl: validated.value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function finishOnboarding() {
    setDone(true);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="font-display text-lg text-text">
          RateLocal
        </Link>

        <div className="mt-8 flex gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
              <p className="mt-2 hidden text-xs text-muted sm:block">{label}</p>
            </div>
          ))}
        </div>

        <div className="auth-card mt-10">
          <ClientOnly fallback={<div className="min-h-[200px]" />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={done ? "done" : step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {!done && step === 0 && (
                  <>
                    <h1 className="font-display text-2xl text-text">Tell us about your business</h1>
                    <form onSubmit={form1.handleSubmit(saveStep1)} className="mt-6 space-y-4">
                      <Input label="Business name" error={form1.formState.errors.businessName?.message} {...form1.register("businessName")} />
                      <div>
                        <p className="mb-2 text-sm text-muted">Category</p>
                        <IndustryPicker value={form1.watch("businessType")} onChange={(v) => form1.setValue("businessType", v, { shouldValidate: true })} />
                        {form1.formState.errors.businessType && (
                          <p className="mt-1 text-xs text-danger">{form1.formState.errors.businessType.message}</p>
                        )}
                      </div>
                      <Input label="City" error={form1.formState.errors.city?.message} {...form1.register("city")} />
                      <Input label="Phone (optional)" type="tel" {...form1.register("phone")} />
                      {error && <p className="text-sm text-danger">{error}</p>}
                      <Button type="submit" className="w-full" loading={loading}>
                        Continue
                      </Button>
                    </form>
                  </>
                )}

                {!done && step === 1 && (
                  <>
                    <h1 className="font-display text-2xl text-text">Paste your Google review link</h1>
                    <p className="mt-2 text-sm text-muted">
                      In Google Maps, open your business → Share → Copy link. It usually starts with g.page or google.com/maps.
                    </p>
                    <Input
                      label="Google review link"
                      value={googleUrl}
                      onChange={(e) => setGoogleUrl(e.target.value)}
                      className="mt-4"
                      placeholder="https://g.page/r/..."
                    />
                    {error && <p className="mt-2 text-sm text-danger">{error}</p>}
                    <Button className="mt-6 w-full" loading={loading} onClick={saveStep2}>
                      Continue
                    </Button>
                  </>
                )}

                {!done && step === 2 && (
                  <>
                    <h1 className="font-display text-2xl text-text">Customize your greeting</h1>
                    <textarea
                      className="input-field mt-4 min-h-[120px]"
                      value={greeting}
                      onChange={(e) => setGreeting(e.target.value)}
                    />
                    <Button className="mt-6 w-full" onClick={() => setStep(3)}>
                      Continue
                    </Button>
                  </>
                )}

                {!done && step === 3 && (
                  <>
                    <h1 className="font-display text-2xl text-text">You&apos;re ready to share</h1>
                    <div className="mt-4 space-y-4">
                      <div className="card-surface">
                        <p className="text-sm font-semibold text-text">QR code preview</p>
                        <div className="mt-3 flex h-32 items-center justify-center rounded-xl bg-surface text-muted">
                          Download from dashboard → Share
                        </div>
                      </div>
                      <div className="card-surface">
                        <p className="text-sm font-semibold text-text">SMS template</p>
                        <p className="mt-2 text-sm text-muted">
                          Hi! Thanks for visiting. Share a quick review — takes 30 seconds: [your link]
                        </p>
                      </div>
                    </div>
                    <Button className="mt-6 w-full" onClick={finishOnboarding}>
                      Finish setup
                    </Button>
                  </>
                )}

                {done && (
                  <div className="text-center">
                    <h1 className="font-display text-2xl text-text">You&apos;re live!</h1>
                    <p className="mt-2 text-muted">Share your first review request from the dashboard.</p>
                    <Button className="mt-6 w-full" onClick={() => router.push("/dashboard")}>
                      Go to dashboard →
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </ClientOnly>
        </div>
      </div>
    </main>
  );
}
