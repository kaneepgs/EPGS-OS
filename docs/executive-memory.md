# Executive Memory & Knowledge Graph

## Purpose

The Executive Memory layer gives EP Intelligence a long-term memory of the business.

It exists so the product can remember:

- important business events
- executive decisions
- historical trends
- major risks
- opportunities
- completed actions
- recurring issues
- strategic goals

This memory is intentionally separate from live providers.

Providers deliver data.

Memory stores business knowledge.

## Architecture

The memory subsystem lives in `assets/memory/`.

Current modules:

- `memory-store.js` — local persistence entry point using structured seed data plus `localStorage`
- `event-store.js` — permanent executive timeline access
- `decision-store.js` — structured executive decision journal access
- `goal-store.js` — strategic goal access and progress summary helpers
- `context-store.js` — recurring issues, historical trends, strategic themes, and memory highlights
- `knowledge-graph.js` — structured node/edge relationship generation
- `memory-service.js` — shared business-memory API used by runtime, reports, search, settings, and intelligence
- `memory-seed.js` — initial structured memory dataset and retention defaults

## Persistence Model

The layer is local-first and frontend-only.

It uses:

- structured seed files for default memory state
- `localStorage` for persistence in the running browser
- deterministic merge behaviour so persisted data can extend the seeded memory safely

It does **not** use:

- databases
- external AI
- external APIs
- background automation
- backend authentication

## Business Timeline

The executive timeline is now permanent rather than transient.

Timeline events support:

- `date`
- `category`
- `department`
- `impact`
- `relatedEntities`
- `route`
- descriptive `title` and `body`

Typical timeline coverage includes:

- revenue milestones
- campaign launches
- website traffic milestones
- supplier changes
- major business decisions
- system milestones such as new intelligence capabilities

## Decision Journal

Executive decisions are now structured memory objects.

Each decision supports:

- `title`
- `summary`
- `reason`
- `expectedOutcome`
- `actualOutcome`
- `owner`
- `department`
- `relatedKpis`
- `linkedGoalIds`
- `linkedTimelineEventIds`
- `status`

This allows future review of not only what was decided, but why it was decided and whether the expected outcome actually arrived.

## Strategic Goals

Strategic goals now persist as first-class business memory.

Each goal supports:

- `progress`
- `owner`
- `deadline`
- `linkedMetrics`
- `linkedDecisionIds`
- `target`
- `currentValue`
- `status`

This keeps leadership focused on direction, not only current-period movement.

## Knowledge Graph

The knowledge graph is represented as structured objects, not a visual graph.

It currently models relationships between:

- Departments
- Goals
- Risks
- Opportunities
- KPIs
- Approvals
- Timeline Events
- Recommendations
- Decisions
- Historical Context

The output contains:

- `nodes`
- `edges`
- a graph `summary`

This makes relationships reusable in dashboards, reports, search, and future AI-assisted reasoning.

## Deterministic Executive Context

The intelligence layer can now reference memory-backed historical context using deterministic logic.

Examples:

- repeated traffic growth across consecutive months
- current revenue exceeding a previous benchmark
- recurring executive issues surfacing across multiple decisions

This allows EP Intelligence to say things like:

- this is the third consecutive month of growth
- this decision keeps returning as an executive constraint
- current performance is above a previous benchmark

without relying on external AI.

## Search Integration

Global search now includes memory-backed content:

- timeline events
- goals
- decisions
- recommendations
- historical context
- standard application routes

This means search can act as a lightweight memory retrieval surface for the executive shell.

## UI Integration

Executive Memory currently feeds:

- CEO Dashboard
  - Historical Context
  - Strategic Goal Progress
  - Recent Decisions
  - Business Milestones
  - Memory Highlights
- Reports
  - historical events
  - previous decisions
  - goal progress
  - milestones
- AI Memory / Context
  - searchable memory index
  - deterministic context coverage
  - knowledge graph summary
- Settings
  - memory retention settings
  - memory counts
  - graph summary

## Retention Settings

Retention remains structured and configurable.

Current examples include:

- `timelineHistory`
- `completedDecisions`
- `archivedGoals`
- `memoryCategories`

These settings are stored as local structured data and surfaced in Settings.

## Design Rules

1. Keep memory separate from providers.
2. Keep memory explainable and deterministic.
3. Prefer structured objects over opaque summaries.
4. Preserve local-first behaviour.
5. Treat the knowledge graph as reusable infrastructure, not decoration.
6. Let future AI providers consume this memory rather than replace it.

## Outcome

EP Intelligence now remembers the business.

That means future live providers and future AI layers can reason from durable business context rather than only whatever the latest metrics happen to show.