#!/usr/bin/env bash
# Fixes broken Cursor MCP config on Mac (when "Open JSON" does nothing).
# Safe to run — backs up your old file first.

set -euo pipefail

CURSOR_DIR="${HOME}/.cursor"
MCP_FILE="${CURSOR_DIR}/mcp.json"
BACKUP="${MCP_FILE}.backup-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$CURSOR_DIR"

if [[ -f "$MCP_FILE" ]]; then
  cp "$MCP_FILE" "$BACKUP"
  echo "Backed up old config to:"
  echo "  $BACKUP"
fi

cat > "$MCP_FILE" << 'EOF'
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    },
    "datadog": {
      "url": "https://mcp.datadoghq.com/api/unstable/mcp-server/mcp?referrer_ide=cursor-project&toolsets=core,visualizations"
    }
  }
}
EOF

echo ""
echo "Fixed ~/.cursor/mcp.json"
echo ""
echo "Next:"
echo "  1. Press Cmd + Q to quit Cursor completely"
echo "  2. Open Cursor again"
echo "  3. Gear icon -> Tools & MCP"
echo "  4. Connect figma and datadog if you want them (optional — not needed for your app)"
echo ""
echo "You can IGNORE Figma/Datadog entirely. Your app does not need them."
