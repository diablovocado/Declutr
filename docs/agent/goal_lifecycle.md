# Declutr Persistent Goal Lifecycle Guide

Persistent goals are long-running operational objectives configured by users (e.g., "Keep tax receipts organized", "Monitor expiring IDs").

## Lifecycle States

1. **Goal Registration**: Goal created via UI or API.
2. **Decomposition**: `PlanningEngine` constructs multi-step plan.
3. **Reasoning & Safety Evaluation**: `ReasoningEngine` evaluates task safety & confidence.
4. **Approval Checkpoint**: Destructive plans wait in Approval Center for user consent.
5. **Execution & Memory**: Plan executes; result telemetry logged in `agent_executions` and `agent_memory`.
