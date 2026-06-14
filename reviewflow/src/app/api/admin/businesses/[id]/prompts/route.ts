import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePlatformAdminApi } from "@/lib/require-platform-admin";
import { createServiceClient } from "@/lib/supabase/admin";

const promptSchema = z.object({
  id: z.string().uuid(),
  helper_label: z.string().min(1).max(200),
  placeholder: z.string().min(1).max(500),
  ai_instruction: z.string().min(1).max(2000),
});

const bodySchema = z.object({
  prompts: z.array(promptSchema).min(1),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const { id: businessId } = await params;

  try {
    const body = bodySchema.parse(await request.json());
    const admin = createServiceClient();
    if (!admin) {
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    const { data: business } = await admin
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    for (const prompt of body.prompts) {
      const { error } = await admin
        .from("prompt_templates")
        .update({
          helper_label: prompt.helper_label,
          placeholder: prompt.placeholder,
          ai_instruction: prompt.ai_instruction,
        })
        .eq("id", prompt.id)
        .eq("business_id", businessId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid prompt data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save prompts." }, { status: 500 });
  }
}
