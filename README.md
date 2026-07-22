# Declutr

> Your personal knowledge operating system — private, AI-powered, and built for the way you actually think.

Declutr lets you store every document, note, and file in an end-to-end encrypted Vault, then gives you an AI copilot that can search, summarize, and reason over everything you've ever saved — across every Life Area, Project, and Goal in your life.

---

## Features

| Capability | Description |
|---|---|
| 🔒 **Zero-Knowledge Vault** | SRP-based auth, client-side encrypted storage |
| 🤖 **Grounded AI Copilot** | RAG-powered chat with citations from your own files |
| 🧠 **Semantic Search** | Hybrid keyword + vector search across all assets |
| 🗂️ **Life Operating System** | Life Areas → Projects → Goals instead of plain folders |
| 🔮 **Predictive Intelligence** | Proactive suggestions before you ask |
| 🤝 **Multi-Agent Platform** | Specialist AI agents that collaborate on complex tasks |
| 🔗 **Integrations** | Google Drive, Notion, GitHub, Dropbox connectors |
| 🏢 **Organizations** | Multi-tenant workspaces with role-based access |
| 🔧 **Developer Platform** | REST API, Webhooks, OAuth2, and SDK |
| 🧩 **Extension Marketplace** | Sandboxed third-party extensions |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Mobile | React Native + Expo |
| Backend | Go (net/http), Clean Feature Architecture |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| AI | OpenAI / Gemini API (pluggable providers) |
| Storage | Cloudflare R2 / S3-compatible |
| Auth | SRP (Secure Remote Password) — zero-knowledge |

---

## Repository Structure

```
Declutr/
├── backend/              # Go REST API server
│   ├── cmd/              # Entry point (cmd/main.go)
│   ├── internal/         # Feature-owned modules (auth, users, vault, files, ai, search, ...)
│   ├── db/               # Database drivers & migrations runner
│   ├── storage/          # Storage abstraction (Cloudflare R2 / S3)
│   ├── middleware/       # Shared HTTP middleware
│   ├── utils/            # Shared utilities & helpers
│   ├── tests/            # Integration & unit test suites
│   └── main.go           # Root server entry point
├── frontend/             # Next.js web app
│   ├── app/              # App Router pages
│   ├── features/         # Feature components (auth, vault, copilot, lifeos, …)
│   ├── components/       # Shared UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API client functions
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
├── mobile/               # React Native + Expo mobile app
│   ├── app/              # Navigation pages
│   ├── components/       # Native UI components
│   ├── features/         # Feature components
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── stores/           # Mobile state stores
│   ├── types/            # Type definitions
│   └── assets/           # App icons and media
├── database/
│   └── migrations/       # 10 grouped SQL migrations (001_auth.sql – 010_settings.sql)
├── docs/
│   └── declutr_architecture_document.html  # Interactive architecture docs
├── docker-compose.yml    # One-command local dev environment
├── .env.example          # All environment variables documented
├── LICENSE               # MIT License
└── README.md
```

---

## ⏳ Timeline & Memory Engine (Issue #050)

Declutr organizes memories around time, allowing users to effortlessly explore their digital life history:

| Component | Technical Capability |
|---|---|
| ⏳ **Vertical Timeline Stream** | Chronological stream listing events (Upload, Import, AI Summary, Workflow, AI Chat) with sequential event links (`vertical-timeline-stream.tsx`) |
| 🎴 **Smart Memory Cards** | Cards generated for trips, annual financials, medical records, and flashback memories (`memory-card.tsx`) |
| 📊 **35-Day Activity Heatmap** | GitHub-style visual activity heatmap tracking memory upload and processing intensity (`activity-heatmap.tsx`) |
| 🔍 **Time Scrubber & Search** | Scrubber filtering events by Today, This Week, This Month, Custom Range, and natural text queries |
| 📱 **Mobile Timeline Feed** | React Native Expo timeline component (`mobile-timeline-feed.tsx`) displaying memory cards and event stream |

