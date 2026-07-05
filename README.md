# EP Intelligence

EP Intelligence is a frontend-only AI Executive Operating System prototype for EP Golf Studios.

It has now moved beyond a CFO-first prototype into a true **Executive Operating System** with a CEO-level intelligence layer that synthesises Finance and Marketing into one daily executive briefing.

Sprint 11 packages **GA4 + YouTube** into the first usable **Marketing Intelligence** release, so the business can now read live website demand and live YouTube authority together through a clearer executive marketing layer, a proper Marketing Health Score, a packaged Marketing Intelligence Report, and provider-independent memory milestones — while still falling back safely to demo data.

## Release & Roadmap

- **Current release:** EP Intelligence v1.1 — Marketing Intelligence
- **Active roadmap:** `Roadmap.md`
- **Product vision:** `PRODUCT_VISION.md`
- **Formal release changelog:** `CHANGELOG.md`
- **Detailed sprint history:** `changelog/CHANGELOG.md`
- **Project principles:** `PROJECT_PRINCIPLES.md`
- **Definition of Done:** `DEFINITION_OF_DONE.md`

Release metadata is now centralised in `assets/config/release-config.js`, so the app, docs, and release process can all read from one source of truth.

Use `PRODUCT_VISION.md` for long-term product direction, `Roadmap.md` for active planning, `CHANGELOG.md` for formal release history, `changelog/CHANGELOG.md` for detailed sprint history, `PROJECT_PRINCIPLES.md` for engineering and architecture judgment, and `DEFINITION_OF_DONE.md` for sprint completion standards.

## Current Sprint State

### Sprint 1 — Foundation

Documentation and architecture foundation only.

### Sprint 2 — CFO Workspace v0.1

Introduced the first working executive homepage with:

- polished workspace layout
- placeholder Financial Health Score
- summary cards
- priorities, opportunities, risks, and approval centre
- weekly briefing preview
- natural-language “Ask My CFO” placeholder experience

### Sprint 3 — CFO Executive Workspace v0.2

Expanded the prototype into a larger static SPA with:

- full CFO pages for Revenue, Profit, Expenses, Supplier Spend, Cash Flow, VAT, Forecasting, Business KPIs, Decision Journal, Weekly Briefings, Approval Centre, and Settings
- dedicated Financial Health Score, Opportunity Register, Risk Register, and Quarterly Review pages
- Board Meeting mode
- breadcrumb navigation, searchable decision journal, and richer executive framing

### Sprint 4 — CFO Executive Workspace v0.3

Polished the prototype into a more deployment-ready executive application with:

- upgraded visual system, spacing, hierarchy, hover states, loading skeletons, and smoother transitions
- improved responsive behaviour and dark-mode presentation
- collapsible sidebar, page search, favourites, recently viewed pages, breadcrumbs, keyboard shortcuts, and command palette
- reusable UI/component layer for cards, commentary, charts, approvals, navigation, and search
- structured mock data layer separated into metrics, charts, forecasts, approvals, suppliers, risks, opportunities, and commentary
- interactive Chart.js visualisations for revenue, profit, cash flow, expenses, suppliers, VAT, forecasting, and KPI gauges
- richer AI executive commentary blocks with executive summary, evidence, confidence, impact, risks, alternatives, recommended action, missing information, and follow-up prompts
- deployment-readiness assets including favicon, web manifest, metadata, package scripts, and cleaner static-project structure

### Sprint 5A — CEO Shell & Executive Operating System Navigation

Restructured EP Intelligence into a broader executive operating system shell with:

- **CEO Dashboard** as the default application home page
- permanent top-level navigation for CEO Dashboard, CFO, CMO, COO, Sales, Customer Success, Operations, HR, Projects, AI Assistant, Approvals, Reports, and Settings
- the full **CFO module** preserved inside the wider shell, with all core finance pages still accessible
- a central **Approvals** section for business-wide approval routing
- a central **Reports** section for weekly, monthly, quarterly, board, and functional report routes
- a dedicated **AI Assistant** section for questions, briefings, assumptions, missing information, suggested actions, and context
- polished placeholder module landing pages for CMO, COO, Sales, Customer Success, Operations, HR, and Projects
- route support using static-friendly query routing such as `?route=/ceo`, `?route=/cfo`, and `?route=/reports/board-meeting`

