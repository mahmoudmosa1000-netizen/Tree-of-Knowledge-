#!/usr/bin/env bash
set -e

echo "🌳 Tree of Knowledge — Setup"
echo "----------------------------"

command -v node >/dev/null 2>&1 || { echo "❌ Node.js >= 18 wird benötigt."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker Desktop wird benötigt."; exit 1; }

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ .env aus .env.example erstellt"
fi

echo "→ Installiere npm-Abhängigkeiten …"
npm install

echo "→ Starte PostgreSQL, Ollama, pgAdmin (Docker Compose) …"
docker compose up -d postgres ollama pgadmin

echo "→ Warte auf PostgreSQL …"
sleep 5

echo "→ Erzeuge Prisma Client & Datenbankschema …"
npx prisma generate
npx prisma db push

echo "→ Lade Philosophen-Startdaten …"
npm run db:seed

echo ""
echo "✅ Setup abgeschlossen!"
echo "   Starte die App mit: npm run dev"
echo "   Dann öffnen:        http://localhost:3000"
