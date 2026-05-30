#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# shellcheck disable=SC1091
source "$(dirname "$0")/load-env.sh"
load_env_local "$(pwd)" || true

# Mac / Cursor sometimes injects malloc debug flags — causes spam + extra processes.
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

echo "Starting ReviewFlow (webpack mode — lighter on Mac)..."
echo "Open http://localhost:3000"
echo "Stop with: npm run stop"
echo ""

# --webpack avoids Turbopack spawning many node workers (main cause of laptop hang)
npx next dev --webpack -p 3000 2>&1 | filter_noise
