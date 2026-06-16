import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { WebSocketServer, type WebSocket } from "ws";
import twilio from "twilio";
import { fetchAgentConfig, getAppUrl } from "./agent-config.js";
import { CallSession } from "./session.js";
import { RealtimeSession } from "./realtime-session.js";

const orchestratorDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(orchestratorDir, "../../.env.local") });
dotenv.config({ path: path.resolve(orchestratorDir, "../../.env") });

const PORT = Number(process.env.PORT || process.env.ORCHESTRATOR_PORT || 8080);
const MAX_CONCURRENT = Number(process.env.MAX_CONCURRENT_CALLS || 500);

const relaySessions = new Map<WebSocket, CallSession>();
const realtimeSessions = new Map<WebSocket, RealtimeSession>();
let activeConnections = 0;

function getWssValidationUrls(req: http.IncomingMessage, wsPath: string): string[] {
  const urls = new Set<string>();
  const configured = process.env.ORCHESTRATOR_WSS_URL?.trim();
  if (configured) urls.add(configured);

  const host = req.headers.host;
  if (host) {
    urls.add(`wss://${host}${wsPath}`);
    if (wsPath === "/ws") urls.add(`wss://${host}`);
  }

  return [...urls];
}

function validateTwilioSignature(req: http.IncomingMessage, urls: string[]): boolean {
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

function rejectIfOverCapacity(ws: WebSocket): boolean {
  if (activeConnections >= MAX_CONCURRENT) {
    console.warn("Connection rejected: at capacity", { activeConnections, MAX_CONCURRENT });
    ws.close(1013, "At capacity");
    return true;
  }
  activeConnections += 1;
  return false;
}

function releaseConnection() {
  activeConnections = Math.max(0, activeConnections - 1);
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`GreetQ orchestrator — active: ${activeConnections}`);
});

const wssRelay = new WebSocketServer({ server, path: "/ws" });
const wssStream = new WebSocketServer({ server, path: "/stream" });

wssRelay.on("connection", async (ws, req) => {
  if (rejectIfOverCapacity(ws)) return;

  const validationUrls = getWssValidationUrls(req, "/ws");
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && !validateTwilioSignature(req, validationUrls)) {
    releaseConnection();
    ws.close(1008, "Invalid signature");
    return;
  }

  console.log("Relay WebSocket connected", { active: activeConnections });

  let session: CallSession | null = null;

  ws.on("message", async (data) => {
    const raw = data.toString();

    try {
      if (!session) {
        const msg = JSON.parse(raw);
        if (msg.type === "setup") {
          const orgId =
            msg.customParameters?.orgId || process.env.DEFAULT_ORG_ID || "default";
          const agentId =
            msg.customParameters?.agentId || process.env.DEFAULT_AGENT_ID || "default";
          const config = await fetchAgentConfig(orgId, agentId);
          session = new CallSession(ws, config);
          relaySessions.set(ws, session);
        }
      }

      if (session) {
        await session.handleMessage(raw);
      }
    } catch (err) {
      console.error("Relay message error:", err);
    }
  });

  ws.on("close", () => {
    releaseConnection();
    if (session) {
      session.destroy();
      relaySessions.delete(ws);
      notifyRelayCallEnd(session);
    }
    ws.removeAllListeners();
    console.log("Relay WebSocket closed", { active: activeConnections });
  });

  ws.on("error", () => {
    releaseConnection();
    session?.destroy();
    relaySessions.delete(ws);
    ws.removeAllListeners();
  });
});

wssStream.on("connection", async (ws, req) => {
  if (rejectIfOverCapacity(ws)) return;

  const validationUrls = getWssValidationUrls(req, "/stream");
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && !validateTwilioSignature(req, validationUrls)) {
    releaseConnection();
    ws.close(1008, "Invalid signature");
    return;
  }

  const url = new URL(req.url || "/", "http://localhost");
  const orgId = url.searchParams.get("orgId") || process.env.DEFAULT_ORG_ID || "default";
  const agentId = url.searchParams.get("agentId") || process.env.DEFAULT_AGENT_ID || "default";
  const callSid = url.searchParams.get("callSid");

  console.log("Realtime WebSocket connected", { orgId, agentId, callSid, active: activeConnections });

  const config = await fetchAgentConfig(orgId, agentId);
  const session = new RealtimeSession(ws, config, callSid);
  realtimeSessions.set(ws, session);
  session.startOpenAi();

  ws.on("message", (data) => {
    session.handleTwilioMessage(data.toString());
  });

  ws.on("close", async () => {
    releaseConnection();
    session.destroy();
    realtimeSessions.delete(ws);
    ws.removeAllListeners();
    await notifyRealtimeCallEnd(session);
    console.log("Realtime WebSocket closed", { active: activeConnections });
  });

  ws.on("error", () => {
    releaseConnection();
    session.destroy();
    realtimeSessions.delete(ws);
    ws.removeAllListeners();
  });
});

async function notifyRelayCallEnd(session: CallSession) {
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

async function notifyRealtimeCallEnd(session: RealtimeSession) {
  await session.notifyCallEnd();
}

server.listen(PORT, () => {
  console.log(`GreetQ orchestrator listening on :${PORT}`);
  console.log(`  Relay:    wss://host/ws (ConversationRelay)`);
  console.log(`  Realtime: wss://host/stream (OpenAI g711_ulaw)`);
  console.log(`  Health:   http://host:${PORT}/health`);
  console.log(`WSS URL: ${process.env.ORCHESTRATOR_WSS_URL || "(not set)"}`);
  console.log(`App URL: ${getAppUrl()}`);
  console.log(
    `Twilio auth: ${process.env.TWILIO_AUTH_TOKEN ? "configured" : "MISSING — WebSocket will fail in production"}`
  );
  console.log(
    `OpenRouter (relay): ${process.env.OPENROUTER_API_KEY ? "configured" : "MISSING"}`
  );
  console.log(
    `OpenAI (realtime): ${process.env.OPENAI_API_KEY ? "configured" : "MISSING — realtime mode needs OPENAI_API_KEY"}`
  );
});
