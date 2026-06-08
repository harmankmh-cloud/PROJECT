import { NextResponse } from "next/server";
import { z } from "zod";
import { runAiTeam } from "@/lib/ai-teams/run";

const bodySchema = z.object({
  team: z.enum(["growth", "brand", "jobs"]),
  role: z.union([z.string(), z.number()]).transform(String),
  product: z.string().max(80).optional(),
  context: z.string().max(8000).optional(),
  deliver_to: z.string().email().optional(),
});

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkSecret(request: Request): boolean {
  const secret =
    process.env.AI_TEAM_WEBHOOK_SECRET?.trim() || "greetq-ai-team-2026";

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const header = request.headers.get("x-greetq-secret");
  return header === secret;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "AI Team Runner",
    teams: ["growth", "brand", "jobs"],
    roles: {
      growth: ["strategist", "content", "researcher", "outreach", "seo"],
      brand: ["planner", "video", "caption", "linkedin", "analyst"],
      jobs: ["researcher", "resume", "cover", "ats", "tracker"],
    },
    usage: "POST JSON with X-GreetQ-Secret header",
    example: {
      team: "growth",
      role: "strategist",
      product: "Intellivio",
      context: "Focus Abbotsford insurance agencies this week",
      deliver_to: "you@email.com",
    },
  });
}

export async function POST(request: Request) {
  if (!checkSecret(request)) return unauthorized();

  try {
    const body = bodySchema.parse(await request.json());
    const result = await runAiTeam(body);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.error.includes("not configured") ? 503 : 400 });
    }

    return NextResponse.json({
      ok: true,
      team: result.team,
      role: result.role,
      emailed: result.emailed,
      email_to: result.email_to,
      output: result.output,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Team run failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
