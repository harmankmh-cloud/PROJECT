#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env.local ]]; then
  echo "❌ Missing .env.local"
  echo "   Run: cp env.local.template .env.local"
  exit 1
fi

# Warn if the terminal already had Stripe vars before we load the file
had_setup="${STRIPE_PRICE_SETUP:-}"
had_monthly="${STRIPE_PRICE_MONTHLY:-}"

# shellcheck disable=SC1091
source "$(dirname "$0")/load-env.sh"
load_env_local "$(pwd)"

ok=0
warn=0

if [[ -n "$had_setup" && "$had_setup" != "$STRIPE_PRICE_SETUP" ]]; then
  echo "⚠ Terminal had old STRIPE_PRICE_SETUP — .env.local wins for this check."
  echo "  Run: npm run stop && npm run smooth  (so the app reloads .env.local too)"
  echo ""
fi
if [[ -n "$had_monthly" && "$had_monthly" != "$STRIPE_PRICE_MONTHLY" ]]; then
  echo "⚠ Terminal had old STRIPE_PRICE_MONTHLY — .env.local wins for this check."
  echo "  Run: npm run stop && npm run smooth  (so the app reloads .env.local too)"
  echo ""
fi

check() {
  local name="$1"
  local val="${2:-}"
  local optional="${3:-}"
  if [[ -z "$val" || "$val" == *"your-"* ]]; then
    if [[ "$optional" == "optional" ]]; then
      echo "○ $name — not set (optional: setup fee is waived by default)"
      return
    fi
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
check "STRIPE_PRICE_MONTHLY (\$39/mo)" "$STRIPE_PRICE_MONTHLY"
check "STRIPE_PRICE_SETUP (one-time, optional)" "$STRIPE_PRICE_SETUP" optional
check "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
check "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"

echo ""
echo "ID prefixes (must start with price_):"
echo "  Monthly: ${STRIPE_PRICE_MONTHLY:0:12}..."
echo "  Setup:   ${STRIPE_PRICE_SETUP:0:12}... (optional)"
echo ""
if [[ $warn -eq 0 ]]; then
  echo "All set. Restart app, then test at /dashboard/billing"
  echo "If billing still errors: npm run stop && npm run smooth"
else
  echo "Fix the ✗ items above."
  echo "Price IDs start with price_ — NOT prod_"
  echo "Stripe → Product catalog → open product → click price → copy Price ID"
fi