---

## 🏥 Knowledge Management Center & Data Health (Issue #049)

Declutr's Knowledge Health Center helps users maintain a clean, trustworthy, and well-organized digital vault as it scales:

| Feature | Technical Implementation |
|---|---|
| 📊 **Knowledge Health Score (92/100)** | Health score calculator evaluating Metadata Completeness (95%), Organization Rate (90%), Low Duplicate Rate (98%), Processing Success (99%), and Search Readiness (100%) |
| 👯 **Duplicate File Manager** | Detection of exact duplicates, near duplicates, and versioned files with Merge, Keep Both, or Delete controls |
| 🏷️ **AI Metadata Review** | Suggestion cards displaying AI confidence % (94%) with Accept, Edit, and Reject actions |
| 📂 **Uncategorized Item Manager** | Identifies files lacking tags/collections with one-click smart organization recommendations |
| 🧹 **Bulk Cleanup Tools** | Bulk Tagging Engine and Bulk Archive/Purge for temporary documents older than 90 days |
| 📱 **Mobile Health Summary** | React Native Expo health sheet (`mobile_health_sheet.tsx`) displaying score and duplicate review |

---

## 📁 Universal Import Hub & Connected Digital Life (Issue #048)

Declutr's Universal Import Hub brings together all of a user's digital information across cloud services, repos, productivity tools, mail, and local files:

| Feature | Technical Implementation |
|---|---|
| 🌐 **Connected Services Grid** | Service connectors for Google Drive, Dropbox, OneDrive, iCloud, GitHub, Notion, Amazon S3, Gmail, Slack, and Local ZIP |
| 🛡️ **Import Preview Modal** | Pre-import file count, estimated storage size, duplicate filter rules (Skip, Merge, Rename), and conflict resolution |
| 📊 **Import Queue Telemetry** | Active import progress bars with pause, resume, and cancel controls |
| 📜 **Import History Table** | Historical import logs detailing Source, Timestamp, Duration, File Count, and Success/Failure status |
| 💡 **Smart Suggestions** | Proactive import alerts ("Google Drive connected, but Financials folder un-synced") |
| 📱 **Mobile Quick Import** | React Native Expo import sheet (`mobile_import_sheet.tsx`) for Camera Document Scan, Gallery, and Cloud Files |

---

## 🤖 Cross-Knowledge Intelligence & Global AI Workspace (Issue #047)

Declutr's Global AI Workspace transforms single-document AI into a multi-file cross-knowledge reasoning engine:

| Component | Technical Capability |
|---|---|
| 🌐 **Multi-Doc Scope Selector** | Scope selection between Entire Vault, Collections, Projects, Search Results, or Selected Multi-Files (`scope-selector.tsx`) |
| 🛡️ **Verifiable Citations** | Citation cards displaying Document Name, Page/Section, Confidence Match % (96%), and direct jump links (`citation-list.tsx`) |
| 📊 **Knowledge Comparison Matrix** | Multi-document matrix highlighting Differences, Similarities, and Missing Information across files (`knowledge-comparison-matrix.tsx`) |
| 💬 **Chat History & Pinned Sessions** | Session history sidebar managing pinned conversations, search chats, and clear history (`chat-history-sidebar.tsx`) |
| 🔍 **Search + AI Integration** | Multi-select search results with one-click "Ask AI About Selected Content (N files)" redirection |
| 📱 **Mobile AI Workspace** | React Native Expo copilot component (`mobile_ai_workspace.tsx`) with scope selection and citations |

---

## 📡 Real-Time Platform, Live Updates & Presence (Issue #046)

Declutr's unified real-time event layer eliminates page refreshes and delivers zero-latency state synchronization:

