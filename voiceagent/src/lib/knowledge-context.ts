import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function loadKnowledgeContext(orgId: string, agentId?: string, query?: string) {
  const admin = createAdminClient();

  const { data: docs, error } = await admin
    .from("va_knowledge_docs")
    .select("title, content, agent_id")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !docs?.length) return "";

  const scoped = docs.filter((d) => !d.agent_id || !agentId || d.agent_id === agentId);

  let ranked = scoped;
  if (query?.trim()) {
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    ranked = [...scoped].sort((a, b) => {
      const score = (doc: typeof a) => {
        const text = `${doc.title} ${doc.content}`.toLowerCase();
        return terms.reduce((s, term) => s + (text.includes(term) ? 1 : 0), 0);
      };
      return score(b) - score(a);
    });
  }

  return ranked
    .slice(0, 3)
    .map((d) => `## ${d.title}\n${String(d.content).slice(0, 400)}`)
    .join("\n\n")
    .slice(0, 1500);
}
