import { NextResponse } from "next/server";
import { z } from "zod";

/** Real sends can exceed 60s above ~8 emails; Activepieces batches of 5 stay safe. */
export const maxDuration = 120;
import { sendEmail } from "@/lib/email";
import { generateOutreachEmail } from "@/lib/outreach-email";
import { checkOutreachSecret, outreachUnauthorized } from "@/lib/outreach-auth";
import { formatApiError, isSendableOutreachEmail } from "@/lib/outreach-leads";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  /** Max emails this run (hard cap 100/day across Activepieces batches). */
  limit: z.number().int().min(1).max(15).default(5),
  sequence: z.enum(["initial", "morning_call", "followup_1", "followup_2"]).default("morning_call"),
  delay_ms: z.number().int().min(0).max(10_000).default(1_500),
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

  let admin;
  try {
    admin = createAdminClient();
  } catch (error) {
    return NextResponse.json({ ok: false, error: formatApiError(error) }, { status: 503 });
  }

  try {
    const body = bodySchema.parse(await request.json());

    let query = admin
      .from("va_outreach_leads")
      .select("id, business_name, email, city, vertical, notes")
      .eq("status", "pending")
      .not("email", "is", null)
      .neq("email", "")
      .order("created_at", { ascending: true })
      .limit(body.limit * 3);

    if (body.city) {
      query = query.ilike("city", body.city);
    }

    const { data: leads, error } = await query;
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const batch: LeadRow[] = [];
    const skipped: Array<{ business: string; email: string; reason: string }> = [];

    for (const lead of (leads || []) as LeadRow[]) {
      if (batch.length >= body.limit) break;
      if (!isSendableOutreachEmail(lead.email)) {
        skipped.push({
          business: lead.business_name,
          email: lead.email,
          reason: "invalid_or_blocked_email",
        });
        if (!body.preview_to) {
          await admin
            .from("va_outreach_leads")
            .update({
              status: "no_email",
              notes: "Skipped: invalid or blocked email domain",
              updated_at: new Date().toISOString(),
            })
            .eq("id", lead.id);
        }
        continue;
      }
      batch.push(lead);
    }

    if (batch.length === 0) {
      const { count } = await admin
        .from("va_outreach_leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .not("email", "is", null);
      return NextResponse.json({
        ok: true,
        sent: 0,
        skipped: skipped.length,
        message:
          skipped.length > 0
            ? "No sendable pending leads — blocked emails were skipped"
            : "No pending leads with email — run scraper + import first",
        pending_with_email: count ?? 0,
        skipped_results: skipped,
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
      const draft = await generateOutreachEmail({
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
          .from("va_outreach_leads")
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
        error: ok ? null : "error" in mail ? mail.error : "send failed",
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
      skipped: skipped.length,
      preview: Boolean(body.preview_to),
      results,
      skipped_results: skipped,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload", details: error.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: formatApiError(error) }, { status: 500 });
  }
}
