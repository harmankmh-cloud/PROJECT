"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AgentConfigBottomBar } from "@/components/dashboard/AgentConfigBottomBar";
import { AgentConfigHeader } from "@/components/dashboard/AgentConfigHeader";
import { AgentConfigureForm } from "@/components/dashboard/AgentConfigureForm";
import { DashboardDetailSkeleton } from "@/components/ui/DashboardPageSkeleton";
import { useToast } from "@/components/providers/ToastProvider";
import { agentToFormValues, formValuesToPayload } from "@/lib/agent-form";
import type { AgentFormValues } from "@/components/dashboard/AgentConfigureForm";
import { apiFetch } from "@/lib/api-client";
import type { Agent } from "@/lib/types";

const FORM_ID = "agent-config-form";

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const agentId = params.id as string;

  const [values, setValues] = useState<AgentFormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{ agents: Agent[] }>("/api/agents").then((res) => {
      if (!active) return;
      if (res.ok) {
        const agent = res.data.agents.find((a) => a.id === agentId);
        if (agent) setValues(agentToFormValues(agent));
        else showError("Agent not found");
      } else {
        showError(res.error);
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
    const res = await apiFetch<{ agent: Agent }>("/api/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agentId, ...formValuesToPayload(values) }),
    });
    setSaving(false);

    if (res.ok) {
      setValues(agentToFormValues(res.data.agent));
      showSuccess("Agent saved");
      return;
    }
    showError(res.error);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveAgent();
  }

  if (loading) {
    return <DashboardDetailSkeleton />;
  }

  if (!values) {
    return (
      <div className="dashboard-container py-12">
        <p className="text-error">Agent not found</p>
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
      <main className="dashboard-container mx-auto max-w-2xl pt-4">
        <AgentConfigureForm
          formId={FORM_ID}
          agentId={agentId}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
        />
      </main>
      <AgentConfigBottomBar agentId={agentId} />
    </div>
  );
}
