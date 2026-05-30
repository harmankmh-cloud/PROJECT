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
warn=0

check() {
  local name="$1"
  local val="${2:-}"
  if [[ -z "$val" || "$val" == *"your-"* ]]; then
    echo "✗ $name — not set yet"
    warn=$((warn + 1))
    return
  fi
  if [[ "$val" == prod_* ]]; then
    echo "✗ $name — WRONG: prod_... is a Product ID. Use price_... (Price ID)"
    warn=$((warn + 1))
    return
  fi
  if [[ "$name" == *PRICE* && "$val" != price_* ]]; then
    echo "✗ $name — must start with price_"
    warn=$((warn + 1))
    return
  fi
  echo "✓ $name"
  ok=$((ok + 1))
}

echo "ReviewFlow Stripe checklist"
echo ""

check "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
check "STRIPE_PRICE_SETUP (\$99 one-time)" "$STRIPE_PRICE_SETUP"
check "STRIPE_PRICE_MONTHLY (\$39/mo)" "$STRIPE_PRICE_MONTHLY"
check "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
check "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"

echo ""
if [[ $warn -eq 0 ]]; then
  echo "All set. Restart app, then test at /dashboard/billing"
else
  echo "Fix the ✗ items above."
  echo "Price IDs start with price_ — NOT prod_"
  echo "Stripe → Product catalog → open product → click price → copy Price ID"
fi
