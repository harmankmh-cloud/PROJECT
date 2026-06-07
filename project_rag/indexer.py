from __future__ import annotations

import json
from pathlib import Path

from project_rag.chunking import chunk_text, kind_for_path
from project_rag.config import MANIFEST_PATH, MAX_FILE_BYTES, PROJECTS, ROOT, SKIP_DIRS
from project_rag.store import clear_index, connect, init_db, insert_chunk, set_meta


def should_skip_dir(name: str) -> bool:
    return name in SKIP_DIRS or name.startswith(".")


def iter_files(project: dict[str, object]) -> list[Path]:
    base = ROOT / str(project["path"])
    if not base.exists():
        return []

    extensions: set[str] = set(project.get("extensions", set()))  # type: ignore[arg-type]
    only_files: set[str] | None = project.get("only_files")  # type: ignore[assignment]

    if only_files:
        return [base / name for name in only_files if (base / name).is_file()]

    found: list[Path] = []
    for path in base.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS or (part.startswith(".") and part not in {".env.example"}) for part in path.parts):
            continue
        if path.suffix.lower() not in extensions:
            continue
        if path.name.startswith(".") and path.name not in {".env.example", ".env.local.template"}:
            continue
        try:
            if path.stat().st_size > MAX_FILE_BYTES:
                continue
        except OSError:
            continue
        found.append(path)

    return sorted(found)


def index_all(*, clear: bool = True) -> dict[str, int]:
    conn = connect()
    init_db(conn)

    if clear:
        clear_index(conn)

    stats: dict[str, int] = {"files": 0, "chunks": 0}

    for project in PROJECTS:
        project_id = str(project["id"])
        files = iter_files(project)
        stats["files"] += len(files)

        for file_path in files:
            try:
                text = file_path.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue

            rel = file_path.relative_to(ROOT).as_posix()
            kind = kind_for_path(file_path)
            title = file_path.name

            for line_start, line_end, content in chunk_text(text, Path(rel)):
                insert_chunk(
                    conn,
                    project=project_id,
                    path=rel,
                    kind=kind,
                    title=title,
                    content=content,
                    line_start=line_start,
                    line_end=line_end,
                )
                stats["chunks"] += 1

    conn.commit()

    manifest = {
        "projects": [
            {
                "id": p["id"],
                "name": p.get("name", p["id"]),
                "path": p["path"],
                "url": p.get("url", ""),
            }
            for p in PROJECTS
        ],
        "stats": stats,
    }
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    set_meta(conn, "manifest", json.dumps(manifest))
    set_meta(conn, "version", "1")

    conn.close()
    return stats
