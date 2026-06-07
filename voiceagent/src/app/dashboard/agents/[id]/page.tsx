"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AgentConfigBottomBar } from "@/components/dashboard/AgentConfigBottomBar";
import { AgentConfigHeader } from "@/components/dashboard/AgentConfigHeader";
import {
  AgentConfigureForm,
  type AgentFormValues,
} from "@/components/dashboard/AgentConfigureForm";
import { apiFetch } from "@/lib/api-client";
import type { Agent } from "@/lib/types";

const FORM_ID = "agent-config-form";

function toFormValues(agent: Agent): AgentFormValues {
  return {
    name: agent.name,
    system_prompt: agent.system_prompt || "",
    welcome_greeting: agent.welcome_greeting || "",
    escalation_phone: agent.escalation_phone || "",
    voice: agent.voice,
    language: agent.language,
    knowledge_base_enabled: agent.knowledge_base_enabled,
  };
}

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [values, setValues] = useState<AgentFormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch<{ agents: Agent[] }>("/api/agents").then((res) => {
      if (!active) return;
      if (res.ok) {
        const agent = res.data.agents.find((a) => a.id === agentId);
        if (agent) setValues(toFormValues(agent));
        else setError("Agent not found");
      } else {
        setError(res.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [agentId]);

  async function saveAgent() {
    if (!values) return;
    setSaving(true);
    setError("");
    const res = await apiFetch<{ agent: Agent }>("/api/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: agentId,
        name: values.name,
        system_prompt: values.system_prompt,
        welcome_greeting: values.welcome_greeting,
        escalation_phone: values.escalation_phone || null,
        voice: values.voice,
        language: values.language,
        knowledge_base_enabled: values.knowledge_base_enabled,
      }),
    });
    setSaving(false);

    if (res.ok) {
      setValues(toFormValues(res.data.agent));
      return;
    }
    setError(res.error);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveAgent();
  }

  if (loading) {
    return (
      <div className="dashboard-container py-12 text-on-primary-container">Loading agent…</div>
    );
  }

  if (!values) {
    return (
      <div className="dashboard-container py-12">
        <p className="text-red-600">{error || "Agent not found"}</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/agents")}
          className="mt-4 text-sm font-semibold text-secondary hover:underline"
        >
          Back to agents
        </button>
      </div>
    );
  }

  return (
    <div className="pb-36">
      <AgentConfigHeader title="Configure Agent" onSave={() => void saveAgent()} saving={saving} />
      <main className="dashboard-container mx-auto max-w-lg pt-4">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <AgentConfigureForm
          formId={FORM_ID}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
        />
      </main>
      <AgentConfigBottomBar agentId={agentId} />
    </div>
  );
}
