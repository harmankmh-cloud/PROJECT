import { NextResponse } from "next/server";
import { z } from "zod";
import { starToExperienceLevel } from "@/lib/defaults";
import { createServiceClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  starRating: z.number().int().min(1).max(5),
  customerNotes: z.string().optional(),
  aiDraft: z.string().min(3),
  customerName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const experienceLevel = starToExperienceLevel(body.starRating as 1 | 2 | 3 | 4 | 5);

    const row: Record<string, unknown> = {
      business_id: body.businessId,
      experience_level: experienceLevel,
      customer_notes: body.customerNotes || null,
      ai_draft: body.aiDraft,
      is_private: false,
      customer_name: body.customerName || null,
      star_rating: body.starRating,
    };

    const { error } = await supabase.from("feedback_events").insert(row);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("analytics_events").insert({
      business_id: body.businessId,
      event_type: "owner_notification",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
