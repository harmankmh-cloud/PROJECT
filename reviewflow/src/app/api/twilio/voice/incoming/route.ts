import {
  getCallLocalSettingsByTwilioNumber,
  getPublicAppUrl,
  logCallEvent,
} from "@/lib/calllocal-data";
import { readTwilioFormBody, twimlResponse, validateTwilioRequest } from "@/lib/twilio";

export async function POST(request: Request) {
  const { params, raw } = await readTwilioFormBody(request);

  if (!validateTwilioRequest(request, raw)) {
    return new Response("Invalid signature", { status: 403 });
  }

  const to = params.To || "";
  const from = params.From || "";
  const callSid = params.CallSid || null;

  const match = await getCallLocalSettingsByTwilioNumber(to);
  if (!match || !match.settings.ring_phone_e164) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">This line is not configured yet. Please try again later.</Say>
</Response>`;
    return twimlResponse(xml);
  }

  await logCallEvent({
    businessId: match.business.id,
    callSid,
    caller: from,
    status: "ringing",
  });

  const appUrl = getPublicAppUrl();
  const ringPhone = match.settings.ring_phone_e164.replace(/&/g, "&amp;");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="22" action="${appUrl}/api/twilio/voice/dial-status" method="POST">
    <Number>${ringPhone}</Number>
  </Dial>
</Response>`;

  return twimlResponse(xml);
}
