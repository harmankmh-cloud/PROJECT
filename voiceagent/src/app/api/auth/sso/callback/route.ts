import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cert = process.env.SAML_CERT;

  if (!cert) {
    return NextResponse.json(
      { error: "SSO callback not configured — set SAML_CERT and complete IdP setup." },
      { status: 501 }
    );
  }

  // Full SAML assertion parsing requires a library (e.g. @boxyhq/saml-jackson).
  // Redirect with a clear message until enterprise SSO is fully wired.
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent("SSO assertion handling not yet implemented")}`, request.url)
  );
}
