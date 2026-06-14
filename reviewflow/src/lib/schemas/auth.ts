import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(2, "Business name is required"),
  phone: z.string().optional(),
  termsAccepted: z.literal(true, { message: "Accept Terms and Privacy Policy" }),
});

export const onboardingStep1Schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(2, "Select a category"),
  city: z.string().min(2, "City is required"),
  phone: z.string().optional(),
});

export const onboardingStep2Schema = z.object({
  googleReviewUrl: z.string().min(1, "Google review link is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
