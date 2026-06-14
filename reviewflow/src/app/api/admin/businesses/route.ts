import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail } from "@/lib/admin-users";
import { createBusinessForUser } from "@/lib/business-setup";
import { validateGoogleReviewUrl } from "@/lib/google-review-url";
import { requirePlatformAdminApi } from "@/lib/require-platform-admin";
import { createServiceClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  ownerEmail: z.string().email(),
  name: z.string().min(2).max(80),
  businessType: z.string().min(2).max(80),
  googleReviewUrl: z.union([z.string().url(), z.literal("")]).optional(),
  tone: z.enum(["friendly", "professional", "casual"]).optional(),
});

export async function POST(request: Request) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = bodySchema.parse(await request.json());
    const admin = createServiceClient();
    if (!admin) {
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    const user = await findUserByEmail(body.ownerEmail);
    if (!user) {
      return NextResponse.json(
        { error: "No account with that email. Invite them under Admin → Users first, then add the business." },
        { status: 404 }
      );
    }

    const { data: existing } = await admin
      .from("businesses")
      .select("id, name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: `This account already has a business (${existing.name}). Open Manage to edit it.`,
          businessId: existing.id,
        },
        { status: 409 }
      );
    }

    let googleReviewUrl = body.googleReviewUrl?.trim() || "";
    if (googleReviewUrl) {
      const validated = validateGoogleReviewUrl(googleReviewUrl);
      if (!validated.ok) {
        return NextResponse.json({ error: validated.error }, { status: 400 });
      }
      googleReviewUrl = validated.value;
    }

    const result = await createBusinessForUser(admin, user.id, {
      name: body.name.trim(),
      businessType: body.businessType.trim(),
      googleReviewUrl,
      tone: body.tone || "friendly",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, businessId: result.businessId, userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input — check email and fields." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not create business." }, { status: 500 });
  }
}
