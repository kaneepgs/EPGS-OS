# Gmail Provider v1.0

## Purpose

`GmailProvider` turns business email into executive intelligence for EP Intelligence.

It is intentionally **not** an email client.

The goal is to help the CEO understand:

- what needs attention now
- which customers are waiting
- which booking requests should move fastest
- which supplier and finance conversations require action
- which inbox actions should be staged for approval

## Security model

Gmail follows the same low-risk provider pattern as GA4 and YouTube:

1. OAuth credentials stay in `.env` or `.env.local`
2. the sync script exchanges the refresh token for a short-lived access token on demand
3. the browser never receives the OAuth client secret, refresh token, or access token
4. the script writes a generated local snapshot into `assets/data/generated/`
5. `GmailProvider` reads only that generated snapshot at runtime
6. if anything fails, EP Intelligence falls back to structured demo data

Required ignores:

- `.env`
- `.env.local`
- `assets/data/generated/gmail-live-snapshot.json`

## OAuth setup

Create a Google Cloud project and configure Gmail API access.

### Required env vars

```bash
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_ACCOUNT=
GMAIL_SYNC_INTERVAL_MINUTES=15
```

### Required scope

```text
https://www.googleapis.com/auth/gmail.readonly
```

This provider is read-only by design.

It does **not** request send, modify, or delete scopes.

## Local sync flow

Run:

```bash
npm run gmail:sync
```

The script will:

1. load env vars from `.env.local` or `.env`
2. exchange the refresh token for a Gmail access token
3. query inbox messages from the configured account
4. fetch selected metadata headers and snippets
5. classify messages with deterministic rules
6. build Executive Inbox widgets, approval cards, timeline events, and search entries
7. write `assets/data/generated/gmail-live-snapshot.json`

## Deterministic classification

Classification is rule-based and does not depend on AI.

Current categories include:

- Customer
- Supplier
- Finance
- Marketing
- Booking
- Review
- Operations / Internal
- Newsletter
- Spam

Priority and status are also derived deterministically from labels, message age, sender patterns, and subject/snippet content.

## Provider lifecycle

1. `loadGeneratedGmailSnapshot()` reads the generated snapshot
2. `GmailProvider` exposes integration health plus Executive Inbox workspace data
3. `CommunicationsService` normalizes sections, widgets, metrics, and search coverage
4. the approval domain receives Gmail-derived Reply / Archive / Label / Forward / Create Task / Schedule Follow-up cards
5. the intelligence layer produces Gmail-aware insights, recommendations, narratives, and board/report context
6. Executive Memory records only higher-value communications milestones

## Demo fallback

Demo fallback remains first-class when:

- credentials are missing
- OAuth exchange fails
- Gmail API access is rejected
- the snapshot file is missing
- the snapshot cannot be parsed

In fallback mode, EP Intelligence still renders:

- Executive Inbox
- inbox sections
- inbox widgets
- approval cards
- search coverage
- timeline and memory context

## Integration status fields

The Settings integration view now surfaces:

- Gmail connected
- last sync
- current account
- Demo / Live state
- provider health

## Troubleshooting

### Missing configuration

If the sync output reports missing env vars, add:

- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `GMAIL_ACCOUNT`

### OAuth rejected

If the token request fails, check:

- OAuth client type and redirect flow used to obtain the refresh token
- Gmail API enabled in the Google Cloud project
- refresh token still active
- client id / client secret pair belongs to the same project as the refresh token

### Insufficient access

If Gmail returns an insufficient permissions error, confirm the refresh token was granted:

```text
https://www.googleapis.com/auth/gmail.readonly
```

### No live data in UI after sync

Check:

1. `assets/data/generated/gmail-live-snapshot.json` exists locally
2. the snapshot contains `"available": true`
3. refresh the browser after the sync completes
4. Integration Status shows Gmail as live rather than demo fallback
