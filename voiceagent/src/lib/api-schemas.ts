import { z } from "zod";

export const agentCreateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  system_prompt: z.string().max(32_000).optional(),
  welcome_greeting: z.string().max(2_000).optional(),
  voice: z.string().max(80).optional(),
  voice_provider: z.enum(["telnyx", "polly", "elevenlabs"]).optional(),
  voice_id: z.string().max(120).optional(),
  language: z.string().max(16).optional(),
  llm_model: z.string().max(120).nullable().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(4096).optional(),
  persona_template: z.string().max(64).optional(),
  escalation_phone: z.string().max(32).nullable().optional(),
  is_active: z.boolean().optional(),
  knowledge_base_enabled: z.boolean().optional(),
});

export const agentPatchSchema = agentCreateSchema.extend({
  id: z.string().uuid(),
});

export const flowCreateSchema = z.object({
  agent_id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120).optional(),
  nodes: z.array(z.record(z.string(), z.unknown())).optional(),
  edges: z.array(z.record(z.string(), z.unknown())).optional(),
  is_published: z.boolean().optional(),
});

export const flowPatchSchema = flowCreateSchema.extend({
  id: z.string().uuid(),
});

export const flowDeleteSchema = z.object({
  id: z.string().uuid(),
});

export const channelPatchSchema = z.object({
  channel_type: z.enum(["sms", "whatsapp", "web_chat"]),
  is_active: z.boolean(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const teamInviteSchema = z.object({
  email: z.string().email().max(254),
  role: z.enum(["admin", "operator", "viewer"]).optional(),
});

export const teamMemberPatchSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["admin", "operator", "viewer"]),
});

export const teamMemberDeleteSchema = z.object({
  user_id: z.string().uuid(),
});

export const apiKeyCreateSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export const apiKeyDeleteSchema = z.object({
  id: z.string().uuid(),
});

export const campaignCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  agent_id: z.string().uuid().optional(),
  contact_list: z.array(z.object({ phone: z.string().min(10).max(20) })).optional(),
  schedule_at: z.string().max(64).nullable().optional(),
  calling_hours: z.record(z.string(), z.unknown()).optional(),
});

export const phoneNumberPurchaseSchema = z.object({
  phone_number: z.string().trim().min(10).max(20),
  agent_id: z.string().uuid().nullable().optional(),
});

export const knowledgeCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(100_000),
  agent_id: z.string().uuid().nullable().optional(),
  source_url: z.union([z.string().url().max(2048), z.literal("")]).nullable().optional(),
});

export const knowledgeDeleteSchema = z.object({
  id: z.string().uuid(),
});

export const phoneNumberSearchSchema = z.object({
  area_code: z.string().regex(/^\d{3}$/).optional(),
  country: z.string().length(2).optional(),
});
