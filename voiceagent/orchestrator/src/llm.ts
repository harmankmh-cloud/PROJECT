import OpenAI from "openai";
import type { ToolCallResult } from "./types.js";

const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "transfer_to_human",
      description: "Transfer the caller to a human agent when they request it or the issue is too complex.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Why the transfer is needed" },
          summary: { type: "string", description: "Brief summary for the human agent" },
        },
        required: ["reason", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_appointment",
      description: "Book an appointment on the business calendar.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string" },
          customer_phone: { type: "string" },
          preferred_date: { type: "string", description: "ISO date or natural language date" },
          preferred_time: { type: "string" },
          notes: { type: "string" },
        },
        required: ["customer_name", "preferred_date", "preferred_time"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_knowledge",
      description: "Search the business knowledge base for an answer.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
        required: ["query"],
      },
    },
  },
];

const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

export class LlmSession {
  private client: OpenAI;
  private messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  private pendingTool: ToolCallResult | null = null;

  constructor(
    private systemPrompt: string,
    private knowledgeContext?: string,
    private contactMemory?: string
  ) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is required");
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
        "X-Title": "VoiceAgent",
      },
    });

    let fullSystem = systemPrompt;
    if (knowledgeContext) {
      fullSystem += `\n\nKnowledge base:\n${knowledgeContext}`;
    }
    if (contactMemory) {
      fullSystem += `\n\nCaller history:\n${contactMemory}`;
    }
    fullSystem +=
      "\n\nLive phone call rules: ONE short spoken sentence, under 20 words, natural and direct. No lists or markdown. If the caller wants a human, use transfer_to_human.";

    this.messages.push({ role: "system", content: fullSystem });
  }

  async respond(userText: string): Promise<{ text: string; toolResult: ToolCallResult | null }> {
    this.messages.push({ role: "user", content: userText });

    const completion = await this.client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: this.messages,
      tools: TOOLS,
      tool_choice: "auto",
      max_tokens: 80,
      temperature: 0.4,
    });

    const choice = completion.choices[0];
    const msg = choice.message;

    if (msg.tool_calls?.length) {
      const call = msg.tool_calls[0];
      const args = JSON.parse(call.function.arguments || "{}");
      this.messages.push(msg);

      let toolResult: ToolCallResult = {};
      let assistantText = "";

      if (call.function.name === "transfer_to_human") {
        toolResult = {
          action: "transfer",
          handoffSummary: args.summary,
          message: "I'll connect you with a team member now. Please hold.",
        };
        assistantText = toolResult.message!;
      } else if (call.function.name === "book_appointment") {
        toolResult = {
          action: "book_appointment",
          message: `I've noted your appointment request for ${args.preferred_date} at ${args.preferred_time}. You'll receive a confirmation shortly.`,
        };
        assistantText = toolResult.message!;
      } else if (call.function.name === "lookup_knowledge") {
        assistantText =
          this.knowledgeContext ||
          "I don't have specific information on that, but I can connect you with someone who does.";
        toolResult = { message: assistantText };
      }

      this.messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(toolResult),
      });
      this.messages.push({ role: "assistant", content: assistantText });
      this.pendingTool = toolResult;
      return { text: assistantText, toolResult };
    }

    const text = msg.content || "I'm sorry, could you repeat that?";
    this.messages.push({ role: "assistant", content: text });
    return { text, toolResult: null };
  }

  handleInterrupt(utteranceUntilInterrupt?: string) {
    if (utteranceUntilInterrupt) {
      const lastAssistant = [...this.messages].reverse().find((m) => m.role === "assistant");
      if (lastAssistant && typeof lastAssistant.content === "string") {
        const truncated = lastAssistant.content.slice(0, utteranceUntilInterrupt.length);
        lastAssistant.content = truncated;
      }
    }
  }

  getHistory() {
    return this.messages.filter((m) => m.role === "user" || m.role === "assistant");
  }
}
