"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { VoicePicker } from "@/components/dashboard/VoicePicker";
import { MODEL_CATALOG } from "@/lib/model-catalog";
import { PERSONA_TEMPLATES } from "@/lib/persona-templates";
import type { PersonaTemplate, VoiceProvider } from "@/lib/types";

export type AgentFormValues = {
  name: string;
  system_prompt: string;
  welcome_greeting: string;
  escalation_phone: string;
  voice: string;
  voice_provider: VoiceProvider;
  voice_id: string;
  language: string;
  llm_model: string;
  temperature: number;
  max_tokens: number;
  persona_template: PersonaTemplate;
  knowledge_base_enabled: boolean;
};

const TABS = [
  { id: "personality", label: "Personality", icon: "psychology" },
  { id: "voice", label: "Voice & Language", icon: "settings_voice" },
  { id: "behavior", label: "Behavior", icon: "tune" },
  { id: "advanced", label: "Advanced", icon: "code" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AgentConfigureForm({
  formId,
  values,
  onChange,
  onSubmit,
  agentId,
}: {
  formId: string;
  values: AgentFormValues;
  onChange: (values: AgentFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  agentId?: string;
}) {
  const [tab, setTab] = useState<TabId>("personality");

  function update<K extends keyof AgentFormValues>(key: K, value: AgentFormValues[K]) {
    onChange({ ...values, [key]: value });
  }

  function applyPersona(id: PersonaTemplate) {
    const template = PERSONA_TEMPLATES.find((p) => p.id === id);
    if (!template || id === "custom") {
      update("persona_template", id);
      return;
    }
    onChange({
      ...values,
      persona_template: id,
      name: values.name || template.label,
      system_prompt: template.system_prompt,
      welcome_greeting: template.welcome_greeting,
    });
  }

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-glass-border-subtle pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-primary/15 text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <MaterialIcon name={t.icon} className="text-[18px]" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "personality" && (
        <section className="space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-text">
              Persona template
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PERSONA_TEMPLATES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPersona(p.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    values.persona_template === p.id
                      ? "border-primary/40 bg-primary/10"
                      : "border-glass-border-subtle hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MaterialIcon name={p.icon} className="text-primary" />
                    <span className="font-semibold text-ghost-white">{p.label}</span>
                  </div>
                  <p className="mt-2 text-xs text-on-surface-variant">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="agent_name" className="mb-2 block text-sm font-semibold text-slate-text">
              Agent name
            </label>
            <input
              id="agent_name"
              className="agent-field"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="system_prompt" className="mb-2 block text-sm font-semibold text-slate-text">
              System prompt
            </label>
            <textarea
              id="system_prompt"
              className="agent-field min-h-[140px] resize-y"
              value={values.system_prompt}
              onChange={(e) => update("system_prompt", e.target.value)}
              rows={6}
            />
          </div>

          <div className="rounded-xl border border-glass-border-subtle bg-surface-container-low/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-text">
              Effective prompt preview
            </p>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {values.system_prompt || "No system prompt yet."}
              {values.knowledge_base_enabled && (
                <span className="mt-2 block text-primary">
                  + Knowledge base context injected on each call
                </span>
              )}
            </p>
          </div>
        </section>
      )}

      {tab === "voice" && (
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-text">
              Voice
            </h2>
            <VoicePicker
              value={values.voice_id}
              agentId={agentId}
              sampleText={values.welcome_greeting}
              onChange={(voiceId, language, provider) => {
                onChange({
                  ...values,
                  voice_id: voiceId,
                  language,
                  voice_provider: provider as VoiceProvider,
                });
              }}
            />
          </div>

          <div>
            <label htmlFor="greeting" className="mb-2 block text-sm font-semibold text-slate-text">
              Greeting message
            </label>
            <input
              id="greeting"
              className="agent-field"
              value={values.welcome_greeting}
              onChange={(e) => update("welcome_greeting", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-text">
              Language (BCP-47)
            </label>
            <input
              id="language"
              className="agent-field"
              value={values.language}
              onChange={(e) => update("language", e.target.value)}
            />
          </div>
        </section>
      )}

      {tab === "behavior" && (
        <section className="space-y-6">
          <div>
            <label htmlFor="escalation" className="mb-2 block text-sm font-semibold text-slate-text">
              Escalation number
            </label>
            <input
              id="escalation"
              className="agent-field"
              type="tel"
              placeholder="+1 (xxx) xxx-xxxx"
              value={values.escalation_phone}
              onChange={(e) => update("escalation_phone", e.target.value)}
            />
            <p className="mt-2 text-xs text-on-surface-variant">
              Warm-transfer target when caller asks for a human.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-glass-border-subtle p-4">
            <input
              type="checkbox"
              checked={values.knowledge_base_enabled}
              onChange={(e) => update("knowledge_base_enabled", e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary/30"
            />
            <div>
              <p className="text-sm font-semibold text-ghost-white">Knowledge base enabled</p>
              <p className="text-xs text-on-surface-variant">
                Inject FAQs and docs into every conversation turn.
              </p>
            </div>
          </label>
        </section>
      )}

      {tab === "advanced" && (
        <section className="space-y-6">
          <div>
            <label htmlFor="llm_model" className="mb-2 block text-sm font-semibold text-slate-text">
              LLM model
            </label>
            <select
              id="llm_model"
              className="agent-field"
              value={values.llm_model}
              onChange={(e) => update("llm_model", e.target.value)}
            >
              {MODEL_CATALOG.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} — {m.description}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="temperature" className="mb-2 block text-sm font-semibold text-slate-text">
                Temperature ({values.temperature})
              </label>
              <input
                id="temperature"
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={values.temperature}
                onChange={(e) => update("temperature", Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="max_tokens" className="mb-2 block text-sm font-semibold text-slate-text">
                Max tokens (voice)
              </label>
              <input
                id="max_tokens"
                type="number"
                min={20}
                max={120}
                className="agent-field"
                value={values.max_tokens}
                onChange={(e) => update("max_tokens", Number(e.target.value))}
              />
            </div>
          </div>
        </section>
      )}
    </form>
  );
}
