import { DEFAULT_AGENT_SYSTEM_PROMPT } from "@/lib/agent-guardrails";
import { notifyActivepiecesSignup } from "@/lib/activepieces";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

export async function ensureUserOrg(
  user: User,
  options?: { businessName?: string; phone?: string }
) {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("va_organizations")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existing) return { org: existing, created: false };

  const slug = `org-${user.id.slice(0, 8)}`;
  const { data: org, error } = await admin
    .from("va_organizations")
    .insert({
      name: options?.businessName || user.email?.split("@")[0] || "My Organization",
      slug,
      owner_id: user.id,
      transfer_phone: options?.phone?.trim() || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  void notifyActivepiecesSignup({
    orgId: org.id,
    orgName: org.name,
    ownerEmail: user.email,
    plan: org.plan ?? "trial",
  });

  await admin.from("va_agents").insert({
    org_id: org.id,
    name: "Default Agent",
    system_prompt: DEFAULT_AGENT_SYSTEM_PROMPT,
    welcome_greeting: "Hello! Thanks for calling. How can I help you today?",
    voice_id: "telnyx-female",
    voice_provider: "telnyx",
    persona_template: "receptionist",
    llm_model: "google/gemini-2.5-flash",
    temperature: 0.2,
    max_tokens: 50,
  });

  return { org, created: true };
}
