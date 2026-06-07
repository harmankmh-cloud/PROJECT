#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Installing RAG dependencies..."
pip3 install -q -r requirements-rag.txt

echo "Indexing monorepo (reviewflow + servelocal + docs)..."
python3 -m project_rag index

if [[ -f .env ]] && grep -q 'OPENROUTER_API_KEY=sk' .env 2>/dev/null; then
  echo "Building semantic embeddings (OpenRouter)..."
  python3 -m project_rag embed || echo "Embed skipped (check OPENROUTER_API_KEY)"
else
  echo "Skipping embeddings — keyword search ready. Add OPENROUTER_API_KEY to .env for semantic + ask."
fi

python3 -m project_rag stats
echo "Done. In Cursor: enable MCP server 'project-rag' and use rag_search / rag_ask."
