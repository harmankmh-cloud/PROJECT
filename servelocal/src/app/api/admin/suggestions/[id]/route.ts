import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePlatformAdminApi } from "@/lib/require-admin";
import { updateSuggestionAdmin } from "@/lib/data";

const bodySchema = z.object({
  status: z.enum(["read", "done"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const body = bodySchema.parse(await request.json());
    const result = await updateSuggestionAdmin(id, body.status);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
