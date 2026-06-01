from __future__ import annotations

from dataclasses import dataclass

from project_rag.embedder import vector_search
from project_rag.store import connect, fts_search, get_chunks_by_ids, init_db


@dataclass
class SearchHit:
    id: int
    project: str
    path: str
    kind: str
    title: str
    content: str
    line_start: int
    line_end: int
    score: float
    source: str


def _row_to_hit(row, score: float, source: str) -> SearchHit:
    return SearchHit(
        id=int(row["id"]),
        project=str(row["project"]),
        path=str(row["path"]),
        kind=str(row["kind"]),
        title=str(row["title"]),
        content=str(row["content"]),
        line_start=int(row["line_start"]),
        line_end=int(row["line_end"]),
        score=score,
        source=source,
    )


def search(query: str, *, limit: int = 10, project: str | None = None, semantic: bool = True) -> list[SearchHit]:
    conn = connect()
    init_db(conn)

    hits: dict[int, SearchHit] = {}

    for row in fts_search(conn, query, limit=limit * 2, project=project):
        cid = int(row["id"])
        rank = float(row["rank"]) if row["rank"] is not None else 0.0
        # bm25 returns negative — lower is better
        score = -rank
        hits[cid] = _row_to_hit(row, score, "keyword")

    conn.close()

    if semantic:
        try:
            for chunk_id, sim in vector_search(query, limit=limit * 2):
                if chunk_id in hits:
                    hits[chunk_id].score += sim * 2.0
                    hits[chunk_id].source = "hybrid"
                else:
                    conn = connect()
                    rows = get_chunks_by_ids(conn, [chunk_id])
                    conn.close()
                    if rows:
                        if project and str(rows[0]["project"]) != project:
                            continue
                        hits[chunk_id] = _row_to_hit(rows[0], sim, "semantic")
        except RuntimeError:
            pass

    ranked = sorted(hits.values(), key=lambda h: h.score, reverse=True)
    return ranked[:limit]


def format_hits(hits: list[SearchHit], *, max_chars: int = 12000) -> str:
    parts: list[str] = []
    used = 0

    for i, hit in enumerate(hits, start=1):
        block = (
            f"### [{i}] {hit.project} — `{hit.path}` (L{hit.line_start}-{hit.line_end}, {hit.source})\n"
            f"{hit.content.strip()}\n"
        )
        if used + len(block) > max_chars:
            break
        parts.append(block)
        used += len(block)

    return "\n".join(parts)
