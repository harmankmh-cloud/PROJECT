import { NextResponse } from "next/server";
import { z } from "zod";
import { starToExperienceLevel } from "@/lib/defaults";
import { monthlyLimitForPlan } from "@/lib/plans";
import { countReviewsThisMonth } from "@/lib/usage";
import { createAnonClient } from "@/lib/supabase/public";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resolvePlan } from "@/lib/business-plan";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  starRating: z.number().int().min(1).max(5),
  customerNotes: z.string().optional(),
  aiDraft: z.string().min(3),
  customerName: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

function getPublicSupabase() {
  return createServiceClient() ?? createAnonClient();
}

export async function GET(request: Request) {
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
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);

    const { data, count, error } = await supabase
      .from("feedback_events")
      .select("*", { count: "exact" })
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      feedback: data || [],
      total: count || 0,
      offset,
      limit,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = getPublicSupabase();

    if (!supabase) {
      return NextResponse.json({ error: "App not configured" }, { status: 500 });
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", body.businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const plan = resolvePlan(business);
    const limit = monthlyLimitForPlan(plan);

    if (limit === 0) {
      return NextResponse.json(
        { error: "This business subscription is inactive. Reviews cannot be saved." },
        { status: 403 }
      );
    }

    const used = await countReviewsThisMonth(supabase, body.businessId);
    if (used >= limit) {
      return NextResponse.json(
        {
          error: `Monthly review limit reached (${limit}). The business owner can upgrade on their dashboard.`,
        },
        { status: 429 }
      );
    }

    const experienceLevel = starToExperienceLevel(body.starRating as 1 | 2 | 3 | 4 | 5);
    const isPrivate = body.isPrivate ?? body.starRating <= 2;

    const row: Record<string, unknown> = {
      business_id: body.businessId,
      experience_level: experienceLevel,
      customer_notes: body.customerNotes || null,
      ai_draft: body.aiDraft,
      is_private: isPrivate,
      customer_name: body.customerName || null,
      star_rating: body.starRating,
    };

    const { error } = await supabase.from("feedback_events").insert(row);

    if (error) {
      if (error.message.includes("star_rating")) {
        delete row.star_rating;
        const retry = await supabase.from("feedback_events").insert(row);
        if (retry.error) {
          return NextResponse.json({ error: retry.error.message }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    await supabase.from("analytics_events").insert({
      business_id: body.businessId,
      event_type: isPrivate ? "private_feedback" : "owner_notification",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
