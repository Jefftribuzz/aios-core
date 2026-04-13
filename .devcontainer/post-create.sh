#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/workspaces/aios-core"
BACKEND_DIR="$ROOT_DIR/projetos/corvos-bjj-backend"
FRONTEND_DIR="$ROOT_DIR/projetos/corvos-bjj-frontend"

if [[ -f "$ROOT_DIR/package.json" ]]; then
  echo "[devcontainer] Installing root dependencies..."
  cd "$ROOT_DIR"
  npm install
fi

if [[ -f "$BACKEND_DIR/package.json" ]]; then
  echo "[devcontainer] Installing Corvos backend dependencies..."
  cd "$BACKEND_DIR"
  npm install
fi

if [[ -f "$FRONTEND_DIR/package.json" ]]; then
  echo "[devcontainer] Installing Corvos frontend dependencies..."
  cd "$FRONTEND_DIR"
  npm install
fi

echo "[devcontainer] Setup complete."
