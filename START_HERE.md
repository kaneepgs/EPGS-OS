# START HERE — EP Intelligence Demo Handoff

## What this is

**EP Intelligence** is a frontend-only **Executive Operating System** prototype for **EP Golf Studios**.

It has now moved from a CFO-first prototype into a broader **Executive Operating System** with a true **CEO Intelligence Dashboard** at the centre.

Today it is still primarily a **demo product**, but it now has two controlled live-data paths: **Website Analytics** can hydrate from a locally generated GA4 snapshot and **YouTube** can hydrate from a locally generated channel snapshot.

Sprint 11 packages those into **EP Intelligence v1.1 — Marketing Intelligence**.

## Release and roadmap references

- **Current release:** EP Intelligence v1.1 — Marketing Intelligence
- **Current roadmap:** `Roadmap.md`
- **Formal release changelog:** `CHANGELOG.md`
- **Detailed sprint history:** `changelog/CHANGELOG.md`
- **Definition of Done:** `DEFINITION_OF_DONE.md`

Release metadata is now centralised in `assets/config/release-config.js`, so the displayed version and release references should stay consistent across the product.

## What it includes

- a true **CEO Intelligence Dashboard** as the application home page
- a complete **CFO module** inside the wider shell
- a complete first-pass **CMO module** inside the wider shell
- integrated executive intelligence that links Finance and Marketing together inside one CEO-level daily briefing
- a new **Integration Framework** beneath the UI so future live data can be added through providers rather than dashboard rewrites
- a deterministic **Executive Intelligence Engine** that turns structured business data into scored health views, correlations, recommendations, narratives, and executive Q&A outputs before any external AI is introduced
- the first **Google Analytics 4 live-provider path** for CMO Website Analytics, using a local sync script and generated snapshot file
- a live-capable **YouTube provider path** for channel totals, recent uploads, visibility, and content-library items
- a reusable **Marketing Intelligence Report** that packages GA4 + YouTube into one executive report
- a proper **Marketing Health Score** with score, trend, confidence, and source status
- provider-independent **Executive Memory** that now stores marketing milestones as part of the business timeline
- placeholder module landing pages for:
  - COO
  - Sales
  - Customer Success
  - Operations
  - HR
  - Projects
- central **Approvals** section
- central **Reports** section
- dedicated **AI Assistant** section
- interactive charts using realistic mock/demo data only

## What it does not include

- no always-on live APIs inside the browser
- no authentication
- no backend
- no databases
- no automation
- no live financial or operational data

The app now includes architecture for future integrations plus an internal intelligence engine. By default it still runs in **Demo Mode**, with optional local snapshot hydration for **GA4 Website Analytics** and **YouTube** when credentials are added and snapshots are synced.

## How to open it locally

This project is a static website.

1. Open the `EP-Intelligence` folder
2. Open a terminal in that folder
3. Run:

```bash
npm install
npm run vendor:chart
npm run serve
```

4. Open this address in your browser:

```text
http://127.0.0.1:3012
```

The default home page is now the **CEO Dashboard**.

## What to demo first

Start with these in order:

1. **CEO Dashboard** — now the AI Chief of Staff-style executive home page
2. **Board Meeting Mode** — shows the presentation-ready board experience
3. **CFO** — shows the most complete finance module in the system
4. **CMO** — shows the first full executive marketing workspace
5. **Approvals** — shows business-wide approval thinking
6. **AI Assistant** — shows the conversational executive AI direction
7. **CMO → Website Analytics** — shows the live GA4 path and conversion visibility clearly
8. **CMO → YouTube** — shows the live YouTube path, recent uploads, and authority-channel momentum
9. **Reports → Marketing Intelligence Report** — shows the packaged v1.1 marketing narrative across GA4, YouTube, risks, and actions
10. **Settings → Integration Status / Demo Mode Configuration / Provider Architecture** — shows how the hybrid demo/live data framework is now structured under the product
11. **CEO Dashboard marketing intelligence / cross-department intelligence** — shows the deterministic reasoning layer still working on top of the provider/service architecture

## Key pages to show

- **CEO Dashboard** — AI Chief of Staff daily briefing
- **CFO Workspace** — complete finance module within the shell
- **CFO Revenue / Cash Flow / Supplier Spend** — strongest decision-support examples
- **CMO Marketing Dashboard** — executive marketing command centre
- **CMO Social Media Overview / YouTube / Website Analytics / AI Marketing Advisor** — strongest marketing examples
- **Reports → Marketing Intelligence Report** — packaged v1.1 marketing output
- **Approvals** — centralised business-wide approval centre
- **Reports** — shared reporting structure
- **Board Meeting Mode** — leadership / board presentation view
- **AI Assistant** — future AI reasoning and briefing area

## Current limitations

This is intentionally still a prototype.

- almost all data is still mock/demo data
- charts are illustrative, not connected to real systems
- most non-finance / non-marketing modules are still placeholders
- no save/sync between users or devices
- no real approvals or workflow execution
- only Website Analytics and YouTube are live-capable today, both through manual local snapshot sync
- no external AI or LLM reasoning yet; the current intelligence layer is deterministic and rule-based by design

## Current roadmap position

The product roadmap is now managed in `Roadmap.md`.

Current **Now** focus:

- Sprint 13 — Gmail Provider v1.0
- Executive Inbox
- Gmail Intelligence
- Executive Communications
- Approval-first email workflows

Current **Next** priorities:

1. Google Calendar Provider
2. QuickBooks/Xero Provider
3. Mailchimp Provider
4. Booking Intelligence

## Suggested positioning when presenting it

Describe it as:

> “A premium executive operating system prototype for EP Golf Studios — now centred on a CEO Intelligence Dashboard that acts like an AI Chief of Staff, with integrated executive intelligence across Finance and Marketing, plus a first usable Marketing Intelligence release.”

You can now more accurately say it includes a real **CEO intelligence layer**, a deterministic **Executive Intelligence Engine**, both **CFO** and **CMO** executive workspaces, a packaged **Marketing Intelligence Report**, and live-capable **GA4 Website Analytics + YouTube** provider paths, with the rest of the business architecture prepared for future module builds.

After each completed release, update `CHANGELOG.md` for the formal release summary, then advance `Roadmap.md`, then move detailed sprint notes into `changelog/CHANGELOG.md`.
