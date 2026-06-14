import "server-only";
import { getTelnyxApiKey, telnyxGet } from "./telnyx";

const TELNYX_API = "https://api.telnyx.com/v2";

async function telnyxRequest(path: string, options: RequestInit = {}) {
  const apiKey = getTelnyxApiKey();
  if (!apiKey) throw new Error("TELNYX_API_KEY not configured");

  const res = await fetch(`${TELNYX_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telnyx API error ${res.status}: ${text}`);
  }

  return res.json();
}

export type AvailableNumber = {
  phone_number: string;
  region: string;
  monthly_cost_cents: number;
};

export async function searchAvailableNumbers(params: {
  areaCode?: string;
  country?: string;
  limit?: number;
}): Promise<AvailableNumber[]> {
  const country = params.country || "US";
  const filter = params.areaCode
    ? `filter[national_destination_code]=${params.areaCode}`
    : "filter[features][]=voice";

  const data = await telnyxRequest(
    `/available_phone_numbers?filter[country_code]=${country}&${filter}&filter[limit]=${params.limit || 10}`
  );

  const items = (data?.data || []) as Array<{
    phone_number: string;
    region_information?: Array<{ region_name?: string }>;
    cost_information?: { monthly_cost?: string };
  }>;

  return items.map((item) => ({
    phone_number: item.phone_number,
    region: item.region_information?.[0]?.region_name || country,
    monthly_cost_cents: Math.round(Number(item.cost_information?.monthly_cost || 1) * 100),
  }));
}

export async function purchasePhoneNumber(params: {
  phoneNumber: string;
  connectionId?: string;
}) {
  const connectionId = params.connectionId || process.env.TELNYX_CONNECTION_ID;
  if (!connectionId) throw new Error("TELNYX_CONNECTION_ID not configured");

  return telnyxRequest("/number_orders", {
    method: "POST",
    body: JSON.stringify({
      phone_numbers: [{ phone_number: params.phoneNumber }],
      connection_id: connectionId,
    }),
  });
}

export async function listOwnedNumbers() {
  const data = await telnyxGet("/phone_numbers?page[size]=50");
  return (data?.data || []) as Array<{
    id: string;
    phone_number: string;
    status: string;
  }>;
}
