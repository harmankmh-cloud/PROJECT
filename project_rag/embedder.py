from __future__ import annotations

import math
import os
from typing import Iterable

import httpx

from project_rag.config import OPENROUTER_EMBED_MODEL
from project_rag.store import connect, init_db, load_all_embeddings, save_embedding


def _cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b, strict=True))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def embed_texts(texts: list[str]) -> list[list[float]]:
    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if not api_key or api_key.startswith("your_"):
        raise RuntimeError("OPENROUTER_API_KEY not set — keyword search still works without embeddings")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    app_url = os.environ.get("OPENROUTER_APP_URL", "http://localhost:3000")
    app_name = os.environ.get("OPENROUTER_APP_NAME", "Project RAG")
    headers["HTTP-Referer"] = app_url
    headers["X-Title"] = app_name

    vectors: list[list[float]] = []
    batch_size = 16

    with httpx.Client(timeout=120.0) as client:
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            response = client.post(
                "https://openrouter.ai/api/v1/embeddings",
                headers=headers,
                json={"model": OPENROUTER_EMBED_MODEL, "input": batch},
            )
            response.raise_for_status()
            data = response.json()["data"]
            data.sort(key=lambda item: item["index"])
            vectors.extend(item["embedding"] for item in data)

    return vectors


def embed_index(*, limit: int | None = None) -> int:
    conn = connect()
    init_db(conn)

    rows = conn.execute(
        """
        SELECT c.id, c.content
        FROM chunks c
        LEFT JOIN embeddings e ON e.chunk_id = c.id
        WHERE e.chunk_id IS NULL
        ORDER BY c.id
        """
    ).fetchall()

    if limit is not None:
        rows = rows[:limit]

    if not rows:
        conn.close()
        return 0

    ids = [int(r["id"]) for r in rows]
    texts = [str(r["content"])[:8000] for r in rows]

    vectors = embed_texts(texts)
    for chunk_id, vector in zip(ids, vectors, strict=True):
        save_embedding(conn, chunk_id, vector)

    conn.commit()
    conn.close()
    return len(ids)


def vector_search(query: str, limit: int = 10) -> list[tuple[int, float]]:
    query_vec = embed_texts([query])[0]
    conn = connect()
    init_db(conn)
    stored = load_all_embeddings(conn)
    conn.close()

    scored: list[tuple[int, float]] = []
    for chunk_id, vec in stored:
        scored.append((chunk_id, _cosine(query_vec, vec)))

    scored.sort(key=lambda item: item[1], reverse=True)
    return scored[:limit]
