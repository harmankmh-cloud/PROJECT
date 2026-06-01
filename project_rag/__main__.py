from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow running from repo root
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))


def load_dotenv() -> None:
    env_path = _ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        import os

        os.environ.setdefault(key.strip(), value.strip())


def main() -> None:
    load_dotenv()

    parser = argparse.ArgumentParser(description="Project RAG — search all monorepo knowledge")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("index", help="Rebuild keyword index from all projects")

    p_embed = sub.add_parser("embed", help="Compute semantic embeddings (needs OPENROUTER_API_KEY)")
    p_embed.add_argument("--limit", type=int, default=None)

    p_search = sub.add_parser("search", help="Search indexed knowledge")
    p_search.add_argument("query")
    p_search.add_argument("--project", choices=["reviewflow", "servelocal", "openrouter_chat", "repo"])
    p_search.add_argument("--limit", type=int, default=8)
    p_search.add_argument("--json", action="store_true")

    p_ask = sub.add_parser("ask", help="Search + answer with OpenRouter")
    p_ask.add_argument("question")
    p_ask.add_argument("--project", choices=["reviewflow", "servelocal", "openrouter_chat", "repo"])

    sub.add_parser("stats", help="Show index statistics")

    args = parser.parse_args()

    if args.cmd == "index":
        from project_rag.indexer import index_all

        stats = index_all(clear=True)
        print(f"Indexed {stats['files']} files → {stats['chunks']} chunks")
        print("Next: python -m project_rag embed  (optional, for semantic search)")
        return

    if args.cmd == "embed":
        from project_rag.embedder import embed_index

        count = embed_index(limit=args.limit)
        print(f"Embedded {count} chunks")
        return

    if args.cmd == "search":
        from project_rag.search import search

        hits = search(args.query, limit=args.limit, project=args.project)
        if args.json:
            print(
                json.dumps(
                    [
                        {
                            "project": h.project,
                            "path": h.path,
                            "lines": [h.line_start, h.line_end],
                            "score": h.score,
                            "source": h.source,
                            "preview": h.content[:400],
                        }
                        for h in hits
                    ],
                    indent=2,
                )
            )
            return

        for h in hits:
            print(f"[{h.score:.3f}] {h.project} {h.path}:{h.line_start}-{h.line_end} ({h.source})")
            print(h.content[:500].replace("\n", "\n  "))
            print("---")
        return

    if args.cmd == "ask":
        from project_rag.ask import ask

        print(ask(args.question, project=args.project))
        return

    if args.cmd == "stats":
        from project_rag.config import INDEX_DB, MANIFEST_PATH
        from project_rag.store import connect, init_db

        if MANIFEST_PATH.exists():
            print(MANIFEST_PATH.read_text(encoding="utf-8"))

        conn = connect()
        init_db(conn)
        chunks = conn.execute("SELECT COUNT(*) AS n FROM chunks").fetchone()["n"]
        embeds = conn.execute("SELECT COUNT(*) AS n FROM embeddings").fetchone()["n"]
        conn.close()
        print(f"DB: {INDEX_DB}")
        print(f"Chunks: {chunks}, Embeddings: {embeds}")
        return


if __name__ == "__main__":
    main()
