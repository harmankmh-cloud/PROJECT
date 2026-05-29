#!/usr/bin/env python3
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from openrouter_chat.client import DEFAULT_MODEL, OpenRouterError, chat_stream

STATIC_DIR = Path(__file__).resolve().parent / "static"
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8080"))


class ChatHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path: Path, content_type: str) -> None:
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path in {"/", "/index.html"}:
            return self._send_file(STATIC_DIR / "index.html", "text/html; charset=utf-8")
        if parsed.path == "/health":
            return self._send_json(200, {"ok": True, "model": DEFAULT_MODEL})
        self.send_error(404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/api/chat":
            return self.send_error(404)

        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8")
        try:
            payload = json.loads(raw)
            messages = payload.get("messages", [])
            model = payload.get("model", DEFAULT_MODEL)
        except json.JSONDecodeError:
            return self._send_json(400, {"error": "Invalid JSON body"})

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        try:
            for token in chat_stream(messages, model=model):
                event = json.dumps({"content": token})
                self.wfile.write(f"data: {event}\n\n".encode("utf-8"))
                self.wfile.flush()
            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
        except OpenRouterError as exc:
            event = json.dumps({"error": str(exc)})
            self.wfile.write(f"data: {event}\n\n".encode("utf-8"))
            self.wfile.flush()

    def log_message(self, format: str, *args) -> None:
        return


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), ChatHandler)
    print(f"OpenRouter web chat running at http://{HOST}:{PORT}")
    print(f"Model: {DEFAULT_MODEL}")
    server.serve_forever()


if __name__ == "__main__":
    main()
