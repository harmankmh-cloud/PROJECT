#!/usr/bin/env python3
"""MCP server so Cursor agents can search the monorepo RAG index."""

from __future__ import annotations

import os
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))


def _load_dotenv() -> None:
    env_path = _ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def main() -> None:
    _load_dotenv()

    try:
        from mcp.server.fastmcp import FastMCP
    except ImportError as exc:
        raise SystemExit("Install MCP: pip install mcp httpx") from exc

    from project_rag.ask import ask
    from project_rag.indexer import index_all
    from project_rag.search import format_hits, search
    from project_rag.store import connect, init_db

    mcp = FastMCP(
        "project-rag",
        instructions=(
            "Search the monorepo knowledge base (RateLocal/reviewflow, ServeLocal/servelocal, docs). "
            "Call rag_search before large tasks. Call rag_reindex after major code changes."
        ),
    )

    @mcp.tool()
    def rag_search(query: str, project: str | None = None, limit: int = 8) -> str:
        """Keyword + semantic search across all indexed projects. project: reviewflow|servelocal|openrouter_chat|repo"""
        hits = search(query, limit=limit, project=project)
        if not hits:
            return "No results. Run rag_reindex if the codebase changed."
        return format_hits(hits)

    @mcp.tool()
    def rag_ask(question: str, project: str | None = None) -> str:
        """Ask a question answered from retrieved project context (uses OpenRouter if API key set)."""
        return ask(question, project=project)

    @mcp.tool()
    def rag_reindex() -> str:
        """Rebuild the full-text index from all projects (run after big merges)."""
        stats = index_all(clear=True)
        return f"Indexed {stats['files']} files, {stats['chunks']} chunks. Optional: run `python -m project_rag embed` for semantic search."

    @mcp.tool()
    def rag_stats() -> str:
        """Show index size and projects covered."""
        conn = connect()
        init_db(conn)
        chunks = conn.execute("SELECT COUNT(*) AS n FROM chunks").fetchone()["n"]
        embeds = conn.execute("SELECT COUNT(*) AS n FROM embeddings").fetchone()["n"]
        by_project = conn.execute(
            "SELECT project, COUNT(*) AS n FROM chunks GROUP BY project ORDER BY project"
        ).fetchall()
        conn.close()
        lines = [f"Chunks: {chunks}, Embeddings: {embeds}"]
        for row in by_project:
            lines.append(f"  - {row['project']}: {row['n']}")
        return "\n".join(lines)

    mcp.run()


if __name__ == "__main__":
    main()
