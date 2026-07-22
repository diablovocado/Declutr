# Declutr Extension Sandbox Guide

The Extension Sandbox (`ExtensionSandbox`) provides isolated runtime boundaries preventing malicious or buggy extensions from affecting core Declutr stability.

## Resource Quotas & Isolation

- **Execution Timeout**: 5 seconds per invocation maximum.
- **Memory Limit**: 128MB per sandbox instance.
- **Crash Isolation**: Unhandled exceptions and panics in extension code are caught, logged, and isolated without crashing the Declutr backend server.
