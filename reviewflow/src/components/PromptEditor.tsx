"use client";

import { useState } from "react";
import type { PromptTemplate } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type Props = {
  businessId: string;
  prompts: PromptTemplate[];
};

export function PromptEditor({ businessId, prompts }: Props) {
  const [items, setItems] = useState(prompts);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updatePrompt(id: string, field: keyof PromptTemplate, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const supabase = createClient();

    for (const prompt of items) {
      await supabase
        .from("prompt_templates")
        .update({
          helper_label: prompt.helper_label,
          placeholder: prompt.placeholder,
          ai_instruction: prompt.ai_instruction,
        })
        .eq("id", prompt.id)
        .eq("business_id", businessId);
    }

    setSaving(false);
    setMessage("Saved.");
  }

  return (
    <div className="space-y-4">
      {items.map((prompt) => (
        <div key={prompt.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold capitalize text-zinc-900">{prompt.experience_level}</h2>
          <div className="mt-4 space-y-3">
            <input
              value={prompt.helper_label}
              onChange={(e) => updatePrompt(prompt.id, "helper_label", e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              placeholder="Button label"
            />
            <input
              value={prompt.placeholder}
              onChange={(e) => updatePrompt(prompt.id, "placeholder", e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              placeholder="Placeholder text"
            />
            <textarea
              value={prompt.ai_instruction}
              onChange={(e) => updatePrompt(prompt.id, "ai_instruction", e.target.value)}
              className="min-h-28 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              placeholder="AI instruction"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
      >
        {saving ? "Saving..." : "Save prompts"}
      </button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
