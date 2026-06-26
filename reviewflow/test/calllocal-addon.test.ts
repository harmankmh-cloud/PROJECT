import { describe, expect, it } from "vitest";
import { subscriptionHasActiveCallLocal } from "@/lib/calllocal-addon";

const CALLLOCAL_PRICE = "price_calllocal";

function sub(status: string, priceIds: string[]) {
  return {
    status,
    items: { data: priceIds.map((id) => ({ price: { id } })) },
  } as unknown as Parameters<typeof subscriptionHasActiveCallLocal>[0];
}

describe("subscriptionHasActiveCallLocal", () => {
  it("is true when active and the add-on price is present", () => {
    expect(subscriptionHasActiveCallLocal(sub("active", ["price_monthly", CALLLOCAL_PRICE]), CALLLOCAL_PRICE)).toBe(true);
  });

  it("is true when trialing and the add-on price is present", () => {
    expect(subscriptionHasActiveCallLocal(sub("trialing", [CALLLOCAL_PRICE]), CALLLOCAL_PRICE)).toBe(true);
  });

  it("is false when the add-on price is absent", () => {
    expect(subscriptionHasActiveCallLocal(sub("active", ["price_monthly"]), CALLLOCAL_PRICE)).toBe(false);
  });

  it("is false when the subscription is not active", () => {
    expect(subscriptionHasActiveCallLocal(sub("canceled", [CALLLOCAL_PRICE]), CALLLOCAL_PRICE)).toBe(false);
  });

  it("is false when no add-on price id is configured", () => {
    expect(subscriptionHasActiveCallLocal(sub("active", [CALLLOCAL_PRICE]), "")).toBe(false);
  });
});
