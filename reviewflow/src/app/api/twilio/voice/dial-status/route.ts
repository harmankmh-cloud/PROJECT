import {
  buildBusinessReviewLink,
  getCallLocalSettingsByTwilioNumber,
  logCallEvent,
  logSms,
  renderSmsTemplate,
} from "@/lib/calllocal-data";
import { readTwilioFormBody, sendSms, twimlResponse, validateTwilioRequest } from "@/lib/twilio";

const MISSED_STATUSES = new Set(["no-answer", "busy", "failed", "canceled"]);

export async function POST(request: Request) {
  const { params, raw } = await readTwilioFormBody(request);

  if (!validateTwilioRequest(request, raw)) {
    return new Response("Invalid signature", { status: 403 });
  }

  const dialStatus = params.DialCallStatus || "";
  const to = params.To || "";
  const from = params.From || "";
  const callSid = params.CallSid || null;

  if (MISSED_STATUSES.has(dialStatus)) {
    const match = await getCallLocalSettingsByTwilioNumber(to);
    if (match && match.settings.twilio_phone_e164) {
      const link = await buildBusinessReviewLink(match.business.slug);
      const message = renderSmsTemplate(match.settings.sms_template, {
        business_name: match.business.name,
        link,
        caller_phone: from,
      });

      let smsSentToCaller = false;
      let smsSentToOwner = false;

      try {
        if (from) {
          await sendSms(match.settings.twilio_phone_e164, from, message);
          smsSentToCaller = true;
          await logSms({
            businessId: match.business.id,
            direction: "outbound",
            from: match.settings.twilio_phone_e164,
            to: from,
            body: message,
          });
        }
      } catch {
        // logged without sms flag
      }

      if (match.settings.notify_owner_on_missed && match.settings.ring_phone_e164 && from) {
        try {
          const ownerMsg = `Missed call on CallLocal from ${from}. They were texted automatically.`;
          await sendSms(match.settings.twilio_phone_e164, match.settings.ring_phone_e164, ownerMsg);
          smsSentToOwner = true;
        } catch {
          // ignore
        }
      }

      await logCallEvent({
        businessId: match.business.id,
        callSid,
        caller: from,
        status: "missed",
        smsSentToCaller,
        smsSentToOwner,
      });
    }
  } else if (dialStatus === "completed") {
    const match = await getCallLocalSettingsByTwilioNumber(to);
    if (match) {
      await logCallEvent({
        businessId: match.business.id,
        callSid,
        caller: from,
        status: "answered",
      });
    }
  }

  return twimlResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
}
