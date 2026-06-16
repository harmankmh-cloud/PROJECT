import { WebSocket } from "ws";
import type { AgentConfig } from "./types.js";
import { getAppUrl } from "./agent-config.js";

const REALTIME_MODEL =
  process.env.OPENAI_REALTIME_MODEL || "gpt-4o-realtime-preview-2024-12-17";

type TranscriptLine = { role: string; content: string };

export class RealtimeSession {
  private streamSid: string | null = null;
  private callSid: string | null = null;
  private transcripts: TranscriptLine[] = [];
  private openAiWs: WebSocket | null = null;
  private closed = false;

  constructor(
    private twilioWs: WebSocket,
    private config: AgentConfig,
    callSid: string | null = null
  ) {
    this.callSid = callSid;
  }

  startOpenAi() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[Realtime] OPENAI_API_KEY missing");
      this.destroy();
      return;
    }

    this.openAiWs = new WebSocket(`wss://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "realtime=v1",
      },
    });

    this.openAiWs.on("open", () => {
      const instructions = [
        this.config.systemPrompt,
        this.config.knowledgeContext
          ? `Knowledge:\n${this.config.knowledgeContext.slice(0, 1500)}`
          : "",
        "Live phone call: be concise, warm, and direct. Under 2 short sentences per turn.",
      ]
        .filter(Boolean)
        .join("\n\n");

      this.openAiWs?.send(
        JSON.stringify({
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions,
            voice: process.env.OPENAI_REALTIME_VOICE || "alloy",
            input_audio_format: "g711_ulaw",
            output_audio_format: "g711_ulaw",
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
          },
        })
      );
    });

    this.openAiWs.on("message", (data) => this.handleOpenAiMessage(data.toString()));
    this.openAiWs.on("error", () => this.destroy());
    this.openAiWs.on("close", () => this.destroy());
  }

  handleTwilioMessage(raw: string) {
    if (this.closed) return;

    try {
      const msg = JSON.parse(raw);

      switch (msg.event) {
        case "start":
          this.streamSid = msg.start?.streamSid ?? null;
          this.callSid = this.callSid || msg.start?.callSid || null;
          console.log("[Realtime] stream started", {
            streamSid: this.streamSid,
            callSid: this.callSid,
          });
          break;

        case "media":
          if (this.openAiWs?.readyState === WebSocket.OPEN) {
            this.openAiWs.send(
              JSON.stringify({
                type: "input_audio_buffer.append",
                audio: msg.media.payload,
              })
            );
          }
          break;

        case "stop":
          console.log("[Realtime] stream stopped", { streamSid: this.streamSid });
          this.destroy();
          break;
      }
    } catch (err) {
      console.error("[Realtime] Twilio message error:", err);
    }
  }

  private handleOpenAiMessage(raw: string) {
    if (this.closed) return;

    try {
      const msg = JSON.parse(raw);

      switch (msg.type) {
        case "response.audio.delta":
          if (this.streamSid && this.twilioWs.readyState === WebSocket.OPEN) {
            this.twilioWs.send(
              JSON.stringify({
                event: "media",
                streamSid: this.streamSid,
                media: { payload: msg.delta },
              })
            );
          }
          break;

        case "response.audio_transcript.done":
          if (msg.transcript) {
            this.transcripts.push({ role: "assistant", content: msg.transcript });
          }
          break;

        case "conversation.item.input_audio_transcription.completed":
          if (msg.transcript) {
            this.transcripts.push({ role: "user", content: msg.transcript });
          }
          break;

        case "input_audio_buffer.speech_started":
          console.log("[Realtime] barge-in — clearing Twilio playback");
          if (this.streamSid && this.twilioWs.readyState === WebSocket.OPEN) {
            this.twilioWs.send(JSON.stringify({ event: "clear", streamSid: this.streamSid }));
          }
          if (this.openAiWs?.readyState === WebSocket.OPEN) {
            this.openAiWs.send(JSON.stringify({ type: "response.cancel" }));
          }
          break;

        case "error":
          console.error("[Realtime] OpenAI error:", msg);
          break;
      }
    } catch (err) {
      console.error("[Realtime] OpenAI message error:", err);
    }
  }

  async notifyCallEnd() {
    const callSid = this.callSid;
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
          transcripts: this.transcripts,
        }),
      });
    } catch (err) {
      console.error("[Realtime] post-call webhook failed:", err);
    }
  }

  destroy() {
    if (this.closed) return;
    this.closed = true;

    this.twilioWs.removeAllListeners();
    this.openAiWs?.removeAllListeners();

    if (this.twilioWs.readyState === WebSocket.OPEN) this.twilioWs.terminate();
    if (this.openAiWs?.readyState === WebSocket.OPEN) this.openAiWs.terminate();

    this.openAiWs = null;
  }

  getCallSid() {
    return this.callSid;
  }

  getTranscripts() {
    return this.transcripts;
  }
}
