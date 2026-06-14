import { z } from "zod";

const bookingStatusSchema = z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]);
const paymentStatusSchema = z.enum(["held", "released", "refunded", "failed"]);

export const bookingRowSchema = z.object({
  id: z.string().uuid(),
  provider_id: z.string().uuid(),
  customer_name: z.string(),
  customer_email: z.string(),
  customer_phone: z.string().nullable().optional(),
  service_description: z.string(),
  scheduled_at: z.string().nullable().optional(),
  status: bookingStatusSchema,
  base_amount_cents: z.number(),
  addons_cents: z.number(),
  platform_fee_cents: z.number(),
  tax_cents: z.number(),
  total_cents: z.number(),
  payment_status: paymentStatusSchema,
  user_id: z.string().uuid().nullable().optional(),
  stripe_session_id: z.string().nullable().optional(),
  stripe_payment_intent_id: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  service_providers: z
    .object({
      display_name: z.string().optional(),
      slug: z.string().optional(),
      category_slug: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export function parseBooking(row: unknown) {
  const parsed = bookingRowSchema.safeParse(row);
  return parsed.success ? parsed.data : null;
}
