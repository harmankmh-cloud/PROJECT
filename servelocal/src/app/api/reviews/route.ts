import { NextResponse } from "next/server";
import { z } from "zod";
import { createProviderReview } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = z
      .object({
        providerId: z.string().uuid(),
        reviewerName: z.string().min(2).max(80),
        rating: z.number().int().min(1).max(5),
        title: z.string().max(120).optional(),
        body: z.string().min(20).max(2000),
      })
      .parse(await request.json());

    const result = await createProviderReview(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ ok: true, message: "Review submitted for moderation." });
  } catch {
    return NextResponse.json({ error: "Check your review fields" }, { status: 400 });
  }
}
