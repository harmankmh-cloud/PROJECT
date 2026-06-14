import { getCallLocalSettingsByTwilioNumber, logSms } from "@/lib/calllocal-data";
import { readTwilioFormBody, validateTwilioRequest } from "@/lib/twilio";

export async function POST(request: Request) {
  const { params, raw } = await readTwilioFormBody(request);

  if (!validateTwilioRequest(request, raw)) {
    return new Response("Invalid signature", { status: 403 });
  }

  const to = params.To || "";
  const from = params.From || "";
  const body = params.Body || "";
  const messageSid = params.MessageSid || undefined;

  const match = await getCallLocalSettingsByTwilioNumber(to);
  if (match && body) {
    await logSms({
      businessId: match.business.id,
      direction: "inbound",
      from,
      to,
      body,
      messageSid,
    });
  }

  return new Response("", { status: 204 });
}
