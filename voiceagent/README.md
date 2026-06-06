# VoiceAgent

Enterprise AI phone agent platform for local businesses. Built on Telnyx Call Control with a multi-tenant Next.js control plane. Twilio ConversationRelay orchestrator path remains optional.

## Features

- **Phase 1 (MVP)**: Inbound AI agent, call logs, transcripts, warm transfer, HubSpot + Google Calendar, Stripe metered billing
- **Phase 2**: Visual flow builder, outbound campaigns, TCPA consent module, SSO, SOC 2/HIPAA prep
- **Phase 3**: Omnichannel (SMS/WhatsApp/web chat), conversation intelligence, white-label, EU data residency

## Quick start

```bash
cd voiceagent
cp .env.example .env.local
npm install
cd orchestrator && npm install && cd ..

# Terminal 1 — Next.js dashboard (port 3002)
npm run dev

# Terminal 2 — WebSocket orchestrator (port 8080)
npm run orchestrator
```

## Supabase setup

Run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL editor.

## Telnyx setup (recommended)

1. Create a **Call Control App** in Telnyx Mission Control
2. Set webhook URL: `https://your-domain/api/telnyx/webhook`
3. Buy a phone number and assign it to the Call Control App
4. Add to `.env.local`: `TELNYX_API_KEY`, `TELNYX_CONNECTION_ID`, `TELNYX_PHONE_NUMBER`
5. Insert phone number in `va_phone_numbers` linked to your org and agent

## Twilio setup (optional legacy)

1. Create a TwiML App with Voice URL: `https://your-domain/api/twilio/voice`
2. Expose orchestrator via tunnel: `ORCHESTRATOR_WSS_URL=wss://your-tunnel/ws`

## Architecture

```
Caller → Telnyx PSTN → /api/telnyx/webhook → transcription + OpenAI → speak
                                              ↓
                                    Next.js API (config, transfer, post-call)
                                              ↓
                                         Supabase + Stripe + HubSpot
```

## Ports

- VoiceAgent dashboard: **3002**
- Orchestrator WebSocket: **8080**

See [DECISIONS.md](DECISIONS.md) for product decisions.
