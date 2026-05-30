#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

unset MallocStackLogging MallocScribble MallocGuardEdges 2>/dev/null || true
export NODE_NO_WARNINGS=1

filter_noise() {
  while IFS= read -r line || [[ -n "$line" ]]; do
    case "$line" in
      *MallocStackLogging*) continue ;;
      *allocStackLogging*) continue ;;
    esac
    printf '%s\n' "$line"
  done
}

echo "Building once (takes ~30 seconds)..."
npm run build 2>&1 | filter_noise

echo ""
echo "Starting smooth mode — ONE process, no dev spam, fast laptop."
echo "Open http://localhost:3000"
echo "Stop with: npm run stop"
echo ""

npx next start -p 3000 2>&1 | filter_noise
