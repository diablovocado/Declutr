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
