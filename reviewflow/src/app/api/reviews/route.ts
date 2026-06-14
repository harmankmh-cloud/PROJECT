import { NextResponse } from "next/server";
import { getSeedBusinessBySlug } from "@/data/seed-businesses";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  businessId: z.string().uuid().optional(),
  businessSlug: z.string().optional(),
  authorName: z.string().min(1).max(80),
  starRating: z.number().int().min(1).max(5),
  body: z.string().min(10).max(5000),
  subRatings: z
    .object({
      quality: z.number().int().min(1).max(5).optional(),
      value: z.number().int().min(1).max(5).optional(),
      service: z.number().int().min(1).max(5).optional(),
      atmosphere: z.number().int().min(1).max(5).optional(),
    })
    .optional(),
  isVerifiedVisit: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let businessId = parsed.businessId;

    if (!businessId && parsed.businessSlug) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("slug", parsed.businessSlug)
        .maybeSingle();
      businessId = biz?.id;
    }

    if (!businessId && parsed.businessSlug) {
      const seed = getSeedBusinessBySlug(parsed.businessSlug);
      if (seed) {
        return NextResponse.json({ id: `demo-${Date.now()}`, success: true, demo: true });
      }
    }

    if (!businessId) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        business_id: businessId,
        user_id: user?.id ?? null,
        author_name: parsed.authorName,
        star_rating: parsed.starRating,
        body: parsed.body,
        sub_ratings: parsed.subRatings ?? null,
        is_verified_visit: parsed.isVerifiedVisit ?? false,
        is_public: true,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: review.id, success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
