# Architecture Manual

## Overview

EP Intelligence is an AI Executive Operating System for EP Golf Studios.

It is now formally packaged as **v2.0 — Executive Action Centre & Executive Copilot**.

The architecture is designed so that:

- providers supply business data
- services normalise business domains
- the intelligence layer explains what changed and what matters
- Executive Memory retains durable context
- the Executive Action Centre turns recommendations into one approval-first workflow
- Executive Copilot answers executive questions on top of the same stack

## Governing references

- `PRODUCT_VISION.md`
- `PROJECT_PRINCIPLES.md`
- `DEFINITION_OF_DONE.md`
- `RELEASE_MANAGEMENT.md`
- `docs/integration-framework.md`
- `docs/executive-memory.md`

## System layers

### 1. Provider Layer

Providers remain the controlled source of business data.

Current live-capable provider paths:

- GA4
- YouTube
- Unified Social
- Gmail
- Google Calendar

All provider hydration still happens through local generated snapshots, not browser-side secrets.

### 2. Service Layer

Services remain the stable business API for the UI.

Key services now include:

- `ExecutiveService`
- `FinanceService`
- `MarketingService`
- `CommunicationsService`
- `TimelineService`
- `ApprovalService`
- `ReportService`
- `MemoryService`
- `ActionService`
- `IntegrationService`
- `IntelligenceService`

### 3. Intelligence Layer

The deterministic intelligence layer continues to own:

- health scoring
- correlations
- recommendations
- insights
- narratives
- executive Q&A framing

It should consume service-backed data, not raw provider payloads.

### 4. Executive Memory & Knowledge Graph Layer

Executive Memory remains provider-independent and local-first.

It now stores and links:

- timeline events
- decisions
- goals
- deterministic context
- action history
- approved / rejected / completed action outcomes

The knowledge graph now includes action nodes and action-linked edges alongside goals, decisions, risks, opportunities, approvals, and recommendations.

### 5. Action Layer

v2.0 introduces a formal Action Layer.

Core modules:

- `assets/services/action-service.js`
- `assets/actions/action-store.js`
- `assets/execution/execution-layer.js`

Responsibilities:

- synthesise actions from finance, marketing, inbox, operations, approvals, reports, memory, and intelligence
- rank actions into executive queues
- expose action analytics and reports
- feed Business Health, CEO Dashboard, search, memory, and Board Meeting Mode
- keep all action state approval-first and non-automatic

### 6. Execution Layer

Execution adapters now exist structurally, but not operationally.

Current adapters:

- `EmailAdapter`
- `CalendarAdapter`
- `SocialAdapter`
- `AccountingAdapter`
- `CRMAdapter`

Each adapter exposes:

- `validate()`
- `preview()`
- `execute()`

In v2.0, `execute()` must intentionally return **Approval Required**.

### 7. Presentation Layer

The UI remains a static SPA built with HTML, CSS, and vanilla JavaScript.

New top-level operating-system surfaces include:

- `/executive-action-centre`
- `/executive-action-centre/queue`
- `/executive-action-centre/action-detail`
- `/executive-action-centre/approval-workflow`
- `/executive-copilot`
- `/executive-copilot/ask`
- `/executive-copilot/executive-briefing`
- `/executive-copilot/memory-context`

## Architectural rules

1. No browser-side secrets.
2. No direct provider calls from presentation code.
3. No automatic action execution.
4. All executive recommendations must remain explainable.
5. Services should be the assembly point for action synthesis.
6. Memory must remain provider-independent.
7. Search should index actions, approvals, decisions, memory, providers, and KPIs deliberately.
8. Future automation must sit on top of the execution layer, never bypass it.
9. Demo fallback must remain first-class.
10. Executive Copilot must consume the same provider → service → intelligence → memory → graph path as the rest of the system.

## v2.0 architectural outcome

The product is no longer just a set of executive dashboards.

It is now an approval-first operating system where:

- every provider can contribute intelligence
- intelligence can become actions
- actions can become decisions
- decisions can become memory
- memory can improve future action quality
