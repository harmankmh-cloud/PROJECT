import json
import os
from typing import Generator, Iterable

import httpx

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")


class OpenRouterError(RuntimeError):
    pass


def _headers() -> dict[str, str]:
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    if not api_key:
        raise OpenRouterError(
            "Missing OPENROUTER_API_KEY. Run ./setup.sh or add it to .env."
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    app_name = os.getenv("OPENROUTER_APP_NAME", "OpenRouter Free Chat")
    app_url = os.getenv("OPENROUTER_APP_URL", "http://localhost:8080")
    headers["X-Title"] = app_name
    headers["HTTP-Referer"] = app_url
    return headers


def chat_stream(
    messages: Iterable[dict[str, str]],
    model: str | None = None,
) -> Generator[str, None, None]:
    payload = {
        "model": model or DEFAULT_MODEL,
        "messages": list(messages),
        "stream": True,
    }

    with httpx.stream(
        "POST",
        f"{OPENROUTER_BASE_URL}/chat/completions",
        headers=_headers(),
        json=payload,
        timeout=120.0,
    ) as response:
        if response.status_code >= 400:
            body = response.read().decode("utf-8", errors="replace")
            raise OpenRouterError(f"OpenRouter error {response.status_code}: {body}")

        for line in response.iter_lines():
            if not line or not line.startswith("data: "):
                continue

            data = line[6:]
            if data == "[DONE]":
                break

            chunk = json.loads(data)
            delta = chunk["choices"][0].get("delta", {})
            content = delta.get("content")
            if content:
                yield content


def chat_once(
    messages: Iterable[dict[str, str]],
    model: str | None = None,
) -> str:
    payload = {
        "model": model or DEFAULT_MODEL,
        "messages": list(messages),
        "stream": False,
    }

    response = httpx.post(
        f"{OPENROUTER_BASE_URL}/chat/completions",
        headers=_headers(),
        json=payload,
        timeout=120.0,
    )

    if response.status_code >= 400:
        raise OpenRouterError(
            f"OpenRouter error {response.status_code}: {response.text}"
        )

    data = response.json()
    return data["choices"][0]["message"]["content"]
