"use client";

import { useState } from "react";
import type { PromptTemplate } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const PROMPT_LABELS: Record<string, { stars: string; title: string }> = {
  great: { stars: "★★★★★", title: "5-star reviews" },
  good: { stars: "★★★★☆", title: "4-star reviews" },
  okay: { stars: "★★★☆☆", title: "3-star reviews" },
  bad: { stars: "★★☆☆☆", title: "1–2 star reviews" },
};

type Props = {
  businessId: string;
  prompts: PromptTemplate[];
  /** Platform admin: save via service API (not owner RLS) */
  adminMode?: boolean;
};

export function PromptEditor({ businessId, prompts, adminMode }: Props) {
  const [items, setItems] = useState(prompts);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="font-medium text-brand-950">No review scripts found</p>
        <p className="mt-2 text-sm text-stone-500">Try reloading the page or contact support.</p>
      </div>
    );
  }

  function updatePrompt(id: string, field: keyof PromptTemplate, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (adminMode) {
        const response = await fetch(`/api/admin/businesses/${businessId}/prompts`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompts: items.map((p) => ({
              id: p.id,
              helper_label: p.helper_label,
              placeholder: p.placeholder,
              ai_instruction: p.ai_instruction,
            })),
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not save");
        setMessage("Saved — live on customer page now.");
        return;
      }

      if (!isSupabaseConfigured()) {
        setError("App not configured.");
        return;
      }

      const supabase = createClient();

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

      setMessage("Saved — live on your customer page now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save prompts");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {items.map((prompt) => {
        const label = PROMPT_LABELS[prompt.experience_level] || {
          stars: "★★★",
          title: prompt.experience_level,
        };
        return (
          <div key={prompt.id} className="surface-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#e8e2d9] bg-cream px-6 py-4">
              <span className="text-lg tracking-wider text-gold-500">{label.stars}</span>
              <div>
                <h2 className="font-semibold text-brand-950">{label.title}</h2>
                <p className="text-xs text-stone-500">Button text + AI instructions</p>
              </div>
            </div>
            <div className="space-y-3 p-6">
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-brand-950">Button label (customer sees this)</span>
                <input
                  value={prompt.helper_label}
                  onChange={(e) => updatePrompt(prompt.id, "helper_label", e.target.value)}
                  className="input-field"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-brand-950">Placeholder hint</span>
                <input
                  value={prompt.placeholder}
                  onChange={(e) => updatePrompt(prompt.id, "placeholder", e.target.value)}
                  className="input-field"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-brand-950">AI instruction</span>
                <textarea
                  value={prompt.ai_instruction}
                  onChange={(e) => updatePrompt(prompt.id, "ai_instruction", e.target.value)}
                  className="input-field min-h-28 resize-y"
                />
              </label>
            </div>
          </div>
        );
      })}
      <button type="button" onClick={handleSave} disabled={saving} className="btn-gold px-6 py-3 disabled:opacity-60">
        {saving ? "Saving…" : "Save all scripts"}
      </button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
