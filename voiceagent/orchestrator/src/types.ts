export type RelayMessageType =
  | "setup"
  | "prompt"
  | "interrupt"
  | "dtmf"
  | "error";

export interface SetupMessage {
  type: "setup";
  sessionId: string;
  callSid: string;
  from: string;
  to: string;
  direction: string;
  customParameters?: Record<string, string>;
}

export interface PromptMessage {
  type: "prompt";
  voicePrompt: string;
  lang?: string;
  last?: boolean;
}

export interface InterruptMessage {
  type: "interrupt";
  utteranceUntilInterrupt?: string;
}

export interface DtmfMessage {
  type: "dtmf";
  digit: string;
}

export type InboundMessage = SetupMessage | PromptMessage | InterruptMessage | DtmfMessage;

export interface TextResponse {
  type: "text";
  token: string;
  last: boolean;
}

export interface EndResponse {
  type: "end";
}

export interface AgentConfig {
  orgId: string;
  agentId: string;
  systemPrompt: string;
  welcomeGreeting: string;
  escalationPhone?: string;
  knowledgeContext?: string;
  contactMemory?: string;
}

export interface ToolCallResult {
  action?: "transfer" | "book_appointment" | "log_crm";
  transferPhone?: string;
  handoffSummary?: string;
  message?: string;
}
