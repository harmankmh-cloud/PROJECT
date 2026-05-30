import { NextResponse } from "next/server";
import { z } from "zod";
import { generateReviewDraft } from "@/lib/openrouter";
import { createServiceClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  businessId: z.string().uuid(),
  experienceLevel: z.enum(["great", "good", "okay", "bad"]),
  customerNotes: z.string().min(3).max(1000),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, business_type, tone")
      .eq("id", body.businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { data: prompt } = await supabase
      .from("prompt_templates")
      .select("ai_instruction")
      .eq("business_id", body.businessId)
      .eq("experience_level", body.experienceLevel)
      .maybeSingle();

    const draft = await generateReviewDraft({
      businessName: business.name,
      businessType: business.business_type,
      tone: business.tone,
      experienceLevel: body.experienceLevel,
      customerNotes: body.customerNotes,
      customInstruction: prompt?.ai_instruction || "",
    });

    return NextResponse.json({ draft, isPrivate: body.experienceLevel === "bad" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 });
  }
}
