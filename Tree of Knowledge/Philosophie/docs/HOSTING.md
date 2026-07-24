# 🌐 5 Hosting-Optionen im Überblick

| Option | Aufwand | Kosten | Datenbank/KI | Empfohlen für |
|---|---|---|---|---|
| **GitHub Pages** (`index.html`) | ⭐ minimal | kostenlos | nein (nur lokal via Ollama) | schnelles Teilen, Demos |
| **Netlify Drop** | ⭐ minimal | kostenlos | nein | Sofort-Deploy ohne Git |
| **Cloudflare Pages** | ⭐⭐ gering | kostenlos | nein | globales CDN, `_headers`/`_redirects` |
| **Vercel** (Next.js) | ⭐⭐ gering | Free-Tier | ja (externe Postgres nötig) | volle App inkl. API-Routen |
| **Docker / eigener Server** | ⭐⭐⭐ mittel | Server-Kosten | ja (inklusive) | volle Kontrolle, Ollama inklusive |

## Empfehlung
- **Nur ausprobieren?** → `index.html` per Netlify Drop.
- **Produktiv mit Datenbank & KI-Chat?** → Docker Compose auf einem eigenen Server
  oder Vercel + externer Postgres + separat gehostetes Ollama.
