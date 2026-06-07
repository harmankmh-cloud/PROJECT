import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return value.trim();
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ phoneNumbers: [] });

  const { data } = await supabase
    .from("va_phone_numbers")
    .select("*, va_agents(id, name)")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ phoneNumbers: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = await request.json();
  const phone_number = normalizePhone(String(body.phone_number || ""));
  if (!phone_number) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("va_phone_numbers")
    .insert({
      org_id: org.id,
      phone_number,
      agent_id: body.agent_id || null,
      twilio_sid: body.twilio_sid || null,
      label: body.label || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "phone_number.created",
    resourceType: "phone_number",
    resourceId: data.id,
  });

  return NextResponse.json({ phoneNumber: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = await request.json();
  const { id } = body;

  const allowed: Record<string, unknown> = {};
  if (body.agent_id !== undefined) allowed.agent_id = body.agent_id || null;
  if (body.label !== undefined) allowed.label = body.label || null;
  if (body.twilio_sid !== undefined) allowed.twilio_sid = body.twilio_sid || null;

  const { data, error } = await supabase
    .from("va_phone_numbers")
    .update(allowed)
    .eq("id", id)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ phoneNumber: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase
    .from("va_phone_numbers")
    .delete()
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
