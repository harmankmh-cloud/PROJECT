import { NextResponse } from "next/server";
import { z } from "zod";
import { getProQA, submitProQuestion } from "@/lib/features-data";

export async function GET(request: Request) {
  const providerId = new URL(request.url).searchParams.get("providerId");
  if (!providerId) return NextResponse.json({ error: "providerId required" }, { status: 400 });
  const items = await getProQA(providerId);
  return NextResponse.json({ items });
}

const postSchema = z.object({
  providerId: z.string().uuid(),
  askerName: z.string().min(1).max(80),
  askerEmail: z.string().email().optional(),
  question: z.string().min(5).max(500),
});

export async function POST(request: Request) {
  try {
    const body = postSchema.parse(await request.json());
    const result = await submitProQuestion(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
