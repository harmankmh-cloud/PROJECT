import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { routeOmnichannelMessage, type ChannelType } from "@/lib/omnichannel";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const from = String(formData.get("From") || "");
  const body = String(formData.get("Body") || "");
  const to = String(formData.get("To") || "");

  const channel: ChannelType = from.startsWith("whatsapp:") ? "whatsapp" : "sms";

  const admin = createAdminClient();
  const { data: phone } = await admin
    .from("va_phone_numbers")
    .select("org_id")
    .eq("phone_number", to.replace("whatsapp:", ""))
    .maybeSingle();

  if (!phone) {
    const twiml = new twilio.twiml.MessagingResponse();
    return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
  }

  const result = await routeOmnichannelMessage({
    orgId: phone.org_id,
    channel,
    from,
    body,
  });

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(result.response || "Thanks for your message. A team member will follow up shortly.");

  return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
}
