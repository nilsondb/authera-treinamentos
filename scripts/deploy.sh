#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "===== AUTHERA TREINAMENTOS ====="
echo "Build e deploy local"

docker compose up -d --build

echo
echo "===== STATUS ====="
docker ps --filter "name=authera-treinamentos"   --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

echo
echo "===== HEALTH ====="
sleep 2
curl -fsS http://127.0.0.1:3062/healthz

echo
echo "Acesso local: http://192.168.100.37:3062"
