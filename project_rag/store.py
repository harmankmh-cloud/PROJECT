from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from project_rag.config import INDEX_DB, INDEX_DIR


def ensure_index_dir() -> None:
    INDEX_DIR.mkdir(parents=True, exist_ok=True)


def connect() -> sqlite3.Connection:
    ensure_index_dir()
    conn = sqlite3.connect(INDEX_DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS chunks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project TEXT NOT NULL,
          path TEXT NOT NULL,
          kind TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          line_start INTEGER NOT NULL,
          line_end INTEGER NOT NULL,
          indexed_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_chunks_project ON chunks(project);

        CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
          project,
          path,
          title,
          content,
          content='chunks',
          content_rowid='id'
        );

        CREATE TABLE IF NOT EXISTS embeddings (
          chunk_id INTEGER PRIMARY KEY,
          vector TEXT NOT NULL,
          FOREIGN KEY (chunk_id) REFERENCES chunks(id) ON DELETE CASCADE
        );
        """
    )

    # FTS sync triggers (idempotent)
    conn.executescript(
        """
        CREATE TRIGGER IF NOT EXISTS chunks_ai AFTER INSERT ON chunks BEGIN
          INSERT INTO chunks_fts(rowid, project, path, title, content)
          VALUES (new.id, new.project, new.path, new.title, new.content);
        END;
        CREATE TRIGGER IF NOT EXISTS chunks_ad AFTER DELETE ON chunks BEGIN
          INSERT INTO chunks_fts(chunks_fts, rowid, project, path, title, content)
          VALUES ('delete', old.id, old.project, old.path, old.title, old.content);
        END;
        CREATE TRIGGER IF NOT EXISTS chunks_au AFTER UPDATE ON chunks BEGIN
          INSERT INTO chunks_fts(chunks_fts, rowid, project, path, title, content)
          VALUES ('delete', old.id, old.project, old.path, old.title, old.content);
          INSERT INTO chunks_fts(rowid, project, path, title, content)
          VALUES (new.id, new.project, new.path, new.title, new.content);
        END;
        """
    )
    conn.commit()


def clear_index(conn: sqlite3.Connection) -> None:
    conn.execute("DELETE FROM embeddings")
    conn.execute("DELETE FROM chunks")
    conn.execute("DELETE FROM chunks_fts")
    conn.commit()


def set_meta(conn: sqlite3.Connection, key: str, value: str) -> None:
    conn.execute(
        "INSERT INTO meta(key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        (key, value),
    )
    conn.commit()


def get_meta(conn: sqlite3.Connection, key: str) -> str | None:
    row = conn.execute("SELECT value FROM meta WHERE key = ?", (key,)).fetchone()
    return row["value"] if row else None


def insert_chunk(
    conn: sqlite3.Connection,
    *,
    project: str,
    path: str,
    kind: str,
    title: str,
    content: str,
    line_start: int,
    line_end: int,
) -> int:
    now = datetime.now(timezone.utc).isoformat()
    cur = conn.execute(
        """
        INSERT INTO chunks (project, path, kind, title, content, line_start, line_end, indexed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (project, path, kind, title, content, line_start, line_end, now),
    )
    return int(cur.lastrowid)


def save_embedding(conn: sqlite3.Connection, chunk_id: int, vector: list[float]) -> None:
    conn.execute(
        "INSERT OR REPLACE INTO embeddings (chunk_id, vector) VALUES (?, ?)",
        (chunk_id, json.dumps(vector)),
    )


def load_all_embeddings(conn: sqlite3.Connection) -> list[tuple[int, list[float]]]:
    rows = conn.execute("SELECT chunk_id, vector FROM embeddings").fetchall()
    out: list[tuple[int, list[float]]] = []
    for row in rows:
        out.append((int(row["chunk_id"]), json.loads(row["vector"])))
    return out


def get_chunks_by_ids(conn: sqlite3.Connection, ids: list[int]) -> list[sqlite3.Row]:
    if not ids:
        return []
    placeholders = ",".join("?" * len(ids))
    return conn.execute(
        f"SELECT * FROM chunks WHERE id IN ({placeholders}) ORDER BY id",
        ids,
    ).fetchall()


def fts_search(conn: sqlite3.Connection, query: str, limit: int = 12, project: str | None = None) -> list[sqlite3.Row]:
    terms = [t for t in query.replace("/", " ").split() if len(t) > 1]
    if not terms:
        return []

    match = " OR ".join(f'"{t}"' for t in terms[:12])

    if project:
        sql = """
          SELECT c.*, bm25(chunks_fts) AS rank
          FROM chunks_fts f
          JOIN chunks c ON c.id = f.rowid
          WHERE chunks_fts MATCH ? AND c.project = ?
          ORDER BY rank
          LIMIT ?
        """
        return conn.execute(sql, (match, project, limit)).fetchall()

    sql = """
      SELECT c.*, bm25(chunks_fts) AS rank
      FROM chunks_fts f
      JOIN chunks c ON c.id = f.rowid
      WHERE chunks_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    """
    return conn.execute(sql, (match, limit)).fetchall()
