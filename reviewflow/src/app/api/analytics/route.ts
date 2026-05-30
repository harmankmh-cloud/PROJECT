import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  eventType: z.enum(["page_view", "google_click", "copy_review", "private_feedback"]),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ ok: true });
    }

    await supabase.from("analytics_events").insert({
      business_id: body.businessId,
      event_type: body.eventType,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
