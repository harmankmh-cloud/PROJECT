import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { notifyActivepiecesSupportLead } from "@/lib/activepieces";
import { logAudit } from "@/lib/compliance/audit";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().email(),
  orgName: z.string().max(120).optional(),
  category: z.enum(["help", "suggestion", "bug", "billing", "other"]).default("help"),
  message: z.string().min(10).max(4000),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(`support:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Try again in an hour." }, { status: 429 });
  }

  try {
    const body = bodySchema.parse(await request.json());

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const org = user ? await getUserOrg(user.id) : null;
    const orgName = body.orgName?.trim() || org?.name || null;

    try {
      const admin = createAdminClient();
      await admin.from("va_support_tickets").insert({
        org_id: org?.id || null,
        user_id: user?.id || null,
        email: body.email.trim(),
        org_name: orgName,
        category: body.category,
        message: body.message.trim(),
      });
    } catch {
      // Table may not exist yet; fall through to audit when possible.
    }

    void notifyActivepiecesSupportLead({
      email: body.email.trim(),
      orgName,
      category: body.category,
      message: body.message.trim(),
    });

    if (org) {
      await logAudit({
        orgId: org.id,
        userId: user?.id,
        action: "support.message",
        resourceType: "support",
        metadata: {
          email: body.email.trim(),
          orgName,
          category: body.category,
          message: body.message.trim(),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please fill in email and a message (10+ characters)." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }
}
