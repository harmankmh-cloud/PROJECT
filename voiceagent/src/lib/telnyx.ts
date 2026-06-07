import "server-only";

const TELNYX_API = "https://api.telnyx.com/v2";

export function getTelnyxApiKey() {
  return process.env.TELNYX_API_KEY || "";
}

export function isTelnyxConfigured() {
  return Boolean(getTelnyxApiKey());
}

export function encodeClientState(data: Record<string, string>) {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

export function decodeClientState(state?: string | null): Record<string, string> {
  if (!state) return {};
  try {
    return JSON.parse(Buffer.from(state, "base64").toString("utf8"));
  } catch {
    return {};
  }
}

async function telnyxPost(path: string, body: Record<string, unknown> = {}) {
  const apiKey = getTelnyxApiKey();
  if (!apiKey) throw new Error("TELNYX_API_KEY not configured");

  const res = await fetch(`${TELNYX_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telnyx API error ${res.status}: ${text}`);
  }

  return res.json().catch(() => ({}));
}

export async function answerCall(
  callControlId: string,
  options: {
    clientState?: string;
    streamUrl?: string;
  } = {}
) {
  const body: Record<string, unknown> = {
    client_state: options.clientState,
  };

  if (options.streamUrl) {
    body.stream_url = options.streamUrl;
    body.stream_track = "both_tracks";
    body.stream_bidirectional_mode = "rtp";
  }

  return telnyxPost(`/calls/${encodeURIComponent(callControlId)}/actions/answer`, body);
}

export async function startTranscription(callControlId: string) {
  return telnyxPost(`/calls/${encodeURIComponent(callControlId)}/actions/transcription_start`, {
    transcription_engine: "deepgram",
    language: "en",
    transcription_tracks: "inbound",
  });
}

export async function speakOnCall(callControlId: string, text: string) {
  return telnyxPost(`/calls/${encodeURIComponent(callControlId)}/actions/speak`, {
    payload: text,
    voice: "female",
    language: "en-US",
  });
}

export async function transferCall(callControlId: string, to: string, from?: string) {
  return telnyxPost(`/calls/${encodeURIComponent(callControlId)}/actions/transfer`, {
    to,
    from: from || process.env.TELNYX_PHONE_NUMBER,
  });
}

export async function hangupCall(callControlId: string) {
  return telnyxPost(`/calls/${encodeURIComponent(callControlId)}/actions/hangup`, {});
}

export async function dialOutbound(params: {
  to: string;
  from: string;
  connectionId: string;
  webhookUrl: string;
  clientState?: string;
}) {
  return telnyxPost("/calls", {
    connection_id: params.connectionId,
    to: params.to,
    from: params.from,
    webhook_url: params.webhookUrl,
    client_state: params.clientState,
  });
}
