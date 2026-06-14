export const TCPA_DISCLOSURE =
  "By providing your phone number and checking this box, you consent to receive automated calls and texts from us at the number provided, including AI-generated voice calls. Consent is not a condition of purchase. Message and data rates may apply.";

export const HIPAA_CONTROLS = {
  encryptionAtRest: "AES-256",
  encryptionInTransit: "TLS 1.2+",
  defaultRetentionDays: 30,
  baaRequired: true,
  noModelTraining: true,
} as const;

export const SOC2_CHECKLIST = [
  "Access control policies documented",
  "Encryption at rest and in transit enabled",
  "Audit logging for all config changes",
  "Incident response plan documented",
  "Vendor sub-processor list maintained",
  "Annual penetration test scheduled",
  "Employee security training completed",
] as const;
