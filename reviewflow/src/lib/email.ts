import { BRAND } from "@/lib/brand";

const FROM =
  process.env.EMAIL_FROM?.trim() || `Harman · ${BRAND.name} <${BRAND.contact.email}>`;

export type EmailResult = { ok: true; id?: string; provider?: string } | { ok: false; skipped?: boolean; error: string };

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

function resolveProvider(): "resend" | "brevo" | null {
  const forced = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (forced === "resend" && process.env.RESEND_API_KEY?.trim()) return "resend";
  if (forced === "brevo" && process.env.BREVO_API_KEY?.trim()) return "brevo";
  if (process.env.RESEND_API_KEY?.trim()) return "resend";
  if (process.env.BREVO_API_KEY?.trim()) return "brevo";
  return null;
}

async function sendViaResend(input: EmailInput): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };

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

  return { ok: true, id: data.id, provider: "resend" };
}

async function sendViaBrevo(input: EmailInput): Promise<EmailResult> {
  const key = process.env.BREVO_API_KEY?.trim();
  if (!key) return { ok: false, skipped: true, error: "BREVO_API_KEY not configured" };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: BRAND.contact.email, name: `Harman · ${BRAND.name}` },
      to: [{ email: input.to }],
      replyTo: { email: input.replyTo || BRAND.contact.email },
      subject: input.subject,
      textContent: input.text,
    }),
  });

  const data = (await response.json()) as { messageId?: string; message?: string };
  if (!response.ok) {
    return { ok: false, error: data.message || `Brevo error ${response.status}` };
  }

  return { ok: true, id: data.messageId, provider: "brevo" };
}

export async function sendEmail(input: EmailInput): Promise<EmailResult> {
  const provider = resolveProvider();
  if (!provider) {
    return {
      ok: false,
      skipped: true,
      error: "No email provider configured (set RESEND_API_KEY or BREVO_API_KEY)",
    };
  }

  try {
    if (provider === "brevo") return await sendViaBrevo(input);
    return await sendViaResend(input);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Send failed" };
  }
}

export function emailFooter(): string {
  return `\n\n—\n${BRAND.legalName} · ${BRAND.location.label}\n${BRAND.contact.email} · ${BRAND.domain}\nReply STOP to opt out of future emails.`;
}
