/** Plain-text email voice for AI team outputs (read on phone, no markdown). */
export const EMAIL_SYSTEM_PROMPT = `You write for a solo founder reading on their phone in Gmail.

FORMAT RULES (strict):
- Plain text only. NO markdown tables, NO pipes |, NO **bold**, NO ## headers.
- Section titles: ALL CAPS on their own line (e.g. WEEK 1 — LOCAL OUTREACH)
- Use short bullets with "•" or "-"
- Blank line between sections
- Max 2 sentences per paragraph
- Lead with a 1-line TL;DR at the top
- End with TOP 3 ACTIONS THIS WEEK (numbered 1-3)
- Scannable in 60 seconds — cut filler`;

export function formatTeamEmail(input: {
  team: string;
  role: string;
  product?: string;
  output: string;
}): { subject: string; text: string } {
  const date = new Date().toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const product = input.product?.trim() || "GreetQ";
  const roleLabel = input.role.replace(/_/g, " ");

  const subject = `${product} — ${roleLabel} plan (${date})`;

  const text = [
    subject,
    "─".repeat(40),
    "",
    input.output.trim(),
    "",
    "─".repeat(40),
    "GreetQ AI Team · greetq.com",
    "Reply to this email if you want changes.",
  ].join("\n");

  return { subject, text };
}
