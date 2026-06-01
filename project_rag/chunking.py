from __future__ import annotations

from pathlib import Path

from project_rag.config import CHUNK_OVERLAP, CHUNK_SIZE


def kind_for_path(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".md":
        return "doc"
    if suffix == ".sql":
        return "sql"
    if suffix in {".ts", ".tsx", ".py", ".mjs"}:
        return "code"
    return "config"


def chunk_text(text: str, path: Path) -> list[tuple[int, int, str]]:
    lines = text.splitlines()
    if not lines:
        return []

    chunks: list[tuple[int, int, str]] = []
    start = 0

    while start < len(lines):
        buf: list[str] = []
        size = 0
        end = start

        while end < len(lines):
            line = lines[end]
            add = len(line) + 1
            if buf and size + add > CHUNK_SIZE:
                break
            buf.append(line)
            size += add
            end += 1
            if size >= CHUNK_SIZE:
                break

        if not buf:
            break

        header = f"File: {path.as_posix()}\n\n"
        body = "\n".join(buf)
        chunks.append((start + 1, end, header + body))

        if end >= len(lines):
            break

        # overlap by lines approximating CHUNK_OVERLAP chars
        overlap_lines = max(1, CHUNK_OVERLAP // 80)
        start = max(start + 1, end - overlap_lines)

    return chunks
