import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { hasValidConsent, isWithinCallingHours } from "@/lib/compliance/tcpa";
import { getTwilioClient } from "@/lib/twilio";
import { logAudit } from "@/lib/compliance/audit";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ campaigns: [] });

  const { data } = await supabase
    .from("va_campaigns")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ campaigns: data || [] });
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

  const { data, error } = await supabase
    .from("va_campaigns")
    .insert({
      org_id: org.id,
      agent_id: body.agent_id,
      name: body.name,
      status: "draft",
      contact_list: body.contact_list || [],
      schedule_at: body.schedule_at,
      calling_hours: body.calling_hours,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "campaign.created",
    resourceType: "campaign",
    resourceId: data.id,
  });

  return NextResponse.json({ campaign: data });
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
  const { id, action } = body;

  if (action === "start") {
    if (!isWithinCallingHours()) {
      return NextResponse.json({ error: "Outside TCPA calling hours (8am-9pm)" }, { status: 400 });
    }

    const { data: campaign } = await supabase
      .from("va_campaigns")
      .select("*")
      .eq("id", id)
      .eq("org_id", org.id)
      .single();

    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const contacts = (campaign.contact_list as Array<{ phone: string }>) || [];
    const eligible: string[] = [];

    for (const contact of contacts) {
      const hasConsent = await hasValidConsent(org.id, contact.phone);
      if (hasConsent) eligible.push(contact.phone);
    }

    const client = getTwilioClient();
    const from = process.env.TWILIO_PHONE_NUMBER;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

    if (client && from) {
      for (const phone of eligible.slice(0, 10)) {
        await client.calls.create({
          to: phone,
          from,
          url: `${appUrl}/api/twilio/voice`,
        });
      }
    }

    await supabase
      .from("va_campaigns")
      .update({ status: "running", updated_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ ok: true, dialed: eligible.length });
  }

  const { data, error } = await supabase
    .from("va_campaigns")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ campaign: data });
}
