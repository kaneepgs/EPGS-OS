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
| Gmail | `GmailProvider` | `npm run gmail:sync` | EP Golf Studios read-only Gmail intelligence for INBOX, IMPORTANT, STARRED, and SENT; executive triage, suggested replies, approval-first communications |
| Google Calendar | `CalendarProvider` | `npm run calendar:sync` | Operations Calendar, capacity, timeline, schedule pressure |

## Future providers

| Tool | Future provider | Why it matters |
| --- | --- | --- |
| Acuity / Squarespace Scheduling | `BookingProvider` | Confirmed fitting/booking source; sends Gmail confirmations, creates Google Calendar events, uses Stripe for deposits/payments |
| QuickBooks | `AccountingProvider` / `FinanceProvider` | Confirmed account `accounts@epgolfstudios.co.uk`; VAT and supplier bills; not used for invoices/payments; future CFO cash flow, VAT, supplier spend, profitability |
| Stripe / payment provider | `FinanceProvider` | Confirmed payment/deposit provider for booking flow; future deposits, payment timing, checkout quality |
| Mailchimp | `MarketingProvider` | Confirmed email marketing platform for `accounts@epgolfstudios.co.uk`, email distribution lists, future nurture/follow-up campaigns; not currently linked to fitting bookings |
| OpenClaw action gateway | `AIProvider` / `ActionService` | Future execution only after explicit approval and audit logging |

## Current safety boundary

- `assets/data/generated/*.json` is ignored by Git.
- `.env`, `.env.local`, OAuth tokens, and secrets are ignored by Git.
- Browser assets should contain only sanitized data.
- Execution adapters intentionally return approval-required responses.
- Kane has confirmed EP Hub must not send emails, publish social posts, or edit calendar events automatically.
- Every external action requires explicit approval before execution.
- Gmail is read-only for initial activation: no automatic sending, replying, archiving, deleting, or labelling.

## Recommended activation order

1. Confirm GA4 and YouTube snapshots are current.
2. Activate Gmail and Google Calendar through OAuth snapshots.
3. Build Acuity-derived Booking Provider v1.0 using Gmail confirmations and Google Calendar events first.
4. Add direct Acuity API support if API access is confirmed.
5. Build QuickBooks Provider v1.0.
6. Add Mailchimp/email marketing.
7. Add optional execution gateway only after approvals/audit are complete.

## Confirmed tool choices

- Communications: EP Golf Studios Gmail (`info@epgolfstudios.co.uk`) — read-only inbox intelligence, suggested replies only, no automatic send/reply/archive/delete/label
- Accounting: QuickBooks — account `accounts@epgolfstudios.co.uk`; legal business name Elite Performance Golf Studios Ltd; name EP Golf Studios Ltd; VAT yes; supplier bills yes; invoices/payments no
- Email marketing: Mailchimp — `accounts@epgolfstudios.co.uk`, email distribution lists, future regular follow-ups/nurture; not currently linked to fitting bookings
- Social accounts: Instagram, Facebook, LinkedIn, X/Twitter, TikTok
- LinkedIn API key: supplied by Kane outside this checklist
- Booking/fitting: Acuity / Squarespace Scheduling via `https://epgolfstudios.co.uk/book-now`; confirmation emails and Google Calendar events enabled; Stripe handles deposits/payments
