#!/usr/bin/env bash
# One-time Graphify setup for Cursor (saves tokens by using a code knowledge graph).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Installing Graphify (graphifyy on PyPI)..."
if [[ -n "${VIRTUAL_ENV:-}" ]]; then
  # Inside a venv — install there (no --user flag)
  python3 -m pip install --upgrade graphifyy
  export PATH="${VIRTUAL_ENV}/bin:${PATH}"
else
  python3 -m pip install --user --upgrade graphifyy
  export PATH="${HOME}/.local/bin:${PATH}"
fi

if ! command -v graphify >/dev/null 2>&1; then
  echo "ERROR: graphify command not found after install."
  echo "Try: export PATH=\"${PATH}\""
  exit 1
fi

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
