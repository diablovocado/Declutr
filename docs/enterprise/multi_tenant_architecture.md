# Declutr Multi-Tenant Enterprise Architecture

Declutr's multi-tenant architecture provides scalable enterprise multi-tenancy while guaranteeing complete backward compatibility for personal single-user accounts.

## Multi-Tenant Hierarchy

```
                                [ Declutr Platform ]
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
       [ Personal Account ]                             [ Enterprise Organization ]
     Single-user Vault (Default)                         Multi-Tenant Tenant Unit
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                               [ Workspace / Vault ]
                     (Personal, Organization, Department, Shared)
                                         │
                                         ▼
                                   [ Collections ]
                                         │
                                         ▼
                                     [ Assets ]
```

## Data Isolation & Security Boundaries

1. **Context Propagation & Middleware**:
   - `TenantMiddleware` extracts `X-Organization-ID` headers or JWT claims and injects `OrganizationIDKey` into context.
   - Restricts cross-tenant database querying via mandatory `organization_id` foreign keys and composite indexes on `vaults`, `audit_events`, and metadata tables.

2. **Personal Accounts Compatibility**:
   - Personal accounts operate cleanly with `organization_id = NULL`. Personal vaults require no organization overhead.
