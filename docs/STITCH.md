# Google Stitch on macOS

`stitch` is not installed globally by default. Use **npx** or the repo setup script — no `command not found` errors.

## Quick start (from repo root)

```bash
cd /path/to/PROJECT   # not voiceagent/ — repo root
npm run stitch:auth     # paste API key when prompted
npm run stitch:doctor
```

Or one line with your key:

```bash
npx -y stitch-design-cli auth set --api-key YOUR_KEY_HERE
npm run stitch:doctor
```

## From `voiceagent/` folder

```bash
npm run stitch -- auth set --api-key YOUR_KEY_HERE
npm run stitch:doctor
```

Prefix every command with `npm run stitch --` or use `npx -y stitch-design-cli` directly.

## `doctor` vs upstream `doctor`

`npm run stitch:doctor` runs a **reliable health check** (auth + project list). Use this one.

The upstream CLI command (`npm run stitch:doctor:upstream`) can report `ok: false` even when Stitch works:

- `auth.present` — ok
- `api.projects.list` — ok (e.g. 2 projects)
- `api.tools.list` — fails with `can't resolve reference #/$defs/ScreenInstance`

That `tools.list` failure is a known MCP JSON-schema bug in the upstream client, **not** an auth or API-key problem. If project list succeeds, Stitch is ready.

## Verify Stitch is working

```bash
npx -y stitch-design-cli auth status --json
npx -y stitch-design-cli project list --json
```

Both should return `"ok": true`. Then generate a screen:

```bash
npx -y stitch-design-cli screen generate \
  --project-id YOUR_PROJECT_ID \
  --prompt "Dark mode SaaS landing page for AI phone agents" \
  --device-type DESKTOP \
  --include-html \
  --json
```

## Optional: global install (adds `stitch` to PATH)

```bash
npm install -g stitch-design-cli --prefix ~/.local
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
stitch --version
```

## Get an API key

https://stitch.withgoogle.com/ → Settings → API Keys

Credentials are stored at `~/.config/stitch/config.json`.

**Security:** Never paste API keys into chat or commit them. Rotate any key that was exposed.
