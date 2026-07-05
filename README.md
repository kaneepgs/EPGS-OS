# EP Intelligence

EP Intelligence is a frontend-only AI Executive Operating System prototype for EP Golf Studios.

This repo currently focuses on a **polished CFO Executive Workspace** built for demos, stakeholder presentations, and future live-integration planning — while staying entirely static and powered by realistic mock data.

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

## Constraints

This prototype intentionally remains:

- **HTML + CSS + Vanilla JavaScript only**
- **frontend-only**
- **mock-data-only**
- **without APIs, backend, auth, databases, external services, or automation**

## Project Structure

- `START_HERE.md` — non-technical demo handoff guide
- `DEPLOYMENT_NOTE.md` — simple deployment notes for Replit and Hostinger static hosting
- `EXECUTIVE_DEMO_SCRIPT.md` — short demo script for live walkthroughs
- `index.html` — main app shell and metadata
- `assets/app.js` — application state, routing, rendering, and interactions
- `assets/styles.css` — visual system, layout, responsive styling, transitions, and accessibility states
- `assets/data/mock-data.js` — structured mock executive/financial data
- `assets/ui/components.js` — reusable UI render helpers
- `assets/ui/charts.js` — Chart.js render/destroy helpers
- `assets/vendor/chart.umd.js` — local Chart.js bundle for static hosting
- `assets/favicon.svg` — favicon / OG image source
- `assets/site.webmanifest` — install metadata
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

Then open:

- `http://127.0.0.1:3012`

## Deployment Targets

The project is structured to be easy to host on:

- Replit
- Vercel
- Hostinger static hosting / web hosting
- any simple static web host

No server runtime is required.

## Validation

Sprint 4 validation included:

- `node --check assets/app.js`
- local static serving via `python3 -m http.server`
- rendered screenshot captures for:
  - dashboard
  - board meeting mode
  - revenue page
  - cash flow
  - executive AI commentary
  - mobile layout

Validation artifacts are stored in `/data/.openclaw/workspace/.artifacts/`.

## Design Principles

1. Evidence before recommendation
2. Approval before action
3. Transparency before automation
4. Historical learning over one-off analysis
5. Executive collaboration over siloed advice
6. Decision support over accounting-software aesthetics

## Near-Term Outcome

The immediate goal is a premium static executive prototype that feels production-ready, gives EP Golf Studios a credible executive workspace for review/demo use, and creates a clean foundation for future live CFO, CMO, COO, and CEO workspaces.
