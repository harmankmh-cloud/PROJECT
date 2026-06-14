import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const QUIET_HOURS = { start: 8, end: 21 };

export async function hasValidConsent(
  orgId: string,
  phoneNumber: string,
  consentType: "pewc" | "express" = "pewc"
): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("va_consent_records")
    .select("id, expires_at")
    .eq("org_id", orgId)
    .eq("phone_number", phoneNumber)
    .eq("consent_type", consentType)
    .order("captured_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return false;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false;
  return true;
}

export async function recordConsent(params: {
  orgId: string;
  phoneNumber: string;
  consentType: "pewc" | "express" | "opt_out";
  consentText: string;
  ipAddress?: string;
  campaignId?: string;
}) {
  const admin = createAdminClient();

  if (params.consentType === "opt_out") {
    await admin.from("va_consent_records").insert({
      org_id: params.orgId,
      phone_number: params.phoneNumber,
      consent_type: "opt_out",
      consent_text: params.consentText,
      ip_address: params.ipAddress,
    });
    return { ok: true };
  }

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 4);

  await admin.from("va_consent_records").insert({
    org_id: params.orgId,
    phone_number: params.phoneNumber,
    consent_type: params.consentType,
    consent_text: params.consentText,
    ip_address: params.ipAddress,
    expires_at: expiresAt.toISOString(),
    campaign_id: params.campaignId,
  });

  return { ok: true };
}

export function isWithinCallingHours(timezone = "America/New_York"): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  const hour = parseInt(formatter.format(now), 10);
  return hour >= QUIET_HOURS.start && hour < QUIET_HOURS.end;
}

export { TCPA_DISCLOSURE, HIPAA_CONTROLS, SOC2_CHECKLIST } from "./constants";
