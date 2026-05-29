#!/usr/bin/env python3
"""Load .env before launching OpenRouter chat apps."""

from __future__ import annotations

import os
import runpy
import sys
from pathlib import Path


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def main() -> None:
    root = Path(__file__).resolve().parent
    load_dotenv(root / ".env")

    if len(sys.argv) < 2:
        raise SystemExit("Usage: python run.py <cli|web>")

    target = sys.argv[1]
    if target == "cli":
        runpy.run_module("openrouter_chat.cli", run_name="__main__")
    elif target == "web":
        runpy.run_module("openrouter_chat.web", run_name="__main__")
    else:
        raise SystemExit("Unknown target. Use 'cli' or 'web'.")


if __name__ == "__main__":
    main()
