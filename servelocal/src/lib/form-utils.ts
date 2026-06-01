import type { ServiceCategory } from "@/lib/types";
import { DEFAULT_SERVICE_CATEGORIES } from "@/lib/constants";

export function resolveCategories(categories: ServiceCategory[]): ServiceCategory[] {
  return categories.length > 0 ? categories : DEFAULT_SERVICE_CATEGORIES;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

export function isValidPhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  return digits.length === 10;
}

export function formatSubmitError(message: string): string {
  if (message === "Server not configured") {
    return "Quotes are temporarily unavailable — site database is still being connected. Please call a pro from the directory or try again soon.";
  }
  if (message.includes("row-level security") || message.includes("permission denied")) {
    return "Could not save your request — database permissions need updating. Please email us or try again later.";
  }
  if (message === "Check your form fields") {
    return "Please check your details — phone needs 10 digits and job description at least 10 characters.";
  }
  if (message === "Invalid category") {
    return "Please pick a service from the list.";
  }
  return message;
}

export function zodFieldError(error: unknown): string {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues: Array<{ path: string[]; message: string }> }).issues;
    const phoneIssue = issues.find((i) => i.path[0] === "customerPhone" || i.path[0] === "phone");
    if (phoneIssue) return "Enter a valid 10-digit phone number (e.g. 604-555-1234).";
    const descIssue = issues.find((i) => i.path[0] === "description");
    if (descIssue) return "Describe your job in at least 10 characters.";
    const categoryIssue = issues.find((i) => i.path[0] === "categorySlug");
    if (categoryIssue) return "Please pick a service from the list.";
  }
  return "Please check your form fields.";
}
