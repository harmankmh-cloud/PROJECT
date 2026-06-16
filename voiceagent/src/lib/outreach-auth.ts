import { envSecret } from "@/lib/webhook-secrets";

/** Shared secret check for Make / Activepieces marketing webhooks. Fails closed if unset. */
export function checkOutreachSecret(request: Request): boolean {
  const makeSecret = envSecret("MAKE_WEBHOOK_SECRET");
  const marketingSecret = envSecret("ACTIVEPIECES_MARKETING_WEBHOOK_SECRET");

  if (!makeSecret && !marketingSecret) return false;

  if (makeSecret) {
    const auth = request.headers.get("authorization");
    if (auth === `Bearer ${makeSecret}`) return true;

    const makeHeader = request.headers.get("x-make-secret");
    if (makeHeader === makeSecret) return true;
  }

  if (marketingSecret) {
    const greetqHeader = request.headers.get("x-greetq-secret");
    if (greetqHeader === marketingSecret) return true;
  }

  return false;
}

export function outreachUnauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
