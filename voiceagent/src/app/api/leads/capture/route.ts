import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyActivepiecesMarketingLead } from "@/lib/activepieces";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const businessName = body.business_name ? String(body.business_name).trim() : null;
  const source = body.source ? String(body.source).trim() : "hero";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { error: insertError } = await admin.from("va_marketing_leads").insert({
      email,
      business_name: businessName,
      source,
    });
    if (insertError && !insertError.message.includes("duplicate")) {
      throw new Error(insertError.message);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save lead";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  void notifyActivepiecesMarketingLead({ email, businessName, source });

  return NextResponse.json({ ok: true });
}
