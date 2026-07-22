-- Migration: 031_create_autonomous_agent_tables.sql
-- Description: Autonomous Knowledge Agent Platform (Declutr Intelligence v2) Database Schema

-- 1. Autonomous Agents Master Table
CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- KNOWLEDGE_AGENT, RESEARCH_AGENT, ORGANIZATION_AGENT, DOCUMENT_AGENT, FINANCIAL_AGENT, TRAVEL_AGENT, LEARNING_AGENT, COMPLIANCE_AGENT
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, WORKING, IDLE, ERROR
    execution_mode VARCHAR(50) NOT NULL DEFAULT 'GOAL_DRIVEN', -- MANUAL_APPROVAL, AUTOMATIC, SCHEDULED, EVENT_DRIVEN, GOAL_DRIVEN
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agents_user ON agents (user_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents (status);

-- 2. Persistent User Goals Table
CREATE TABLE IF NOT EXISTS agent_goals (
    id VARCHAR(255) PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    schedule VARCHAR(100) DEFAULT 'CONTINUOUS',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_goals_agent ON agent_goals (agent_id);

-- 3. Multi-Step Execution Plans Table
CREATE TABLE IF NOT EXISTS agent_plans (
    id VARCHAR(255) PRIMARY KEY,
    goal_id VARCHAR(255) NOT NULL REFERENCES agent_goals(id) ON DELETE CASCADE,
    agent_id VARCHAR(255) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    explanation TEXT,
    reasoning TEXT,
    confidence NUMERIC(3,2) DEFAULT 0.95,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, AWAITING_APPROVAL, APPROVED, REJECTED, RUNNING, COMPLETED, FAILED
    requires_review BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_plans_goal ON agent_plans (goal_id);
CREATE INDEX IF NOT EXISTS idx_agent_plans_status ON agent_plans (status);

-- 4. Plan Tasks / Tool Step Interceptors Table
CREATE TABLE IF NOT EXISTS agent_tasks (
    id VARCHAR(255) PRIMARY KEY,
    plan_id VARCHAR(255) NOT NULL REFERENCES agent_plans(id) ON DELETE CASCADE,
    sequence_index INT NOT NULL,
    tool_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_destructive BOOLEAN DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    result TEXT,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_plan ON agent_tasks (plan_id);

-- 5. Operational Agent Memory Table
CREATE TABLE IF NOT EXISTS agent_memory (
    id VARCHAR(255) PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- SUCCESS, FAILURE, PREFERENCE, FEEDBACK
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_mem_agent ON agent_memory (agent_id);

-- 6. User Feedback Learning Table
CREATE TABLE IF NOT EXISTS agent_feedback (
    id VARCHAR(255) PRIMARY KEY,
    plan_id VARCHAR(255) NOT NULL REFERENCES agent_plans(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    approved BOOLEAN NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Agent Execution Telemetry Audit Log Table
CREATE TABLE IF NOT EXISTS agent_executions (
    id VARCHAR(255) PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    plan_id VARCHAR(255) NOT NULL REFERENCES agent_plans(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    duration_ms INT8 NOT NULL,
    log TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_exec_agent ON agent_executions (agent_id);

-- 8. Agent Scoped Permissions Table
CREATE TABLE IF NOT EXISTS agent_permissions (
    agent_id VARCHAR(255) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (agent_id, permission_name)
);
