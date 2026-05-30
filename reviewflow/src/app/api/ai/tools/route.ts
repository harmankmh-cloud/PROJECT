import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSocialCaption, generateReviewReply } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  type: z.enum(["caption", "reply"]),
  text: z.string().min(3).max(2000),
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

    const { data: business } = await supabase
      .from("businesses")
      .select("name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const result =
      body.type === "caption"
        ? await generateSocialCaption({ businessName: business.name, reviewText: body.text })
        : await generateReviewReply({ businessName: business.name, reviewText: body.text });

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
