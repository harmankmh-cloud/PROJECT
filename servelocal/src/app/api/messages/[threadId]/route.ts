import { NextResponse } from "next/server";
import { z } from "zod";
import { getThreadMessages, sendMessage } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const messages = await getThreadMessages(threadId);
  return NextResponse.json({ messages });
}

const postSchema = z.object({
  body: z.string().min(1).max(2000),
  senderRole: z.enum(["homeowner", "pro"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const body = postSchema.parse(await request.json());
    const result = await sendMessage({
      threadId,
      senderUserId: user.id,
      senderRole: body.senderRole,
      body: body.body,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
