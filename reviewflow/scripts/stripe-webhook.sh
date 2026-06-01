#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v stripe >/dev/null 2>&1; then
  echo "Install Stripe CLI first:"
  echo "  brew install stripe/stripe-cli/stripe"
  echo "  stripe login"
  exit 1
fi

echo "Forwarding Stripe webhooks → http://localhost:3000/api/stripe/webhook"
echo ""
echo "Copy the whsec_... secret into .env.local as STRIPE_WEBHOOK_SECRET"
echo "Then restart the app (npm run stop && npm run smooth)"
echo ""

stripe listen --forward-to localhost:3000/api/stripe/webhook
