import { NextResponse } from "next/server";
import { feedbackToCsv } from "@/lib/export-csv";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackEvent } from "@/lib/types";

export async function GET() {
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
      .select("id, slug, name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("feedback_events")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(10000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const csv = feedbackToCsv((data || []) as FeedbackEvent[]);
    const filename = `${business.slug}-reviews.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
