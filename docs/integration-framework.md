# Integration Framework v0.1

## Purpose

Sprint 6 introduces the first reusable integration architecture for EP Intelligence.

The goal is simple:

- keep the current executive UI stable
- keep the whole product in Demo Mode
- make future live integrations a provider implementation task rather than a dashboard rewrite
- give the intelligence layer a stable service-backed foundation before any live API or LLM work begins

## Core Separation

EP Intelligence now has three explicit layers:

### 1. Presentation Layer

Files such as `assets/app.js` and `assets/ui/components.js` render the UI.

Rules:

- the presentation layer should not know where business data comes from
- views should consume route metadata plus service-shaped workspace data
- views must not import raw mock datasets directly

### 2. Business Logic Layer

The business logic layer lives in `assets/services/`.

Current services:

- `ExecutiveService`
- `FinanceService`
- `MarketingService`
- `ApprovalService`
- `ReportService`
- `TimelineService`
- `IntegrationService`
- `IntelligenceService`

Rules:

- services talk to providers, not raw files
- services normalize or preserve data contracts before returning view data
- services are the right place for future aggregation, fallback rules, and cross-source synthesis
- intelligence engines should consume service-backed data rather than bypassing the service layer

### 3. Data Provider Layer

The provider layer lives in `assets/providers/`.

Current state:

- `MockProvider` is the only active provider
- placeholder providers are registered for Analytics, Finance, Marketing, CRM, Calendar, and AI

Rules:

- providers hide source-specific mechanics from services
- providers may eventually call APIs, parse uploaded files, or read external state
- providers should return structured domain data, not UI markup or route logic

## Runtime Assembly

`assets/data/runtime.js` is the composition root.

It:

- loads the active app configuration
- creates the provider registry
- instantiates the services
- instantiates the intelligence layer through `IntelligenceService`
- exports `WORKSPACE_DATA` for the current runtime
- exports `APP_RUNTIME` for configuration and architecture inspection

This file is the main swap-point for future mode changes.

## Current Mode

Only one real mode exists today:

- **Demo Mode** — all domains resolve to `MockProvider`

A future mode is reserved but not active:

- **Future Live Mode** — planned for real API-backed providers later

## Domain Binding Pattern

The provider registry currently binds these domains:

- `executive`
- `finance`
- `marketing`
- `approval`
- `report`
- `timeline`
- `ai`
- `settings`

In Sprint 6, each of these binds to `MockProvider`.

In future live work, the binding should change before any dashboard code changes are considered.

## Contracts

Shared data contracts live in `assets/contracts/data-contracts.js`.

Current contract types:

- KPI
- Insight
- Executive Insight
- Executive Recommendation
- Timeline Event
- Approval
- Opportunity
- Risk
- AI Recommendation
- Report
- Department Summary

These contracts are intentionally lightweight.
They establish naming consistency for future providers and services without introducing a framework or backend.

## Future Integration Registry

The placeholder registry lives in `assets/config/integration-registry.js`.

Current registration targets:

- YouTube
- Google Analytics
- Gmail
- Google Calendar
- Mailchimp
- LinkedIn
- Facebook
- Instagram
- X
- QuickBooks / Xero
- Stripe
- OpenClaw

Each registry entry documents:

- integration id
- label
- intended provider
- intended service
- group
- current status
- integration notes

## Naming Conventions

### Providers

Use `<Domain>Provider` naming.

Examples:

- `AnalyticsProvider`
- `FinanceProvider`
- `CalendarProvider`

### Services

Use `<Domain>Service` naming.

Examples:

- `ExecutiveService`
- `MarketingService`
- `ReportService`

### Contracts

Use singular business nouns.

Examples:

- `normalizeKpi`
- `normalizeApproval`
- `normalizeReport`

### Runtime Exports

Use clear, explicit names.

Examples:

- `WORKSPACE_DATA`
- `APP_RUNTIME`
- `SERVICES`

## Implementation Rule for Future Sprints

When adding a real integration:

1. implement or extend a provider
2. bind the relevant domain in the provider registry
3. update the relevant service if shaping rules change
4. leave the presentation layer untouched unless the product requirement itself changed

That sequence is the main architectural promise of Sprint 6.

## Relationship to the Intelligence Engine

Sprint 7 adds a deterministic intelligence layer above the service layer.

The intended flow is now:

1. providers return structured business-domain data
2. services shape that data into stable workspace/domain objects
3. intelligence engines reason over those service outputs
4. the runtime assembles the final UI-facing `WORKSPACE_DATA`
5. the presentation layer renders insights, recommendations, scores, and narratives without needing to know how they were produced

This means future work can evolve in two directions independently:

- **provider evolution** — replacing Demo Mode data with real data sources
- **reasoning evolution** — improving correlation, recommendation, and narrative logic, later including optional LLM enhancement