### Sprint 5B — CMO Executive Workspace v0.1

Built the first full **Chief Marketing Officer workspace** inside the CEO shell, including:

- a dedicated **Marketing Dashboard** with Marketing Health Score, performance summary, platform winners/losers, opportunities, risks, approvals, and weekly briefing
- a full **Social Media Overview** with combined metrics, platform rankings, top/lowest content, and cross-platform charts
- dedicated platform pages for **YouTube, Instagram, Facebook, LinkedIn, and X** with realistic placeholder metrics, trend charts, top content, and recent posts
- executive pages for **Website Analytics, Email Marketing, Campaign Performance, Content Library, Competitor Analysis, Marketing Calendar, AI Marketing Advisor, Marketing Reports, and CMO Settings**
- structured modular mock datasets for social, website, email, campaigns, competitors, calendar, and AI marketing commentary
- continued approval-first behaviour for marketing actions such as publishing posts, videos, email campaigns, website updates, blog posts, and LinkedIn articles

EP Intelligence now contains both a complete **CFO workspace** and a complete first-pass **CMO workspace** inside the same executive operating system shell.

### Sprint 5C — CEO Intelligence Dashboard v0.1

Upgraded the default **CEO Dashboard** into an AI Chief of Staff experience with:

- a prominent **Executive Briefing** explaining what happened, why it happened, what matters, and what decisions deserve attention today
- a combined **Business Health Score** spanning Finance, Marketing, Sales, Customer Experience, Operations, and Projects
- ranked **Today’s Priorities** with impact, urgency, estimated business value, and recommended owner
- executive-only **KPI cards**, a business timeline, cross-department intelligence commentary, executive risks, executive opportunities, approval summary, department health, and a CEO **Decision Centre**
- a richer **Ask EP Intelligence** conversational workspace with realistic example executive questions and answers
- an upgraded **Board Meeting Mode** with presentation-style slides for Executive Summary, KPI snapshot, Financial Summary, Marketing Summary, Opportunities, Risks, and Actions, plus keyboard navigation
- integrated executive intelligence across the existing **CFO** and **CMO** modules while keeping the product frontend-only and mock-data-only

EP Intelligence now feels less like a shell with modules and more like a working **CEO operating surface** for the business.

### Sprint 6 — Integration Framework v0.1

Introduced the first integration architecture for EP Intelligence while keeping all visible behaviour in **Demo Mode**:

- created a provider pattern so the UI no longer needs to care whether data comes from mock datasets or future live integrations
- added a reusable service layer spanning **ExecutiveService, FinanceService, MarketingService, ApprovalService, ReportService, TimelineService, and IntegrationService**
- added a central configuration module with **Demo Mode** active and **Future Live Mode** reserved
- defined shared contracts for KPI, Insight, Timeline Event, Approval, Opportunity, Risk, AI Recommendation, Report, and Department Summary
- refactored the application to consume **provider-backed runtime data** rather than importing raw mock datasets directly into the workspace UI
- added a Settings-based **Integration Status**, **Demo Mode Configuration**, and **Provider Architecture** view for future scalability and onboarding

### Sprint 7 — Executive Intelligence Engine v0.1

Added the first deterministic reasoning layer on top of the provider/service framework while keeping the whole product in **Demo Mode**:

- introduced a dedicated `assets/intelligence/` layer with **InsightEngine, CorrelationEngine, RecommendationEngine, PriorityEngine, HealthEngine, NarrativeEngine, and ConfidenceEngine**
- built structured executive insight generation with title, executive summary, supporting evidence, confidence score, business impact, financial impact, suggested actions, responsible department, priority, and timestamp
- added configurable scoring weights and thresholds for health, priority, and confidence evaluation
- generated cross-department correlations such as marketing ↔ revenue, profit ↔ expenses, cash ↔ supplier pressure, and approval-load ↔ execution drag
- generated deterministic recommendation objects with suggested owner, expected benefit, risk, confidence, estimated value, and ranked priority
- created narrative outputs for daily briefings, weekly briefings, board summaries, and department summaries from structured insights rather than hardcoded commentary
- upgraded the CEO Dashboard, CFO, CMO, Reports, Board Meeting Mode, and Ask EP Intelligence views to consume engine-backed intelligence outputs
- added timeline intelligence so the business timeline now includes generated milestones, warnings, and campaign/financial signal events

