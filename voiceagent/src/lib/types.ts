export type Plan = "starter" | "growth" | "pro" | "enterprise";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: Plan;
  stripe_customer_id: string | null;
  transfer_phone: string | null;
  data_region: "us" | "eu";
  white_label: Record<string, unknown>;
  hipaa_enabled: boolean;
  recording_retention_days: number;
}

export interface Agent {
  id: string;
  org_id: string;
  name: string;
  system_prompt: string;
  welcome_greeting: string;
  voice: string;
  language: string;
  is_active: boolean;
  escalation_phone: string | null;
  knowledge_base_enabled: boolean;
}

export interface Call {
  id: string;
  org_id: string;
  agent_id: string | null;
  twilio_call_sid: string | null;
  direction: "inbound" | "outbound";
  from_number: string | null;
  to_number: string | null;
  status: string;
  duration_seconds: number;
  cost_cents: number;
  contained: boolean | null;
  transferred: boolean;
  transfer_reason: string | null;
  handoff_payload: Record<string, unknown> | null;
  sentiment: string | null;
  intent: string | null;
  summary: string | null;
  score: number | null;
  topics: string[] | null;
  action_items: string[] | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface FlowNode {
  id: string;
  type: "greet" | "ask" | "branch" | "tool" | "transfer" | "end";
  label: string;
  config: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}
