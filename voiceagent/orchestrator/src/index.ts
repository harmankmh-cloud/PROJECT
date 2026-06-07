import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const orchestratorDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(orchestratorDir, "../../.env.local") });
dotenv.config({ path: path.resolve(orchestratorDir, "../../.env") });
import { WebSocketServer, type WebSocket } from "ws";
import twilio from "twilio";
import type { AgentConfig } from "./types.js";
import { CallSession } from "./session.js";

const PORT = Number(process.env.PORT || process.env.ORCHESTRATOR_PORT || 8080);
const sessions = new Map<WebSocket, CallSession>();

function getAppUrl() {
  return (
    process.env.ORCHESTRATOR_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://127.0.0.1:3002"
  );
}

async function fetchAgentConfig(orgId: string, agentId: string): Promise<AgentConfig> {
  const apiUrl = getAppUrl();
  const apiKey = process.env.ORCHESTRATOR_API_KEY || "";

  try {
    const res = await fetch(
      `${apiUrl}/api/orchestrator/config?orgId=${orgId}&agentId=${agentId}`,
      { headers: { "x-orchestrator-key": apiKey }, signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) return (await res.json()) as AgentConfig;
    console.warn("Config fetch failed", { status: res.status, orgId, agentId });
  } catch (err) {
    console.warn("Config fetch error:", err);
  }

  return {
    orgId,
    agentId,
    systemPrompt:
      process.env.DEFAULT_SYSTEM_PROMPT ||
      "You are a helpful phone assistant for a local business. Answer questions, book appointments, and transfer to a human when needed.",
    welcomeGreeting: "Hello! How can I help you today?",
    escalationPhone: process.env.DEFAULT_ESCALATION_PHONE,
  };
}

function getWssValidationUrls(req: http.IncomingMessage): string[] {
  const urls = new Set<string>();
  const configured = process.env.ORCHESTRATOR_WSS_URL?.trim();
  if (configured) urls.add(configured);

  const host = req.headers.host;
  if (host) {
    urls.add(`wss://${host}/ws`);
    urls.add(`wss://${host}`);
  }

  return [...urls];
}

function validateTwilioSignature(
  req: http.IncomingMessage,
  urls: string[]
): boolean {
  if (process.env.ORCHESTRATOR_SKIP_TWILIO_SIGNATURE === "true") {
    console.warn("ORCHESTRATOR_SKIP_TWILIO_SIGNATURE=true — skipping Twilio signature check");
    return true;
  }

  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.error("TWILIO_AUTH_TOKEN missing — WebSocket rejected in production");
    return process.env.NODE_ENV !== "production";
  }

  const signature = req.headers["x-twilio-signature"] as string | undefined;
  if (!signature) {
    console.warn("WebSocket missing X-Twilio-Signature header");
    return false;
  }

  for (const url of urls) {
    if (twilio.validateRequest(authToken, signature, url, {})) return true;
  }

  console.warn("Twilio signature mismatch", { tried: urls });
  return false;
}

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("VoiceAgent orchestrator running");
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", async (ws, req) => {
  const validationUrls = getWssValidationUrls(req);
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && !validateTwilioSignature(req, validationUrls)) {
    console.warn("WebSocket connection rejected: invalid Twilio signature");
    ws.close(1008, "Invalid signature");
    return;
  }

  console.log("WebSocket connected from Twilio");

  let session: CallSession | null = null;

  ws.on("message", async (data) => {
    const raw = data.toString();

    try {
      if (!session) {
        const msg = JSON.parse(raw);
        if (msg.type === "setup") {
          const orgId = msg.customParameters?.orgId || process.env.DEFAULT_ORG_ID || "default";
          const agentId = msg.customParameters?.agentId || process.env.DEFAULT_AGENT_ID || "default";
          const config = await fetchAgentConfig(orgId, agentId);
          session = new CallSession(ws, config);
          sessions.set(ws, session);
        }
      }

      if (session) {
        await session.handleMessage(raw);
      }
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  });

  ws.on("close", () => {
    if (session) {
      sessions.delete(ws);
      notifyCallEnd(session);
    }
  });
});

async function notifyCallEnd(session: CallSession) {
  const callSid = session.getCallSid();
  if (!callSid) return;

  const apiUrl = getAppUrl();
  const apiKey = process.env.ORCHESTRATOR_API_KEY || "";

  try {
    await fetch(`${apiUrl}/api/webhooks/post-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-orchestrator-key": apiKey,
      },
      body: JSON.stringify({
        callSid,
        transcripts: session.getTranscripts(),
      }),
    });
  } catch (err) {
    console.error("Post-call webhook failed:", err);
  }
}

server.listen(PORT, () => {
  console.log(`VoiceAgent orchestrator listening on :${PORT}/ws`);
  console.log(`WSS URL: ${process.env.ORCHESTRATOR_WSS_URL || "(not set)"}`);
  console.log(`App URL: ${getAppUrl()}`);
  console.log(
    `Twilio auth: ${process.env.TWILIO_AUTH_TOKEN ? "configured" : "MISSING — WebSocket will fail in production"}`
  );
  console.log(
    `OpenRouter: ${process.env.OPENROUTER_API_KEY ? "configured" : "MISSING — add OPENROUTER_API_KEY"}`
  );
  const model =
    process.env.OPENROUTER_MODEL?.trim().replace(/^OPENROUTER_MODEL=/i, "") ||
    "google/gemini-2.5-flash";
  console.log(`Model: ${model} (+ fallbacks)`);
});