### Sprint 8 — Google Analytics Provider v1.0

Added the first live data path without changing the wider architecture:

- introduced a dedicated `AnalyticsProvider` that selectively overrides only the **CMO Website Analytics** workspace when a valid GA4 snapshot exists
- added `assets/data/live-data-loader.js` so the runtime can safely load a generated local snapshot and fall back automatically when it is missing or invalid
- added `scripts/sync-ga4-snapshot.mjs` plus `npm run ga4:sync` to fetch GA4 data using service-account credentials and write a local snapshot file that is intentionally ignored by git
- kept the wider executive shell, provider/service/intelligence layering, and all non-website routes in **Demo Mode**
- updated Settings pages so **Integration Status**, **Demo Mode Configuration**, and **Provider Architecture** now explain the hybrid demo/live state clearly
- preserved safe fallback behaviour when credentials are missing, incomplete, or not yet synced

### Sprint 9 — Executive Memory & Knowledge Graph v0.1

Added the long-term memory of the business without changing the frontend-only architecture:

- introduced a dedicated `assets/memory/` subsystem with **MemoryStore, EventStore, DecisionStore, GoalStore, ContextStore, KnowledgeGraph, and MemoryService**
- added a permanent executive timeline with structured date, category, department, impact, and related-entity coverage
- added a structured executive decision journal with reason, expected outcome, actual outcome, owner, department, related KPIs, and status
- added persistent strategic goals with progress, deadlines, linked metrics, and linked decisions
- added a structured knowledge graph linking departments, goals, risks, opportunities, KPIs, approvals, recommendations, timeline events, and decisions
- added deterministic historical context so the intelligence layer can reference prior trends and repeated business patterns
- upgraded the CEO Dashboard, Reports, AI Memory / Context route, global search, and Settings to consume memory-backed business context
- added configurable retention settings for timeline history, completed decisions, archived goals, and memory categories

### Sprint 10 — YouTube Provider v1.0

Added the second live provider path without changing the wider architecture:

- introduced a dedicated `YouTubeProvider` that overlays only the **YouTube portions of the CMO workspace** while preserving the existing demo baseline for Instagram, Facebook, LinkedIn, and X
- added `scripts/sync-youtube-snapshot.mjs` plus `npm run youtube:sync` to fetch channel totals, recent uploads, tracked visibility, and content-library-ready video data from the YouTube Data API
- added generated local snapshot loading and safe fallback through `assets/data/live-data-loader.js`
- updated the CEO Dashboard so leadership can now see **YouTube subscribers, total views, tracked recent views, subscriber movement, and publishing activity** inside the executive shell
- fed live YouTube signals into the deterministic intelligence layer for briefing, cross-department correlations, recommendations, and timeline events
- updated Content Library and the YouTube platform page so recent uploads and top-performing tracked videos replace the old demo entries automatically
- kept Executive Memory fully provider-independent and left the rest of the product in **Demo Mode** except for the selective GA4 + YouTube overlays

### Sprint 11 — Marketing Intelligence v1.1

Packaged the first usable executive marketing release on top of the existing provider architecture:

- added a proper **Marketing Health Score** using website sessions, session growth, YouTube subscribers, recent views, publishing cadence, content performance, and conversion capture
- added clearer **hybrid live/demo source coverage** across the CEO Dashboard, CMO Dashboard, Social Overview, Website Analytics, YouTube, Content Library, Reports, and Settings
- added a reusable **Marketing Intelligence Report** at `/reports/cmo-reports` covering GA4 summary, YouTube summary, cross-channel findings, opportunities, risks, recommended actions, and marketing memory milestones
- expanded deterministic intelligence so the system now links:
  - YouTube visibility → website demand
  - publishing cadence → growth support
  - website traffic → enquiry capture
  - high-performing content → next marketing opportunities
- wrote new **marketing milestones into Executive Memory** without duplicating seeded events, including website demand milestones, YouTube subscriber milestones, campaign notes, and high-performing content context
- kept the wider product **frontend-only** and **Demo Mode** by default, with selective live overlays only where GA4 and YouTube snapshots exist

### Sprint 13 — Gmail Provider v1.0

