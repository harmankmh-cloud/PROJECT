import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/data";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const result = await subscribeNewsletter(body.email);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }
}
