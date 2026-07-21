# Declutr — AI-Powered Intelligent Digital Life Vault

Declutr is an AI-powered digital life vault engineered to help users securely store, organize, connect, and retrieve the information they accumulate throughout their digital lives.

---

## 🏗️ Repository Architecture (Modular Monorepo)

Declutr is structured as an enterprise-grade modular monorepo containing the Go backend, Next.js web application, Expo mobile application, database management tools, and infrastructure definitions.

```
Declutr Monorepo/
├── backend/                  # Go Domain-Oriented Modular Monolith
│   ├── cmd/server/           # Backend entrypoint (main.go)
│   ├── modules/              # Feature modules (auth, vault, file, search, persona, behavior)
│   │   └── auth/             # Domain, Application, Repository, Transport, Validators
│   ├── shared/               # Cross-cutting concerns (crypto, database, middleware)
│   ├── platform/             # Platform drivers (postgres, redis, storage)
│   └── pkg/                  # Public shared utilities (health checks)
├── frontend/                 # Next.js Web Client (TypeScript)
│   ├── app/                  # App router pages
│   ├── features/             # Web feature modules (auth, vault, search)
│   ├── shared/               # Shared components, hooks, providers, services
│   └── declutr-mobile/       # React Native / Expo Mobile Application
│       ├── app/              # Expo router screens
│       ├── features/         # Mobile feature modules
│       ├── shared/           # Native UI components, providers, services
│       └── navigation/       # Navigation configurations
├── database/                 # Database migrations, seeds, and scripts
├── docs/                     # Architecture specification, ADRs, API contracts, and references
├── infrastructure/           # Docker, Compose, K8s, Terraform, Monitoring
├── scripts/                  # Development, build, and maintenance scripts
├── security/                 # Security policies and audit documentation
└── tests/                    # Unit, Integration, and E2E test suites
```

---

## 🧩 Module Philosophy & Architecture Rules

1. **Domain Isolation:** Each feature module owns its domain models, application services, repositories, and transport handlers. Global `models/` or `repository/` folders are avoided.
2. **Module Contracts:** No feature module may directly depend on another module's database repository implementation. Modules interact only via domain interfaces or application services.
3. **Clean Architecture Layers:**
   - **Domain:** Core entities and pure business rules.
   - **Application:** Use-case services and workflow orchestration.
   - **Repository:** Database persistence implementations.
   - **Transport:** HTTP API handlers and request/response DTOs.
4. **Mirroring Frontend Layouts:** The Next.js web app and React Native Expo mobile app mirror feature modularization (`features/` and `shared/`).

---

## 🚀 Quick Start

### Backend (Go)
```bash
cd backend
go run ./cmd/server
```

### Web Client (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### Mobile App (Expo)
```bash
cd frontend/declutr-mobile
npm install
npm run start
```
