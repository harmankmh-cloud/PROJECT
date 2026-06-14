import { z } from "zod";
import { NextResponse } from "next/server";

export function parseJsonBody<T extends z.ZodType>(
  body: unknown,
  schema: T
): { ok: true; data: z.infer<T> } | { ok: false; response: NextResponse } {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ") || "Invalid request body";
    return {
      ok: false,
      response: NextResponse.json({ error: message }, { status: 400 }),
    };
  }
  return { ok: true, data: parsed.data };
}

export async function readJsonBody(request: Request): Promise<unknown> {
  return request.json().catch(() => ({}));
}
