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

const PORT = Number(process.env.ORCHESTRATOR_PORT || 8080);
const sessions = new Map<WebSocket, CallSession>();

async function fetchAgentConfig(orgId: string, agentId: string): Promise<AgentConfig> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  const apiKey = process.env.ORCHESTRATOR_API_KEY || "";

  try {
    const res = await fetch(
      `${apiUrl}/api/orchestrator/config?orgId=${orgId}&agentId=${agentId}`,
      { headers: { "x-orchestrator-key": apiKey } }
    );
    if (res.ok) return (await res.json()) as AgentConfig;
  } catch {
    // fall through to defaults
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

function validateTwilioSignature(
  req: http.IncomingMessage,
  url: string
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return process.env.NODE_ENV !== "production";

  const signature = req.headers["x-twilio-signature"] as string | undefined;
  if (!signature) return false;

  return twilio.validateRequest(authToken, signature, url, {});
}

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("VoiceAgent orchestrator running");
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", async (ws, req) => {
  const publicUrl = process.env.ORCHESTRATOR_WSS_URL || `wss://${req.headers.host || `localhost:${PORT}`}/ws`;
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && !validateTwilioSignature(req, publicUrl)) {
    console.warn("WebSocket connection rejected: invalid Twilio signature");
    ws.close(1008, "Invalid signature");
    return;
  }

  console.log("WebSocket connected from Twilio");

  let session: CallSession | null = null;

  ws.on("message", async (data) => {
    const raw = data.toString();

    if (!session) {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === "setup") {
          const orgId = msg.customParameters?.orgId || process.env.DEFAULT_ORG_ID || "default";
          const agentId = msg.customParameters?.agentId || process.env.DEFAULT_AGENT_ID || "default";
          const config = await fetchAgentConfig(orgId, agentId);
          session = new CallSession(ws, config);
          sessions.set(ws, session);
        }
      } catch {
        return;
      }
    }

    if (session) {
      await session.handleMessage(raw);
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

  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
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
});
