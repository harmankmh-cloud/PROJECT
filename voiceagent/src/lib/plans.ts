export const PLANS = {
  starter: {
    name: "Starter",
    monthlyPrice: 99,
    perMinute: 0.12,
    concurrentCalls: 5,
    features: ["1 agent", "Inbound calls", "Call logs", "Basic analytics"],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 499,
    perMinute: 0.09,
    concurrentCalls: 20,
    features: ["5 agents", "Flow builder", "HubSpot + Calendar", "Warm transfer", "Outbound campaigns"],
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 2000,
    perMinute: 0.06,
    concurrentCalls: 1000,
    features: ["Unlimited agents", "SSO", "HIPAA", "White-label", "EU residency", "SLA"],
  },
} as const;
