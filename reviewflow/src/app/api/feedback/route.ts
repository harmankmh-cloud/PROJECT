import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  experienceLevel: z.enum(["great", "good", "okay", "bad"]),
  customerNotes: z.string().optional(),
  aiDraft: z.string().optional(),
  isPrivate: z.boolean(),
  customerName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const { error } = await supabase.from("feedback_events").insert({
      business_id: body.businessId,
      experience_level: body.experienceLevel,
      customer_notes: body.customerNotes || null,
      ai_draft: body.aiDraft || null,
      is_private: body.isPrivate,
      customer_name: body.customerName || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("analytics_events").insert({
      business_id: body.businessId,
      event_type: body.isPrivate ? "private_feedback" : "copy_review",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
