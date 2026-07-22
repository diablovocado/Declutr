# Declutr RC1 Production Configuration Guide

Complete environment variable reference for Declutr backend & frontend services.

## Backend Environment Variables

| Key | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP Server Port |
| `ENV` | `production` | Deployment Environment (`development`, `staging`, `production`) |
| `DATABASE_URL` | `postgres://declutr:secret@localhost:5432/declutr` | PostgreSQL DSN Connection String |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis DSN Connection String |
| `STORAGE_PROVIDER` | `local` | Storage Backend (`local`, `s3`, `gcs`) |
| `OPENAI_API_KEY` | `` | OpenAI API Key for Grounded RAG |
| `RATE_LIMIT_GLOBAL_RPS` | `100` | Global Rate Limiter RPS Limit |
| `LOG_LEVEL` | `info` | JSON Structured Logger Level (`debug`, `info`, `warn`, `error`) |
