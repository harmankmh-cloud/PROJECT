import { z } from "zod";

export const serviceRequestRowSchema = z.object({
  id: z.string().uuid(),
  category_slug: z.string(),
  city_slug: z.string(),
  customer_name: z.string(),
  customer_phone: z.string(),
  customer_email: z.string().nullable().optional(),
  description: z.string(),
  status: z.string(),
  created_at: z.string(),
  user_id: z.string().uuid().nullable().optional(),
  urgency: z.string().nullable().optional(),
  budget_min: z.number().nullable().optional(),
  budget_max: z.number().nullable().optional(),
});

export function parseServiceRequest(row: unknown) {
  const parsed = serviceRequestRowSchema.safeParse(row);
  return parsed.success ? parsed.data : null;
}

export function parseServiceRequests(rows: unknown[]) {
  return rows.map(parseServiceRequest).filter((r) => r !== null);
}
