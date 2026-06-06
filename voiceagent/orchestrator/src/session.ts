import type { WebSocket } from "ws";
import { LlmSession } from "./llm.js";
import type { AgentConfig, InboundMessage, TextResponse } from "./types.js";

export class CallSession {
  private llm: LlmSession | null = null;
  private callSid: string | null = null;
  private from: string | null = null;
  private transcripts: Array<{ role: string; content: string }> = [];
  private isSpeaking = false;

  constructor(
    private ws: WebSocket,
    private config: AgentConfig
  ) {}

  async handleMessage(raw: string) {
    let msg: InboundMessage;
    try {
      msg = JSON.parse(raw) as InboundMessage;
    } catch {
      return;
    }

    try {
      switch (msg.type) {
        case "setup":
          this.callSid = msg.callSid;
          this.from = msg.from;
          this.llm = new LlmSession(
            this.config.systemPrompt,
            this.config.knowledgeContext,
            this.config.contactMemory
          );
          console.log("Relay setup", { callSid: this.callSid, from: this.from });
          break;

        case "prompt":
          if (!this.llm || !msg.voicePrompt?.trim()) return;
          if (!msg.last) return;

          console.log("Relay prompt", { callSid: this.callSid, text: msg.voicePrompt });
          this.transcripts.push({ role: "user", content: msg.voicePrompt });
          this.isSpeaking = true;

          this.send({ type: "text", token: "Sure. ", last: false });

          const { text, toolResult } = await this.llm.respondStream(
            msg.voicePrompt,
            (token) => {
              this.send({ type: "text", token, last: false });
            }
          );

          this.send({ type: "text", token: "", last: true });
          this.transcripts.push({ role: "assistant", content: text });

          if (toolResult?.action === "transfer" && this.config.escalationPhone) {
            await this.notifyTransfer(toolResult);
          }

          this.isSpeaking = false;
          break;

        case "interrupt":
          this.isSpeaking = false;
          this.llm?.handleInterrupt(msg.utteranceUntilInterrupt);
          break;

        case "dtmf":
          if (msg.digit === "0" && this.config.escalationPhone) {
            await this.streamText("Connecting you to a team member now.");
            await this.notifyTransfer({
              action: "transfer",
              handoffSummary: "Caller pressed 0 for operator",
            });
          }
          break;
      }
    } catch (err) {
      console.error("Relay session error:", err);
      this.send({
        type: "text",
        token: "Sorry, I had a brief issue. Please try again.",
        last: true,
      });
      this.isSpeaking = false;
    }
  }

  private async streamText(text: string) {
    this.send({ type: "text", token: text, last: false });
    this.send({ type: "text", token: "", last: true });
  }

  private send(response: TextResponse) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify(response));
    }
  }

  private async notifyTransfer(payload: { action?: string; handoffSummary?: string }) {
    const apiUrl =
      process.env.ORCHESTRATOR_APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://127.0.0.1:3002";
    const apiKey = process.env.ORCHESTRATOR_API_KEY || "";

    try {
      await fetch(`${apiUrl}/api/twilio/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-orchestrator-key": apiKey,
        },
        body: JSON.stringify({
          callSid: this.callSid,
          orgId: this.config.orgId,
          agentId: this.config.agentId,
          transferPhone: this.config.escalationPhone,
          handoffSummary: payload.handoffSummary,
          from: this.from,
          transcripts: this.transcripts,
        }),
      });
    } catch (err) {
      console.error("Transfer notification failed:", err);
    }
  }

  getCallSid() {
    return this.callSid;
  }

  getTranscripts() {
    return this.transcripts;
  }
}
