import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { denyUnlessCanOperate } from "@/lib/require-org-access";
import { purchasePhoneNumber } from "@/lib/telnyx-numbers";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const body = await request.json();
  const phoneNumber = (body.phone_number as string)?.trim();
  const agentId = (body.agent_id as string) || null;

  if (!phoneNumber) {
    return NextResponse.json({ error: "phone_number required" }, { status: 400 });
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
