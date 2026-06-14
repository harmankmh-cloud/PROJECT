import { NextResponse } from "next/server";
import { z } from "zod";
import { validateGoogleReviewUrl } from "@/lib/google-review-url";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  name: z.string().min(2).max(80).optional(),
  businessType: z.string().min(2).max(80).optional(),
  googleReviewUrl: z.union([z.string().url(), z.literal("")]).optional(),
  tone: z.enum(["friendly", "professional", "casual"]).optional(),
});

export async function PATCH(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const patch: Record<string, string | null> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) patch.name = body.name.trim();
    if (body.businessType !== undefined) patch.business_type = body.businessType.trim();
    if (body.googleReviewUrl !== undefined) {
      const validated = validateGoogleReviewUrl(body.googleReviewUrl);
      if (!validated.ok) {
        return NextResponse.json({ error: validated.error }, { status: 400 });
      }
      patch.google_review_url = validated.value || null;
    }
    if (body.tone !== undefined) patch.tone = body.tone;

    const { data: updated, error } = await supabase
      .from("businesses")
      .update(patch)
      .eq("id", business.id)
      .select("*")
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: error?.message || "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ business: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input — check Google link format." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}
