# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Route Max is a multi-stop driving route planner with two frontends:

- **Static web app** — vanilla HTML/CSS/JS served by `server.js` (port 8000)
- **Expo React Native app** — uses Expo SDK 56 / Metro bundler (port 8081)

### Running services

| Service | Command | Port | Notes |
|---|---|---|---|
| Static web server | `npm run start:static` | 8000 | Zero-dependency Node.js server; visit `http://localhost:8000` |
| Expo dev server | `npm start` | 8081 | Requires Expo Go on a mobile device or emulator; not needed for static web testing |

### Lint / check / test

- **Syntax check:** `npm run check` — runs `node --check` on all JS files. This is the only automated check available; there is no test framework configured.
- There is no ESLint, Prettier, or TypeScript configured.

### Key caveats

- The static web app uses only browser `localStorage` for persistence — no backend or database.
- The Expo mobile app keeps state in-memory with React `useState` — no persistence.
- `server.js` uses only Node.js built-in modules — no need for any extra dependencies beyond `npm install`.
- The Expo dev server (`npm start`) uses `--host lan` by default. In headless/VM environments without LAN access to a mobile device, Expo testing is not practical; focus on the static web app instead.
