---
name: project-rag
description: Search the monorepo knowledge base (RateLocal, ServeLocal, docs) before implementing or debugging. Use when the task spans multiple apps, env setup, Supabase SQL, auth, or you need prior context from this repo.
---

# Project RAG

This repo has a **local RAG index** covering all projects. Use it so you do not guess across RateLocal and ServeLocal.

## When to use

- Starting work on **reviewflow** (RateLocal) or **servelocal** (ServeLocal)
- Questions about Supabase SQL order, SMTP, env vars, admin auth
- "How does X work in our codebase?" across the monorepo
- After a long break — refresh context before editing

## How to use (pick one)

### 1. MCP tools (preferred in Cursor)

If `project-rag` MCP server is available:

1. `rag_stats` — confirm index exists
2. `rag_search` with a focused query (e.g. `servelocal service request form categories`)
3. `rag_ask` for synthesized answers with file paths
4. `rag_reindex` after large merges or new apps

### 2. CLI (shell)

```bash
python -m project_rag search "your query" --project servelocal
python -m project_rag ask "your question"
```

If index missing:

```bash
pip install -r requirements-rag.txt
python -m project_rag index
```

## Query tips

- Include **project name**: `servelocal`, `reviewflow`, `ratelocal`, `ServeLocal`
- Include **feature**: `login`, `guest-access`, `stripe`, `admin`, `request form`
- Prefer `rag_search` first; use `rag_ask` when you need a summary

## Do not

- Skip search and improvise env/SQL steps that already exist in docs
- Index secrets — `.env` files are excluded by design
