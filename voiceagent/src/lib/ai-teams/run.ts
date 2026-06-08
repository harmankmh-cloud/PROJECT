import { chatCompletion, hasOpenRouter } from "@/lib/openrouter";
import { sendEmail } from "@/lib/email";
import { EMAIL_SYSTEM_PROMPT, formatTeamEmail } from "./email-format";
import {
  buildTeamPrompt,
  FOUNDER,
  resolveRole,
  type TeamId,
} from "./prompts";

export type TeamRunInput = {
  team: TeamId;
  role: string;
  product?: string;
  context?: string;
  deliver_to?: string;
};

export type TeamRunResult =
  | { ok: true; team: TeamId; role: string; output: string; emailed: boolean; email_to?: string }
  | { ok: false; error: string };

export async function runAiTeam(input: TeamRunInput): Promise<TeamRunResult> {
  const role = resolveRole(input.team, input.role);
  if (!role) {
    return { ok: false, error: `Invalid role "${input.role}" for team "${input.team}"` };
  }

  if (!hasOpenRouter()) {
    return { ok: false, error: "OPENROUTER_API_KEY not configured" };
  }

  const prompt = buildTeamPrompt(input.team, role, {
    product: input.product,
    extra: input.context,
  });

  const output = await chatCompletion({
    messages: [
      {
        role: "system",
        content: EMAIL_SYSTEM_PROMPT,
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  if (!output) {
    return {
      ok: false,
      error:
        "AI generation failed — OpenRouter returned no content (timeout or all models unavailable). Retry in a minute.",
    };
  }

  const deliverTo = input.deliver_to?.trim() || FOUNDER.email;
  let emailed = false;

  if (deliverTo) {
    const { subject, text } = formatTeamEmail({
      team: input.team,
      role,
      product: input.product,
      output,
    });
    const result = await sendEmail({ to: deliverTo, subject, text });
    emailed = result.ok;
  }

  return {
    ok: true,
    team: input.team,
    role,
    output,
    emailed,
    email_to: deliverTo,
  };
}
