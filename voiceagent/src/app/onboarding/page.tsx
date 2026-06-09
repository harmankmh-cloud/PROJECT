"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { BusinessHoursEditor } from "@/components/BusinessHoursEditor";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { onboardingStep1Schema, type OnboardingStep1Data } from "@/lib/schemas/auth";
import { apiFetch } from "@/lib/api-client";
import { DEFAULT_BUSINESS_HOURS, type BusinessHours } from "@/lib/business-hours";
import { markOnboardingComplete } from "@/lib/onboarding";
import { SANDBOX_MAX_TEST_CALLS, TRIAL_MARKETING, TRIAL_MINUTES_ON_SIGNUP } from "@/lib/trial";

const STEPS = ["Business info", "Hours", "FAQs", "Test call"] as const;

const BUSINESS_TYPES = [
  "Dental / Medical",
  "Salon / Spa",
  "Home Services",
  "Legal / Professional",
  "Restaurant",
  "Other",
] as const;

const FAQ_DEFAULTS = `What are your business hours?
What services do you offer?
Where are you located?`;

export default function OnboardingPage() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [step, setStep] = useState(0);
  const [faqs, setFaqs] = useState(FAQ_DEFAULTS);
  const [testPhone, setTestPhone] = useState("");
  const [agentId, setAgentId] = useState("");
  const [hours, setHours] = useState<BusinessHours>(DEFAULT_BUSINESS_HOURS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("welcome=1")) {
      setShowWelcome(true);
    }
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
      body: JSON.stringify({
        name: data.businessName,
        transfer_phone: data.phone,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStep(1);
  }

  async function saveFaqs() {
    setLoading(true);
    setError("");
    const lines = faqs.split("\n").filter((l) => l.trim());
    for (const line of lines) {
      await apiFetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: line.slice(0, 80), content: line, agent_id: agentId || null }),
      });
    }
    const agentsRes = await apiFetch<{ agents: Array<{ id: string }> }>("/api/agents");
    if (agentsRes.ok && agentsRes.data.agents[0]) {
      setAgentId(agentsRes.data.agents[0].id);
    }
    setLoading(false);
    setStep(3);
  }

  async function finishOnboarding(destination = "/dashboard") {
    await markOnboardingComplete();
    router.push(destination);
  }

  async function runTestCall() {
    if (!testPhone.trim()) {
      await finishOnboarding();
      return;
    }
    setLoading(true);
    const res = await apiFetch("/api/sandbox/test-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, phone: testPhone }),
    });
    setLoading(false);
    if (res.ok) await finishOnboarding();
    else setError(res.error);
  }

  return (
    <div className="aurora-bg min-h-screen px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="font-display text-lg text-text">
          GreetQ
        </Link>

        {showWelcome && (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-text">
            <p className="font-semibold">Account created — let&apos;s set up your agent.</p>
            <p className="mt-1 text-muted">
              {TRIAL_MINUTES_ON_SIGNUP} trial minutes and {SANDBOX_MAX_TEST_CALLS} test calls included.
              {` ${TRIAL_MARKETING.goLiveLong}`} This setup takes about 2 minutes.
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
              />
              <p className="mt-2 hidden text-xs text-muted sm:block">{label}</p>
            </div>
          ))}
        </div>

        <div className="auth-card mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <>
                  <h1 className="font-display text-2xl text-text">Tell us about your business</h1>
                  <form onSubmit={form1.handleSubmit(saveStep1)} className="mt-6 space-y-4">
                    <Input label="Business name" error={form1.formState.errors.businessName?.message} {...form1.register("businessName")} />
                    <div>
                      <label className="mb-1.5 block text-sm text-muted">Business type</label>
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
                    <Button type="submit" className="w-full" loading={loading}>Continue</Button>
                  </form>
                </>
              )}

              {step === 1 && (
                <>
                  <h1 className="font-display text-2xl text-text">Business hours</h1>
                  <p className="mt-2 text-sm text-muted">When should GreetQ answer calls?</p>
                  <div className="mt-6">
                    <BusinessHoursEditor value={hours} onChange={setHours} />
                  </div>
                  <Button
                    className="mt-6 w-full"
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
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="font-display text-2xl text-text">Common questions</h1>
                  <p className="mt-2 text-sm text-muted">Paste FAQs — one per line. GreetQ learns from these.</p>
                  <textarea
                    className="input-field mt-4 min-h-[160px] font-mono text-sm"
                    value={faqs}
                    onChange={(e) => setFaqs(e.target.value)}
                  />
                  {error && <p className="mt-2 text-sm text-danger">{error}</p>}
                  <div className="mt-6 flex gap-3">
                    <Button variant="ghost" onClick={() => setStep(3)}>Skip</Button>
                    <Button className="flex-1" loading={loading} onClick={saveFaqs}>Continue</Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h1 className="font-display text-2xl text-text">Test your agent</h1>
                  <p className="mt-2 text-sm text-muted">Enter your mobile to hear GreetQ greet as your business.</p>
                  <Input
                    label="Your phone (optional)"
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="mt-4"
                  />
                  {error && <p className="mt-2 text-sm text-danger">{error}</p>}
                  <div className="mt-6 flex gap-3">
                    <Button variant="ghost" onClick={() => void finishOnboarding()}>Skip to dashboard</Button>
                    <Button className="flex-1" loading={loading} onClick={runTestCall}>Start test call</Button>
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
