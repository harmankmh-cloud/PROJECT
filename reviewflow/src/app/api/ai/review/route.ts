import { NextResponse } from "next/server";
import { z } from "zod";
import { generateReviewOptions } from "@/lib/openrouter";
import { starToExperienceLevel } from "@/lib/defaults";
import { buildFallbackReviewOptions } from "@/lib/review-fallbacks";
import { createAnonClient } from "@/lib/supabase/public";
import { createServiceClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  starRating: z.number().int().min(1).max(5),
  customerNotes: z.string().min(3).max(1000),
});

function getSupabase() {
  return createServiceClient() ?? createAnonClient();
}

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: "App not configured. Check Supabase keys in .env.local" },
        { status: 500 }
      );
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, business_type, tone")
      .eq("id", body.businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const experienceLevel = starToExperienceLevel(body.starRating as 1 | 2 | 3 | 4 | 5);

    const { data: prompt } = await supabase
      .from("prompt_templates")
      .select("ai_instruction")
      .eq("business_id", body.businessId)
      .eq("experience_level", experienceLevel)
      .maybeSingle();

    const input = {
      businessName: business.name,
      businessType: business.business_type,
      tone: business.tone,
      starRating: body.starRating,
      customerNotes: body.customerNotes,
      customInstruction: prompt?.ai_instruction || "",
    };

    let options = await generateReviewOptions(input);

    if (!options || options.length < 3) {
      options = buildFallbackReviewOptions({
        businessName: business.name,
        starRating: body.starRating,
        customerNotes: body.customerNotes,
      });
    }

    return NextResponse.json({ options, starRating: body.starRating });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please add a star rating and a few words." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to generate reviews. Try again." }, { status: 500 });
  }
}
