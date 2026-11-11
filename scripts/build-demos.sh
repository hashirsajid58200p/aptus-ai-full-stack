#!/usr/bin/env bash
# Builds the 3 demo sites as static files and copies them into
# frontend/public/demo/{1,2,3} so the main site serves them at /demo/1, /demo/2, /demo/3.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/frontend/public/demo"

rm -rf "$OUT"
mkdir -p "$OUT"

echo "▶ /demo/1 — FitLife Pro"
(cd "$ROOT/demo/FitLife_Pro" && rm -rf .next out && DEMO_EXPORT=1 npx next build)
cp -r "$ROOT/demo/FitLife_Pro/out" "$OUT/1"

echo "▶ /demo/2 — NexusCloud Pro"
(cd "$ROOT/demo/NexusCloud_Pro" && npx vite build)
cp -r "$ROOT/demo/NexusCloud_Pro/dist" "$OUT/2"

echo "▶ /demo/3 — VeloVita Wellness"
(cd "$ROOT/demo/VeloVita_Wellness" && npx vite build)
cp -r "$ROOT/demo/VeloVita_Wellness/dist" "$OUT/3"

echo "✅ Demos built into $OUT"
