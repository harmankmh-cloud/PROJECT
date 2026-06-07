import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const entryPoint = process.env.SAML_ENTRY_POINT;
  const issuer = process.env.SAML_ISSUER;

  if (!entryPoint || !issuer) {
    return NextResponse.json(
      {
        error: "SSO not configured",
        setup: {
          required: ["SAML_ENTRY_POINT", "SAML_ISSUER", "SAML_CERT"],
          docs: "Configure SAML IdP (Okta, Azure AD, Google Workspace) and set env vars.",
        },
      },
      { status: 501 }
    );
  }

  const relayState = request.nextUrl.searchParams.get("relayState") || "/dashboard";
  const samlRequest = Buffer.from(
    `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="_${Date.now()}" Version="2.0" IssueInstant="${new Date().toISOString()}" Destination="${entryPoint}" AssertionConsumerServiceURL="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/sso/callback"><saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${issuer}</saml:Issuer></samlp:AuthnRequest>`
  ).toString("base64");

  const redirectUrl = `${entryPoint}?SAMLRequest=${encodeURIComponent(samlRequest)}&RelayState=${encodeURIComponent(relayState)}`;
  return NextResponse.redirect(redirectUrl);
}
