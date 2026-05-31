#!/usr/bin/env bash
# Graphify setup for Cursor (optional — map is usually already in git).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "graphify-out/GRAPH_REPORT.md" && -f "graphify-out/graph.json" ]]; then
  echo "Graphify map already exists in graphify-out/ — you do NOT need to install anything."
  echo "Cursor will use it automatically via .cursor/rules/graphify.mdc"
  echo ""
  echo "Only re-run this script after big code changes if you want to refresh the map locally."
  exit 0
fi

PY_VERSION="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
PY_MAJOR="$(python3 -c 'import sys; print(sys.version_info.major)')"
PY_MINOR="$(python3 -c 'import sys; print(sys.version_info.minor)')"

if (( PY_MAJOR < 3 || (PY_MAJOR == 3 && PY_MINOR < 10) )); then
  echo "ERROR: Graphify needs Python 3.10 or newer. You have Python ${PY_VERSION}."
  exit 1
fi

if (( PY_MAJOR == 3 && PY_MINOR >= 14 )); then
  echo "ERROR: Python ${PY_VERSION} is too new for graphifyy on PyPI right now."
  echo ""
  echo "You do NOT need to install Graphify — the code map is already in this repo (graphify-out/)."
  echo "Cursor uses it automatically. Skip this script."
  echo ""
  echo "If you still want to refresh the map locally, use Python 3.12:"
  echo "  brew install python@3.12"
  echo "  /opt/homebrew/opt/python@3.12/bin/python3.12 -m venv .graphify-venv"
  echo "  source .graphify-venv/bin/activate"
  echo "  pip install graphifyy"
  echo "  graphify update ."
  exit 1
fi

echo "Installing Graphify (graphifyy on PyPI) with Python ${PY_VERSION}..."
if [[ -n "${VIRTUAL_ENV:-}" ]]; then
  python3 -m pip install --upgrade graphifyy
  export PATH="${VIRTUAL_ENV}/bin:${PATH}"
else
  python3 -m pip install --user --upgrade graphifyy
  export PATH="${HOME}/.local/bin:${PATH}"
fi

if ! command -v graphify >/dev/null 2>&1; then
  echo "ERROR: graphify command not found after install."
  exit 1
fi

graphify cursor install
graphify update .

echo ""
echo "Done. Graph saved in graphify-out/"
