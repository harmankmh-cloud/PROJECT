import {
  DEFAULT_AGENT_LANGUAGE,
  DEFAULT_AGENT_LLM_MODEL,
  DEFAULT_AGENT_PERSONA,
  DEFAULT_AGENT_VOICE,
  DEFAULT_AGENT_VOICE_ID,
  DEFAULT_AGENT_VOICE_PROVIDER,
} from "./agent-defaults";
import type { Agent } from "./types";
import type { AgentFormValues } from "@/components/dashboard/AgentConfigureForm";

export function agentToFormValues(agent: Agent): AgentFormValues {
  return {
    name: agent.name,
    system_prompt: agent.system_prompt || "",
    welcome_greeting: agent.welcome_greeting || "",
    escalation_phone: agent.escalation_phone || "",
    voice: agent.voice || DEFAULT_AGENT_VOICE,
    voice_provider: agent.voice_provider || DEFAULT_AGENT_VOICE_PROVIDER,
    voice_id: agent.voice_id || DEFAULT_AGENT_VOICE_ID,
    language: agent.language || DEFAULT_AGENT_LANGUAGE,
    llm_model: agent.llm_model || DEFAULT_AGENT_LLM_MODEL,
    temperature: agent.temperature ?? 0.2,
    max_tokens: agent.max_tokens ?? 50,
    persona_template: agent.persona_template || DEFAULT_AGENT_PERSONA,
    knowledge_base_enabled: agent.knowledge_base_enabled,
  };
}

export function formValuesToPayload(values: AgentFormValues) {
  return {
    name: values.name,
    system_prompt: values.system_prompt,
    welcome_greeting: values.welcome_greeting,
    escalation_phone: values.escalation_phone || null,
    voice: values.voice,
    voice_provider: values.voice_provider,
    voice_id: values.voice_id,
    language: values.language,
    llm_model: values.llm_model || null,
    temperature: values.temperature,
    max_tokens: values.max_tokens,
    persona_template: values.persona_template,
    knowledge_base_enabled: values.knowledge_base_enabled,
  };
}
