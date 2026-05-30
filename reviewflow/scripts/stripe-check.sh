#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env.local ]]; then
  echo "❌ Missing .env.local"
  echo "   Run: cp env.local.template .env.local"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

ok=0
missing=0

check() {
  local name="$1"
  local val="${2:-}"
  if [[ -n "$val" && "$val" != *"your-"* && "$val" != "you@gmail.com" ]]; then
    echo "✓ $name"
    ok=$((ok + 1))
  else
    echo "✗ $name — not set yet"
    missing=$((missing + 1))
  fi
}

echo "ReviewFlow Stripe checklist"
echo ""

check "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
check "STRIPE_PRICE_SETUP (\$99 one-time)" "$STRIPE_PRICE_SETUP"
check "STRIPE_PRICE_MONTHLY (\$39/mo)" "$STRIPE_PRICE_MONTHLY"
check "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
check "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"

echo ""
if [[ $missing -eq 0 ]]; then
  echo "All set. Restart app, then test at /dashboard/billing"
else
  echo "$missing item(s) still needed — open STRIPE_SETUP.md"
fi
