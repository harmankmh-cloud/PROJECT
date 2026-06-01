import { NextResponse } from "next/server";
import { z } from "zod";
import { createSiteSuggestion } from "@/lib/data";

const bodySchema = z.object({
  message: z.string().min(5).max(2000),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  pageUrl: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());

    const result = await createSiteSuggestion({
      message: body.message,
      email: body.email,
      pageUrl: body.pageUrl,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Suggestion received — thank you!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please check your suggestion" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }
}
