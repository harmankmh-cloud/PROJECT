import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  businessType: z.string().min(2).max(80),
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
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { data: updated, error } = await supabase
      .from("businesses")
      .update({
        name: body.name.trim(),
        business_type: body.businessType.trim(),
        google_review_url: body.googleReviewUrl?.trim() || null,
        tone: body.tone || "friendly",
        updated_at: new Date().toISOString(),
      })
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
