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
npx -y stitch-design-cli doctor --json
```

## From `voiceagent/` folder

```bash
npm run stitch -- auth set --api-key YOUR_KEY_HERE
npm run stitch:doctor
```

Prefix every command with `npm run stitch --` or use `npx -y stitch-design-cli` directly.

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
