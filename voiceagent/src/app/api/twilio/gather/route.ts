import { NextRequest } from "next/server";
import {
  buildProcessingTwiml,
  buildSimpleVoiceTwiml,
  twimlResponse,
} from "@/lib/twilio";
import { getPublicAppUrl } from "@/lib/public-url";
import { storePendingSpeech } from "@/lib/pending-speech";

const LOW_CONFIDENCE = 0.45;

export async function POST(request: NextRequest) {
  const appUrl = getPublicAppUrl(request);
  const gatherUrl = `${appUrl}/api/twilio/gather`;
  const replyUrl = `${appUrl}/api/twilio/reply`;

  try {
    const formData = await request.formData();
    const to = String(formData.get("To") || "");
    const callSid = String(formData.get("CallSid") || "");
    const speech = String(formData.get("SpeechResult") || "").trim();
    const confidenceRaw = formData.get("Confidence");
    const confidence =
      confidenceRaw != null ? Number(confidenceRaw) : Number.NaN;

    if (!speech) {
      return twimlResponse(
        buildSimpleVoiceTwiml({
          message: "Sorry, I didn't catch that. Please repeat your question.",
          gatherUrl,
        })
      );
    }

    if (!Number.isNaN(confidence) && confidence < LOW_CONFIDENCE) {
      console.info("Low speech confidence", { callSid, speech, confidence });
      return twimlResponse(
        buildSimpleVoiceTwiml({
          message: `I heard "${speech}". Could you say that again a little slower?`,
          gatherUrl,
        })
      );
    }

    console.info("Speech captured", {
      callSid,
      speech,
      confidence: Number.isNaN(confidence) ? "n/a" : confidence,
    });

    storePendingSpeech(callSid, speech, to);

    return twimlResponse(buildProcessingTwiml({ replyUrl }));
  } catch (err) {
    console.error("Twilio gather webhook error:", err);
    return twimlResponse(
      buildSimpleVoiceTwiml({
        message: "Sorry, I had a brief issue. Please ask your question again.",
        gatherUrl,
      })
    );
  }
}
