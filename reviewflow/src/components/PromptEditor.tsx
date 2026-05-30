"use client";

import { useState } from "react";
import type { PromptTemplate } from "@/lib/types";
import { EXPERIENCE_OPTIONS } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/client";

type Props = {
  businessId: string;
  prompts: PromptTemplate[];
};

export function PromptEditor({ businessId, prompts }: Props) {
  const [items, setItems] = useState(prompts);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updatePrompt(id: string, field: keyof PromptTemplate, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");
    const supabase = createClient();

    try {
      for (const prompt of items) {
        const { error: updateError } = await supabase
          .from("prompt_templates")
          .update({
            helper_label: prompt.helper_label,
            placeholder: prompt.placeholder,
            ai_instruction: prompt.ai_instruction,
          })
          .eq("id", prompt.id)
          .eq("business_id", businessId);

        if (updateError) throw updateError;
      }

      setMessage("Scripts saved — live on your customer page.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save prompts");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {items.map((prompt) => {
        const option = EXPERIENCE_OPTIONS.find((o) => o.level === prompt.experience_level);
        return (
          <div key={prompt.id} className="surface-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#e8e2d9] bg-cream px-6 py-4">
              <span className="text-2xl">{option?.emoji}</span>
              <div>
                <h2 className="font-semibold text-brand-950">{option?.label || prompt.experience_level}</h2>
                <p className="text-xs text-stone-500">{option?.subtitle}</p>
              </div>
            </div>
            <div className="space-y-3 p-6">
              <input
                value={prompt.helper_label}
                onChange={(e) => updatePrompt(prompt.id, "helper_label", e.target.value)}
                className="input-field"
                placeholder="Button label"
              />
              <input
                value={prompt.placeholder}
                onChange={(e) => updatePrompt(prompt.id, "placeholder", e.target.value)}
                className="input-field"
                placeholder="Placeholder text"
              />
              <textarea
                value={prompt.ai_instruction}
                onChange={(e) => updatePrompt(prompt.id, "ai_instruction", e.target.value)}
                className="input-field min-h-28 resize-y"
                placeholder="AI instruction"
              />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="btn-gold px-6 py-3 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save all scripts"}
      </button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
