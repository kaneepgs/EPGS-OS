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

- `MockProvider` remains the baseline provider
- `AnalyticsProvider` is now the first live-capable provider and selectively overrides only Website Analytics when a generated GA4 snapshot exists
- `YouTubeProvider` now composes on top of `AnalyticsProvider` and selectively overrides the YouTube portions of the marketing workspace when a generated local YouTube snapshot exists
- `UnifiedSocialProvider` now composes on top of `YouTubeProvider` and can selectively overlay Instagram, Facebook, LinkedIn, and X from one generated local social snapshot while preserving per-platform demo fallback
- Sprint 11 packages GA4 + YouTube into a reusable **Marketing Intelligence** layer, and Sprint 18 extends that same layer with social health, attribution, competitor benchmarking, and cross-platform reporting without adding direct browser-side APIs
- `GmailProvider` and `CalendarProvider` extend the same runtime pattern into communications and operations
- placeholder providers remain registered for Finance, CRM, and AI

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
- assembles marketing-health, social-health, source-status, attribution, competitor benchmarking, reporting, and memory-milestone outputs from the provider-backed marketing workspace
- exports `WORKSPACE_DATA` for the current runtime
- exports `APP_RUNTIME` for configuration and architecture inspection

This file is the main swap-point for future mode changes.

## Current Mode

Only one real runtime mode exists today:

- **Demo Mode** — the wider app stays demo-first, while individual providers may still expose safe selective overlays such as the Sprint 8 GA4 Website Analytics snapshot, the Sprint 10 YouTube snapshot path, the Sprint 18 Unified Social snapshot path, the Gmail snapshot path, and the Google Calendar snapshot path

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

In Sprint 6 and Sprint 7, each of these bound to `MockProvider`.

In Sprint 8, `marketing` moved to `AnalyticsProvider`, which internally decides whether to return demo marketing data or a selective GA4 Website Analytics overlay.

In Sprint 10, `marketing` now binds to `YouTubeProvider`, which composes on top of `AnalyticsProvider` so GA4 Website Analytics and live YouTube channel data can both flow through the same domain without any route-level rewrites.

In Sprint 11 and Sprint 18, that same single `marketing` domain is used to generate:

- the Marketing Health Score
- the Social Health Score
- clearer hybrid live/demo source coverage cards
- deterministic attribution and competitor benchmark summaries
- the packaged Marketing Intelligence Report
- derived marketing milestones written into provider-independent Executive Memory

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
- `YouTubeProvider`
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

## Snapshot-Based Live Provider Pattern

Sprint 8 and Sprint 10 now establish the preferred pattern for low-risk live integrations inside EP Intelligence:

1. **Local sync script** fetches live data using credentials that never ship to the browser
2. the script writes a generated snapshot into `assets/data/generated/`
3. `assets/data/live-data-loader.js` safely loads that snapshot at runtime
4. the provider overlays only the relevant workspace surfaces
5. if the snapshot is missing, invalid, or stale, the provider falls back to demo data without breaking the UI

This pattern now exists for:

- `scripts/sync-ga4-snapshot.mjs` → `AnalyticsProvider`
- `scripts/sync-youtube-snapshot.mjs` → `YouTubeProvider`
- `scripts/sync-gmail-snapshot.mjs` → `GmailProvider`
- `scripts/sync-calendar-snapshot.mjs` → `CalendarProvider`

Sprint 11 proves that new executive value can be added by composing on top of those snapshots and providers, rather than by adding new APIs or bypassing the architecture. Sprint 13 extends the same pattern into communications so Executive Inbox can remain approval-first and browser-safe. Sprint 14 extends it again into operations so schedule intelligence can stay browser-safe, approval-first, and architecturally isolated from the presentation layer.

## Calendar Provider Lifecycle

`CalendarProvider` overlays operational scheduling intelligence without turning EP Intelligence into a calendar client.

Its lifecycle is:

