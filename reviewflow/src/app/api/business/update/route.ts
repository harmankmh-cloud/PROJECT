import { NextResponse } from "next/server";
import { z } from "zod";
import { slugify } from "@/lib/defaults";
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
      .select("id, slug")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const baseSlug = slugify(body.name);
    let slug = business.slug;

    if (baseSlug && baseSlug !== business.slug) {
      slug = baseSlug;
      let suffix = 1;
      while (true) {
        const { data: existing } = await supabase
          .from("businesses")
          .select("id")
          .eq("slug", slug)
          .neq("id", business.id)
          .maybeSingle();
        if (!existing) break;
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
    }

    const { data: updated, error } = await supabase
      .from("businesses")
      .update({
        name: body.name,
        business_type: body.businessType,
        google_review_url: body.googleReviewUrl || null,
        tone: body.tone || "friendly",
        slug,
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
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}
