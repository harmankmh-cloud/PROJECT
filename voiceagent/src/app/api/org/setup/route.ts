import { NextResponse } from "next/server";
import { DEFAULT_AGENT_SYSTEM_PROMPT } from "@/lib/agent-guardrails";
import { createClient } from "@/lib/supabase/server";
import { notifyActivepiecesSignup } from "@/lib/activepieces";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let businessName: string | undefined;
  if (request.headers.get("content-type")?.includes("application/json")) {
    try {
      const body = (await request.json()) as { businessName?: string };
      businessName = body.businessName?.trim() || undefined;
    } catch {
      businessName = undefined;
    }
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: existing } = await admin
    .from("va_organizations")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ org: existing });

  const slug = `org-${user.id.slice(0, 8)}`;
  const { data: org, error } = await admin
    .from("va_organizations")
    .insert({
      name: businessName || user.email?.split("@")[0] || "My Organization",
      slug,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

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

  return NextResponse.json({ org });
}
