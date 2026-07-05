# START HERE — EP Intelligence Demo Handoff

## What this is

**EP Intelligence** is a frontend-only **Executive Operating System** prototype for **EP Golf Studios**.

The formal shipped release is now **EP Intelligence v2.0 — Executive Action Centre & Executive Copilot**.

It combines:

- a true **CEO Dashboard**
- a top-level **Executive Action Centre**
- a new **Executive Copilot**
- full **CFO** and **CMO** workspaces
- a deterministic intelligence layer
- provider-independent **Executive Memory** and **Knowledge Graph**
- live-capable snapshot overlays for **GA4**, **YouTube**, **Unified Social**, **Gmail**, and **Google Calendar**

## Release and roadmap references

- **Current release:** EP Intelligence v2.0 — Executive Action Centre & Executive Copilot
- **Current roadmap:** `Roadmap.md`
- **Product vision:** `PRODUCT_VISION.md`
- **Formal release changelog:** `CHANGELOG.md`
- **Detailed sprint history:** `changelog/CHANGELOG.md`
- **Definition of Done:** `DEFINITION_OF_DONE.md`
- **Release management:** `RELEASE_MANAGEMENT.md`

## What it includes

- **CEO Dashboard** with action-aware business health, risks, opportunities, approvals, recent decisions, and recommended actions
- **Executive Action Centre** with My Queue, Today, Urgent, This Week, Waiting For Me, Completed Today, Recently Approved, and Recently Rejected
- **Action Detail** workspace with executive summary, business context, evidence, metrics, history, memory, alternatives, and linked providers
- **Approval Workflow** with approve, reject, edit, delegate, snooze, archive, evidence, history, and related-item review
- **Executive Copilot** for action-oriented executive questions
- **Executive Inbox** for deterministic communications triage
- **Operations Calendar** for capacity, fitting, and scheduling intelligence
- **Reports** for Executive Actions, Outstanding Approvals, Decision History, Action Analytics, Approval Performance, Department Workload, timeline, goals, and board output
- **Action Centre Settings** for priority rules, confidence thresholds, retention, routing, business hours, and notifications

## What it does not include

- no backend
- no database
- no browser-side secrets
- no automatic execution
- no live accounting provider yet

Execution adapters exist for the future, but every adapter currently returns **Approval Required**.

## How to open it locally

This project is a static site.

1. Open the `EP-Intelligence` folder
2. Run:

```bash
npm install
npm run vendor:chart
npm run serve
```

3. Open:

```text
http://127.0.0.1:3012
```

## What to demo first

1. **CEO Dashboard**
2. **Executive Action Centre**
3. **Executive Queue / Action Detail / Approval Workflow**
4. **Executive Copilot**
5. **CFO**
6. **CMO**
7. **Executive Inbox**
8. **Operations Calendar**
9. **Reports → Executive Actions / Outstanding Approvals / Board Meeting Mode**
10. **Settings → Action Centre / Integration Status / Provider Architecture**

## Key positioning

Describe it as:

> “A premium executive operating system prototype for EP Golf Studios — now centred on a CEO Dashboard, a single Executive Action Centre, and an Executive Copilot that brings cross-provider intelligence into one approval-first workflow.”

## Current roadmap position

See `Roadmap.md`.

Current **Now** focus after v2.0:

- Accounting Provider v1.0
- Booking Intelligence groundwork beneath the Action Centre
- execution-adapter hardening ahead of future live activation

Current **Next** priorities:

1. Booking Intelligence
2. CRM / Customer Intelligence
3. Mailchimp Provider
4. future live execution activation on top of the existing adapter layer

## Closing line

> “EP Intelligence is now ready to act like the business operating system, while still keeping every decision explainable and under executive control.”
