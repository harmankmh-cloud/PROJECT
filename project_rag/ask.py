from __future__ import annotations

import os

import httpx

from project_rag.config import OPENROUTER_CHAT_MODEL
from project_rag.search import format_hits, search

SYSTEM_PROMPT = """You are the Project Knowledge assistant for a monorepo with:
- RateLocal (reviewflow/) — QR review funnel for local businesses at ratelocal.ca
- ServeLocal (servelocal/) — BC trades directory at servelocal.ca
- OpenRouter chat utilities (openrouter_chat/)

Answer using ONLY the retrieved context below. If the context is insufficient, say what is missing and which file or area to check.
Cite paths like `servelocal/src/...` when referencing code.
"""


def ask(question: str, *, project: str | None = None, limit: int = 8) -> str:
    hits = search(question, limit=limit, project=project)
    context = format_hits(hits)

    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if not api_key or api_key.startswith("your_"):
        return (
            "OPENROUTER_API_KEY not set — showing search results only:\n\n"
            + (context or "No matches. Run: python -m project_rag index")
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.environ.get("OPENROUTER_APP_URL", "http://localhost:3000"),
        "X-Title": os.environ.get("OPENROUTER_APP_NAME", "Project RAG"),
    }

    user_content = f"Question: {question}\n\n## Retrieved context\n\n{context or '(no matches)'}"

    with httpx.Client(timeout=120.0) as client:
        response = client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json={
                "model": os.environ.get("OPENROUTER_MODEL", OPENROUTER_CHAT_MODEL),
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_content},
                ],
                "temperature": 0.2,
            },
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