| Capability | Technical Implementation |
|---|---|
| ⚡ **Real-Time Event Engine** | `RealtimeService` managing WebSocket/SSE transport fallback, exponential backoff reconnection, heartbeat pinging, and typed event emitter |
| 🟢 **Presence Framework** | `PresenceService` tracking online/idle/offline status, active device info, session heartbeat, and vault sandbox telemetry |
| 🔊 **Accessible ARIA Regions** | Hidden ARIA live region (`<div aria-live="polite">`) announcing critical processing events to screen readers |
| 📊 **Live Dashboard Updates** | Auto-updates processing queue progress, storage telemetry, and daily activity timeline without page refreshes |
| 💬 **AI Token Streaming** | Simulated token-by-token streaming response in AI Copilot Chat with active typing indicator and cancellation |
| 📱 **Mobile Real-Time** | `mobileRealtimeService` handling connection state and live processing updates on React Native Expo |

---

## 🧭 Context-Aware Workspace & Intelligent Navigation (Issue #045)

Declutr automatically tracks, surfs, and adapts to your active working context across every page:

| Feature | Description |
|---|---|
| 🌐 **Workspace Context Provider** | Global React context managing `activeVault`, `activeCollection`, `activeProject`, `activeDocument`, `activeChat`, `activeSearch`, and `recentContexts` stack |
| 📍 **Persistent Context Bar** | Header bar displaying interactive breadcrumbs (`Home > Vault > Collection > Project > Document`), active AI context badge, quick smart actions, and context switcher trigger |
| ⚡ **Context Switcher (`⌘J`)** | Sub-100ms workspace switcher modal enabling one-click switching between vaults, collections, projects, recent files, and saved searches |
| 🤖 **AI Context Auto-Sync** | Automatically pre-populates active document/collection context into AI Copilot chat without manual re-selection |
| 🧩 **Smart Adaptive Sidebar** | Dynamically surfaces related files, linked collections, related AI chats, and contextual suggestions |
| 📱 **Mobile Context Sheet** | React Native Expo context sheet (`mobile_context_sheet.tsx`) allowing mobile context switching |

---

## ⚡ Command Palette & Keyboard Productivity (Issue #044)

Declutr features a Raycast/Linear-inspired Spotlight Universal Command Palette (`⌘K` / `Ctrl+K`) for keyboard-first navigation:

| Hotkey | Capability & Action |
|---|---|
| ⌨️ **`⌘K` / `Ctrl+K`** | Open Universal Command Palette Spotlight from any screen |
| ⬆️⬇️ **Arrow Keys** | Highlight and navigate search results cleanly in sub-100ms fuzzy index |
| ↵ **Enter Key** | Instantly execute command, open file, navigate page, or trigger action |
| 📁 **`⌘U` / `Ctrl+U`** | Open Quick Upload Memory modal |
| 🤖 **`⌘⇧A` / `Ctrl+Shift+A`** | Jump directly to AI Copilot Chat workspace |
| ❓ **`⌘/` / `Ctrl+/`** | Display Keyboard Shortcuts Cheat-Sheet dialog |
| ❌ **`Esc`** | Dismiss command palette, dialogs, or active modals |
| 📱 **Mobile Sheet** | Mobile Quick Action Bottom-Sheet modal on React Native Expo |

---

## 🌟 Dashboard & Personal Intelligence Hub (Issue #043)

Declutr's Home Dashboard (`/dashboard`) is a living Personal Intelligence Hub designed for daily user retention and calm clarity:

