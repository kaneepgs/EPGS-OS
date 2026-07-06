# EP Hub Tool Connections

EP Hub is a static frontend with provider-based live overlays. Real credentials must never be stored in browser-readable files.

## Connection principle

1. Keep credentials in Replit Secrets or another server-side environment.
2. Run a sync script server-side.
3. Write a sanitized generated snapshot.
4. Let EP Hub hydrate from that snapshot with safe demo fallback.
5. Keep all execution approval-first.

## Live-capable now

| Tool | Provider | Script | Feeds |
| --- | --- | --- | --- |
| Google Analytics 4 | `AnalyticsProvider` | `npm run ga4:sync` | Website Analytics, CMO reports, CEO demand signals |
| YouTube | `YouTubeProvider` | `npm run youtube:sync` | YouTube page, CMO social, CEO marketing momentum |
| Unified Social | `UnifiedSocialProvider` | `npm run social:sync` | Confirmed Instagram, Facebook, LinkedIn, X, and TikTok accounts; social score, attribution, platform rankings |
| Gmail | `GmailProvider` | `npm run gmail:sync` | Executive Inbox, triage, approval-first communications |
| Google Calendar | `CalendarProvider` | `npm run calendar:sync` | Operations Calendar, capacity, timeline, schedule pressure |

## Future providers

| Tool | Future provider | Why it matters |
| --- | --- | --- |
| Booking / fitting system | `BookingProvider` | Primary conversion source for fittings and marketing attribution |
| QuickBooks | `AccountingProvider` / `FinanceProvider` | Confirmed accounting platform for CFO, cash flow, VAT, supplier spend, profitability |
| Stripe / payment provider | `FinanceProvider` | Deposits, payment timing, checkout quality |
| Mailchimp | `MarketingProvider` | Confirmed email marketing platform for campaigns, audience health, weekly marketing reporting |
| OpenClaw action gateway | `AIProvider` / `ActionService` | Future execution only after explicit approval and audit logging |

## Current safety boundary

- `assets/data/generated/*.json` is ignored by Git.
- `.env`, `.env.local`, OAuth tokens, and secrets are ignored by Git.
- Browser assets should contain only sanitized data.
- Execution adapters intentionally return approval-required responses.
- Kane has confirmed EP Hub must not send emails, publish social posts, or edit calendar events automatically.
- Every external action requires explicit approval before execution.

## Recommended activation order

1. Confirm GA4 and YouTube snapshots are current.
2. Activate Gmail and Google Calendar through OAuth snapshots.
3. Decide the booking/fitting platform and conversion event names.
4. Build Booking Provider v1.0.
5. Build QuickBooks Provider v1.0.
6. Add Mailchimp/email marketing.
7. Add optional execution gateway only after approvals/audit are complete.

## Confirmed tool choices

- Communications: EP Golf Studios Gmail
- Accounting: QuickBooks
- Email marketing: Mailchimp
- Social accounts: Instagram, Facebook, LinkedIn, X/Twitter, TikTok
- LinkedIn API key: supplied by Kane outside this checklist
