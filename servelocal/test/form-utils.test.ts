import { describe, expect, it } from "vitest";
import { friendlyAuthError } from "@/lib/auth-errors";
import { formatSubmitError, isValidPhone, normalizePhone } from "@/lib/form-utils";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("creates URL-safe provider slugs", () => {
    expect(slugify("  Maple Leaf Electric Ltd. ")).toBe("maple-leaf-electric-ltd");
  });
});

describe("normalizePhone", () => {
  it("strips formatting and leading country code", () => {
    expect(normalizePhone("+1 (604) 555-1234")).toBe("6045551234");
  });

  it("validates 10-digit numbers", () => {
    expect(isValidPhone("604-555-1234")).toBe(true);
    expect(isValidPhone("60455")).toBe(false);
  });
});

describe("formatSubmitError", () => {
  it("maps RLS errors to a user-safe message", () => {
    expect(formatSubmitError("permission denied for table service_requests")).toContain(
      "database permissions"
    );
  });

  it("maps invalid category errors", () => {
    expect(formatSubmitError("Invalid category")).toBe("Please pick a service from the list.");
  });
});

describe("friendlyAuthError", () => {
  it("maps invalid credentials to plain language", () => {
    expect(friendlyAuthError("Invalid login credentials")).toBe("Wrong email or password. Try again.");
  });

  it("maps expired OTP links", () => {
    expect(friendlyAuthError("Email link is invalid or has expired")).toContain("expired");
  });
});
