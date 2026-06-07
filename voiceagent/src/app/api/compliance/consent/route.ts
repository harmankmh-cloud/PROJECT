import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { recordConsent, TCPA_DISCLOSURE } from "@/lib/compliance/tcpa";

export async function GET() {
  return NextResponse.json({ disclosure: TCPA_DISCLOSURE });
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
  const result = await recordConsent({
    orgId: org.id,
    phoneNumber: body.phone_number,
    consentType: body.consent_type || "pewc",
    consentText: body.consent_text || TCPA_DISCLOSURE,
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
    campaignId: body.campaign_id,
  });

  return NextResponse.json(result);
}
