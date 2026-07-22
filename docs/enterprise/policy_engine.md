# Declutr Enterprise Governance Policy Engine Specification

The Policy Engine evaluates and enforces organization-wide security, retention, sharing, and AI execution guardrails.

## Policy Types

1. `PASSWORD_POLICY`: Minimum length, complexity, and expiration days.
2. `SESSION_TIMEOUT`: Inactivity timeout duration before session invalidation.
3. `MFA_REQUIREMENT`: Mandatory Multi-Factor Authentication requirement for all org members.
4. `SHARING_RESTRICTION`: Restrictions on public links and external email sharing.
5. `RETENTION_POLICY`: Automated data lifecycle retention and purge rules.
6. `AI_USAGE_POLICY`: Organization AI provider inference limits and grounding boundaries.
7. `WORKFLOW_RESTRICTION`: Execution policies on automated background actions.
