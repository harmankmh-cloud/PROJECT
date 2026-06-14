import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { cosineSimilarity, embedText } from "@/lib/embeddings";

type KnowledgeDoc = {
  title: string;
  content: string;
  agent_id: string | null;
  embedding?: number[] | string | null;
};

function parseEmbedding(raw: number[] | string | null | undefined): number[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as number[];
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

function keywordRank(docs: KnowledgeDoc[], query?: string) {
  if (!query?.trim()) return docs;
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  return [...docs].sort((a, b) => {
    const score = (doc: KnowledgeDoc) => {
      const text = `${doc.title} ${doc.content}`.toLowerCase();
      return terms.reduce((s, term) => s + (text.includes(term) ? 1 : 0), 0);
    };
    return score(b) - score(a);
  });
}

export async function loadKnowledgeContext(orgId: string, agentId?: string, query?: string) {
  const admin = createAdminClient();

  const { data: docs, error } = await admin
    .from("va_knowledge_docs")
    .select("title, content, agent_id, embedding")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !docs?.length) return "";

  const scoped = (docs as KnowledgeDoc[]).filter(
    (d) => !d.agent_id || !agentId || d.agent_id === agentId
  );

  let ranked = scoped;

  if (query?.trim()) {
    const queryEmbedding = await embedText(query);
    const withVectors = scoped.filter((d) => parseEmbedding(d.embedding));

    if (queryEmbedding && withVectors.length >= 2) {
      ranked = [...withVectors].sort((a, b) => {
        const ea = parseEmbedding(a.embedding)!;
        const eb = parseEmbedding(b.embedding)!;
        return cosineSimilarity(queryEmbedding, eb) - cosineSimilarity(queryEmbedding, ea);
      });
    } else {
      ranked = keywordRank(scoped, query);
    }
  }

  return ranked
    .slice(0, 3)
    .map((d) => `## ${d.title}\n${String(d.content).slice(0, 400)}`)
    .join("\n\n")
    .slice(0, 1500);
}
