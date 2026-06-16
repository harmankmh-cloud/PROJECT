import { describe, expect, it } from "vitest";
import { buildReviewUrl, normalizeAppUrl } from "@/lib/app-url";
import { slugify } from "@/lib/defaults";

describe("slugify", () => {
  it("lowercases and hyphenates business names", () => {
    expect(slugify("  Joe's Plumbing & HVAC  ")).toBe("joe-s-plumbing-hvac");
  });

  it("trims leading/trailing hyphens and caps length", () => {
    expect(slugify("---A---")).toBe("a");
    expect(slugify("x".repeat(60)).length).toBeLessThanOrEqual(48);
  });
});

describe("buildReviewUrl", () => {
  it("builds a canonical public review link", () => {
    expect(buildReviewUrl("https://ratelocal.ca/", "joes-plumbing")).toBe(
      "https://ratelocal.ca/r/joes-plumbing"
    );
  });

  it("normalizes a single trailing slash on the app URL", () => {
    expect(normalizeAppUrl("https://ratelocal.ca/")).toBe("https://ratelocal.ca");
  });
});
