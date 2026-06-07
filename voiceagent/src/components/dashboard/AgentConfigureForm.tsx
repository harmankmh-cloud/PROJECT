"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

export type AgentFormValues = {
  name: string;
  system_prompt: string;
  welcome_greeting: string;
  escalation_phone: string;
  voice: string;
  language: string;
  knowledge_base_enabled: boolean;
};

export function AgentConfigureForm({
  formId,
  values,
  onChange,
  onSubmit,
}: {
  formId: string;
  values: AgentFormValues;
  onChange: (values: AgentFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [voiceOpen, setVoiceOpen] = useState(false);

  function update<K extends keyof AgentFormValues>(key: K, value: AgentFormValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-8">
      <section>
        <div className="glass-panel rounded-xl p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-surface-container bg-primary-container">
              <MaterialIcon name="support_agent" className="text-[32px] text-on-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                Active Template
              </p>
              <h2 className="text-xl font-bold text-on-surface">{values.name || "Receptionist"}</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="agent_name" className="mb-2 block text-sm font-semibold text-slate-text">
                Agent Name
              </label>
              <input
                id="agent_name"
                className="agent-field"
                placeholder="e.g. Front Desk Assistant"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="system_prompt" className="mb-2 block text-sm font-semibold text-slate-text">
                System Prompt
              </label>
              <textarea
                id="system_prompt"
                className="agent-field resize-none"
                placeholder="Define the behavior, tone, and constraints of your AI agent..."
                rows={5}
                value={values.system_prompt}
                onChange={(e) => update("system_prompt", e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <span className="text-[10px] font-semibold text-on-primary-container/60">
                  Character count: {values.system_prompt.length}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="greeting" className="mb-2 block text-sm font-semibold text-slate-text">
                Greeting Message
              </label>
              <input
                id="greeting"
                className="agent-field"
                placeholder="The first words your agent says"
                value={values.welcome_greeting}
                onChange={(e) => update("welcome_greeting", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="escalation" className="mb-2 block text-sm font-semibold text-slate-text">
                Escalation Number
              </label>
              <div className="relative">
                <MaterialIcon
                  name="phone"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-primary-container"
                />
                <input
                  id="escalation"
                  className="agent-field pl-11"
                  placeholder="+1 (xxx) xxx-xxxx"
                  type="tel"
                  value={values.escalation_phone}
                  onChange={(e) => update("escalation_phone", e.target.value)}
                />
              </div>
              <p className="mt-2 text-[11px] italic text-on-primary-container">
                The agent will transfer the call here if a human is requested.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={() => setVoiceOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg bg-surface-container-low p-4 transition-colors active:bg-surface-container-high"
        >
          <div className="flex items-center gap-3">
            <MaterialIcon name="settings_voice" className="text-slate-text" />
            <span className="text-sm font-semibold text-on-surface">Voice &amp; Audio Settings</span>
          </div>
          <MaterialIcon
            name="chevron_right"
            className={`text-outline transition-transform ${voiceOpen ? "rotate-90" : ""}`}
          />
        </button>
        {voiceOpen && (
          <div className="mt-3 space-y-4 rounded-lg bg-surface-container-lowest p-4">
            <div>
              <label htmlFor="voice" className="mb-2 block text-sm font-semibold text-slate-text">
                Voice
              </label>
              <input
                id="voice"
                className="agent-field"
                placeholder="Polly.Joanna"
                value={values.voice}
                onChange={(e) => update("voice", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-text">
                Language
              </label>
              <input
                id="language"
                className="agent-field"
                placeholder="en-US"
                value={values.language}
                onChange={(e) => update("language", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-text">
              <input
                type="checkbox"
                checked={values.knowledge_base_enabled}
                onChange={(e) => update("knowledge_base_enabled", e.target.checked)}
                className="rounded border-outline-variant text-electric-blue focus:ring-electric-blue"
              />
              Knowledge base enabled
            </label>
          </div>
        )}
      </section>
    </form>
  );
}
