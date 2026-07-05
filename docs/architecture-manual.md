# Architecture Manual

## Overview

EP Intelligence is intended to become an AI Executive Operating System for EP Golf Studios.

The system will eventually coordinate executive agents, connected business data, decision memory, approval workflows, and recurring briefings.

Sprint 6 now implements the first real integration framework for that future direction:

- presentation routes remain stable
- business logic now sits behind reusable services
- data access now sits behind interchangeable providers
- the whole application still runs entirely in Demo Mode using mock data only

## Proposed System Layers

### 1. Data Provider Layer

Future inputs may include:

- accounting platforms such as QuickBooks or Xero
- marketing and analytics platforms such as YouTube and Google Analytics
- communications systems such as Gmail
- calendar systems such as Google Calendar
- payment systems such as Stripe
- future OpenClaw executive context and workflow metadata

Sprint 6 does not connect any of them live.

Instead, the new provider architecture introduces:

- `MockProvider` as the active source in Demo Mode
- placeholder providers for Analytics, Finance, Marketing, CRM, Calendar, and AI domains
- a provider registry that decides which provider each business domain uses

### 2. Business Logic / Intelligence Layer

This layer now lives in `assets/services/`.

It will:

- normalise business data through shared contracts
- preserve domain boundaries between executive modules
- compare current state against prior periods
- support evidence-based recommendations
- expose uncertainty, gaps, and assumptions
- shield the UI from provider-specific data shapes

Current services:

- `ExecutiveService`
- `FinanceService`
- `MarketingService`
- `ApprovalService`
- `ReportService`
- `TimelineService`
- `IntegrationService`

### 3. Executive Reasoning Layer

Separate executive agents will be responsible for domain-specific reasoning:

- CFO
- CMO
- COO
- CEO

Each executive should produce recommendations in a transparent format with rationale, evidence, alternatives, risks, impact, confidence, and missing information.

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

Sprint 6 keeps reporting frontend-only, but moves report access behind `ReportService` so future live inputs can be added without route rewrites.

## Architectural Rules for This Sprint

1. No live integrations.
2. No direct access to financial accounts.
3. No automation without explicit approval.
4. All executive recommendations must be explainable.
5. Views should not import raw mock datasets directly.
6. Services should request data only through providers.
7. Provider swaps should happen in the registry before any UI rewrite is considered.

## Current Integration Build Sequence

1. Define provider contracts and shared schemas.
2. Implement the mock-backed provider registry.
3. Route executive workspaces through reusable services.
4. Add configuration and integration status surfaces.
5. Onboard future APIs by implementing providers and rebinding domains.
6. Keep the presentation layer stable unless product requirements themselves change.
