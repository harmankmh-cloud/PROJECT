# GreetQ Voice Architecture

Production voice runs as a **distributed** system: Vercel answers Twilio's first HTTP POST; a **stateful orchestrator** (Railway) holds long-lived WebSocket streams.

## Modes (`TWILIO_VOICE_MODE`)

| Mode | TwiML | Orchestrator path | LLM / audio |
|------|-------|-------------------|-------------|
| `relay` (default) | ConversationRelay | `wss://host/ws` | OpenRouter text → Twilio Deepgram/ElevenLabs |
| `realtime` | Media Stream | `wss://host/stream` | OpenAI Realtime g711_ulaw passthrough |
| `simple` | Say + Gather | (none) | Polly TTS, Vercel gather loop |

## Call flow (relay — default)

```
Twilio POST → Vercel /api/twilio/voice
  → sync: signature, phone→org, billing gate, va_calls record
  → TwiML ConversationRelay → wss://orchestrator/ws
Orchestrator → Vercel /api/orchestrator/reply (OpenRouter)
Orchestrator → post-call webhook on hangup
```

## Call flow (realtime — pilot)

```
Twilio POST → Vercel /api/twilio/voice
  → same sync gates
  → TwiML <Stream url="wss://orchestrator/stream?orgId&agentId&callSid&from">
Orchestrator → OpenAI Realtime (g711_ulaw in/out)
  → Twilio `clear` on barge-in (speech_started)
  → post-call webhook on hangup
```

## Env vars

**Vercel (voiceagent project):**
- `TWILIO_VOICE_MODE` — `relay` | `realtime` | `simple`
- `ORCHESTRATOR_WSS_URL` — e.g. `wss://your-app.up.railway.app/ws`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`

**Railway (orchestrator):**
- `ORCHESTRATOR_WSS_URL` — must match public WSS URL Twilio uses
- `ORCHESTRATOR_API_KEY` — shared secret with Vercel
- `ORCHESTRATOR_APP_URL` — `https://greetq.com`
- `TWILIO_AUTH_TOKEN` — WebSocket signature validation
- `OPENROUTER_API_KEY` — relay mode
- `OPENAI_API_KEY` — realtime mode only
- `MAX_CONCURRENT_CALLS` — default 500

## Deploy orchestrator

```bash
cd voiceagent/orchestrator
npm run build
npm start   # or Docker: docker build -t greetq-orchestrator .
```

Health check: `GET /health` → `OK`

Railway: [railway.toml](../orchestrator/railway.toml) uses Nixpacks. Optional: switch service to Docker with the included Dockerfile.

## Barge-in

- **Relay:** `interrupt` messages abort in-flight `/api/orchestrator/reply` via AbortController
- **Realtime:** OpenAI `speech_started` → Twilio `clear` + OpenAI `response.cancel`

## Files

| File | Role |
|------|------|
| `src/app/api/twilio/voice/route.ts` | Fast TwiML hand-off |
| `src/lib/twilio.ts` | TwiML builders |
| `orchestrator/src/index.ts` | HTTP + WSS `/ws` and `/stream` |
| `orchestrator/src/session.ts` | ConversationRelay session |
| `orchestrator/src/realtime-session.ts` | OpenAI Realtime proxy |
| `orchestrator/Dockerfile` | Production container |