1. `scripts/sync-calendar-snapshot.mjs` exchanges the stored refresh token for a short-lived Google Calendar access token using read-only calendar scope
2. the script fetches the selected calendar, reads upcoming events, classifies fittings, meetings, travel, deadlines, and all-day holds using deterministic business rules, and writes a generated local snapshot
3. `assets/data/live-data-loader.js` loads that snapshot at runtime and falls back safely if it is missing, invalid, or stale
4. `CalendarProvider` shapes Operations Calendar, provider health, timeline events, search entries, approval cards, and Google Calendar integration status from that snapshot
5. `TimelineService` exposes the operations workspace and business timeline coverage while `ApprovalService` merges calendar-derived actions into the central approval workspace
6. the intelligence layer, executive briefing, CEO widgets, reports, and provider-independent memory consume those operations outputs without talking to Google Calendar directly
7. all schedule actions remain approval cards only; nothing executes automatically

## Gmail Provider Lifecycle

`GmailProvider` is the first provider in EP Intelligence that overlays a new executive communications domain while also feeding the approval domain.

Its lifecycle is:

1. `scripts/sync-gmail-snapshot.mjs` exchanges the stored refresh token for a short-lived Gmail access token using the read-only Gmail scope
2. the script fetches inbox metadata plus selected message content, classifies messages using deterministic business rules, and writes a generated local snapshot
3. `assets/data/live-data-loader.js` loads that snapshot at runtime and falls back safely if it is missing, invalid, or stale
4. `GmailProvider` shapes Executive Inbox, provider health, and Gmail integration status data from that snapshot
5. `CommunicationsService` normalizes inbox sections, CEO widgets, search entries, summary metrics, and approval cards
6. the intelligence layer, timeline, memory, and reporting surfaces consume those communications outputs without talking to Gmail directly
7. all reply, archive, label, forward, task, and follow-up actions remain approval cards only; nothing executes automatically

## YouTube Provider Lifecycle

`YouTubeProvider` is the first provider in EP Intelligence that composes on top of another active provider.

Its lifecycle is:

1. `AnalyticsProvider` builds the marketing workspace, including any GA4 website overlay
2. `YouTubeProvider` receives that already-shaped workspace
3. it overlays only:
   - CMO dashboard combined totals impacted by YouTube
   - social overview YouTube-driven figures
   - the dedicated YouTube platform page
   - Content Library YouTube items
   - integration status metadata
4. the service layer remains unchanged
5. the intelligence layer receives the updated marketing workspace and generates deterministic YouTube-aware insights

This composition approach is the template for future platform integrations that need to enrich only part of an existing domain.

## Sprint 11 Marketing Intelligence Pattern

Sprint 11 adds a new architectural pattern on top of the existing provider setup:

1. providers still return one shaped `marketing` workspace
2. `assets/data/runtime.js` reads that workspace once
3. runtime-derived helpers build:
   - Marketing Health Score
   - hybrid live/demo source coverage
   - Marketing Intelligence Report
   - marketing milestones for Executive Memory
4. the presentation layer reads those pre-shaped executive objects directly

This is important because it keeps:

- providers focused on source overlays
- services focused on domain shaping
- intelligence focused on reasoning
- runtime focused on cross-cutting assembly
- memory provider-independent

## Relationship to the Intelligence Engine

Sprint 7 adds a deterministic intelligence layer above the service layer.

The intended flow is now:

1. providers return structured business-domain data
2. services shape that data into stable workspace/domain objects
3. intelligence engines reason over those service outputs
4. the runtime assembles the final UI-facing `WORKSPACE_DATA`
5. the presentation layer renders insights, recommendations, scores, and narratives without needing to know how they were produced

This means future work can evolve in two directions independently:

- **provider evolution** — replacing Demo Mode data with real data sources, starting with the Sprint 8 GA4 snapshot path and Sprint 10 YouTube snapshot path
- **reasoning evolution** — improving correlation, recommendation, and narrative logic, later including optional LLM enhancement
