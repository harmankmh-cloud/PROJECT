import { NextResponse } from "next/server";
import { z } from "zod";
import { generateReviewReply } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  reviewText: z.string().min(3).max(2000),
  starRating: z.number().int().min(1).max(5).optional(),
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

    const { data: business } = await supabase
      .from("businesses")
      .select("name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const payload = bodySchema.parse(await request.json());
    const ratingNote =
      payload.starRating && payload.starRating <= 3
        ? " The review is critical — acknowledge concerns professionally and invite offline follow-up."
        : "";

    const suggestion = await generateReviewReply({
      businessName: business.name,
      reviewText: `${payload.reviewText}${ratingNote}`,
    });

    return NextResponse.json({ suggestion });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not generate suggestion" }, { status: 500 });
  }
}
