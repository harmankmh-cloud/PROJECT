import { NextResponse } from "next/server";
import { z } from "zod";
import { createBusinessForUser } from "@/lib/business-setup";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  businessType: z.string().min(2).max(80),
  googleReviewUrl: z.union([z.string().url(), z.literal("")]).optional(),
  tone: z.enum(["friendly", "professional", "casual"]).optional(),
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

    const result = await createBusinessForUser(supabase, user.id, {
      name: body.name,
      businessType: body.businessType,
      googleReviewUrl: body.googleReviewUrl,
      tone: body.tone,
    });

    if (!result.ok) {
      if (result.error === "You already have a business set up.") {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      const isValidation =
        result.error.includes("Google") ||
        result.error.includes("RateLocal") ||
        result.error.includes("valid URL");
      return NextResponse.json(
        { error: result.error },
        { status: isValidation ? 400 : 500 }
      );
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", result.businessId)
      .single();

    return NextResponse.json({ business });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Check your business name and Google link format." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to setup business" }, { status: 500 });
  }
}
