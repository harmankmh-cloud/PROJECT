import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const homeownerSignupSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  city: z.string().min(1, "Select your city"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const onboardingStep1Schema = z.object({
  name: z.string().min(2, "Enter your name"),
  businessName: z.string().min(2, "Enter your business name"),
  categorySlug: z.string().min(1, "Select your trade"),
  citySlug: z.string().min(1, "Select your city"),
});

export const onboardingStep4Schema = z.object({
  services: z.array(z.string()).min(1, "Select at least one service"),
  hourlyMin: z.coerce.number().min(0).optional(),
  hourlyMax: z.coerce.number().min(0).optional(),
});

export const onboardingStep5Schema = z.object({
  licenseNumber: z.string().optional(),
  wcbNumber: z.string().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type HomeownerSignupData = z.infer<typeof homeownerSignupSchema>;
export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
