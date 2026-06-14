import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { phoneNumberPurchaseSchema } from "@/lib/api-schemas";
import { isApiSession, requireApiSession } from "@/lib/api-session";
import { parseJsonBody, readJsonBody } from "@/lib/parse-json-body";
import { denyUnlessCanOperate } from "@/lib/require-org-access";
import { purchasePhoneNumber } from "@/lib/telnyx-numbers";
import { canPurchasePhoneNumber, phonePurchaseBlockReason } from "@/lib/trial";

export async function POST(request: NextRequest) {
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, session.user.id);
  if (denied) return denied;

  const parsed = parseJsonBody(await readJsonBody(request), phoneNumberPurchaseSchema);
  if (!parsed.ok) return parsed.response;

  const phoneNumber = parsed.data.phone_number;
  const agentId = parsed.data.agent_id ?? null;

  if (!canPurchasePhoneNumber(org)) {
    return NextResponse.json({ error: phonePurchaseBlockReason(org) }, { status: 402 });
  }

  try {
    const order = await purchasePhoneNumber({ phoneNumber });
    const admin = createAdminClient();

    await admin.from("va_telnyx_numbers").insert({
      org_id: org.id,
      phone_number: phoneNumber,
      telnyx_order_id: order?.data?.id || null,
      status: "pending",
    });

    const { data: mapped, error } = await admin
      .from("va_phone_numbers")
      .insert({
        org_id: org.id,
        phone_number: phoneNumber,
        agent_id: agentId,
        label: "Telnyx",
      })
      .select("*, va_agents(id, name)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      ok: true,
      phoneNumber: mapped,
      message: `Number ${phoneNumber} ordered. It may take a few minutes to activate.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Purchase failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
