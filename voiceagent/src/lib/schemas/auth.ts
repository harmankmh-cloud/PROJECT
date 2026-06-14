import { z } from "zod";
import { isValidNanpPhone } from "@/lib/phone";

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    businessName: z.string().optional(),
    phone: z
      .string()
      .min(10, "Enter a valid business phone number")
      .refine(isValidNanpPhone, "Enter a valid Canadian or US phone number"),
    email: z.string().email("Enter a valid email address"),
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptedTerms: z.literal(true, { message: "You must accept the terms to continue" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const onboardingStep1Schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Select a business type"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .refine(isValidNanpPhone, "Enter a valid Canadian or US phone number"),
  city: z.string().min(2, "City is required"),
});

export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
