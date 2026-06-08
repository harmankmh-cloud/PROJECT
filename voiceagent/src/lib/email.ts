import { BRAND } from "@/lib/brand";

const FROM =
  process.env.EMAIL_FROM?.trim() || `Harman from ${BRAND.name} <${BRAND.contact.email}>`;

export type EmailResult = { ok: true; id?: string } | { ok: false; skipped?: boolean; error: string };

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
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
        reply_to: input.replyTo || BRAND.contact.email,
        subject: input.subject,
        text: input.text,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };
    if (!response.ok) {
      return { ok: false, error: data.message || `Resend error ${response.status}` };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Send failed" };
  }
}

export function emailFooter(): string {
  return `\n\n—\n${BRAND.legalName} · ${BRAND.location.label}\n${BRAND.contact.email} · ${BRAND.domain}\nReply STOP to opt out of future emails.`;
}
