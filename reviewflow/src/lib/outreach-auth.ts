/** Shared secret check for Make / Activepieces marketing webhooks. */
export function checkOutreachSecret(request: Request): boolean {
  const makeSecret = process.env.MAKE_WEBHOOK_SECRET?.trim();
  const marketingSecret =
    process.env.ACTIVEPIECES_MARKETING_WEBHOOK_SECRET?.trim() || "ratelocal-marketing-webhook-2026";

  const auth = request.headers.get("authorization");
  if (makeSecret && auth === `Bearer ${makeSecret}`) return true;

  const makeHeader = request.headers.get("x-make-secret");
  if (makeSecret && makeHeader === makeSecret) return true;

  const rlHeader = request.headers.get("x-ratelocal-secret");
  if (rlHeader === marketingSecret) return true;

  const greetqCompat = request.headers.get("x-greetq-secret");
  if (greetqCompat === marketingSecret) return true;

  return false;
}

export function outreachUnauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
