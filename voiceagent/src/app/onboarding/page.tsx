"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Calendar, Check, ExternalLink, Mic, Sparkles } from "lucide-react";
import { BusinessHoursEditor } from "@/components/BusinessHoursEditor";
import { OnboardingConfetti } from "@/components/onboarding/OnboardingConfetti";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { slideIn } from "@/lib/motion";
import { onboardingStep1Schema, type OnboardingStep1Data } from "@/lib/schemas/auth";
import { apiFetch } from "@/lib/api-client";
import { DEFAULT_BUSINESS_HOURS, type BusinessHours } from "@/lib/business-hours";
import { markOnboardingComplete } from "@/lib/onboarding";
import { SANDBOX_MAX_TEST_CALLS, TRIAL_MARKETING, TRIAL_MINUTES_ON_SIGNUP } from "@/lib/trial";

const BUSINESS_TYPES = [
  "Dental / Medical",
  "Salon / Spa",
  "Home Services",
  "Legal / Professional",
  "Restaurant",
  "Other",
] as const;

const DEFAULT_GREETING =
  "Hello! Thanks for calling. How can I help you today?";

export default function OnboardingPage() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [step, setStep] = useState(0);
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);
  const [agentId, setAgentId] = useState("");
  const [hours, setHours] = useState<BusinessHours>(DEFAULT_BUSINESS_HOURS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("welcome=1")) {
      setShowWelcome(true);
    }
    void apiFetch<{ agents: Array<{ id: string }> }>("/api/agents").then((res) => {
      if (res.ok && res.data.agents[0]) setAgentId(res.data.agents[0].id);
    });
  }, []);

  const form1 = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: { businessName: "", businessType: "", phone: "", city: "" },
  });

  async function saveStep1(data: OnboardingStep1Data) {
    setLoading(true);
    setError("");
    const res = await apiFetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.businessName, transfer_phone: data.phone }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStep(1);
  }

  async function saveGreeting() {
    if (!agentId) {
      setStep(3);
      return;
    }
    setLoading(true);
    setError("");
    const res = await apiFetch(`/api/agents`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agentId, welcome_greeting: greeting }),
    });
    setLoading(false);
    if (res.ok) setStep(3);
    else setError(res.error);
  }

  async function finishOnboarding() {
    await markOnboardingComplete();
    router.push("/dashboard");
  }

  return (
    <div className="hero-mesh relative min-h-screen px-4 py-10">
      {step === 4 ? <OnboardingConfetti /> : null}
      <div className="relative mx-auto max-w-xl">
        <Link href="/" className="font-display text-lg text-text">
          GreetQ
        </Link>

        {showWelcome && (
          <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-sm text-text">
            <p className="font-semibold">Welcome aboard — let&apos;s make you live.</p>
            <p className="mt-1 text-muted">
              {TRIAL_MINUTES_ON_SIGNUP} trial minutes and {SANDBOX_MAX_TEST_CALLS} test calls included.
              {` ${TRIAL_MARKETING.goLiveLong}`}
            </p>
          </div>
        )}

        <OnboardingProgress step={step} />

        <div className="auth-card relative mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={slideIn.hidden}
              animate={slideIn.visible}
              exit={slideIn.exit}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <>
                  <h1 className="font-display text-2xl text-text">Tell us about your business</h1>
                  <p className="mt-2 text-sm text-muted">We&apos;ll tailor your AI receptionist to your industry.</p>
                  <form onSubmit={form1.handleSubmit(saveStep1)} className="mt-6 space-y-4">
                    <Input label="Business name" error={form1.formState.errors.businessName?.message} {...form1.register("businessName")} />
                    <div>
                      <label className="mb-1.5 block text-sm text-muted">Industry</label>
                      <select className="input-field" {...form1.register("businessType")}>
                        <option value="">Select type</option>
                        {BUSINESS_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {form1.formState.errors.businessType && (
                        <p className="mt-1 text-xs text-danger">{form1.formState.errors.businessType.message}</p>
                      )}
                    </div>
                    <Input label="Phone number" type="tel" error={form1.formState.errors.phone?.message} {...form1.register("phone")} />
                    <Input label="City" error={form1.formState.errors.city?.message} {...form1.register("city")} />
                    {error && <p className="text-sm text-danger">{error}</p>}
                    <GlowButton type="submit" loading={loading} className="w-full justify-center">
                      Continue
                    </GlowButton>
                  </form>
                </>
              )}

              {step === 1 && (
                <>
                  <h1 className="font-display text-2xl text-text">Set your business hours</h1>
                  <p className="mt-2 text-sm text-muted">When should GreetQ answer calls?</p>
                  <div className="mt-6">
                    <BusinessHoursEditor value={hours} onChange={setHours} />
                  </div>
                  {error && <p className="mt-2 text-sm text-danger">{error}</p>}
                  <GlowButton
                    className="mt-6 w-full justify-center"
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      const res = await apiFetch("/api/settings", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ business_hours: hours }),
                      });
                      setLoading(false);
                      if (res.ok) setStep(2);
                      else setError(res.error);
                    }}
                  >
                    Continue
                  </GlowButton>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="font-display text-2xl text-text">Customize your greeting</h1>
                  <p className="mt-2 text-sm text-muted">This is the first thing callers hear. Keep it warm and on-brand.</p>
                  <textarea
                    className="input-field mt-4 min-h-[120px] resize-y"
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    maxLength={500}
                  />
                  <p className="mt-1 text-xs text-muted">{greeting.length}/500 characters</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                    disabled
                    title="Voice preview available in dashboard after setup"
                  >
                    <Mic className="h-4 w-4" />
                    Preview voice (available in dashboard)
                  </button>
                  {error && <p className="mt-2 text-sm text-danger">{error}</p>}
                  <div className="mt-6 flex gap-3">
                    <GlowButton variant="ghost" onClick={() => setStep(3)} className="flex-1 justify-center">
                      Skip for now
                    </GlowButton>
                    <GlowButton loading={loading} onClick={saveGreeting} className="flex-1 justify-center">
                      Continue
                    </GlowButton>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h1 className="font-display text-2xl text-text">Connect your calendar</h1>
                  <p className="mt-2 text-sm text-muted">Let GreetQ book appointments directly into your schedule.</p>
                  <div className="mt-6 grid gap-3">
                    <Link
                      href="/dashboard/integrations"
                      className="card-glow-hover flex items-center gap-3 rounded-xl border border-border p-4 transition hover:border-violet-500/40"
                    >
                      <Calendar className="h-5 w-5 text-teal-400" />
                      <div className="flex-1">
                        <p className="font-medium text-text">Google Calendar</p>
                        <p className="text-xs text-muted">Sync bookings in real time</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted" />
                    </Link>
                    <div className="card-glow flex items-center gap-3 rounded-xl border border-border p-4 opacity-60">
                      <Calendar className="h-5 w-5 text-muted" />
                      <div>
                        <p className="font-medium text-text">Calendly</p>
                        <p className="text-xs text-muted">Coming soon</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="card-glow-hover rounded-xl border border-border p-4 text-left text-sm text-muted transition hover:border-violet-500/40"
                    >
                      I&apos;ll set up calendar later — continue manually
                    </button>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <GlowButton variant="ghost" onClick={() => setStep(4)} className="flex-1 justify-center">
                      Skip for now
                    </GlowButton>
                    <GlowButton href="/dashboard/integrations" className="flex-1 justify-center">
                      Connect now
                    </GlowButton>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20">
                      <Sparkles className="h-6 w-6 text-violet-400" />
                    </span>
                    <div>
                      <h1 className="font-display text-2xl text-text">You&apos;re live!</h1>
                      <p className="text-sm text-muted">Your AI receptionist is ready to answer.</p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-muted">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-teal-400" />
                      Business profile saved
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-teal-400" />
                      Greeting configured
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-teal-400" />
                      {TRIAL_MINUTES_ON_SIGNUP} trial minutes activated
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-col gap-3">
                    <GlowButton onClick={() => void finishOnboarding()} className="w-full justify-center py-3">
                      Go to dashboard
                    </GlowButton>
                    <GlowButton href="/dashboard/sandbox" variant="ghost" className="w-full justify-center">
                      Test in sandbox first
                    </GlowButton>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
