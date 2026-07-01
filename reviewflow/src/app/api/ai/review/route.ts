import { NextResponse } from "next/server";
import { z } from "zod";
import { generateReviewOptions } from "@/lib/openrouter";
import { starToExperienceLevel } from "@/lib/defaults";
import { buildFallbackReviewOptions } from "@/lib/review-fallbacks";
import { createAnonClient } from "@/lib/supabase/public";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  starRating: z.number().int().min(1).max(5),
  customerNotes: z.string().min(3).max(1000),
});

const MAX_REQUESTS_PER_HOUR = 20;

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limit = rateLimit(ip, {
      key: "ai-review",
      limit: MAX_REQUESTS_PER_HOUR,
      windowMs: 60 * 60 * 1000,
    });
    if (limit.limited) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    const body = bodySchema.parse(await request.json());
    const supabase = createAnonClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "App not configured. Check Supabase keys in .env.local" },
        { status: 500 }
      );
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, business_type, tone, slug")
      .eq("id", body.businessId)
      .not("slug", "is", null)
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
