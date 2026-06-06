# VoiceAgent

Enterprise AI phone agent platform for local businesses. Built on Twilio ConversationRelay with a multi-tenant Next.js control plane.

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

## Twilio setup

1. Create a TwiML App with Voice URL: `https://your-domain/api/twilio/voice`
2. Buy a phone number and assign the TwiML App
3. Expose orchestrator via tunnel: `ORCHESTRATOR_WSS_URL=wss://your-tunnel/ws`
4. Insert phone number in `va_phone_numbers` linked to your org and agent

## Architecture

```
Caller → Twilio PSTN → ConversationRelay → orchestrator (wss) → OpenAI
                                              ↓
                                    Next.js API (config, transfer, post-call)
                                              ↓
                                         Supabase + Stripe + HubSpot
```

## Ports

- VoiceAgent dashboard: **3002**
- Orchestrator WebSocket: **8080**

See [DECISIONS.md](DECISIONS.md) for product decisions.
