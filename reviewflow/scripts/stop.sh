#!/usr/bin/env bash
# Stop all ReviewFlow / Next.js processes that may be eating RAM.
pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
pkill -f "reviewflow.*next" 2>/dev/null || true
sleep 1
echo "Stopped. If your Mac still feels slow, quit Terminal and reopen it."