Added the first operational communications provider without breaking the wider architecture:

- introduced a dedicated `GmailProvider` bound through the existing provider registry for the new `communications` and `approval` domain flow
- added `scripts/sync-gmail-snapshot.mjs` plus `npm run gmail:sync` to fetch Gmail metadata and selected message content through OAuth, then write a generated local snapshot that never ships to the browser
- added a new **Executive Inbox** route with deterministic sections for Priority, Needs Reply, Customer Enquiries, Booking Requests, Supplier Communications, Finance, Marketing, Internal, and Recently Completed
- added CEO-facing inbox widgets for unread critical emails, waiting customer replies, supplier issues, finance emails, booking requests, and a daily executive inbox summary
- extended deterministic intelligence, recommendations, reports, Board Meeting Mode, AI Assistant prompts, timeline events, search coverage, and provider-independent Executive Memory with Gmail-derived communications signals
- kept all inbox actions **approval-first** by staging Reply, Archive, Label, Forward, Create Task, and Schedule Follow-up cards without executing anything automatically
- preserved safe demo fallback when Gmail credentials are missing, rejected, or the generated snapshot is unavailable

## Constraints

This prototype intentionally remains:

- **HTML + CSS + Vanilla JavaScript only**
- **frontend-only in the browser**
- **no browser-side secrets or direct GA4 calls from the UI**
- **mostly demo-mode**, with Website Analytics, YouTube, and Executive Inbox eligible for optional local snapshot hydration
- **without backend services, databases, authentication, or automation inside the product itself**

## Project Structure

- `START_HERE.md` — non-technical demo handoff guide
- `CHANGELOG.md` — formal semver release history for the platform
- `Roadmap.md` — active product roadmap and current planning source of truth
- `DEFINITION_OF_DONE.md` — permanent sprint completion standard and handoff format
- `DEPLOYMENT_NOTE.md` — simple deployment notes for Replit and Hostinger static hosting
- `EXECUTIVE_DEMO_SCRIPT.md` — short demo script for live walkthroughs
- `index.html` — main app shell and metadata
- `assets/app.js` — application state, routing, rendering, and interactions
- `assets/styles.css` — visual system, layout, responsive styling, transitions, and accessibility states
- `assets/config/app-config.js` — central runtime mode and framework configuration
- `assets/config/release-config.js` — single source of truth for current release metadata and version display
- `assets/config/integration-registry.js` — placeholder registration points for future integrations
- `assets/config/shell-config.js` — route, navigation, and page-question metadata
- `assets/contracts/data-contracts.js` — shared schema helpers for normalized workspace data
- `assets/data/mock-data.js` — raw structured demo datasets
- `assets/data/live-data-loader.js` — safe loader for the optional generated GA4, YouTube, and Gmail snapshots
- `assets/data/runtime.js` — composition root that assembles providers, services, intelligence, marketing-health/reporting state, and runtime workspace data
- `assets/memory/` — provider-independent executive memory stores, seed data, knowledge graph generation, and memory service
- `assets/providers/` — active mock provider, live-capable analytics, YouTube, and Gmail providers, future provider placeholders, and provider registry
- `assets/services/` — business logic layer for executive, finance, marketing, communications, approvals, reports, timeline, integration status, and intelligence assembly
- `assets/intelligence/` — deterministic executive reasoning engines for insights, correlations, recommendations, priority, health, narratives, and confidence
- `assets/ui/components.js` — reusable UI render helpers
- `assets/ui/charts.js` — Chart.js render/destroy helpers
- `assets/vendor/chart.umd.js` — local Chart.js bundle for static hosting
- `assets/favicon.svg` — favicon / OG image source
- `assets/site.webmanifest` — install metadata
- `scripts/sync-ga4-snapshot.mjs` — local GA4 snapshot sync script for Sprint 8
- `scripts/sync-youtube-snapshot.mjs` — local YouTube snapshot sync script for Sprint 10
- `scripts/sync-gmail-snapshot.mjs` — local Gmail snapshot sync script for Sprint 13
- `docs/` — architecture and constitutional documents
- `docs/executive-memory.md` — Executive Memory and Knowledge Graph architecture guide
- `docs/youtube-provider.md` — YouTube provider setup, lifecycle, fallback, and troubleshooting guide
- `docs/gmail-provider.md` — Gmail provider setup, OAuth scope, lifecycle, fallback, and troubleshooting guide
- `specifications/` — executive role specifications
- `prompts/` — future OpenClaw executive build prompts
- `skills/` — draft executive skills
- `changelog/` — sprint history

