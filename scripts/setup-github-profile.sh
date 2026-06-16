#!/usr/bin/env bash
# Creates harmankmh-cloud/harmankmh-cloud and pushes the profile README.
# Run once on your machine (needs: gh auth login as harmankmh-cloud)
set -euo pipefail

USERNAME="harmankmh-cloud"
REPO="$USERNAME/$USERNAME"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
README="$ROOT/docs/GITHUB_PROFILE_README.md"
TMP=$(mktemp -d)

if ! command -v gh >/dev/null; then
  echo "Install GitHub CLI: https://cli.github.com/"
  exit 1
fi

if [[ ! -f "$README" ]]; then
  echo "Missing $README"
  exit 1
fi

# Strip the HTML comment lines at top (GitHub allows them but cleaner without)
tail -n +3 "$README" > "$TMP/README.md"

if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Repo exists — updating README only"
  gh repo clone "$REPO" "$TMP/repo" -- --depth 1
  cp "$TMP/README.md" "$TMP/repo/README.md"
  cd "$TMP/repo"
  git add README.md
  git commit -m "docs: update profile README"
  git push origin main
else
  echo "Creating profile repo $REPO"
  cd "$TMP"
  git init -b main
  cp "$README" README.md
  sed -i '1,2d' README.md 2>/dev/null || sed -i '' '1,2d' README.md
  git add README.md
  git commit -m "docs: GitHub profile README"
  gh repo create "$USERNAME" --public --description "Harman — solo founder, BC local business tools" --source=. --remote=origin --push
fi

echo "Done. Check https://github.com/$USERNAME"
