import { NextResponse } from "next/server";
import { z } from "zod";
import { zodFieldError } from "@/lib/form-utils";
import { createContactMessage } from "@/lib/data";

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().max(120).optional(),
  message: z.string().min(10).max(3000),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const result = await createContactMessage(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: zodFieldError(error) }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send" }, { status: 500 });
  }
}
