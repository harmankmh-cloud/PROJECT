import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;
import { sendEmail } from "@/lib/email";
import { generateOutreachEmail } from "@/lib/outreach-email";
import { checkOutreachSecret, outreachUnauthorized } from "@/lib/outreach-auth";
import { createServiceClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  limit: z.number().int().min(1).max(100).default(100),
  sequence: z.enum(["initial", "morning_call", "followup_1", "followup_2"]).default("initial"),
  delay_ms: z.number().int().min(0).max(10_000).default(2_000),
  city: z.string().max(80).optional(),
  preview_to: z.string().email().optional(),
});

type LeadRow = {
  id: string;
  business_name: string;
  email: string;
  city: string;
  vertical: string;
  notes: string | null;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(request: Request) {
  if (!checkOutreachSecret(request)) {
    return outreachUnauthorized();
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 503 });
  }

  try {
    const body = bodySchema.parse(await request.json());

    let query = admin
      .from("rl_outreach_leads")
      .select("id, business_name, email, city, vertical, notes")
      .eq("status", "pending")
      .not("email", "is", null)
      .neq("email", "")
      .order("created_at", { ascending: true })
      .limit(body.limit);

    if (body.city) {
      query = query.ilike("city", body.city);
    }

    const { data: leads, error } = await query;
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const batch = (leads || []) as LeadRow[];
    if (batch.length === 0) {
      const { count } = await admin
        .from("rl_outreach_leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .not("email", "is", null);
      return NextResponse.json({
        ok: true,
        sent: 0,
        message: "No pending leads with email — run scraper + import first",
        pending_with_email: count ?? 0,
      });
    }

    const results: Array<{
      business: string;
      email: string;
      ok: boolean;
      sent: boolean;
      subject: string | null;
      error: string | null;
    }> = [];

    for (let i = 0; i < batch.length; i++) {
      const lead = batch[i];
      const draft = generateOutreachEmail({
        businessName: lead.business_name,
        city: lead.city,
        vertical: lead.vertical,
        painNote: lead.notes || undefined,
        sequence: body.sequence,
      });

      const recipient = body.preview_to || lead.email;
      const mail = await sendEmail({
        to: recipient,
        subject: draft.subject,
        text: draft.body,
      });

      const ok = mail.ok;
      if (ok && !body.preview_to) {
        await admin
          .from("rl_outreach_leads")
          .update({
            status: "sent",
            last_sequence: body.sequence,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", lead.id);
      }

      results.push({
        business: lead.business_name,
        email: lead.email,
        ok,
        sent: ok,
        subject: draft.subject,
        error: ok ? null : ("error" in mail ? mail.error : "send failed"),
      });

      if (i < batch.length - 1 && body.delay_ms > 0) {
        await sleep(body.delay_ms);
      }
    }

    const succeeded = results.filter((r) => r.ok).length;
    return NextResponse.json({
      ok: true,
      sequence: body.sequence,
      limit: body.limit,
      total: results.length,
      succeeded,
      failed: results.length - succeeded,
      preview: Boolean(body.preview_to),
      results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Daily outreach failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
