#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="${HOME}/.local/bin:${PATH}"

install_cli() {
  if command -v stitch >/dev/null 2>&1; then
    echo "stitch CLI already installed: $(stitch --version)"
    return
  fi
  echo "Installing stitch-design-cli to ~/.local ..."
  npm install -g stitch-design-cli --prefix "${HOME}/.local"
  export PATH="${HOME}/.local/bin:${PATH}"
  stitch --version
}

load_env_key() {
  if [[ -f "${ROOT}/.env" ]]; then
    # shellcheck disable=SC2046
    export $(grep -E '^STITCH_API_KEY=' "${ROOT}/.env" | xargs) || true
  fi
}

save_key() {
  local key="${1:-}"
  if [[ -z "${key}" ]]; then
    key="${STITCH_API_KEY:-}"
  fi
  if [[ -z "${key}" ]]; then
    echo ""
    echo "No API key found."
    echo "Option A — add to ${ROOT}/.env:"
    echo "  STITCH_API_KEY=your_key_here"
    echo "Then rerun: bash scripts/stitch-setup.sh"
    echo ""
    echo "Option B — save directly:"
    echo "  stitch auth set --api-key YOUR_KEY"
    echo "  stitch doctor --json"
    exit 1
  fi
  printf '%s' "${key}" | stitch auth set --stdin
  echo "Stitch API key saved to ~/.config/stitch/config.json"
}

main() {
  install_cli
  load_env_key

  if [[ "${1:-}" == "--api-key" && -n "${2:-}" ]]; then
    save_key "${2}"
  else
    save_key ""
  fi

  stitch auth status --json
  stitch doctor --json
}

main "$@"