## Run Locally

```bash
npm install
npm run vendor:chart
npm run validate:js
npm run serve
```

Optional GA4 sync for Website Analytics only:

```bash
cp .env.example .env.local
# add GA4 credentials locally
npm run ga4:sync
```

Optional YouTube sync for the marketing workspace:

```bash
cp .env.example .env.local
# add YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID locally
npm run youtube:sync
```

Then open:

- `http://127.0.0.1:3012`

Optional examples:

- `http://127.0.0.1:3012/?route=/ceo`
- `http://127.0.0.1:3012/?route=/cfo`
- `http://127.0.0.1:3012/?route=/cmo`
- `http://127.0.0.1:3012/?route=/reports/cmo-reports`
- `http://127.0.0.1:3012/?route=/reports/board-meeting`

## Deployment Targets

The project is structured to be easy to host on:

- Replit
- Hostinger static hosting / web hosting
- any simple static web host

No server runtime is required for the UI itself.

If you want live Website Analytics or live YouTube channel data, run the relevant local sync script first so the static frontend can read the generated snapshot file.

## Validation

Sprint 5A validation included:

- `node --check assets/app.js`
- `node --check assets/data/mock-data.js`
- local static serving via `python3 -m http.server`
- route rendering checks for CEO Dashboard, CFO, all key CFO child pages, CMO placeholder, Approvals, Reports, AI Assistant, and Settings
- source check confirming no app-side `console.*` usage
- rendered screenshot captures for:
  - CEO Dashboard
  - CFO module inside the new shell
  - CMO placeholder
  - Approvals
  - Reports
  - AI Assistant
  - mobile navigation

Validation artifacts are stored in `/data/.openclaw/workspace/.artifacts/`.

Sprint 5B validation included:

- `node --check assets/app.js`
- `node --check assets/data/mock-data.js`
- all CMO routes rendering successfully in headless Chromium
- captured screenshots for Marketing Dashboard, Social Media Overview, YouTube, Website Analytics, AI Marketing Advisor, Marketing Calendar, and Mobile Layout
- source check confirming no app-side `console.*` usage outside the vendored Chart.js file

Sprint 5C validation included:

- `node --check assets/app.js`
- `node --check assets/data/mock-data.js`
- CEO Dashboard render checks for Executive Briefing, Business Health Score, Today’s Priorities, Cross-Department Intelligence, Decision Centre, and Ask EP Intelligence
- search validation through the shell navigation search
- command palette validation using `Ctrl/Cmd + K`
- breadcrumb validation across CEO / CMO / Reports routes
- Board Meeting Mode keyboard navigation validation across all seven slides
- responsive/mobile validation for the CEO Dashboard
- runtime validation with no JavaScript errors and no console warnings during the scripted walkthrough
- captured screenshots for:
  - CEO Dashboard
  - Executive Briefing
  - Today’s Priorities
  - Cross-Department Intelligence
  - Risks & Opportunities
  - Board Meeting Mode
  - Mobile Layout

Sprint 6 validation included:

- `node --check assets/app.js`
- syntax checks across the full `assets/` tree including config, providers, services, contracts, and runtime modules
- route validation confirming the CEO Dashboard, CFO routes, CMO routes, and new Settings architecture pages still render
- provider-layer validation confirming Demo Mode runtime assembly and provider/service bindings work
- runtime validation with no JavaScript errors and no console warnings during the scripted walkthrough
- captured screenshots for:
  - Integration Status
  - Demo Mode Configuration
  - Provider Architecture

Sprint 7 validation included:

- `node --check assets/app.js`
- syntax checks across the full `assets/` tree including the new intelligence layer
- engine initialisation validation confirming insights, recommendations, health scores, narratives, and timeline events are generated from provider-backed service data
- route validation confirming the CEO Dashboard, CFO, CMO, Reports, Board Meeting Mode, and Ask EP Intelligence all consume generated intelligence objects
- runtime validation with no JavaScript errors and no console warnings during the scripted walkthrough
- captured screenshots for:
  - CEO Dashboard with generated insights
  - Cross-Department Intelligence
  - Executive Recommendations
  - Health Engine
  - Board Meeting Mode

