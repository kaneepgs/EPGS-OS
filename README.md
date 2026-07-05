# EP Intelligence

EP Intelligence is a frontend-only AI Executive Operating System prototype for EP Golf Studios.

It has now moved beyond a CFO-first prototype into a true **Executive Operating System** with a CEO-level intelligence layer that synthesises Finance and Marketing into one daily executive briefing.

Sprint 8 adds the first live-capable provider path: **Website Analytics** can now hydrate from a locally generated **Google Analytics 4 snapshot** while the rest of the product stays safely in Demo Mode.

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

## Constraints

This prototype intentionally remains:

- **HTML + CSS + Vanilla JavaScript only**
- **frontend-only in the browser**
- **no browser-side secrets or direct GA4 calls from the UI**
- **mostly demo-mode**, with only Website Analytics eligible for optional GA4 hydration through a locally generated snapshot
- **without backend services, databases, authentication, or automation inside the product itself**

## Project Structure

- `START_HERE.md` — non-technical demo handoff guide
- `DEPLOYMENT_NOTE.md` — simple deployment notes for Replit and Hostinger static hosting
- `EXECUTIVE_DEMO_SCRIPT.md` — short demo script for live walkthroughs
- `index.html` — main app shell and metadata
- `assets/app.js` — application state, routing, rendering, and interactions
- `assets/styles.css` — visual system, layout, responsive styling, transitions, and accessibility states
- `assets/config/app-config.js` — central runtime mode and framework configuration
- `assets/config/integration-registry.js` — placeholder registration points for future integrations
- `assets/config/shell-config.js` — route, navigation, and page-question metadata
- `assets/contracts/data-contracts.js` — shared schema helpers for normalized workspace data
- `assets/data/mock-data.js` — raw structured demo datasets
- `assets/data/live-data-loader.js` — safe loader for the optional generated GA4 snapshot
- `assets/data/runtime.js` — composition root that assembles providers, services, intelligence, and runtime workspace data
- `assets/providers/` — active mock provider, live-capable analytics provider, future provider placeholders, and provider registry
- `assets/services/` — business logic layer for executive, finance, marketing, approvals, reports, timeline, integration status, and intelligence assembly
- `assets/intelligence/` — deterministic executive reasoning engines for insights, correlations, recommendations, priority, health, narratives, and confidence
- `assets/ui/components.js` — reusable UI render helpers
- `assets/ui/charts.js` — Chart.js render/destroy helpers
- `assets/vendor/chart.umd.js` — local Chart.js bundle for static hosting
- `assets/favicon.svg` — favicon / OG image source
- `assets/site.webmanifest` — install metadata
- `scripts/sync-ga4-snapshot.mjs` — local GA4 snapshot sync script for Sprint 8
- `docs/` — architecture and constitutional documents
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

Then open:

- `http://127.0.0.1:3012`

Optional examples:

- `http://127.0.0.1:3012/?route=/ceo`
- `http://127.0.0.1:3012/?route=/cfo`
- `http://127.0.0.1:3012/?route=/cmo`
- `http://127.0.0.1:3012/?route=/reports/board-meeting`

## Deployment Targets

The project is structured to be easy to host on:

- Replit
- Hostinger static hosting / web hosting
- any simple static web host

No server runtime is required for the UI itself.

If you want live Website Analytics, run the local GA4 sync script first so the static frontend can read the generated snapshot file.

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

## Design Principles

1. Evidence before recommendation
2. Approval before action
3. Transparency before automation
4. Historical learning over one-off analysis
5. Executive collaboration over siloed advice
6. Decision support over accounting-software aesthetics
7. One shared shell for all future executive modules

## Near-Term Outcome

The immediate goal is a premium static executive prototype that now feels like a real **Executive Operating System**, giving EP Golf Studios a credible AI-Chief-of-Staff-style **CEO Dashboard** plus integrated prototype depth across the **CFO** and **CMO** workspaces, with clear expansion paths for COO, Sales, Customer Success, Operations, HR, Projects, AI Assistant, Approvals, and Reports work.

After Sprint 7, the product has both a real integration framework and a deterministic Executive Intelligence Engine beneath the UI, so future live APIs and future LLM assistance can enhance a stable reasoning core instead of replacing it.
