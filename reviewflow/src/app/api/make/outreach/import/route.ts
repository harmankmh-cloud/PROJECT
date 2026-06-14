import { NextResponse } from "next/server";
import { z } from "zod";
import { checkOutreachSecret, outreachUnauthorized } from "@/lib/outreach-auth";
import { createServiceClient } from "@/lib/supabase/admin";

const leadSchema = z.object({
  business_name: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().min(2).max(80).default("Abbotsford"),
  vertical: z.string().min(2).max(80).default("other"),
  website: z.string().max(300).optional(),
  status: z.enum(["pending", "sent", "no_email", "preview_sent", "followup_1", "followup_2"]).default("pending"),
  notes: z.string().max(500).optional(),
});

const bodySchema = z.object({
  leads: z.array(leadSchema).min(1).max(500),
  mark_sent_emails: z.array(z.string().email()).optional(),
});

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
    const sentSet = new Set((body.mark_sent_emails || []).map((e) => e.toLowerCase()));

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const raw of body.leads) {
      const email = raw.email?.trim().toLowerCase() || null;
      const status = sentSet.has(email || "") ? "sent" : email ? raw.status : "no_email";

      const row = {
        business_name: raw.business_name.trim(),
        email,
        city: raw.city,
        vertical: raw.vertical,
        website: raw.website || null,
        status,
        notes: raw.notes || null,
        sent_at: status === "sent" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (!email) {
        const { error } = await admin.from("rl_outreach_leads").insert(row);
        if (error?.message.includes("duplicate")) skipped++;
        else if (error) throw new Error(error.message);
        else inserted++;
        continue;
      }

      const { data: existing } = await admin
        .from("rl_outreach_leads")
        .select("id, status")
        .ilike("email", email)
        .maybeSingle();

      if (existing) {
        if (existing.status === "sent") {
          skipped++;
          continue;
        }
        const { error } = await admin.from("rl_outreach_leads").update(row).eq("id", existing.id);
        if (error) throw new Error(error.message);
        updated++;
      } else {
        const { error } = await admin.from("rl_outreach_leads").insert(row);
        if (error) throw new Error(error.message);
        inserted++;
      }
    }

    const { count: pending } = await admin
      .from("rl_outreach_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .not("email", "is", null);

    return NextResponse.json({
      ok: true,
      inserted,
      updated,
      skipped,
      pending_with_email: pending ?? 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
