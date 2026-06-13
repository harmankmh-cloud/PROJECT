# PROJECT

This repo includes:

- **RateLocal** (`reviewflow/`) — QR-powered Google reviews for local businesses ([ratelocal.ca](https://ratelocal.ca))
- **VoiceAgent** (`voiceagent/`) — enterprise AI phone agent platform (Twilio + Next.js + Supabase)
- **ServeLocal** (`servelocal/`) — standalone BC trades directory (IndiaMART-style contacts)
- **OpenRouter chat** (`openrouter_chat/`) — earlier OpenRouter CLI/web experiment
- **Route Max** (`route-max/`) — scan package addresses, optimize delivery route ([route-max.vercel.app](https://route-max.vercel.app))

## Start RateLocal

See [reviewflow/README.md](reviewflow/README.md).

## Start VoiceAgent

See [voiceagent/README.md](voiceagent/README.md).

## Start ServeLocal

See [servelocal/README.md](servelocal/README.md).

## Project RAG (agent knowledge base)

Search all projects from one index — for Cursor agents and CLI:

```bash
pip install -r requirements-rag.txt
python -m project_rag index
python -m project_rag search "ServeLocal login"
```

See [docs/PROJECT_RAG.md](docs/PROJECT_RAG.md). MCP server: `project-rag` in `.cursor/mcp.json`.
