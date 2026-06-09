import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { hasValidConsent, isWithinCallingHours } from "@/lib/compliance/tcpa";
import { getTwilioClient } from "@/lib/twilio";
import { dialOutbound, encodeClientState, isTelnyxConfigured } from "@/lib/telnyx";
import { logAudit } from "@/lib/compliance/audit";
import { denyUnlessCanOperate } from "@/lib/require-org-access";
import { canMakeProductionCall, productionBlockReason } from "@/lib/trial";

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

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

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

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const body = await request.json();
  const { id, action } = body;

  if (action === "start") {
    if (!canMakeProductionCall(org)) {
      return NextResponse.json({ error: productionBlockReason(org) }, { status: 402 });
    }

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
    if (!contacts.length) {
      return NextResponse.json({ error: "Add at least one phone number to the campaign" }, { status: 400 });
    }

    const eligible: string[] = [];
    for (const contact of contacts) {
      const hasConsent = await hasValidConsent(org.id, contact.phone);
      if (hasConsent) eligible.push(contact.phone);
    }

    if (!eligible.length) {
      return NextResponse.json(
        {
          error:
            "No contacts have TCPA consent. Record consent on the Compliance page before starting outbound calls.",
        },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
    const provider = process.env.TELEPHONY_PROVIDER || "telnyx";
    const telnyxReady = provider === "telnyx" && isTelnyxConfigured();
    const client = getTwilioClient();
    let twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    const { data: orgNumbers } = await supabase
      .from("va_phone_numbers")
      .select("phone_number")
      .eq("org_id", org.id)
      .limit(1);

    if (orgNumbers?.[0]?.phone_number) {
      twilioFrom = orgNumbers[0].phone_number;
    }

    const twilioReady = Boolean(client && twilioFrom);

    if (!telnyxReady && !twilioReady) {
      return NextResponse.json(
        {
          error:
            "Telephony is not configured. Set Telnyx env vars or connect Twilio with a phone number.",
        },
        { status: 400 }
      );
    }

    if (telnyxReady) {
      const from = process.env.TELNYX_PHONE_NUMBER!;
      const connectionId = process.env.TELNYX_CONNECTION_ID!;
      const clientState = encodeClientState({
        orgId: org.id,
        agentId: campaign.agent_id || "",
      });
      for (const phone of eligible.slice(0, 10)) {
        await dialOutbound({
          to: phone,
          from,
          connectionId,
          webhookUrl: `${appUrl}/api/telnyx/webhook`,
          clientState,
        });
      }
    } else if (twilioReady && client && twilioFrom) {
      for (const phone of eligible.slice(0, 10)) {
        await client.calls.create({
          to: phone,
          from: twilioFrom,
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

  const allowed: Record<string, unknown> = {};
  if (body.name !== undefined) allowed.name = body.name;
  if (body.status !== undefined) allowed.status = body.status;
  if (body.contact_list !== undefined) allowed.contact_list = body.contact_list;
  if (body.schedule_at !== undefined) allowed.schedule_at = body.schedule_at;
  if (body.calling_hours !== undefined) allowed.calling_hours = body.calling_hours;
  if (body.agent_id !== undefined) allowed.agent_id = body.agent_id;

  const { data, error } = await supabase
    .from("va_campaigns")
    .update({ ...allowed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ campaign: data });
}
