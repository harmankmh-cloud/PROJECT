import { NextResponse } from "next/server";
import { z } from "zod";
import { createMessageThread, getUserMessageThreads } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ threads: [] });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const asPro = new URL(request.url).searchParams.get("as") === "pro";
  const threads = await getUserMessageThreads(user.id, asPro);
  return NextResponse.json({ threads });
}

const postSchema = z.object({
  providerId: z.string().uuid(),
  message: z.string().min(1).max(2000),
  subject: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const body = postSchema.parse(await request.json());
    const result = await createMessageThread({
      homeownerUserId: user.id,
      providerId: body.providerId,
      subject: body.subject,
      initialMessage: body.message,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ threadId: result.threadId });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