Sprint 8 validation included:

- `npm run ga4:sync` with missing credentials confirming safe fallback snapshot generation
- `node --check assets/app.js`
- syntax checks across the full `assets/` tree and `scripts/sync-ga4-snapshot.mjs`
- runtime validation confirming `AnalyticsProvider` binds to marketing while Website Analytics stays safely on demo data when no snapshot is available
- scripted route validation for Website Analytics, Integration Status, Demo Mode Configuration, and Provider Architecture
- runtime validation with no JavaScript errors and no console warnings during the scripted walkthrough
- captured screenshots for:
  - Website Analytics
  - Integration Status
  - Demo Mode Configuration
  - Provider Architecture

Sprint 9 validation includes:

- `node --check assets/app.js`
- syntax validation across the new `assets/memory/` subsystem and runtime wiring
- memory initialisation checks for timeline, decisions, goals, retention, and knowledge graph summary
- route rendering checks for:
  - `?route=/ceo`
  - `?route=/reports/executive-timeline`
  - `?route=/reports/decision-journal`
  - `?route=/reports/strategic-goals`
  - `?route=/ai-assistant/memory-context`
- validation that reports now consume memory-backed historical events, decisions, goal progress, and milestones
- validation that global search includes memory entries
- validation that no JavaScript errors or console warnings appear during the scripted walkthrough
- captured screenshots for:
  - CEO Historical Context
  - Strategic Goals
  - Decision Journal
  - Timeline
  - Memory Search

Sprint 10 validation includes:

- `node --check assets/app.js`
- syntax checks across the full `assets/` tree and `scripts/sync-youtube-snapshot.mjs`
- `npm run youtube:sync` using a local environment file to generate a live YouTube snapshot successfully
- runtime validation confirming:
  - `APP_RUNTIME.config.liveData.youtube.available === true`
  - YouTube now binds through `YouTubeProvider`
  - CMO combined totals update from live YouTube data
  - CEO YouTube intelligence cards render from the live snapshot
  - Content Library replaces demo YouTube entries with live recent uploads
- scripted route validation for:
  - `?route=/cmo/youtube`
  - `?route=/cmo/social-media-overview`
  - `?route=/ceo`
  - `?route=/settings/integrations`
  - `?route=/cmo/content-library`
- fallback validation by temporarily removing the generated YouTube snapshot and confirming a clean automatic return to demo content
- validation that no JavaScript errors or console warnings appear during the scripted walkthrough
- captured screenshots for:
  - YouTube Dashboard
  - Social Overview
  - CEO Dashboard
  - Integration Status
  - Content Library

## Design Principles

1. Evidence before recommendation
2. Approval before action
3. Transparency before automation
4. Historical learning over one-off analysis
5. Executive collaboration over siloed advice
6. Decision support over accounting-software aesthetics
7. One shared shell for all future executive modules

## Product Planning Workflow

From this point forward:

1. update `Roadmap.md` when priorities change or a release completes
2. document formal releases in `CHANGELOG.md`
3. move detailed completed sprint notes into `changelog/CHANGELOG.md`
4. keep the demo script aligned to the latest release positioning
5. evaluate new feature requests against `PROJECT_PRINCIPLES.md` before accepting them into the roadmap
6. do not mark a sprint complete until `DEFINITION_OF_DONE.md` has been satisfied and a structured handoff report has been produced

## Near-Term Outcome

The immediate goal is a premium static executive prototype that now feels like a real **Executive Operating System**, giving EP Golf Studios a credible AI-Chief-of-Staff-style **CEO Dashboard** plus integrated prototype depth across the **CFO** and **CMO** workspaces, with clear expansion paths for COO, Sales, Customer Success, Operations, HR, Projects, AI Assistant, Approvals, and Reports work.

After Sprint 10, the product has a real integration framework, a deterministic Executive Intelligence Engine, a provider-independent Executive Memory layer, and two live snapshot paths (GA4 + YouTube) beneath the UI, so future live APIs and future LLM assistance can enhance a stable reasoning core with durable business context instead of replacing it.
