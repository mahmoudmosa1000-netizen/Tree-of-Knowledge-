# 🚀 Deployment-Anleitung

## Option 1 — Standalone `index.html`
Keine Build-Schritte nötig. Datei per GitHub Actions (`pages.yml`) auf GitHub Pages
deployen oder direkt auf Netlify/Cloudflare Pages ziehen.

## Option 2 — Next.js App auf Vercel
1. Repository mit Vercel verbinden (oder `.github/workflows/deploy.yml` mit Secrets
   `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `DATABASE_URL` nutzen).
2. `DATABASE_URL` (PostgreSQL, z. B. Neon/Supabase) als Environment-Variable setzen.
3. Push auf `main` löst automatisches Deployment aus.

## Option 3 — Docker (Self-Hosting)
```bash
docker compose up -d
```
Startet App (Port 3000), PostgreSQL (5432), Ollama (11434) und pgAdmin (5050).

## Option 4 — Eigener Server mit Nginx
Siehe `docs/nginx.conf` — Variante A für die Standalone-App, Variante B als
Reverse-Proxy vor die Next.js-App inkl. Streaming-Support für den KI-Chat.

## Datenbank-Migration
```bash
npx prisma db push     # Schema anwenden
npm run db:seed        # 25 Startphilosophen laden
```
