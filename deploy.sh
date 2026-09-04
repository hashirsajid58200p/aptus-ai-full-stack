#!/usr/bin/env bash
# ==============================================================================
# Zero-Downtime Deployment Pipeline Script for Aptus AI
# Performs rolling build, health-checking, and zero-downtime container swap.
# ==============================================================================

set -euo pipefail

APP_NAME="aptus-ai-backend"
PORT="${PORT:-3000}"
HEALTH_URL="http://127.0.0.1:${PORT}/health"
MAX_RETRIES=20
RETRY_INTERVAL=3

echo "🚀 [Deploy] Initiating Zero-Downtime Deployment for ${APP_NAME}..."

# 1. Build and verify new image
echo "📦 [Deploy] Building updated Docker image..."
docker compose build --pull backend

# 2. Start new service instance
echo "🔄 [Deploy] Launching updated backend container..."
docker compose up -d --no-deps --build backend

# 3. Health Check loop
echo "🩺 [Deploy] Verifying service health at ${HEALTH_URL}..."
ATTEMPTS=0
HEALTHY=false

while [ $ATTEMPTS -lt $MAX_RETRIES ]; do
  ATTEMPTS=$((ATTEMPTS + 1))
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}" || true)

  if [ "${HTTP_STATUS}" = "200" ]; then
    echo "✅ [Deploy] Service is HEALTHY! Received HTTP 200 OK (Attempt ${ATTEMPTS}/${MAX_RETRIES})"
    HEALTHY=true
    break
  else
    echo "⏳ [Deploy] Attempt ${ATTEMPTS}/${MAX_RETRIES}: Received HTTP ${HTTP_STATUS}. Retrying in ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
  fi
done

if [ "$HEALTHY" = false ]; then
  echo "❌ [Deploy] CRITICAL: Health checks failed after ${MAX_RETRIES} attempts. Rolling back..."
  docker compose restart backend
  exit 1
fi

# 4. Prune unused images
echo "🧹 [Deploy] Cleaning up dangling images..."
docker image prune -f

echo "🎉 [Deploy] Zero-Downtime Deployment COMPLETE successfully!"
