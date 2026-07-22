# Declutr Extension Security Guide

Declutr enforces security, digital signature verification, and user permission consent.

## Permission Model

Extensions must explicitly declare requested permissions in their manifest:
- `vault.read`, `vault.write`, `workflow.execute`, `ai.generate`, `search.query`, `notification.send`, `storage.read`, `storage.write`, `admin.manage`.

Users must review and approve requested permissions prior to installation. Extensions attempting to invoke ungranted APIs are intercepted and blocked by the sandbox runtime.
