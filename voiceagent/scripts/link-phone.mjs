import { createClient } from "@supabase/supabase-js";

const USER_ID = process.argv[2] || process.env.VA_OWNER_ID;
const PHONE = process.argv[3] || process.env.TELNYX_PHONE_NUMBER || "+12533989947";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!USER_ID) {
  console.error("Usage: node --env-file=.env.local scripts/link-phone.mjs <user-id> [phone-number]");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let { data: org, error: orgLookupError } = await supabase
  .from("va_organizations")
  .select("id")
  .eq("owner_id", USER_ID)
  .maybeSingle();

if (orgLookupError) {
  console.error("Org lookup error:", orgLookupError.message);
  if (orgLookupError.message.includes("permission denied")) {
    console.error("\nFix:");
    console.error("1. In .env.local use SUPABASE_SERVICE_ROLE_KEY (not the anon key)");
    console.error("   Supabase → Project Settings → API → service_role secret");
    console.error("2. Run supabase/fix-grants.sql in Supabase SQL Editor");
  }
  process.exit(1);
}

if (!org) {
  const res = await supabase
    .from("va_organizations")
    .insert({
      name: "My Organization",
      slug: `org-${USER_ID.slice(0, 8)}`,
      owner_id: USER_ID,
    })
    .select()
    .single();

  if (res.error) {
    console.error("Org error:", res.error.message);
    process.exit(1);
  }

  org = res.data;
  console.log("Created org:", org.id);
} else {
  console.log("Org exists:", org.id);
}

let { data: agent, error: agentLookupError } = await supabase
  .from("va_agents")
  .select("id")
  .eq("org_id", org.id)
  .maybeSingle();

if (agentLookupError) {
  console.error("Agent lookup error:", agentLookupError.message);
  process.exit(1);
}

if (!agent) {
  const res = await supabase
    .from("va_agents")
    .insert({
      org_id: org.id,
      name: "Default Agent",
      system_prompt:
        "You are a friendly phone assistant for a local business. Help callers with questions, book appointments, and transfer to a human when needed. Keep answers brief.",
      welcome_greeting: "Hello! Thanks for calling. How can I help you today?",
    })
    .select()
    .single();

  if (res.error) {
    console.error("Agent error:", res.error.message);
    process.exit(1);
  }

  agent = res.data;
  console.log("Created agent:", agent.id);
} else {
  console.log("Agent exists:", agent.id);
}

const phoneRes = await supabase
  .from("va_phone_numbers")
  .upsert(
    {
      org_id: org.id,
      agent_id: agent.id,
      phone_number: PHONE,
      label: "Main line",
    },
    { onConflict: "phone_number" }
  )
  .select()
  .single();

if (phoneRes.error) {
  console.error("Phone error:", phoneRes.error.message);
  process.exit(1);
}

console.log("Phone linked:", phoneRes.data.phone_number);
console.log("Done!");
