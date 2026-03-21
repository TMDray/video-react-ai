#!/usr/bin/env bash
# ─────────────────────────────────────────────
# Setup all MCP servers for this project
# Run once after cloning: ./scripts/setup-mcp.sh
# ─────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "🔧 Setting up MCP servers in $ROOT"

# ── 1. Stocky MCP (Python) ──────────────────
STOCKY="$ROOT/.mcp/stocky"
if [ -f "$STOCKY/stocky_mcp.py" ]; then
  echo ""
  echo "📸 Setting up Stocky (stock images & videos)..."
  if [ ! -d "$STOCKY/.venv" ]; then
    python3 -m venv "$STOCKY/.venv"
  fi
  "$STOCKY/.venv/bin/pip" install -q -r "$STOCKY/requirements.txt"
  echo "   ✅ Stocky ready"
else
  echo "⚠️  Stocky not found at $STOCKY"
fi

# ── 2. Suno MCP (Python) ────────────────────
SUNO="$ROOT/.mcp/suno"
if [ -f "$SUNO/server.py" ]; then
  echo ""
  echo "🎵 Setting up Suno (AI music generation)..."
  if [ ! -d "$SUNO/.venv" ]; then
    python3 -m venv "$SUNO/.venv"
  fi
  "$SUNO/.venv/bin/pip" install -q -r "$SUNO/requirements.txt"
  echo "   ✅ Suno ready"
else
  echo "⚠️  Suno not found at $SUNO"
fi

# ── 3. Write .claude/settings.json ──────────
echo ""
echo "⚙️  Writing .claude/settings.json..."
mkdir -p "$ROOT/.claude"

cat > "$ROOT/.claude/settings.json" << 'SETTINGS'
{
  "mcpServers": {
    "stocky": {
      "command": "${PROJECT_DIR}/.mcp/stocky/.venv/bin/python",
      "args": ["${PROJECT_DIR}/.mcp/stocky/stocky_mcp.py"],
      "env": {
        "PEXELS_API_KEY": "${PEXELS_API_KEY}",
        "UNSPLASH_ACCESS_KEY": "${UNSPLASH_ACCESS_KEY}"
      }
    },
    "suno": {
      "command": "${PROJECT_DIR}/.mcp/suno/.venv/bin/python",
      "args": ["${PROJECT_DIR}/.mcp/suno/server.py"],
      "env": {
        "SUNO_API_KEY": "${SUNO_API_KEY}",
        "SUNO_API_BASE_URL": "${SUNO_API_BASE_URL}"
      }
    }
  }
}
SETTINGS

# Replace ${PROJECT_DIR} with actual path
sed -i '' "s|\${PROJECT_DIR}|$ROOT|g" "$ROOT/.claude/settings.json"

echo "   ✅ Settings written"

# ── 4. Check .env ───────────────────────────
echo ""
if [ ! -f "$ROOT/.env" ]; then
  echo "⚠️  No .env file found. Copy .env.example and fill in your API keys:"
  echo "   cp .env.example .env"
else
  echo "✅ .env file found"
fi

echo ""
echo "🎉 MCP setup complete!"
echo ""
echo "Available MCP servers:"
echo "  📸 Stocky  — search_stock_images, search_stock_videos, download_image, download_video"
echo "  🎵 Suno    — generate_music, get_task_status, convert_to_wav"
echo ""
echo "Make sure your .env has: PEXELS_API_KEY, UNSPLASH_ACCESS_KEY, SUNO_API_KEY"
