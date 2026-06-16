import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  reviewId: z.string().uuid(),
  body: z.string().min(5).max(2000),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = bodySchema.parse(await request.json());

    const { data: review } = await supabase
      .from("reviews")
      .select("id, business_id")
      .eq("id", payload.reviewId)
      .maybeSingle();

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", review.business_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("review_responses")
      .upsert(
        {
          review_id: payload.reviewId,
          business_id: review.business_id,
          body: payload.body.trim(),
        },
        { onConflict: "review_id" }
      )
      .select("body, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ response: data });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save response" }, { status: 500 });
  }
}
