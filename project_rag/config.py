from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_DIR = ROOT / ".rag"
INDEX_DB = INDEX_DIR / "index.sqlite"
MANIFEST_PATH = INDEX_DIR / "manifest.json"

# Projects indexed for agent + developer RAG
PROJECTS: list[dict[str, object]] = [
    {
        "id": "reviewflow",
        "name": "RateLocal",
        "path": "reviewflow",
        "url": "https://ratelocal.ca",
        "extensions": {".md", ".ts", ".tsx", ".sql", ".mjs", ".json"},
    },
    {
        "id": "servelocal",
        "name": "ServeLocal",
        "path": "servelocal",
        "url": "https://www.servelocal.ca",
        "extensions": {".md", ".ts", ".tsx", ".sql", ".mjs", ".json"},
    },
    {
        "id": "openrouter_chat",
        "name": "OpenRouter Chat",
        "path": "openrouter_chat",
        "url": "",
        "extensions": {".py", ".md", ".html"},
    },
    {
        "id": "repo",
        "name": "Monorepo root",
        "path": ".",
        "url": "",
        "extensions": {".md", ".py", ".txt", ".sh"},
        "only_files": {"README.md", "requirements.txt", "run.py", "setup.sh"},
    },
]

SKIP_DIRS = {
    "node_modules",
    ".next",
    ".git",
    "dist",
    "build",
    "__pycache__",
    ".venv",
    "venv",
    ".pytest_cache",
    "graphify-out",
    ".rag",
    "coverage",
}

CHUNK_SIZE = 1400
CHUNK_OVERLAP = 180
MAX_FILE_BYTES = 400_000

OPENROUTER_EMBED_MODEL = "openai/text-embedding-3-small"
OPENROUTER_CHAT_MODEL = "openrouter/free"
