#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "===== ATUALIZANDO DO GITHUB ====="
git pull --ff-only origin main

echo
echo "===== REBUILD ====="
docker compose up -d --build

echo
echo "===== HEALTH ====="
sleep 2
curl -fsS http://127.0.0.1:3062/healthz
