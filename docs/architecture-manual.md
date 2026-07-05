# Architecture Manual

## Overview

EP Intelligence is intended to become an AI Executive Operating System for EP Golf Studios.

The system will eventually coordinate executive agents, connected business data, decision memory, approval workflows, and recurring briefings.

Sprint 6 introduced the first real integration framework for that future direction, Sprint 7 added the first deterministic Executive Intelligence Engine on top of it, and Sprint 8 now proves the first live-capable provider path:

- presentation routes remain stable
- business logic sits behind reusable services
- data access sits behind interchangeable providers
- executive reasoning now sits in dedicated intelligence engines
- the wider application still runs in Demo Mode, with only Website Analytics eligible for a generated GA4 overlay

## Proposed System Layers

### 1. Data Provider Layer

Future inputs may include:

- accounting platforms such as QuickBooks or Xero
- marketing and analytics platforms such as YouTube and Google Analytics
- communications systems such as Gmail
- calendar systems such as Google Calendar
- payment systems such as Stripe
- future OpenClaw executive context and workflow metadata

Sprint 8 still avoids direct browser-side live integrations.

Instead, the provider architecture now includes:

- `MockProvider` as the baseline source in Demo Mode
- `AnalyticsProvider` as the first live-capable provider, reading from a locally generated GA4 snapshot file
- placeholder providers for Finance, Marketing, CRM, Calendar, and AI domains
- a provider registry that decides which provider each business domain uses

### 2. Business Logic Layer

This layer now lives in `assets/services/`.

It:

- normalises business data through shared contracts
- preserves domain boundaries between executive modules
- shields the UI from provider-specific data shapes
- exposes stable service-backed business objects to the runtime composition layer

Current services:

- `ExecutiveService`
- `FinanceService`
- `MarketingService`
- `ApprovalService`
- `ReportService`
- `TimelineService`
- `IntegrationService`
- `IntelligenceService`

### 3. Executive Intelligence Layer

The deterministic reasoning layer now lives in `assets/intelligence/`.

Current engines:

- `InsightEngine`
- `CorrelationEngine`
- `RecommendationEngine`
- `PriorityEngine`
- `HealthEngine`
- `NarrativeEngine`
- `ConfidenceEngine`

Responsibilities:

- consume provider-backed data through the service layer
- explain what happened, why it happened, why it matters, and what should happen next
- generate cross-department correlations before the UI renders them
- rank priorities and recommendations using configurable scoring weights
- generate health scores for CEO, CFO, CMO, and overall business health
- create reusable narratives for daily, weekly, board, and department briefings
- provide a reasoning core that future LLM features can enhance rather than replace

### 4. Decision and Memory Layer

This layer will maintain:

- a decision journal
- an approval history
- recommendation outcomes
- periodic business intelligence snapshots
- quarterly review material

### 5. Approval and Action Layer

All significant actions remain approval-first.

Possible future actions include:

- drafting but not sending communications
- preparing financial recommendations
- producing executive briefings
- staging operational plans
- generating strategic review packs

### 6. Reporting Layer

The reporting layer will eventually provide:

- weekly executive briefings
- Sunday CFO briefings
- decision review summaries
- risk and performance alerts
- historical trend summaries

Sprint 6 moved report access behind `ReportService`, and Sprint 7 now lets report views consume generated narratives and recommendations from the intelligence layer without direct UI-side reasoning.

## Architectural Rules for This Sprint

1. No direct browser-side live integrations or embedded secrets.
2. No direct access to financial accounts.
3. No automation without explicit approval.
4. All executive recommendations must be explainable.
5. Views should not import raw mock datasets directly.
6. Services should request data only through providers.
7. Intelligence engines should consume service-backed data, not call raw data sources directly.
8. Provider swaps should happen in the registry before any UI rewrite is considered.
9. Demo fallback should remain first-class whenever live provider inputs are missing or invalid.
10. Future LLM integrations should augment deterministic reasoning rather than replace it outright.

## Current Integration Build Sequence

1. Define provider contracts and shared schemas.
2. Implement the mock-backed provider registry.
3. Route executive workspaces through reusable services.
4. Add configuration and integration status surfaces.
5. Onboard future APIs by implementing providers and rebinding domains.
6. Keep the presentation layer stable unless product requirements themselves change.
7. Layer any future AI assistance on top of the deterministic intelligence outputs before allowing it to shape visible executive briefings.
