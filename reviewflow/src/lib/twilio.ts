import twilio from "twilio";

export function isTwilioConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  );
}

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}

export function validateTwilioRequest(request: Request, body: string): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get("x-twilio-signature");
  if (!token || !signature) return process.env.NODE_ENV !== "production";

  const url = request.url;
  try {
    const params = Object.fromEntries(new URLSearchParams(body));
    return twilio.validateRequest(token, signature, url, params);
  } catch {
    return false;
  }
}

export async function readTwilioFormBody(request: Request): Promise<{ params: Record<string, string>; raw: string }> {
  const raw = await request.text();
  const params = Object.fromEntries(new URLSearchParams(raw));
  return { params, raw };
}

export function twimlResponse(xml: string) {
  return new Response(xml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function sendSms(from: string, to: string, body: string) {
  const client = getTwilioClient();
  if (!client) throw new Error("Twilio not configured");

  return client.messages.create({
    from,
    to,
    body: body.slice(0, 1600),
  });
}
