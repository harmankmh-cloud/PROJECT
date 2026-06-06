import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const orgId = request.nextUrl.searchParams.get("state");

  if (!code || !orgId) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=missing_params", request.url));
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID!;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET!;
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI!;

  const tokenRes = await fetch("https://api.hubapi.com/oauth/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=token_failed", request.url));
  }

  const tokens = await tokenRes.json();
  const admin = createAdminClient();

  await admin.from("va_integrations").upsert(
    {
      org_id: orgId,
      provider: "hubspot",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      is_active: true,
    },
    { onConflict: "org_id,provider" }
  );

  return NextResponse.redirect(new URL("/dashboard/integrations?connected=hubspot", request.url));
}
