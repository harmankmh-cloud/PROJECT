import { NextResponse } from "next/server";
import { markReviewHelpful } from "@/lib/features-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const fingerprint =
    typeof body.fingerprint === "string" && body.fingerprint.length > 8
      ? body.fingerprint
      : request.headers.get("x-forwarded-for") || "anonymous";

  const result = await markReviewHelpful(id, fingerprint);
  return NextResponse.json({ count: result.count });
}