| Widget Component | Capability & Purpose |
|---|---|
| 🌅 **Greeting Header** | Time-of-day greeting, active date banner, zero-knowledge vault status badge, and onboarding walkthrough launcher |
| ⚡ **Quick Actions Bar** | One-tap pills for Upload File, Scan Document, Ask AI, Search Everything, Create Collection, New Folder, Import Files, Create Workflow |
| 🔍 **Smart Search Hero** | Prominent natural language search bar with autocomplete suggestions, recent search chips, and `⌘K` keyboard shortcut |
| 💡 **AI Intelligence Insights** | Explainable proactive recommendations for documents needing review, expiring passports/IDs, missing metadata tags, and search recommendations |
| 📂 **Continue Working** | Unified feed of recently opened assets, recent AI copilot conversations, and active collections |
| 📌 **Pinned Content & Favorites** | User-pinned folders, collections, projects, files, AI chats, and saved searches with drag/pin management |
| 🕒 **Daily Activity Timeline** | Chronological timeline tracking file uploads, AI processing completion, vector indexing, search queries, and copilot sessions |
| 🎛️ **Dashboard Customizer** | Interactive layout customizer allowing users to reorder, pin, hide, or reset home widgets with persistent local preferences |
| 📱 **Mobile Mirror** | React Native Expo home screen (`mobile/app/(tabs)/index.tsx`) mirroring exact dashboard features |

---

## 🎨 Unified Design System & Product Experience (Issue #042)

Declutr adheres to a unified design language inspired by Linear, Raycast, Arc Browser, and Vercel:

| Primitive | Design Token Standard |
|---|---|
| 🎨 **Color Palette** | Dark Mode (`#090d16` App BG, `#0f172a` Surface, `#141c2e` Card, `#1e293b` Border), Emerald primary accent (`#10b981`), Indigo secondary (`#6366f1`) |
| 🔤 **Typography** | Inter system font stack, hierarchical font sizing (`text-xs` to `text-6xl`), line heights |
| 🔳 **Border Radii** | `rounded-md` (8px), `rounded-lg` (12px), `rounded-xl` (16px), `rounded-full` |
| 💫 **Micro-Animations** | Subtle 150-200ms ease transitions, skeleton loader pulse, focus ring indicators |
| 🛡️ **Accessibility** | WCAG AA compliance, ARIA labels, keyboard focus rings (`ring-2 ring-emerald-500/50`), `@media (prefers-reduced-motion)` support |
| 🧩 **Primitives** | Built with `shadcn/ui`, Radix UI primitives, Tailwind CSS v4, Lucide Icons |
| 📱 **Mobile Consistency** | React Native Expo app mirrors exact web design tokens, colors, and typography |

---

## 🚀 Getting Started — Complete End-to-End User Journey

A new user can experience the complete Declutr workflow in under 2 minutes:

1. **Sign Up (`/register`)**: Create an account with zero-knowledge Secure Remote Password (SRP-6a) authentication. Your master passphrase never leaves your browser.
2. **Login (`/login`)**: Perform mutual zero-knowledge proof verification. The unwrapped Master Vault Key decrypts your active session in local memory.
3. **Create Vault (`/vault`)**: Initialize your root zero-knowledge workspace container ("My Life Vault").
4. **Dashboard (`/dashboard`)**: Monitor active vault storage, processing pipeline status, recent searches, and recent AI chats.
5. **Upload Files (`/upload` / `UploadModal`)**: Drag and drop documents, PDFs, or receipts.
6. **Watch Processing Progress**: Real-time pipeline stage telemetry:
   `Validate` ➔ `Store` ➔ `Queue` ➔ `Extract Text` ➔ `OCR` ➔ `Metadata` ➔ `AI Summary` ➔ `Entities` ➔ `Embeddings` ➔ `Search Indexing` ➔ `Ready`
7. **View AI Analysis (`/files/[id]`)**: Inspect extracted text, metadata tags, executive summary, and extracted entities.
8. **Search Naturally (`/search`)**: Use natural language queries like *"Tax form 2025"* or *"Doctor prescription"*. The hybrid search engine fuses keyword FTS + pgvector 512-dim embeddings.
9. **Chat with AI (`/copilot`)**: Ask natural questions like *"What is this document?"*, *"Summarize this"*, or *"What dates are mentioned?"*. Receive grounded answers with exact source citations.

---

