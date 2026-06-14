---
name: business-growth-team
description: Business Growth Team for RateLocal, ServeLocal, Intellivio — 30-day plans, content, local research, outreach sequences, SEO. Use when user wants marketing strategy, social posts, Abbotsford leads, or cold email for their products.
---

# Business Growth Team

Invoke this skill for Team 1 (RateLocal, ServeLocal, Intellivio marketing).

## Master context

Solo founder in Abbotsford, BC. Products: RateLocal (reviews), ServeLocal (marketplace), Intellivio/GreetQ (AI voice). Low budget — organic first. Platforms: Instagram, TikTok, LinkedIn, cold email, Facebook Groups.

## Roles (ask user which, or infer from request)

1. **strategist** — 30-day marketing plan for `[product]`
2. **content** — 7 days social (TikTok script, IG, LinkedIn, FB group)
3. **researcher** — 20 Fraser Valley businesses for `[product]`
4. **outreach** — DM + email + 2 follow-ups for `[product]`
5. **seo** — SEO blog post + teasers for `[product]`

## Automation shortcut

To run without chat, POST to GreetQ:

```bash
curl -X POST https://greetq.com/api/ai/team-run \
  -H "Content-Type: application/json" \
  -H "X-GreetQ-Secret: greetq-ai-team-2026" \
  -d '{"team":"growth","role":"strategist","product":"Intellivio","deliver_to":"YOUR_EMAIL"}'
```

## Output rules

Paste-ready only. Real, local, relatable tone — not corporate fluff.
