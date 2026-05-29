#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "Setting up OpenRouter Free Chat..."

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required but was not found."
  exit 1
fi

if ! python3 -m venv .venv 2>/dev/null; then
  echo "python3-venv is not installed. Installing it..."
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -qq
    sudo apt-get install -y -qq python3-venv
  else
    echo "Install python3-venv for your Python version, then rerun ./setup.sh"
    exit 1
  fi
  python3 -m venv .venv
fi

source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo
  echo "Created .env from .env.example"
  echo "Paste your OpenRouter API key into .env, then run:"
  echo "  source .venv/bin/activate"
  echo "  python -m openrouter_chat.web"
  echo
  read -r -p "Paste your OpenRouter API key now (or press Enter to skip): " api_key
  if [[ -n "${api_key}" ]]; then
    sed -i "s|^OPENROUTER_API_KEY=.*|OPENROUTER_API_KEY=${api_key}|" .env
    echo "Saved OPENROUTER_API_KEY to .env"
  fi
else
  echo ".env already exists — leaving it unchanged."
fi

echo
echo "Setup complete."
echo
echo "Terminal chat:"
echo "  source .venv/bin/activate && python -m openrouter_chat.cli"
echo
echo "Web chat:"
echo "  source .venv/bin/activate && python -m openrouter_chat.web"
echo "  Then open http://127.0.0.1:8080"
