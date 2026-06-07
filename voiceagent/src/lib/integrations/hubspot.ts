import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

async function getHubSpotToken(orgId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("va_integrations")
    .select("access_token")
    .eq("org_id", orgId)
    .eq("provider", "hubspot")
    .eq("is_active", true)
    .maybeSingle();

  return data?.access_token || null;
}

export async function logHubSpotCall(
  orgId: string,
  params: { phone: string; summary: string; agentId?: string }
) {
  const token = await getHubSpotToken(orgId);
  if (!token || !params.phone) return { ok: false, reason: "no_integration" };

  let contactId: string | null = null;

  const searchRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            { propertyName: "phone", operator: "EQ", value: params.phone },
          ],
        },
      ],
    }),
  });

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    contactId = searchData.results?.[0]?.id || null;
  }

  if (!contactId) {
    const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: { phone: params.phone },
      }),
    });
    if (createRes.ok) {
      const created = await createRes.json();
      contactId = created.id;
    }
  }

  if (!contactId) return { ok: false, reason: "contact_failed" };

  const noteRes = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        hs_note_body: `[VoiceAgent] ${params.summary}`,
        hs_timestamp: new Date().toISOString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
        },
      ],
    }),
  });

  return { ok: noteRes.ok };
}

export function getHubSpotAuthUrl(orgId: string) {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI;
  if (!clientId || !redirectUri) return null;

  const scopes = ["crm.objects.contacts.read", "crm.objects.contacts.write", "crm.objects.notes.write"];
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    state: orgId,
  });

  return `https://app.hubspot.com/oauth/authorize?${params}`;
}
