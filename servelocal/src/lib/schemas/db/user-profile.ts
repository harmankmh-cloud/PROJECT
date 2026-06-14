import { z } from "zod";

export const userProfileRowSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["homeowner", "pro"]),
  display_name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  created_at: z.string(),
  onboarding_completed_at: z.string().nullable().optional(),
  onboarding_step: z.number().nullable().optional(),
  notification_email: z.boolean().nullable().optional(),
  notification_sms: z.boolean().nullable().optional(),
  preferred_city_slug: z.string().nullable().optional(),
});

export function parseUserProfile(row: unknown) {
  const parsed = userProfileRowSchema.safeParse(row);
  return parsed.success ? parsed.data : null;
}
