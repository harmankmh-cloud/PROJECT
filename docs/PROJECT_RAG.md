# Project RAG (monorepo knowledge for agents)

Indexes **RateLocal** (`reviewflow/`), **ServeLocal** (`servelocal/`), **OpenRouter chat**, and root docs so Cursor agents (and you) can search everything in one place.

## Quick start

```bash
cd /workspace   # repo root
pip install -r requirements-rag.txt
python -m project_rag index          # build keyword index (~seconds)
python -m project_rag embed          # optional semantic layer (needs OPENROUTER_API_KEY in .env)
python -m project_rag search "ServeLocal guest access sql"
python -m project_rag ask "How does RateLocal signup email work?"
```

Index data lives in `.rag/index.sqlite` (gitignored).

## Cursor / Cloud Agent integration

1. **MCP** — `.cursor/mcp.json` includes `project-rag`. Restart Cursor after pull.
2. **Skill** — `.cursor/skills/project-rag/SKILL.md` tells agents to call `rag_search` before big tasks.
3. **Reindex** after major changes: MCP tool `rag_reindex` or `python -m project_rag index`.

### MCP tools

| Tool | Purpose |
|------|---------|
| `rag_search` | Hybrid keyword + embedding search |
| `rag_ask` | Search + LLM answer with citations |
| `rag_reindex` | Rebuild index |
| `rag_stats` | Chunk counts per project |

## What gets indexed

- Markdown docs (README, SMTP_SETUP, AGENTS, etc.)
- TypeScript / TSX source under `src/`
- Supabase SQL migrations
- Python in `openrouter_chat/`

Skipped: `node_modules`, `.next`, build output, secrets (`.env` not indexed).

## Projects filter

Use `--project reviewflow` or `--project servelocal` to narrow search.

## Without OpenRouter

Keyword search (SQLite FTS5) works with **no API key**. Embeddings and `ask` need `OPENROUTER_API_KEY` in repo root `.env`.
