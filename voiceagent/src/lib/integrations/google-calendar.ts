import "server-only";
import { google } from "googleapis";
import { createAdminClient } from "@/lib/supabase/admin";

async function getGoogleTokens(orgId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("va_integrations")
    .select("access_token, refresh_token")
    .eq("org_id", orgId)
    .eq("provider", "google_calendar")
    .eq("is_active", true)
    .maybeSingle();

  return data;
}

export function getGoogleAuthUrl(orgId: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) return null;

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  return oauth2.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    state: orgId,
    prompt: "consent",
  });
}

export async function bookAppointment(
  orgId: string,
  params: {
    customerName: string;
    customerPhone?: string;
    date: string;
    time: string;
    notes?: string;
  }
) {
  const tokens = await getGoogleTokens(orgId);
  if (!tokens?.access_token) return { ok: false, error: "Google Calendar not connected" };

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || undefined,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  const startDateTime = `${params.date}T${params.time}:00`;
  const endHour = parseInt(params.time.split(":")[0], 10) + 1;
  const endDateTime = `${params.date}T${String(endHour).padStart(2, "0")}:${params.time.split(":")[1] || "00"}:00`;

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `Appointment: ${params.customerName}`,
      description: [
        params.notes,
        params.customerPhone ? `Phone: ${params.customerPhone}` : "",
        "Booked via VoiceAgent",
      ]
        .filter(Boolean)
        .join("\n"),
      start: { dateTime: startDateTime, timeZone: "America/New_York" },
      end: { dateTime: endDateTime, timeZone: "America/New_York" },
    },
  });

  return { ok: true, eventId: event.data.id, link: event.data.htmlLink };
}
