import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const orgId = request.nextUrl.searchParams.get("state");

  if (!code || !orgId) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=missing_params", request.url));
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2.getToken(code);
  const admin = createAdminClient();

  await admin.from("va_integrations").upsert(
    {
      org_id: orgId,
      provider: "google_calendar",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
      is_active: true,
    },
    { onConflict: "org_id,provider" }
  );

  return NextResponse.redirect(new URL("/dashboard/integrations?connected=google_calendar", request.url));
}
