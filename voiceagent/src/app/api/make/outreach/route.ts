import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { generateOutreachEmail } from "@/lib/outreach-email";

const bodySchema = z.object({
  business_name: z.string().min(2).max(120),
  email: z.string().email(),
  city: z.string().min(2).max(80),
  vertical: z.string().min(2).max(80),
  contact_name: z.string().max(80).optional(),
  pain_note: z.string().max(300).optional(),
  sequence: z.enum(["initial", "followup_1", "followup_2"]).default("initial"),
  send: z.boolean().default(false),
  /** Send draft to your inbox instead of the lead (approval step in Make). */
  preview_to: z.string().email().optional(),
});

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkSecret(request: Request): boolean {
  const makeSecret = process.env.MAKE_WEBHOOK_SECRET?.trim();
  const marketingSecret =
    process.env.ACTIVEPIECES_MARKETING_WEBHOOK_SECRET?.trim() || "greetq-marketing-webhook-2026";

  const auth = request.headers.get("authorization");
  if (makeSecret && auth === `Bearer ${makeSecret}`) return true;

  const makeHeader = request.headers.get("x-make-secret");
  if (makeSecret && makeHeader === makeSecret) return true;

  const greetqHeader = request.headers.get("x-greetq-secret");
  if (greetqHeader === marketingSecret) return true;

  return false;
}

export async function GET() {
  const configured = Boolean(
    process.env.MAKE_WEBHOOK_SECRET?.trim() ||
      process.env.ACTIVEPIECES_MARKETING_WEBHOOK_SECRET?.trim()
  );
  return NextResponse.json({
    ok: true,
    service: "GreetQ Make outreach",
    configured,
    usage: "POST JSON with Authorization: Bearer MAKE_WEBHOOK_SECRET",
    fields: ["business_name", "email", "city", "vertical", "send", "sequence"],
  });
}

export async function POST(request: Request) {
  if (!checkSecret(request)) {
    return unauthorized();
  }

  try {
    const body = bodySchema.parse(await request.json());

    const draft = await generateOutreachEmail({
      businessName: body.business_name,
      city: body.city,
      vertical: body.vertical,
      contactName: body.contact_name,
      painNote: body.pain_note,
      sequence: body.sequence,
    });

    if (!body.send) {
      return NextResponse.json({
        ok: true,
        sent: false,
        subject: draft.subject,
        body: draft.body,
      });
    }

    const recipient = body.preview_to || body.email;
    const result = await sendEmail({
      to: recipient,
      subject: draft.subject,
      text: draft.body,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error,
          subject: draft.subject,
          body: draft.body,
        },
        { status: result.skipped ? 503 : 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      sent: true,
      preview: Boolean(body.preview_to),
      to: recipient,
      resend_id: result.id,
      subject: draft.subject,
      body: draft.body,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Outreach failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
