import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";

const bodySchema = z.object({
  email: z.string().email(),
  orgName: z.string().max(120).optional(),
  category: z.enum(["help", "suggestion", "bug", "billing", "other"]).default("help"),
  message: z.string().min(10).max(4000),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const org = user ? await getUserOrg(user.id) : null;
    const orgName = body.orgName?.trim() || org?.name || null;

    const admin = createAdminClient();
    if (admin && org) {
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
