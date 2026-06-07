"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgentConfigHeader } from "@/components/dashboard/AgentConfigHeader";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  AgentConfigureForm,
  type AgentFormValues,
} from "@/components/dashboard/AgentConfigureForm";
import {
  DEFAULT_AGENT_GREETING,
  DEFAULT_AGENT_LANGUAGE,
  DEFAULT_AGENT_NAME,
  DEFAULT_AGENT_PROMPT,
  DEFAULT_AGENT_VOICE,
} from "@/lib/agent-defaults";
import { apiFetch } from "@/lib/api-client";
import type { Agent } from "@/lib/types";

const FORM_ID = "agent-config-form";

export default function NewAgentPage() {
  const router = useRouter();
  const [values, setValues] = useState<AgentFormValues>({
    name: DEFAULT_AGENT_NAME,
    system_prompt: DEFAULT_AGENT_PROMPT,
    welcome_greeting: DEFAULT_AGENT_GREETING,
    escalation_phone: "",
    voice: DEFAULT_AGENT_VOICE,
    language: DEFAULT_AGENT_LANGUAGE,
    knowledge_base_enabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveAgent(redirectToSandbox = false) {
    setSaving(true);
    setError("");
    const res = await apiFetch<{ agent: Agent }>("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      if (redirectToSandbox) {
        router.push(`/dashboard/sandbox?agent=${res.data.agent.id}`);
      } else {
        router.push(`/dashboard/agents/${res.data.agent.id}`);
      }
      return true;
    }

    setError(res.error);
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveAgent(false);
  }

  return (
    <div className="pb-36">
      <AgentConfigHeader
        title="Configure Agent"
        onSave={() => void saveAgent(false)}
        saving={saving}
      />
      <main className="dashboard-container mx-auto max-w-lg pt-4">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <AgentConfigureForm
          formId={FORM_ID}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
        />
      </main>
      <div className="fixed bottom-20 left-0 right-0 z-40 border-t border-outline-variant/10 glass-panel p-5 md:bottom-0">
        <div className="mx-auto max-w-lg">
          <button
            type="submit"
            form={FORM_ID}
            disabled={saving}
            onClick={(e) => {
              e.preventDefault();
              void saveAgent(true);
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <MaterialIcon name="science" filled />
            {saving ? "Saving…" : "Launch Test Sandbox"}
          </button>
        </div>
      </div>
    </div>
  );
}
