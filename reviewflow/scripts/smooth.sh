#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# shellcheck disable=SC1091
source "$(dirname "$0")/load-env.sh"
load_env_local "$(pwd)" || true

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

echo "Installing dependencies (if needed)..."
npm install --no-fund --no-audit 2>&1 | filter_noise

echo "Building once (takes ~30 seconds)..."
npm run build 2>&1 | filter_noise

COMMIT=""
if git rev-parse --short HEAD >/dev/null 2>&1; then
  COMMIT="$(git rev-parse --short HEAD)"
fi

echo ""
echo "Starting smooth mode — ONE process, no dev spam, fast laptop."
if [[ -n "$COMMIT" ]]; then
  echo "App version: $COMMIT (look for gold Activate Pro banner on billing page)"
fi
echo "Open http://localhost:3000"
echo "Stop with: npm run stop"
echo ""

npx next start -p 3000 2>&1 | filter_noise
