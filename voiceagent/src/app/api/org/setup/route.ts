import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      name: user.email?.split("@")[0] || "My Organization",
      slug,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from("va_agents").insert({
    org_id: org.id,
    name: "Default Agent",
    system_prompt:
      "You are a friendly phone assistant for a local business. Help callers with questions, book appointments, and transfer to a human when needed. Keep answers brief.",
    welcome_greeting: "Hello! Thanks for calling. How can I help you today?",
  });

  return NextResponse.json({ org });
}