## Quick Start (10–15 Minutes Onboarding)

### Prerequisites

- **Go** 1.22+
- **Node.js** 18+
- **Docker** (for local Postgres + Redis)

### 1. Clone

```bash
git clone https://github.com/lakshhchopra/declutr.git
cd declutr
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Start database & cache

```bash
docker compose up -d db redis
```

### 4. Run backend

```bash
cd backend
go run main.go
# API available at http://localhost:8080
```

### 5. Run frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:3000
```

### 6. Run mobile (optional)

```bash
cd mobile
npm install
npx expo start
```

### One-command (Docker)

```bash
docker compose up
# Frontend → http://localhost:3000
# Backend  → http://localhost:8080
```

---

## Environment Variables

Copy `.env.example` to `.env`. All variables are documented in [`docs/declutr_architecture_document.html`](docs/declutr_architecture_document.html).

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `GEMINI_API_KEY` | Google Gemini API key (alternative) |
| `R2_BUCKET` | Cloudflare R2 bucket name |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret |
| `JWT_SECRET` | JWT signing secret |
| `PORT` | Backend server port (default: 8080) |

---

## Database Migrations

Migrations live in `database/migrations/` and run automatically in Docker. They are grouped into 10 logical domain files:

| File | Domain |
|---|---|
| `001_auth.sql` | Users, SRP credentials, sessions, security audit |
| `002_users.sql` | User profiles, preferences, personal settings |
| `003_vault.sql` | Encrypted vaults, keys, permissions |
| `004_assets.sql` | Assets, asset versions, recycle bin |
| `005_processing.sql` | Processing jobs, content extractions, OCR |
| `006_ai.sql` | AI conversations, memory, persona, agents, predictive, LifeOS |
| `007_search.sql` | Vector embeddings, saved searches, search history |
| `008_workflows.sql` | Automations, workflow executions, notifications |
| `009_organizations.sql` | Multi-tenant organizations, members, shared assets |
| `010_settings.sql` | API keys, webhooks, extensions marketplace |

---

## Deployment

### Backend → [Railway](https://railway.app) / [Render](https://render.com) / [Fly.io](https://fly.io)

```bash
# Railway example
railway login
railway up
```

### Frontend → [Vercel](https://vercel.com) / [Netlify](https://netlify.com)

```bash
# Vercel example
cd frontend
vercel deploy
```

### Database → [Supabase](https://supabase.com) / [Neon](https://neon.tech)

Create a project and copy the connection string into `DATABASE_URL`.

### Storage → [Cloudflare R2](https://developers.cloudflare.com/r2/)

Create a bucket and set `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.

### Cache → [Upstash Redis](https://upstash.com)

Create a Redis database and copy the URL into `REDIS_URL`.

---

## API Overview

The REST API is available at `http://localhost:8080/api/v1/`. Full documentation is in [`docs/declutr_architecture_document.html`](docs/declutr_architecture_document.html).

Key endpoint groups:

- `/api/v1/auth/*` — Authentication (register, login, session)
- `/api/v1/vaults/*` — Vault and asset management
- `/api/v1/copilot/*` — AI Copilot conversations
- `/api/v1/search/*` — Hybrid knowledge search
- `/api/v1/lifeos/*` — Life Operating System (areas, projects, goals)
- `/api/v1/predictive/*` — Predictive intelligence feed
- `/api/v1/agents/*` — Autonomous agent platform
- `/api/v1/multiagent/*` — Multi-agent coordinator
- `/api/v1/developer/*` — Public developer platform (API keys, webhooks)
- `/api/v1/organizations/*` — Enterprise multi-tenancy
- `/api/v1/extensions/*` — Extension marketplace

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## Architecture

Full interactive architecture documentation is available at [`docs/declutr_architecture_document.html`](docs/declutr_architecture_document.html).

---

## License

MIT — see [LICENSE](LICENSE).
