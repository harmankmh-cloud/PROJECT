import { NextResponse } from "next/server";
import { z } from "zod";
import { incrementContactClicks } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = z.object({ providerId: z.string().uuid() }).parse(await request.json());
    await incrementContactClicks(body.providerId);
    return NextResponse.json({ ok: true, slug });
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
}
