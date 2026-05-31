#!/usr/bin/env bash
# One-time Graphify setup for Cursor (saves tokens by using a code knowledge graph).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Installing Graphify (graphifyy on PyPI)..."
python3 -m pip install --user --upgrade graphifyy

export PATH="${HOME}/.local/bin:${PATH}"

echo "Connecting Graphify to Cursor..."
graphify cursor install

echo "Building code map (no API key needed for code-only pass)..."
graphify update .

echo ""
echo "Done. Graph saved in graphify-out/"
echo "Cursor will use it automatically — ask things like:"
echo '  "Where is the Google review popup?"'
echo ""
echo "After big code changes, run: graphify update ."
