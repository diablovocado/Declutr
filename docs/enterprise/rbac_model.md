# Declutr Role-Based Access Control (RBAC) Specification

Declutr enforces configurable RBAC with system roles and custom extensible permission assignments.

## Default System Roles

- **OWNER**: Complete organization administration, billing, security, and ownership transfer.
- **ADMINISTRATOR**: Member management, workspace creation, policy updates, and integration setup.
- **MANAGER**: Team & group management, workspace administration.
- **EDITOR**: Read/write access to vault contents, collections, and AI features.
- **CONTRIBUTOR**: Asset upload and metadata editing privileges.
- **VIEWER**: Read-only access to workspaces and insights.
- **GUEST**: Restricted temporary access.

## 10 Granular Permissions

- `MANAGE_ORGANIZATION`, `MANAGE_BILLING`, `MANAGE_USERS`, `MANAGE_VAULTS`, `MANAGE_AI`, `MANAGE_WORKFLOWS`, `MANAGE_INTEGRATIONS`, `MANAGE_SECURITY`, `MANAGE_AUDIT`, `VIEW_ANALYTICS`.
