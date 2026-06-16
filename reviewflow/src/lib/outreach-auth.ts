/** Shared secret check for Make / Activepieces marketing webhooks. Fails closed if unset. */
export function checkOutreachSecret(request: Request): boolean {
  const makeSecret = process.env.MAKE_WEBHOOK_SECRET?.trim() || null;
  const marketingSecret = process.env.ACTIVEPIECES_MARKETING_WEBHOOK_SECRET?.trim() || null;

  if (!makeSecret && !marketingSecret) return false;

  if (makeSecret) {
    const auth = request.headers.get("authorization");
    if (auth === `Bearer ${makeSecret}`) return true;

    const makeHeader = request.headers.get("x-make-secret");
    if (makeHeader === makeSecret) return true;
  }

  if (marketingSecret) {
    const rlHeader = request.headers.get("x-ratelocal-secret");
    if (rlHeader === marketingSecret) return true;

    const greetqCompat = request.headers.get("x-greetq-secret");
    if (greetqCompat === marketingSecret) return true;
  }

  return false;
}

export function outreachUnauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
