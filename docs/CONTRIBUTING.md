# Contributing

Private monorepo. All changes via PR to `main`.

## Workflow

1. Branch off `main`: `cursor/<descriptive-name>-<id>`
2. Make focused changes; match existing patterns in each app folder
3. Test locally (`npm run dev` / `npm run build` in affected app)
4. Open PR with clear summary and test plan
5. Squash merge after CI passes

## Scope rules

- **Minimize diff** — don't refactor unrelated code
- **No secrets** in commits — `.env.local` stays gitignored
- **Separate Supabase projects** — ServeLocal never shares RateLocal DB
- After RateLocal code changes: `cd reviewflow && graphify update .`

## Code style

- TypeScript strict mode
- Zod validation on API inputs
- Server-only service role keys
- Skeleton loaders, not plain "Loading…"

## CI

GitHub Actions: lint + build for `voiceagent`, `reviewflow`, `servelocal`, orchestrator.

## Docs

Update `docs/` when changing deploy env, migrations, or architecture. Link from root README if adding new guides.

## RAG index

After large merges:

```bash
python -m project_rag index
```

**Last updated:** June 16, 2026
