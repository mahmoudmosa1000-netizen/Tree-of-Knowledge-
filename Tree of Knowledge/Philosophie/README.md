# 🌳 Tree of Knowledge

**Philosophie als lebendiges Universum** — interaktive Wissensplattform mit 25 Philosophen, 5 Ansichten, lokaler KI und automatischem Wikipedia-Scraper.

---

## 📁 Struktur nach dem Entpacken

```
tree-of-knowledge-GITHUB/
│
├── 📄 index.html                    ← 🌟 STANDALONE APP — einfach doppelklicken!
│                                        71 KB · keine Installation nötig
│
├── 📄 README.md                     ← diese Datei
├── 📄 .gitignore                    ← Git-Ausschlüsse (node_modules etc.)
├── 📄 package.json                  ← npm-Abhängigkeiten (Next.js App)
├── 📄 next.config.js                ← Next.js Konfiguration
├── 📄 tailwind.config.ts            ← Tailwind CSS
├── 📄 tsconfig.json                 ← TypeScript-Konfiguration
├── 📄 vercel.json                   ← Vercel Deployment-Konfiguration
├── 📄 netlify.toml                  ← Netlify Konfiguration
├── 📄 docker-compose.yml            ← PostgreSQL + Ollama + pgAdmin
├── 📄 Dockerfile                    ← Produktions-Container
├── 📄 setup.sh                      ← Ein-Befehl-Setup (bash setup.sh)
├── 📄 .env.example                  ← Vorlage für Umgebungsvariablen
│
├── 📁 src/                          ← Next.js Produktions-App
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx            ← Root-Layout (Fonts, Metadata)
│   │   ├── 📄 page.tsx              ← Hauptseite
│   │   ├── 📄 globals.css           ← Globale Styles
│   │   └── 📁 api/
│   │       ├── 📁 ai/
│   │       │   └── 📄 route.ts      ← Ollama-Proxy API (löst CORS)
│   │       └── 📁 philosophers/
│   │           └── 📄 route.ts      ← REST API (Prisma → PostgreSQL)
│   │
│   ├── 📁 components/
│   │   ├── 📁 Tree/
│   │   │   └── 📄 TreeSVG.tsx       ← Baum mit Blättern + Animationen
│   │   ├── 📁 Views/
│   │   │   ├── 📄 MindMapView.tsx   ← Einfluss-Netzwerk mit D3
│   │   │   └── 📄 TimelineView.tsx  ← Chronologische Liste
│   │   ├── 📁 Sidebar/
│   │   │   ├── 📄 Sidebar.tsx       ← Philosoph-Detailpanel
│   │   │   └── 📄 AIChat.tsx        ← KI-Streaming-Chat
│   │   └── 📁 UI/
│   │       ├── 📄 Header.tsx        ← Navigation + Suche + Controls
│   │       └── 📄 OllamaModal.tsx   ← KI-Konfiguration
│   │
│   ├── 📁 lib/
│   │   ├── 📄 db.ts                 ← Prisma Client (Singleton)
│   │   └── 📄 ollama.ts             ← Ollama Streaming-Client
│   │
│   ├── 📁 stores/
│   │   └── 📄 treeStore.ts          ← Zustand (globaler State + Persistenz)
│   │
│   └── 📁 types/
│       └── 📄 index.ts              ← TypeScript-Typen
│
├── 📁 prisma/
│   ├── 📄 schema.prisma             ← Datenbankschema (Philosophen, Einflüsse, User)
│   └── 📄 seed.ts                   ← 25 Philosophen als Startdaten
│
├── 📁 scripts/
│   ├── 📄 scrape-wikidata.ts        ← Auto-Scraper (80+ Philosophen von Wikidata)
│   └── 📄 detect-influences.ts      ← Einfluss-Netzwerk automatisch erkennen
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── 📄 pages.yml             ← GitHub Pages (index.html automatisch deployen)
│       └── 📄 deploy.yml            ← CI/CD → Vercel (bei jedem Push auf main)
│
├── 📁 docs/
│   ├── 📄 DEPLOYMENT.md             ← Vollständige Deploy-Anleitung
│   ├── 📄 HOSTING.md                ← 5 Hosting-Optionen erklärt
│   └── 📄 nginx.conf                ← Nginx-Konfiguration (eigener Server)
│
└── 📁 public/
    ├── 📄 _headers                  ← Cloudflare Pages Header
    └── 📄 _redirects                ← Cloudflare Pages Redirects
```

