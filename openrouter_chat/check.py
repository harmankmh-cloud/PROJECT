#!/usr/bin/env python3
"""Verify API key and list usable free models."""

from __future__ import annotations

import os
import sys

import httpx

from openrouter_chat.client import DEFAULT_MODEL, OPENROUTER_BASE_URL, OpenRouterError, _headers

PLACEHOLDER = "your_openrouter_key_here"


def _api_key() -> str:
    key = os.getenv("OPENROUTER_API_KEY", "").strip()
    if not key or key == PLACEHOLDER:
        raise OpenRouterError(
            "OPENROUTER_API_KEY is missing or still the placeholder.\n"
            "Edit .env and set your real key from https://openrouter.ai/keys"
        )
    return key


def _mask_key(key: str) -> str:
    if len(key) <= 12:
        return "(too short)"
    return f"{key[:10]}...{key[-4:]}"


def list_free_models() -> list[dict]:
    response = httpx.get(
        f"{OPENROUTER_BASE_URL}/models",
        headers=_headers(),
        timeout=60.0,
    )
    if response.status_code >= 400:
        raise OpenRouterError(f"Could not list models ({response.status_code}): {response.text}")

    models = response.json().get("data", [])
    free = []
    for model in models:
        model_id = model.get("id", "")
        pricing = model.get("pricing") or {}
        prompt = float(pricing.get("prompt") or 0)
        completion = float(pricing.get("completion") or 0)
        if ":free" in model_id or (prompt == 0 and completion == 0):
            free.append(model)
    free.sort(key=lambda m: m.get("id", ""))
    return free


def test_chat(model: str) -> str:
    response = httpx.post(
        f"{OPENROUTER_BASE_URL}/chat/completions",
        headers=_headers(),
        json={
            "model": model,
            "messages": [{"role": "user", "content": "Reply with exactly: OK"}],
            "max_tokens": 20,
        },
        timeout=120.0,
    )
    if response.status_code >= 400:
        raise OpenRouterError(f"Chat test failed ({response.status_code}): {response.text}")

    return response.json()["choices"][0]["message"]["content"]


def main() -> int:
    try:
        key = _api_key()
    except OpenRouterError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    print("OpenRouter check")
    print(f"API key: {_mask_key(key)}")
    print(f"Default model in .env: {DEFAULT_MODEL}")
    print()

    try:
        free_models = list_free_models()
    except OpenRouterError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    print(f"Free models available ({len(free_models)}):")
    print("-" * 60)
    for model in free_models:
        name = model.get("name", "")
        model_id = model.get("id", "")
        print(f"  {model_id}")
        if name and name != model_id:
            print(f"    ({name})")
    print("-" * 60)
    print()
    print("Popular picks to put in .env as OPENROUTER_MODEL=...")
    print("  openrouter/free")
    for model_id in (
        "meta-llama/llama-3.3-70b-instruct:free",
        "deepseek/deepseek-r1:free",
        "google/gemma-3-12b-it:free",
    ):
        if any(m.get("id") == model_id for m in free_models):
            print(f"  {model_id}")

    print()
    print(f"Testing chat with: {DEFAULT_MODEL}")
    try:
        reply = test_chat(DEFAULT_MODEL)
        print(f"SUCCESS. Model replied: {reply.strip()[:80]}")
    except OpenRouterError as exc:
        print(f"CHAT TEST FAILED: {exc}", file=sys.stderr)
        return 1

    print()
    print("If the test passed, run: python run.py web")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
