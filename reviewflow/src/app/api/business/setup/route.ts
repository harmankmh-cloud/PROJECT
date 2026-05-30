import { NextResponse } from "next/server";
import { z } from "zod";
import { DEFAULT_PROMPTS, slugify } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  businessType: z.string().min(2).max(80),
  googleReviewUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseSlug = slugify(body.name) || "business";
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const { data: existing } = await supabase
        .from("businesses")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name: body.name,
        slug,
        business_type: body.businessType,
        google_review_url: body.googleReviewUrl || null,
        tone: "friendly",
      })
      .select("*")
      .single();

    if (error || !business) {
      return NextResponse.json({ error: error?.message || "Failed to create business" }, { status: 500 });
    }

    const prompts = DEFAULT_PROMPTS.map((prompt) => ({
      business_id: business.id,
      experience_level: prompt.experience_level,
      helper_label: prompt.helper_label,
      placeholder: prompt.placeholder,
      ai_instruction: prompt.ai_instruction,
    }));

    await supabase.from("prompt_templates").insert(prompts);

    return NextResponse.json({ business });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to setup business" }, { status: 500 });
  }
}
