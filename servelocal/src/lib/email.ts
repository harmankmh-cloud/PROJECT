import { createServiceClient } from "@/lib/supabase/admin";

const FROM = process.env.EMAIL_FROM || "ServeLocal <hello@servelocal.ca>";

export type EmailResult = { ok: true; id?: string } | { ok: false; skipped?: boolean; error: string };

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  html: string;
  template: string;
}): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };
    if (!response.ok) {
      return { ok: false, error: data.message || `Resend error ${response.status}` };
    }

    const admin = createServiceClient();
    if (admin) {
      await admin.from("email_send_log").insert({
        template: input.template,
        recipient: input.to,
        subject: input.subject,
        status: "sent",
      });
    }

    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Send failed" };
  }
}
