"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PERSONA_TEMPLATES } from "@/lib/persona-templates";
import type { PersonaTemplate } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

const KNOWLEDGE_PROMPTS = [
  { title: "Business hours", content: "We are open Monday–Friday 9am–5pm." },
  { title: "Services", content: "We offer consultations, bookings, and support by phone." },
  { title: "Location", content: "Ask for our address or directions and we will share them." },
];

export default function SetupWizardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaTemplate>("receptionist");
  const [agentId, setAgentId] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ agents: Array<{ id: string }> }>("/api/agents").then((res) => {
      if (res.ok && res.data.agents[0]) setAgentId(res.data.agents[0].id);
    });
  }, []);

  async function applyPersonaAndContinue() {
    setLoading(true);
    setError("");
    const template = PERSONA_TEMPLATES.find((p) => p.id === persona);
    if (!agentId || !template || persona === "custom") {
      setStep(2);
      setLoading(false);
      return;
    }

    const res = await apiFetch("/api/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: agentId,
        persona_template: persona,
        name: template.label,
        system_prompt: template.system_prompt,
        welcome_greeting: template.welcome_greeting,
      }),
    });
    setLoading(false);
    if (res.ok) setStep(2);
    else setError(res.error);
  }

  async function seedKnowledge() {
    setLoading(true);
    setError("");
    for (const item of KNOWLEDGE_PROMPTS) {
      await apiFetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          content: item.content,
          agent_id: agentId || null,
        }),
      });
    }
    setLoading(false);
    setStep(4);
  }

  async function startTestCall() {
    if (!testPhone.trim()) {
      setStep(5);
      return;
    }
    setLoading(true);
    setError("");
    const res = await apiFetch<{ message?: string }>("/api/sandbox/test-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, phone: testPhone }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage(res.data.message || "Test call started.");
      setStep(5);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="dashboard-container max-w-2xl pb-16">
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Go live wizard</p>
        <h1 className="font-display text-3xl font-bold text-ghost-white">Set up GreetQ</h1>
        <p className="mt-2 text-on-surface-variant">
          Step {step} of 5 — get your agent ready for real callers.
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-electric-cyan transition-all"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}

      {step === 1 && (
        <section className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-bold text-ghost-white">Choose your business type</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PERSONA_TEMPLATES.filter((p) => p.id !== "custom").map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersona(p.id)}
                className={`rounded-xl border p-4 text-left ${
                  persona === p.id ? "border-primary/40 bg-primary/10" : "border-glass-border-subtle"
                }`}
              >
                <MaterialIcon name={p.icon} className="text-primary" />
                <p className="mt-2 font-semibold text-ghost-white">{p.label}</p>
                <p className="text-xs text-on-surface-variant">{p.description}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => void applyPersonaAndContinue()}
            className="btn-primary w-full rounded-xl py-3"
          >
            Continue
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-bold text-ghost-white">Customize your agent</h2>
          <p className="text-sm text-on-surface-variant">
            Fine-tune voice, prompt, and model in Agent Studio.
          </p>
          <Link href={agentId ? `/dashboard/agents/${agentId}` : "/dashboard/agents"} className="btn-secondary inline-flex rounded-xl px-4 py-2">
            Open Agent Studio
          </Link>
          <button type="button" onClick={() => setStep(3)} className="btn-primary w-full rounded-xl py-3">
            Continue
          </button>
        </section>
      )}

      {step === 3 && (
        <section className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-bold text-ghost-white">Add starter knowledge</h2>
          <p className="text-sm text-on-surface-variant">
            We will add three FAQ entries you can edit later.
          </p>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            {KNOWLEDGE_PROMPTS.map((k) => (
              <li key={k.title} className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-primary text-[18px]" />
                {k.title}
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={loading}
            onClick={() => void seedKnowledge()}
            className="btn-primary w-full rounded-xl py-3"
          >
            Add knowledge & continue
          </button>
        </section>
      )}

      {step === 4 && (
        <section className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-bold text-ghost-white">Test without a number</h2>
          <p className="text-sm text-on-surface-variant">
            Enter your mobile number for a 1-minute sandbox test call, or skip to connect a line later.
          </p>
          <input
            className="input-field"
            placeholder="+1 604 555 0100"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => void startTestCall()}
              className="btn-primary flex-1 rounded-xl py-3"
            >
              Call my phone
            </button>
            <button type="button" onClick={() => setStep(5)} className="btn-ghost flex-1 rounded-xl py-3">
              Skip
            </button>
          </div>
          <Link href="/dashboard/phone-numbers" className="text-sm text-primary hover:underline">
            Or connect a phone number →
          </Link>
        </section>
      )}

      {step === 5 && (
        <section className="surface-card space-y-4 p-6 text-center">
          <MaterialIcon name="rocket_launch" className="text-5xl text-primary" />
          <h2 className="text-xl font-bold text-ghost-white">You are ready to go live</h2>
          <p className="text-sm text-on-surface-variant">
            Publish a call flow optional, map your number, and monitor calls from the dashboard.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard/phone-numbers" className="btn-primary rounded-xl px-6 py-3">
              Connect number
            </Link>
            <Link href="/dashboard" className="btn-secondary rounded-xl px-6 py-3">
              Dashboard
            </Link>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard/sandbox")}
            className="text-sm text-primary hover:underline"
          >
            Open text sandbox
          </button>
        </section>
      )}
    </div>
  );
}
