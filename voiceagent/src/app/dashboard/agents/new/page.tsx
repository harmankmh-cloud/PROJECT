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
  DEFAULT_AGENT_LLM_MODEL,
  DEFAULT_AGENT_NAME,
  DEFAULT_AGENT_PERSONA,
  DEFAULT_AGENT_PROMPT,
  DEFAULT_AGENT_VOICE,
  DEFAULT_AGENT_VOICE_ID,
  DEFAULT_AGENT_VOICE_PROVIDER,
} from "@/lib/agent-defaults";
import { formValuesToPayload } from "@/lib/agent-form";
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
    voice_provider: DEFAULT_AGENT_VOICE_PROVIDER,
    voice_id: DEFAULT_AGENT_VOICE_ID,
    language: DEFAULT_AGENT_LANGUAGE,
    llm_model: DEFAULT_AGENT_LLM_MODEL,
    temperature: 0.2,
    max_tokens: 50,
    persona_template: DEFAULT_AGENT_PERSONA,
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
      body: JSON.stringify(formValuesToPayload(values)),
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
      <main className="dashboard-container mx-auto max-w-2xl pt-4">
        {error && <p className="mb-4 text-sm text-error">{error}</p>}
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
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MaterialIcon name="science" filled />
            {saving ? "Saving…" : "Launch Test Sandbox"}
          </button>
        </div>
      </div>
    </div>
  );
}
