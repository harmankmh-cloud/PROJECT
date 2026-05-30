#!/usr/bin/env bash
# Force-load .env.local into the current shell.
# Next.js will NOT overwrite env vars already set in the terminal — sourcing here
# ensures npm run smooth uses the file values you just edited in TextEdit.
load_env_local() {
  local root="${1:-.}"
  if [[ ! -f "$root/.env.local" ]]; then
    return 1
  fi
  set -a
  # shellcheck disable=SC1091
  source "$root/.env.local"
  set +a
}
