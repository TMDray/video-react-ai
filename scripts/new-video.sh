#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────
# new-video.sh — Create a new video from _template
#
# Usage:
#   ./scripts/new-video.sh <slug> [title]
#
# Example:
#   ./scripts/new-video.sh demo-email "Email Automation"
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

SLUG="${1:?Usage: ./scripts/new-video.sh <slug> [title]}"
TITLE="${2:-$SLUG}"

TEMPLATE_DIR="$PROJECT_ROOT/src/videos/_template"
TARGET_DIR="$PROJECT_ROOT/src/videos/$SLUG"
REGISTRY="$PROJECT_ROOT/src/videos/registry.ts"

# ── Checks ─────────────────────────────────────────────

if [ -d "$TARGET_DIR" ]; then
  echo "Error: $TARGET_DIR already exists"
  exit 1
fi

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "Error: Template not found at $TEMPLATE_DIR"
  exit 1
fi

# ── Copy template ──────────────────────────────────────

echo "Creating video: $SLUG"
cp -r "$TEMPLATE_DIR" "$TARGET_DIR"
mkdir -p "$PROJECT_ROOT/public/audio/voiceover/$SLUG"

# ── Replace placeholders ──────────────────────────────

find "$TARGET_DIR" -type f \( -name '*.ts' -o -name '*.tsx' \) | while read -r file; do
  sed -i '' \
    -e "s/__SLUG__/$SLUG/g" \
    -e "s/__TITLE__/$TITLE/g" \
    "$file"
done

# ── Generate import name (kebab to camelCase) ─────────

IMPORT_NAME=$(echo "$SLUG" | sed -E 's/-([a-z])/\U\1/g')

# ── Update registry ───────────────────────────────────

# Add import at top of file (before the export)
sed -i '' "/^export const videos/i\\
import { TemplateComposition as ${IMPORT_NAME}Composition } from \"./${SLUG}/Composition\";
" "$REGISTRY"

# Add entry before sentinel comment
sed -i '' "/NEW_VIDEO/i\\
\  { id: \"${SLUG}\", title: \"${TITLE}\", component: ${IMPORT_NAME}Composition, durationInFrames: 450, fps: 30 },
" "$REGISTRY"

# ── Done ──────────────────────────────────────────────

echo ""
echo "Video created!"
echo ""
echo "  Source:    src/videos/$SLUG/"
echo "  Assets:    public/audio/voiceover/$SLUG/"
echo ""
echo "Next steps:"
echo "  1. Edit src/videos/$SLUG/config.ts — set duration, fps"
echo "  2. Edit src/videos/$SLUG/audio.config.ts — write voiceover segments"
echo "  3. Build scenes in src/videos/$SLUG/scenes/"
echo "  4. Preview: npm run studio"
echo "  5. Generate voiceover: npm run generate:voiceover -- $SLUG"
echo ""