---

## ⚡ Schnellstart

### Option 1 — Sofort starten (kein Setup)
```
index.html  →  Doppelklick  →  fertig ✓
```
Funktioniert direkt im Browser. Alle 25 Philosophen, 5 Ansichten, Quiz, Galaxie.  
Für Ollama KI: lokal `OLLAMA_ORIGINS=* ollama serve` starten.

---

### Option 2 — Auf GitHub hochladen + GitHub Pages

```bash
# 1. Neues Repo auf github.com anlegen
# 2. ZIP entpacken, in den Ordner wechseln
cd tree-of-knowledge-GITHUB

# 3. Git initialisieren
git init
git add .
git commit -m "🌳 Tree of Knowledge — Initial Commit"

# 4. Mit GitHub verbinden und pushen
git remote add origin https://github.com/DEIN-NAME/tree-of-knowledge.git
git push -u origin main
```

**Dann:** Repository → Settings → Pages → Source: **GitHub Actions**

→ Die `index.html` wird automatisch auf `https://DEIN-NAME.github.io/tree-of-knowledge` deployed.

---

### Option 3 — Netlify (60 Sekunden)
```
netlify.com/drop  →  index.html reinziehen  →  fertig ✓
```

---

### Option 4 — Vollständige App (Next.js + Datenbank + KI)
```bash
# Voraussetzungen: Node.js ≥ 18, Docker Desktop
bash setup.sh

# Danach:
npm run dev
# → http://localhost:3000
```

---

## 🌟 Features

| | |
|---|---|
| 🌳 Baum mit echten Blättern + Windanimation | 🎮 Quiz (Zitate, Ideen, Epochen) |
| 🍎 25 Philosophen als leuchtende Äpfel | ★ Lernfortschritt + grüne Checkmarks |
| 📸 Wikipedia-Portraits (live geladen) | 🎲 Zufalls-Entdeckung |
| ⧉ Zitat kopieren (1 Klick) | 🔗 Teilbare Links (#philosopher=kant) |
| 🕸 Mind Map mit Einfluss-Pfeilen | ⬇ Offline-Download |
| 📅 Chronologische Timeline | 💡 Concept Explorer (Ideen filtern) |
| 🌌 Galaxie-Ansicht (D3 Force, draggbar) | ⌨ Keyboard-Shortcuts (T/M/L/G/Q) |
| 🔍 Echtzeit-Suche in allen Ansichten | 📱 PWA — als App installierbar |
| 🦙 Ollama KI-Chat + Streaming | 🗄️ PostgreSQL + Prisma (Next.js) |
| 🌍 DE / EN / عر (RTL vollständig) | 🤖 Wikidata-Scraper (80+ Philosophen) |

---

## ⌨ Tastaturkürzel

| Taste | Aktion |
|---|---|
| `T` | Baum-Ansicht |
| `M` | Mind Map |
| `L` | Timeline |
| `G` | Galaxie |
| `Q` | Quiz |
| `1` `2` `3` `4` | Quiz-Antwort wählen |
| `N` oder `Space` | Nächste Quiz-Frage |
| `ESC` | Sidebar schließen / Filter löschen |

---

## 🔗 Teilbare Links

```
https://deine-domain.de/#philosopher=nietzsche
https://deine-domain.de/#philosopher=kant&view=galaxy
https://deine-domain.de/#philosopher=arendt&view=mindmap
```

Der 🔗-Button in der Sidebar kopiert den Link automatisch.

---

## 🦙 Ollama KI einrichten

```bash
# 1. Installieren
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Modell laden
ollama pull llama3

# 3. Mit Browser-Zugriff starten
OLLAMA_ORIGINS=* ollama serve

# 4. In der App: ⚙ Ollama → URL: http://localhost:11434
```

---

## 📦 Nächste Schritte

| Schritt | Datei |
|---|---|
| Deployment-Anleitung | `docs/DEPLOYMENT.md` |
| Hosting-Optionen | `docs/HOSTING.md` |
| Mehr Philosophen (80+) | `npx ts-node scripts/scrape-wikidata.ts` |
| Einfluss-Netzwerk | `npx ts-node scripts/detect-influences.ts` |
| Datenbank-UI | `npm run db:studio` |

---

*„Das Staunen ist der Anfang der Weisheit." — Platon*
