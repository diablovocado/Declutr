# Declutr Workspace Hierarchy Specification

Workspaces map to underlying Vaults and define organizational resource boundaries.

## Workspace Classifications

1. **PERSONAL**: User's private personal vault (`organization_id = NULL`).
2. **ORGANIZATION**: Organization-wide shared vault accessible to all active org members.
3. **DEPARTMENT**: Department-isolated workspace (e.g., *Engineering*, *Legal*, *Finance*).
4. **SHARED**: Cross-team collaborative workspace.
5. **ARCHIVED**: Read-only historical vault workspace.
