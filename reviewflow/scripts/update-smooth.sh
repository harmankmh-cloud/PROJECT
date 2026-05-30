#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(cd .. && pwd)"

echo "Pulling latest ReviewFlow code..."
if git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  git -C "$ROOT" pull origin cursor/reviewflow-redesign-9a22 || git -C "$ROOT" pull
else
  echo "⚠ Not a git repo — skip pull"
fi

npm run stop
npm run smooth
