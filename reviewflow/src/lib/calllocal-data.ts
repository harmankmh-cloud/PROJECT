import { buildReviewUrl, normalizeAppUrl } from "@/lib/app-url";
import { createServiceClient } from "@/lib/supabase/admin";

export type CallLocalSettings = {
  business_id: string;
  enabled: boolean;
  twilio_phone_e164: string | null;
  ring_phone_e164: string | null;
  sms_template: string;
  notify_owner_on_missed: boolean;
  updated_at: string;
};

export type CallEventRow = {
  id: string;
  caller_e164: string;
  status: string;
  sms_sent_to_caller: boolean;
  created_at: string;
};

export async function getCallLocalSettingsForBusiness(
  businessId: string
): Promise<CallLocalSettings | null> {
  const admin = createServiceClient();
  if (!admin) return null;

  const { data } = await admin
    .from("calllocal_settings")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  return data as CallLocalSettings | null;
}

export async function getCallLocalSettingsByTwilioNumber(twilioPhone: string) {
  const admin = createServiceClient();
  if (!admin) return null;

  const normalized = twilioPhone.trim();
  const { data: settings } = await admin
    .from("calllocal_settings")
    .select("*")
    .eq("twilio_phone_e164", normalized)
    .eq("enabled", true)
    .maybeSingle();

  if (!settings) return null;

  const { data: business } = await admin
    .from("businesses")
    .select("id, name, slug")
    .eq("id", settings.business_id)
    .maybeSingle();

  if (!business) return null;

  return { settings: settings as CallLocalSettings, business };
}

export async function ensureCallLocalSettingsRow(businessId: string) {
  const admin = createServiceClient();
  if (!admin) return null;

  const { data: existing } = await admin
    .from("calllocal_settings")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  if (existing) return existing as CallLocalSettings;

  const { data: created, error } = await admin
    .from("calllocal_settings")
    .insert({ business_id: businessId })
    .select("*")
    .single();

  if (error || !created) return null;
  return created as CallLocalSettings;
}

export async function getRecentCallEvents(businessId: string, limit = 30): Promise<CallEventRow[]> {
  const admin = createServiceClient();
  if (!admin) return [];

  const { data } = await admin
    .from("call_events")
    .select("id, caller_e164, status, sms_sent_to_caller, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data || []) as CallEventRow[];
}

export function renderSmsTemplate(
  template: string,
  vars: { business_name: string; link: string; caller_phone?: string }
) {
  return template
    .replace(/\{business_name\}/g, vars.business_name)
    .replace(/\{link\}/g, vars.link)
    .replace(/\{caller_phone\}/g, vars.caller_phone || "");
}

export function getPublicAppUrl() {
  return normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL || "https://ratelocal.ca");
}

export async function buildBusinessReviewLink(slug: string) {
  return buildReviewUrl(getPublicAppUrl(), slug);
}

export async function logCallEvent(input: {
  businessId: string;
  callSid: string | null;
  caller: string;
  status: "ringing" | "answered" | "missed" | "failed";
  smsSentToCaller?: boolean;
  smsSentToOwner?: boolean;
}) {
  const admin = createServiceClient();
  if (!admin) return;

  await admin.from("call_events").insert({
    business_id: input.businessId,
    call_sid: input.callSid,
    caller_e164: input.caller,
    status: input.status,
    sms_sent_to_caller: input.smsSentToCaller ?? false,
    sms_sent_to_owner: input.smsSentToOwner ?? false,
  });
}

export async function logSms(input: {
  businessId: string;
  direction: "inbound" | "outbound";
  from: string;
  to: string;
  body: string;
  messageSid?: string;
}) {
  const admin = createServiceClient();
  if (!admin) return;

  await admin.from("calllocal_sms_log").insert({
    business_id: input.businessId,
    direction: input.direction,
    from_e164: input.from,
    to_e164: input.to,
    body: input.body,
    message_sid: input.messageSid || null,
  });
}
