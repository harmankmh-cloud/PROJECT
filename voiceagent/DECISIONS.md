# VoiceAgent — Confirmed Product Decisions

Decisions locked per the Enterprise Voice Agent blueprint (June 2026).

## Build Approach

**Orchestrate on Telnyx** — own the SaaS control plane (dashboard, billing, compliance, analytics); rent telephony via Telnyx Call Control + Deepgram transcription + OpenAI + Telnyx speak. Twilio ConversationRelay orchestrator remains optional legacy path.

- Not building PSTN from scratch
- Not white-labeling Retell/Vapi
- Conversation engine + flow execution owned in `orchestrator/` and `src/lib/flow-engine/`

## Primary Use Case

**Inbound-first** for local businesses (RateLocal wedge), with outbound campaigns in Phase 2.

- MVP: answer calls, FAQ from knowledge base, book appointments, warm transfer to owner
- Phase 2: outbound lead qualification + appointment reminders (TCPA-gated)

## First Vertical

**Local businesses** — plumbers, salons, clinics, restaurants. Upsell path from RateLocal customers; enterprise path via multi-location franchises.

## Geography

**US + Canada first.** EU data residency config available in settings (Phase 3); GDPR DPA templates in compliance module.

## Provider Stack

| Layer | Provider |
|-------|----------|
| Telephony | Telnyx Call Control API |
| LLM | OpenAI GPT-4o-mini |
| STT | Telnyx Deepgram transcription |
| TTS | Telnyx speak |
| Control plane | Next.js 16 + Supabase |
| Billing | Stripe metered + subscription tiers |
| Observability | Structured logs + optional Datadog |

## Repo Layout

```
voiceagent/
├── orchestrator/     # WebSocket server (wss://) for ConversationRelay
├── src/              # Next.js SaaS dashboard + API routes
└── supabase/         # Multi-tenant schema
```

Runs on port **3002** (RateLocal 3000, ServeLocal 3001).
