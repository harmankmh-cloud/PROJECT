import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertUserProfile } from "@/lib/user-profiles";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  role: z.enum(["homeowner", "pro"]),
  display_name: z.string().optional(),
  phone: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const result = await upsertUserProfile(user.id, parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
